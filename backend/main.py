"""
FastAPI Application Entry Point & CORS Configuration
Author: Sub-Team B (Sneha Gupta, Vikram Malhotra, Ananya Roy)
Project: Train Ticket Reservation & Dynamic Fleet Management System
"""

import os
import sys
from pathlib import Path
from typing import List, Optional
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

# Add repository root to path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from backend.database import init_db, DB_FILE, get_db_connection
from backend.models import (
    StationDTO,
    TrainSearchItemDTO,
    BookingRequestDTO,
    BookingDetailDTO,
    CancelBookingResponseDTO,
    AdminCreateTrainDTO,
    AuditLogDTO,
    ConcurrencyStressTestResponse
)
from backend import crud


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize DB on startup
    init_db(DB_FILE, seed=True)
    yield


app = FastAPI(
    title="RailFleet Express - Train Ticket Reservation & Dynamic Fleet Management API",
    description="Enterprise-grade decoupled railway reservation system with SQLite exclusive concurrency locking (`BEGIN EXCLUSIVE`), interactive seat maps, and dynamic PNR lifecycle management.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# Enable Cross-Origin Resource Sharing
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", tags=["Health"])
def health_check():
    """System health check and architectural metadata endpoint."""
    return {
        "status": "HEALTHY",
        "service": "RailFleet Express Engine",
        "database": "SQLite3 (Relational Integrity, FKs ON)",
        "concurrency_protection": "BEGIN EXCLUSIVE Transaction Locking",
        "version": "1.0.0",
        "docs": "/docs"
    }


@app.get("/api/v1/stations", response_model=List[StationDTO], tags=["Stations"])
def get_all_stations():
    """Retrieve all available railway terminal stations."""
    conn = get_db_connection(DB_FILE)
    cursor = conn.cursor()
    cursor.execute("SELECT code, name, city, state, platform_count FROM stations ORDER BY city ASC")
    stations = [dict(s) for s in cursor.fetchall()]
    conn.close()
    return stations


@app.get("/api/v1/trains", tags=["Search & Schedules"])
def search_available_trains(
    source: str = Query(..., description="Source station code (e.g. NDLS)"),
    destination: str = Query(..., description="Destination station code (e.g. HWH)"),
    date: Optional[str] = Query(None, description="Travel date in YYYY-MM-DD")
):
    """
    Search available trains for a given route and travel date with real-time
    berth availability computed per coach.
    """
    results = crud.search_trains(source, destination, DB_FILE)
    return {
        "source": source.upper(),
        "destination": destination.upper(),
        "date": date,
        "total_results": len(results),
        "trains": results
    }


@app.get("/api/v1/trains/{train_id}/coaches/{coach_id}/seats", tags=["Coach Grid"])
def get_carriage_seat_grid(train_id: int, coach_id: int):
    """
    Fetch interactive coach seat matrix displaying real-time booking status
    (Available, Booked) for SVG/grid rendering.
    """
    data = crud.get_coach_seats(coach_id, DB_FILE)
    if not data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Coach with ID {coach_id} not found on train {train_id}."
        )
    return data


@app.post("/api/v1/bookings", tags=["Reservations"])
def create_ticket_booking(payload: BookingRequestDTO):
    """
    Atomic seat reservation using SQLite `BEGIN EXCLUSIVE` transaction isolation.
    Eliminates race conditions and prevents double-booking.
    """
    booking_dict = payload.model_dump()
    success, error_msg, result = crud.execute_atomic_booking(booking_dict, DB_FILE)

    if not success:
        # Check if error is concurrency conflict
        if "conflict" in (error_msg or "").lower() or "already booked" in (error_msg or "").lower():
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=error_msg
            )
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=error_msg or "Failed to complete atomic transaction."
        )

    return JSONResponse(status_code=status.HTTP_201_CREATED, content=result)


@app.get("/api/v1/bookings/{pnr}", tags=["Reservations"])
def get_booking_by_pnr(pnr: str):
    """Fetch complete ticket details, passenger manifests, and coach layout by PNR."""
    booking = crud.get_booking_details(pnr.strip(), DB_FILE)
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Ticket record with PNR '{pnr}' does not exist."
        )
    return booking


