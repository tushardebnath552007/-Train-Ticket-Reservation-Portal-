# RailFleet Express: Train Ticket Reservation & Dynamic Fleet Management System

Author: Tushar Debnath

A train ticket reservation and dynamic fleet management system built as a 2nd-year B.Tech Computer Science project, covering Relational Database Management Systems (RDBMS), Operating System concurrency control, and full-stack software engineering.

---

## Features

- Route search and schedule matrix
- Visual carriage seat grid with real-time availability
- PNR booking, lookup, history, and cancellation with refund calculation
- Dynamic fare calculation and 10-digit PNR generation
- Fleet admin metrics and audit logs
- Concurrency-safe reservations (zero double-booking)

## Tech Stack

- Frontend: React + Vite + Tailwind CSS (`src/`), served on port 3000
- Secondary mock API: Node + Express (`server_5500.ts`), port 5500
- Backend: FastAPI (Python) + Pydantic, port 8000
- Database: SQLite3 (`railway.db`) with foreign keys ON and CHECK constraints

## Architecture

```
Browser (React UI :3000)
  │ REST / JSON (proxied /api -> :5500)
  ▼
FastAPI backend (:8000) — fare calc, PNR gen, BEGIN EXCLUSIVE booking
  │ SQL + foreign keys
  ▼
SQLite3 (stations, trains, coaches, seats, bookings, passengers)
```

## Concurrency Control

Bookings use SQLite `BEGIN EXCLUSIVE` so only one transaction can check-and-reserve a seat at a time. A second concurrent request for the same seat waits, then sees `is_booked = 1` and gets HTTP 409 Conflict. Result: no double-booking.

## Database Schema (DDL)

```sql
PRAGMA foreign_keys = ON;

CREATE TABLE stations (
    code TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    platform_count INTEGER NOT NULL CHECK (platform_count > 0)
);

CREATE TABLE trains (
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

CREATE TABLE coaches (
    coach_id INTEGER PRIMARY KEY AUTOINCREMENT,
    train_id INTEGER NOT NULL,
    coach_code TEXT NOT NULL,
    coach_type TEXT NOT NULL CHECK (coach_type IN ('1A', '2A', '3A', 'SL', 'CC', 'EC')),
    total_seats INTEGER NOT NULL CHECK (total_seats > 0),
    base_fare REAL NOT NULL CHECK (base_fare > 0),
    FOREIGN KEY (train_id) REFERENCES trains(train_id) ON DELETE CASCADE,
    UNIQUE(train_id, coach_code)
);

CREATE TABLE seats (
    seat_id INTEGER PRIMARY KEY AUTOINCREMENT,
    coach_id INTEGER NOT NULL,
    seat_number INTEGER NOT NULL CHECK (seat_number > 0),
    berth_type TEXT NOT NULL CHECK (berth_type IN ('LOWER', 'MIDDLE', 'UPPER', 'SIDE_LOWER', 'SIDE_UPPER', 'WINDOW', 'AISLE')),
    is_booked INTEGER NOT NULL DEFAULT 0 CHECK (is_booked IN (0, 1)),
    FOREIGN KEY (coach_id) REFERENCES coaches(coach_id) ON DELETE CASCADE,
    UNIQUE(coach_id, seat_number)
);

CREATE TABLE bookings (
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

CREATE TABLE passengers (
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
```

## Project Structure

```
backend/   FastAPI service (main.py, models.py, crud.py, database.py)
src/       React frontend (components, services, types)
frontend/  Vanilla HTML reference UI
tests/     API + concurrency stress tests
server_5500.ts  Secondary Express mock API
```

## How to Run

Backend (FastAPI):

```bash
py -m pip install -r requirements.txt
py -m uvicorn backend.main:app --host 0.0.0.0 --port 8000
```

Swagger UI: `http://localhost:8000/docs`

Frontend (React + Vite):

```bash
npm install --legacy-peer-deps
node ./node_modules/vite/bin/vite.js --port=3000 --host=0.0.0.0
```

Website: `http://localhost:3000/`

Tests:

```bash
py -m unittest tests/test_api.py
py tests/test_concurrency.py
```
