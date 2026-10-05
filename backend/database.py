"""
Database and Storage Engineering Module
Author: Sub-Team A (Rajesh Kumar, Priya Sharma, Amit Patel)
Project: Train Ticket Reservation & Dynamic Fleet Management System
"""

import sqlite3
import os
from pathlib import Path

DB_FILE = Path(__file__).parent / "railway.db"

SCHEMA_DDL = """
PRAGMA foreign_keys = ON;

-- Stations Table
CREATE TABLE IF NOT EXISTS stations (
    code TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    platform_count INTEGER NOT NULL CHECK (platform_count > 0)
);

-- Trains Table
CREATE TABLE IF NOT EXISTS trains (
    train_id INTEGER PRIMARY KEY AUTOINCREMENT,
    train_number TEXT UNIQUE NOT NULL CHECK (length(train_number) >= 4),
    train_name TEXT NOT NULL,
    source_code TEXT NOT NULL,
    destination_code TEXT NOT NULL,
    departure_time TEXT NOT NULL,
    arrival_time TEXT NOT NULL,
    duration_hours REAL NOT NULL CHECK (duration_hours > 0),
    runs_on TEXT NOT NULL DEFAULT 'Daily',
    train_type TEXT NOT NULL CHECK (train_type IN ('VANDE_BHARAT', 'SUPERFAST_EXPRESS', 'SHATABDI', 'TEJAS', 'DURONTO')),
    is_active INTEGER NOT NULL DEFAULT 1 CHECK (is_active IN (0, 1)),
    FOREIGN KEY (source_code) REFERENCES stations(code) ON DELETE RESTRICT,
    FOREIGN KEY (destination_code) REFERENCES stations(code) ON DELETE RESTRICT
);

-- Coaches Table
CREATE TABLE IF NOT EXISTS coaches (
    coach_id INTEGER PRIMARY KEY AUTOINCREMENT,
    train_id INTEGER NOT NULL,
    coach_code TEXT NOT NULL,
    coach_type TEXT NOT NULL CHECK (coach_type IN ('1A', '2A', '3A', 'SL', 'CC', 'EC')),
    total_seats INTEGER NOT NULL CHECK (total_seats > 0),
    base_fare REAL NOT NULL CHECK (base_fare > 0),
    FOREIGN KEY (train_id) REFERENCES trains(train_id) ON DELETE CASCADE,
    UNIQUE(train_id, coach_code)
);

-- Seats Table with status constraint
CREATE TABLE IF NOT EXISTS seats (
    seat_id INTEGER PRIMARY KEY AUTOINCREMENT,
    coach_id INTEGER NOT NULL,
    seat_number INTEGER NOT NULL CHECK (seat_number > 0),
    berth_type TEXT NOT NULL CHECK (berth_type IN ('LOWER', 'MIDDLE', 'UPPER', 'SIDE_LOWER', 'SIDE_UPPER', 'WINDOW', 'AISLE')),
    is_booked INTEGER NOT NULL DEFAULT 0 CHECK (is_booked IN (0, 1)),
    FOREIGN KEY (coach_id) REFERENCES coaches(coach_id) ON DELETE CASCADE,
    UNIQUE(coach_id, seat_number)
);

-- Bookings Table
CREATE TABLE IF NOT EXISTS bookings (
    booking_id INTEGER PRIMARY KEY AUTOINCREMENT,
    pnr TEXT UNIQUE NOT NULL,
    train_id INTEGER NOT NULL,
    coach_id INTEGER NOT NULL,
    contact_name TEXT NOT NULL,
    contact_email TEXT NOT NULL,
    contact_phone TEXT NOT NULL,
    journey_date TEXT NOT NULL,
    total_amount REAL NOT NULL CHECK (total_amount >= 0),
    status TEXT NOT NULL DEFAULT 'CONFIRMED' CHECK (status IN ('CONFIRMED', 'CANCELLED')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (train_id) REFERENCES trains(train_id) ON DELETE RESTRICT,
    FOREIGN KEY (coach_id) REFERENCES coaches(coach_id) ON DELETE RESTRICT
);

-- Passengers Table
CREATE TABLE IF NOT EXISTS passengers (
    passenger_id INTEGER PRIMARY KEY AUTOINCREMENT,
    booking_id INTEGER NOT NULL,
    seat_id INTEGER NOT NULL,
    full_name TEXT NOT NULL,
    age INTEGER NOT NULL CHECK (age > 0 AND age <= 120),
    gender TEXT NOT NULL CHECK (gender IN ('Male', 'Female', 'Other')),
    berth_preference TEXT NOT NULL,
    FOREIGN KEY (booking_id) REFERENCES bookings(booking_id) ON DELETE CASCADE,
    FOREIGN KEY (seat_id) REFERENCES seats(seat_id) ON DELETE RESTRICT
);

-- Audit Logs for Concurrency Tracking & Isolation Inspection
CREATE TABLE IF NOT EXISTS audit_logs (
    log_id INTEGER PRIMARY KEY AUTOINCREMENT,
    pnr TEXT,
    action_type TEXT NOT NULL,
    lock_mode TEXT NOT NULL DEFAULT 'EXCLUSIVE_TRANSACTION',
    execution_time_ms REAL NOT NULL,
    details TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for high-frequency queries
CREATE INDEX IF NOT EXISTS idx_trains_route ON trains(source_code, destination_code);
CREATE INDEX IF NOT EXISTS idx_seats_coach ON seats(coach_id, is_booked);
CREATE INDEX IF NOT EXISTS idx_bookings_pnr ON bookings(pnr);
CREATE INDEX IF NOT EXISTS idx_bookings_email ON bookings(contact_email);
"""


