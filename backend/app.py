import datetime
import os
import traceback
from flask import Flask, jsonify, request, send_from_directory, current_app
from flask_cors import CORS
from config import Config
from extensions import db, migrate
import subprocess
from models.models import Mission, Coordinate, ImageData, generate_centered_search_waypoints
from models.seeds import seed_missions
import logging


#import openai

def create_app():

    app = Flask(__name__)
    app.config.from_object(Config)
    
    CORS(app)
    
    db.init_app(app)
    migrate.init_app(app, db)

    with app.app_context():
        db.create_all()
        seed_missions(app, db)


    # Asegúrate de que la carpeta de uploads existe
    UPLOAD_FOLDER = 'uploads'
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)

    @app.route('/upload', methods=['POST'])
    def upload_file():
        if 'file' not in request.files:
            return jsonify({"error": "No file part in the request"}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({"error": "No selected file"}), 400
        
        if file:
            filepath = os.path.join(UPLOAD_FOLDER, file.filename)
            file.save(filepath)
            return jsonify({"message": "File uploaded successfully", "filePath": filepath}), 200

    @app.route('/image_data', methods=['GET'])
    def get_image_data():
        images = ImageData.query.all()
        return jsonify([{
            "id": img.id,
            "filename": img.filename,
            "latitude": img.latitude,
            "longitude": img.longitude,
            "classification": img.classification,
            "timestamp": img.timestamp.isoformat()
        } for img in images])

    @app.route('/image/<int:image_id>', methods=['GET'])
    def get_image(image_id):
        image_data = ImageData.query.get_or_404(image_id)
        return send_from_directory(app.config['UPLOAD_FOLDER'], image_data.filename)


    @app.route('/generate_waypoints', methods=['POST', 'GET'])
    def generate_waypoints_endpoint():
        if request.method == 'POST':
            data = request.get_json()
            lat = data.get('lat')
            lng = data.get('lng')

            try:
                # Save the coordinates to the database
                new_coordinate = Coordinate(latitude=lat, longitude=lng)
                db.session.add(new_coordinate)
                db.session.commit()
                print(f"Coordinate saved: {lat}, {lng}")
            except Exception as e:
                db.session.rollback()
                print(f"Error saving coordinate: {str(e)}")
                return jsonify({"error": f"Database error: {str(e)}"}), 500
        else:  # GET request
            lat, lng = -33.0472, -71.6127  # Default coordinates for GET requests

        # Validate input
        if lat is None or lng is None:
            return jsonify({"error": "Invalid input", "waypoints": []}), 400

        start_coord = (lat, lng)
        flight_time = 25  # Example value
        speed = 10        # Example value
        vision_range = 200  # Example value
        
        waypoints = generate_centered_search_waypoints(start_coord, flight_time, speed, vision_range)
        
        return jsonify({"waypoints": waypoints})


    # Route to create a new coordinate
    @app.route('/create_coordinate', methods=['POST'])
    def create_coordinate():
        data = request.json
        new_coordinate = Coordinate(
            latitude=data['latitude'],
            longitude=data['longitude'],
            mission_id=data.get('mission_id')  # This will be None if not provided
        )
        db.session.add(new_coordinate)
        db.session.commit()
        return jsonify({"message": "Coordinate created successfully", "coordinate_id": new_coordinate.id}), 201

    # Route to get all coordinates
    @app.route('/coordinates', methods=['GET'])
    def get_coordinates():
        coordinates = Coordinate.query.all()
        return jsonify([{
            "id": coord.id,
            "latitude": coord.latitude,
            "longitude": coord.longitude,
            "mission_id": coord.mission_id
        } for coord in coordinates])

    # New route to create a mission
    @app.route('/create_mission', methods=['POST'])
    def create_mission():
        data = request.json
        new_mission = Mission(
            name=data['name'],
            schedule=datetime.fromisoformat(data['schedule']),
            priority_score=data['priority_score'],
            mode=data['mode'],
            overlap_pct=data['overlap_pct'],
            vision_range=data['vision_range'],
            speed=data['speed'],
            flight_time=data['flight_time']
        )
        db.session.add(new_mission)

        for coord in data['coordinates']:
            new_coordinate = Coordinate(latitude=coord['lat'], longitude=coord['lng'], mission=new_mission)
            db.session.add(new_coordinate)

        db.session.commit()
        return jsonify({"message": "Mission created successfully", "mission_id": new_mission.id}), 201

    # Route to get all missions
    @app.route('/api/missions', methods=['GET'])
    def get_missions():
        missions = Mission.query.all()
        mission_list = []
        for mission in missions:
            mission_data = {
                'id': mission.id,
                'schedule': mission.schedule.isoformat() if mission.schedule else None,
                'priority_score': mission.priority_score,
                'mode': mission.mode,
                'overlap_pct': mission.overlap_pct,
                'vision_range': mission.vision_range,
                'speed': mission.speed,
                'flight_time': mission.flight_time,
                'created_at': mission.created_at.isoformat(),
                'user_generated': mission.user_generated,
                'starting_lat': mission.starting_lat,
                'starting_long': mission.starting_long,
                'coordinates': [
                    {
                        'latitude': coord.latitude,
                        'longitude': coord.longitude,
                        'sequence_number': coord.sequence_number
                    } for coord in mission.coordinates
                ]
            }
            mission_list.append(mission_data)
        logging.debug("Your message here")

        return jsonify(missions=mission_list)

    @app.route('/api/chat', methods=['POST'])
    def chat():
        data = request.json
        user_message = data.get('message')

        # Make a request to OpenAI's API
        try:
            response = openai.ChatCompletion.create(
                model="gpt-4",
                messages=[{"role": "user", "content": user_message}]
            )
            bot_message = response.choices[0].message['content']
            return jsonify({'message': bot_message})
        except Exception as e:
            return jsonify({'error': str(e)}), 500
        
    @app.route('/run-script', methods=['POST','GET'])
    def run_script():
        try:
            # Ejecuta el script y captura la salida
            result = subprocess.run(['python3', 'script.py'], capture_output=True, text=True, check=True)
            
            # Analiza la salida para extraer el ID de ejecución
            output_lines = result.stdout.split('\n')
            run_id = next((line.split(': ')[1] for line in output_lines if line.startswith('Unique run ID:')), None)
            
            # Retorna la salida del script y el ID de ejecución
            return jsonify({
                'result': result.stdout,
                'runId': run_id
            })
        except subprocess.CalledProcessError as e:
            # Si el script falla, retorna el error
            return jsonify({'error': str(e), 'output': e.output}), 500
        except Exception as e:
            # Captura cualquier otra excepción y retornala como JSON
            return jsonify({'error': str(e), 'traceback': traceback.format_exc()}), 500
        
    @app.route('/results/<path:filename>', methods=['GET'])
    def reload_file(filename):
            return send_from_directory('results', filename)
    
    @app.route('/get_wp_file', methods=['GET'])
    def get_wp_file():
        try:
            file_directory = 'datasets'
            file_name = 'mission_valparaiso.waypoints'
            
            # Debug information
            current_dir = os.getcwd()
            full_path = os.path.join(current_dir, file_directory, file_name)
            file_exists = os.path.exists(full_path)
            
            current_app.logger.info(f"Current working directory: {current_dir}")
            current_app.logger.info(f"Full file path: {full_path}")
            current_app.logger.info(f"File exists: {file_exists}")
            
            if not file_exists:
                return jsonify({"error": f"File not found at {full_path}"})
            
            return send_from_directory(directory=file_directory, path=file_name, as_attachment=True)
        except Exception as e:
            current_app.logger.error(f"Error: {str(e)}")
            return jsonify({"error": str(e)})

    
    @app.route('/')
    def hello_world():
        return 'dsf, World!'
    
    return app

app = create_app()

if __name__ == '__main__':
    app.run(debug=True)
