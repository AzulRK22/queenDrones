from models.models import Mission
from datetime import datetime, timedelta

def seed_missions(app, db):
    with app.app_context():
        # Check if data already exists
        if Mission.query.first() is None:
            # Create sample missions
            mission1 = Mission(
                schedule=datetime.utcnow() + timedelta(days=1),
                priority_score=0.8,
                mode="search",
                overlap_pct=0.20,
                vision_range=200,
                speed=10,
                flight_time=25,
                user_generated=False,
                starting_lat=-33.4489,
                starting_long=-70.6693
            )

            mission2 = Mission(
                schedule=datetime.utcnow() + timedelta(days=2),
                priority_score=0.6,
                mode="patrol",
                overlap_pct=0.15,
                vision_range=250,
                speed=15,
                flight_time=30,
                user_generated=True,
                starting_lat=-33.0472,
                starting_long=-71.6127
            )

            db.session.add(mission1)
            db.session.add(mission2)
            db.session.commit()

            print("Sample missions have been added to the database.")
            print(f"Mission 1 has {len(mission1.coordinates)} coordinates.")
            print(f"Mission 2 has {len(mission2.coordinates)} coordinates.")
        else:
            print("Database already contains missions. Skipping seed.")