def get_db_connection(db_path: Path = DB_FILE) -> sqlite3.Connection:
    """
    Returns an SQLite connection configured with foreign key checks
    and Row factory for dictionary-like column access.
    """
    conn = sqlite3.connect(str(db_path), timeout=20.0)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON;")
    return conn


def init_db(db_path: Path = DB_FILE, seed: bool = True) -> None:
    """
    Initializes the database schema and seeds initial fleet and route data.
    """
    conn = get_db_connection(db_path)
    cursor = conn.cursor()
    cursor.executescript(SCHEMA_DDL)
    conn.commit()

    if seed:
        cursor.execute("SELECT COUNT(*) FROM stations;")
        if cursor.fetchone()[0] == 0:
            seed_initial_data(conn)

    conn.close()


def seed_initial_data(conn: sqlite3.Connection) -> None:
    cursor = conn.cursor()

    # Seed Stations
    stations = [
        ('NDLS', 'New Delhi Railway Station', 'New Delhi', 'Delhi', 16),
        ('MMCT', 'Mumbai Central', 'Mumbai', 'Maharashtra', 10),
        ('HWH', 'Howrah Junction', 'Kolkata', 'West Bengal', 23),
        ('SBC', 'KSR Bengaluru City', 'Bengaluru', 'Karnataka', 10),
        ('MAS', 'Chennai Central', 'Chennai', 'Tamil Nadu', 12),
        ('ADI', 'Ahmedabad Junction', 'Ahmedabad', 'Gujarat', 12),
        ('PNBE', 'Patna Junction', 'Patna', 'Bihar', 10),
        ('GKP', 'Gorakhpur Junction', 'Gorakhpur', 'Uttar Pradesh', 10)
    ]
    cursor.executemany(
        "INSERT INTO stations (code, name, city, state, platform_count) VALUES (?, ?, ?, ?, ?)",
        stations
    )

    # Seed Trains
    trains = [
        ('22436', 'Vande Bharat Express', 'NDLS', 'HWH', '06:00', '14:00', 8.0, 'Daily except Thu', 'VANDE_BHARAT', 1),
        ('12952', 'Mumbai Rajdhani Express', 'NDLS', 'MMCT', '16:55', '08:35', 15.6, 'Daily', 'SUPERFAST_EXPRESS', 1),
        ('12002', 'Shatabdi Express', 'NDLS', 'ADI', '06:15', '14:40', 8.4, 'Daily', 'SHATABDI', 1),
        ('20608', 'Vande Bharat Express', 'SBC', 'MAS', '05:45', '10:10', 4.4, 'Daily except Wed', 'VANDE_BHARAT', 1),
        ('22692', 'Bengaluru Rajdhani', 'SBC', 'NDLS', '20:00', '05:55', 33.9, 'Daily', 'SUPERFAST_EXPRESS', 1),
        ('22119', 'Tejas Express', 'MMCT', 'ADI', '15:25', '21:55', 6.5, 'Daily except Thu', 'TEJAS', 1),
        ('12245', 'Howrah Duronto Express', 'HWH', 'SBC', '10:50', '16:20', 29.5, 'Tue, Wed, Fri, Sun', 'DURONTO', 1)
    ]
    cursor.executemany(
        """INSERT INTO trains (train_number, train_name, source_code, destination_code, 
                               departure_time, arrival_time, duration_hours, runs_on, train_type, is_active)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
        trains
    )

    # Fetch inserted trains
    cursor.execute("SELECT train_id, train_type FROM trains")
    inserted_trains = cursor.fetchall()

    for train in inserted_trains:
        t_id = train["train_id"]
        t_type = train["train_type"]

        if t_type == 'VANDE_BHARAT':
            coaches = [
                ('C1', 'CC', 24, 1850.0),
                ('C2', 'CC', 24, 1850.0),
                ('E1', 'EC', 16, 3420.0)
            ]
        elif t_type in ('SUPERFAST_EXPRESS', 'DURONTO'):
            coaches = [
                ('A1', '2A', 20, 2450.0),
                ('B1', '3A', 24, 1720.0),
                ('B2', '3A', 24, 1720.0),
                ('S1', 'SL', 32, 650.0)
            ]
        else: # SHATABDI / TEJAS
            coaches = [
                ('C1', 'CC', 24, 1420.0),
                ('C2', 'CC', 24, 1420.0),
                ('E1', 'EC', 16, 2680.0)
            ]

        for coach_code, coach_type, total_seats, base_fare in coaches:
            cursor.execute(
                """INSERT INTO coaches (train_id, coach_code, coach_type, total_seats, base_fare)
                   VALUES (?, ?, ?, ?, ?)""",
                (t_id, coach_code, coach_type, total_seats, base_fare)
            )
            coach_id = cursor.lastrowid

            # Create seats for this coach
            seats_to_insert = []
            berth_options = ['LOWER', 'MIDDLE', 'UPPER', 'SIDE_LOWER', 'SIDE_UPPER'] if coach_type in ('SL', '3A', '2A') else ['WINDOW', 'AISLE', 'MIDDLE']
            
            for s_num in range(1, total_seats + 1):
                b_type = berth_options[(s_num - 1) % len(berth_options)]
                # Pre-book some seats to showcase realistic availability
                is_booked = 1 if (s_num in (3, 7, 12, 18) and s_num <= total_seats) else 0
                seats_to_insert.append((coach_id, s_num, b_type, is_booked))

            cursor.executemany(
                "INSERT INTO seats (coach_id, seat_number, berth_type, is_booked) VALUES (?, ?, ?, ?)",
                seats_to_insert
            )

    conn.commit()


if __name__ == "__main__":
    init_db()
    print("Database initialized and seeded successfully.")
