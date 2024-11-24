from extensions import db
from datetime import datetime
from pyproj import Geod
import math



class Mission(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    schedule = db.Column(db.DateTime, nullable=True)
    priority_score = db.Column(db.Float, nullable=True)
    mode = db.Column(db.String(50), nullable=False)
    overlap_pct = db.Column(db.Float, nullable=False)
    vision_range = db.Column(db.Float, nullable=False)
    speed = db.Column(db.Float, nullable=False)
    flight_time = db.Column(db.Float, nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    user_generated = db.Column(db.Boolean, default=False, nullable=False)
    starting_lat = db.Column(db.Float, nullable=False)
    starting_long = db.Column(db.Float, nullable=False)
    coordinates = db.relationship('Coordinate', back_populates='mission', cascade='all, delete-orphan', order_by='Coordinate.sequence_number')

    def __repr__(self):
        return f'<Mission(id={self.id}, schedule={self.schedule}, user_generated={self.user_generated})>'

    def __init__(self, starting_lat, starting_long, flight_time=25, speed=10, vision_range=200, overlap_pct=20, **kwargs):
        super().__init__(**kwargs)
        self.starting_lat = starting_lat
        self.starting_long = starting_long
        self.flight_time = flight_time
        self.speed = speed
        self.vision_range = vision_range
        self.overlap_pct = overlap_pct

        # Generate waypoints using the provided function
        waypoints = generate_centered_search_waypoints(
            (self.starting_lat, self.starting_long), 
            self.flight_time, 
            self.speed, 
            self.vision_range, 
            self.overlap_pct
        )
        
        # Populate the Mission with these waypoints
        self.coordinates = [
            Coordinate(latitude=lat, longitude=long, sequence_number=i+1)
            for i, (lat, long) in enumerate(waypoints)
        ]


class Coordinate(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    latitude = db.Column(db.Float, nullable=False)
    longitude = db.Column(db.Float, nullable=False)
    sequence_number = db.Column(db.Integer, nullable=False)
    mission_id = db.Column(db.Integer, db.ForeignKey('mission.id'), nullable=False)
    mission = db.relationship('Mission', back_populates='coordinates')

    def __repr__(self):
        return f'<Coordinate(lat={self.latitude}, lon={self.longitude}, sequence={self.sequence_number})>'
    
class ImageData(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    filename = db.Column(db.String(255), nullable=False)
    latitude = db.Column(db.Float, nullable=False)
    longitude = db.Column(db.Float, nullable=False)
    classification = db.Column(db.String(10), nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<ImageData {self.filename}, {self.classification}, {self.latitude}, {self.longitude}>'
    

# WGS84 ellipsoid
geod = Geod(ellps="WGS84")

def generate_centered_search_waypoints(start_coord, flight_time, speed, vision_range, overlap=0.2):
    waypoints = [start_coord]
    start_lat, start_lon = start_coord
    lane_spacing = 2 * vision_range * (1 - overlap)
    max_distance = flight_time * 60 * speed * 0.9  # 90% of max distance for safety
    num_lanes = int(math.sqrt(max_distance / (4 * lane_spacing)))  # Adjusting for square shape
    line_length = max_distance / (2 * num_lanes)

    for i in range(-num_lanes, num_lanes + 1):
        current_lat = start_lat + (i * lane_spacing) / 111111  # Convert meters to degrees latitude
        if i % 2 == 0:  # Even lanes go west to east
            west_lon = start_lon - (line_length / 2) / (111111 * math.cos(math.radians(current_lat)))
            east_lon = start_lon + (line_length / 2) / (111111 * math.cos(math.radians(current_lat)))
            waypoints.append((current_lat, west_lon))
            waypoints.append((current_lat, east_lon))
        else:  # Odd lanes go east to west
            east_lon = start_lon + (line_length / 2) / (111111 * math.cos(math.radians(current_lat)))
            west_lon = start_lon - (line_length / 2) / (111111 * math.cos(math.radians(current_lat)))
            waypoints.append((current_lat, east_lon))
            waypoints.append((current_lat, west_lon))
    waypoints.append(start_coord)
    return waypoints