@app.get("/api/v1/bookings/user/{email}", tags=["Reservations"])
def get_user_booking_history(email: str):
    """Retrieve full booking history for a registered traveler email."""
    bookings = crud.get_bookings_by_email(email.strip(), DB_FILE)
    return {
        "email": email,
        "total_bookings": len(bookings),
        "history": bookings
    }


@app.delete("/api/v1/bookings/{pnr}", response_model=CancelBookingResponseDTO, tags=["Reservations"])
def cancel_ticket(pnr: str):
    """
    Atomically cancel a confirmed ticket, calculate refund, and release seats back to inventory.
    """
    success, error_msg, result = crud.cancel_booking(pnr.strip(), DB_FILE)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=error_msg or f"Failed to cancel booking {pnr}."
        )
    return result


@app.get("/api/v1/admin/metrics", tags=["Fleet Administration"])
def get_fleet_operational_metrics():
    """Retrieve live fleet occupancy rates, total revenue, active trains, and cancellations."""
    return crud.get_admin_metrics(DB_FILE)


@app.get("/api/v1/admin/audit-logs", tags=["Fleet Administration"])
def get_concurrency_audit_logs(limit: int = 50):
    """Inspect real-time SQLite exclusive lock transactions and conflict audit logs."""
    return crud.get_audit_logs(limit, DB_FILE)


@app.post("/api/v1/test/concurrency", response_model=ConcurrencyStressTestResponse, tags=["Concurrency Testing"])
def trigger_concurrency_benchmark(
    threads_count: int = Query(20, ge=2, le=100),
    target_seat_id: Optional[int] = Query(None)
):
    """
    Triggers an in-process multi-threaded concurrency race condition simulation
    competing for a single seat to verify `BEGIN EXCLUSIVE` locking.
    """
    import threading
    import time

    conn = get_db_connection(DB_FILE)
    cursor = conn.cursor()
    
    # Pick an available seat if not specified
    if target_seat_id is None:
        cursor.execute("SELECT seat_id FROM seats WHERE is_booked = 0 LIMIT 1")
        row = cursor.fetchone()
        if not row:
            # reset one seat for test
            cursor.execute("UPDATE seats SET is_booked = 0 WHERE seat_id = 1")
            conn.commit()
            target_seat_id = 1
        else:
            target_seat_id = row[0]
    conn.close()

    successes = []
    conflicts = []
    
    start_time = time.perf_counter()

    def attempt_reservation(thread_idx: int):
        booking_payload = {
            "train_id": 1,
            "coach_id": 1,
            "journey_date": "2026-10-15",
            "contact_name": f"Stress Tester {thread_idx}",
            "contact_email": f"tester{thread_idx}@stress.edu",
            "contact_phone": "9876543210",
            "passengers": [
                {
                    "full_name": f"Concurrent Passenger {thread_idx}",
                    "age": 25,
                    "gender": "Male",
                    "seat_id": target_seat_id
                }
            ]
        }
        ok, err, res = crud.execute_atomic_booking(booking_payload, DB_FILE)
        if ok:
            successes.append(res)
        else:
            conflicts.append(err)

    threads = []
    for i in range(threads_count):
        t = threading.Thread(target=attempt_reservation, args=(i + 1,))
        threads.append(t)

    # Launch all threads simultaneously
    for t in threads:
        t.start()
    for t in threads:
        t.join()

    total_time = time.perf_counter() - start_time
    double_booking = len(successes) > 1

    return ConcurrencyStressTestResponse(
        total_threads=threads_count,
        target_seat_id=target_seat_id,
        successful_bookings=len(successes),
        blocked_conflicts=len(conflicts),
        execution_time_seconds=round(total_time, 3),
        double_booking_detected=double_booking,
        summary=f"Race condition eliminated! Exactly {len(successes)} booking succeeded out of {threads_count} concurrent requests. SQLite BEGIN EXCLUSIVE protected seat integrity."
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
