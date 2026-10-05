"""
Raw SQL Query Execution Handlers & Transaction Isolation Wrappers
Author: Sub-Team A & B (Rajesh Kumar, Priya Sharma, Sneha Gupta)
Project: Train Ticket Reservation & Dynamic Fleet Management System

CRITICAL ARCHITECTURAL GUARANTEE:
Eliminate race conditions and double-booking anomalies under heavy concurrent
load using SQLite exclusive transaction locking (`BEGIN EXCLUSIVE`).
"""

import sqlite3
import time
import secrets
import json
from typing import List, Dict, Any, Optional, Tuple
from pathlib import Path

from backend.database import get_db_connection, DB_FILE


def generate_cryptographic_pnr() -> str:
    """Generates an authentic 10-digit railway PNR code."""
    # First 3 digits represent PRS cluster (e.g., 284 for Northern/Western), next 7 are cryptographically random
    cluster = "284"
    rand_part = str(secrets.randbelow(9000000) + 1000000)
    return f"{cluster}{rand_part}"


def search_trains(
    source_code: str,
    destination_code: str,
    db_path: Path = DB_FILE
) -> List[Dict[str, Any]]:
    """
    Retrieves matching train schedules along with real-time seat availability
    calculated dynamically per coach class.
    """
    conn = get_db_connection(db_path)
    cursor = conn.cursor()

    query = """
    SELECT 
        t.train_id, t.train_number, t.train_name,
        t.source_code, s_src.name AS source_name,
        t.destination_code, s_dst.name AS destination_name,
        t.departure_time, t.arrival_time, t.duration_hours,
        t.runs_on, t.train_type
    FROM trains t
    JOIN stations s_src ON t.source_code = s_src.code
    JOIN stations s_dst ON t.destination_code = s_dst.code
    WHERE t.source_code = ? AND t.destination_code = ? AND t.is_active = 1
    ORDER BY t.departure_time ASC;
    """

    cursor.execute(query, (source_code.upper(), destination_code.upper()))
    train_rows = cursor.fetchall()
    results = []

    for tr in train_rows:
        train_data = dict(tr)
        t_id = tr["train_id"]

        # Fetch coaches and calculate live availability
        coach_query = """
        SELECT 
            c.coach_id, c.coach_code, c.coach_type, c.total_seats, c.base_fare,
            COUNT(CASE WHEN s.is_booked = 0 THEN 1 END) AS available_seats
        FROM coaches c
        LEFT JOIN seats s ON c.coach_id = s.coach_id
        WHERE c.train_id = ?
        GROUP BY c.coach_id
        ORDER BY c.base_fare ASC;
        """
        cursor.execute(coach_query, (t_id,))
        coaches = [dict(c) for c in cursor.fetchall()]
        train_data["coaches"] = coaches
        results.append(train_data)

    conn.close()
    return results


def get_coach_seats(coach_id: int, db_path: Path = DB_FILE) -> Dict[str, Any]:
    """
    Fetches real-time seat status for an interactive carriage grid.
    """
    conn = get_db_connection(db_path)
    cursor = conn.cursor()

    cursor.execute("""
        SELECT c.coach_id, c.coach_code, c.coach_type, c.base_fare, t.train_number, t.train_name
        FROM coaches c
        JOIN trains t ON c.train_id = t.train_id
        WHERE c.coach_id = ?
    """, (coach_id,))
    coach_info = cursor.fetchone()
    if not coach_info:
        conn.close()
        return None

    cursor.execute("""
        SELECT seat_id, coach_id, seat_number, berth_type, is_booked
        FROM seats
        WHERE coach_id = ?
        ORDER BY seat_number ASC
    """, (coach_id,))
    seats = [dict(s) for s in cursor.fetchall()]
    conn.close()

    res = dict(coach_info)
    res["seats"] = seats
    return res


def execute_atomic_booking(
    booking_data: Dict[str, Any],
    db_path: Path = DB_FILE
) -> Tuple[bool, Optional[str], Optional[Dict[str, Any]]]:
    """
    ATOMIC RESERVATION WITH EXCLUSIVE TRANSACTION LOCKING.
    
    Uses `BEGIN EXCLUSIVE` in SQLite to ensure no two concurrent transactions
    can read/write the same seat simultaneously, eliminating double-bookings.
    """
    start_time = time.perf_counter()
    conn = sqlite3.connect(str(db_path), timeout=25.0)
    conn.row_factory = sqlite3.Row
    conn.isolation_level = None  # Autocommit disabled to handle explicit transaction blocks
    cursor = conn.cursor()

    pnr = generate_cryptographic_pnr()
    seat_ids = [p["seat_id"] for p in booking_data["passengers"]]

    try:
        # 1. ACQUIRE EXCLUSIVE LOCK ON DATABASE
        cursor.execute("BEGIN EXCLUSIVE")

        # 2. CHECK SEAT AVAILABILITY UNDER EXCLUSIVE LOCK
        placeholders = ",".join("?" for _ in seat_ids)
        check_query = f"""
            SELECT seat_id, seat_number, is_booked, coach_id
            FROM seats
            WHERE seat_id IN ({placeholders})
        """
        cursor.execute(check_query, seat_ids)
        found_seats = cursor.fetchall()

        if len(found_seats) != len(seat_ids):
            cursor.execute("ROLLBACK")
            conn.close()
            return False, "One or more requested seat IDs do not exist.", None

        # Verify none of the requested seats are already booked
        already_booked = [s["seat_number"] for s in found_seats if s["is_booked"] == 1]
        if already_booked:
            cursor.execute("ROLLBACK")
            # Log conflict attempt in audit
            exec_ms = (time.perf_counter() - start_time) * 1000
            _log_audit(db_path, None, "CONCURRENCY_CONFLICT_DETECTED", exec_ms,
                       f"Seat(s) {already_booked} already occupied during exclusive check.")
            conn.close()
            return False, f"Concurrency conflict: Seat(s) {already_booked} already booked by another transaction.", None

        # 3. COMPUTE FARE & MARK SEATS AS BOOKED
        cursor.execute("SELECT base_fare FROM coaches WHERE coach_id = ?", (booking_data["coach_id"],))
        coach_row = cursor.fetchone()
        base_fare = coach_row["base_fare"] if coach_row else 1000.0
        total_fare = base_fare * len(seat_ids)

        update_query = f"UPDATE seats SET is_booked = 1 WHERE seat_id IN ({placeholders})"
        cursor.execute(update_query, seat_ids)

        # 4. INSERT BOOKING HEADER RECORD
        cursor.execute("""
            INSERT INTO bookings (
                pnr, train_id, coach_id, contact_name, contact_email,
                contact_phone, journey_date, total_amount, status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'CONFIRMED')
        """, (
            pnr,
            booking_data["train_id"],
            booking_data["coach_id"],
            booking_data["contact_name"],
            booking_data["contact_email"],
            booking_data["contact_phone"],
            booking_data["journey_date"],
            total_fare
        ))
        booking_id = cursor.lastrowid

        # 5. INSERT PASSENGER LINE ITEMS
        for p in booking_data["passengers"]:
            cursor.execute("""
                INSERT INTO passengers (
                    booking_id, seat_id, full_name, age, gender, berth_preference
                ) VALUES (?, ?, ?, ?, ?, ?)
            """, (
                booking_id,
                p["seat_id"],
                p["full_name"],
                p["age"],
                p["gender"],
                p.get("berth_preference", "NO_PREFERENCE")
            ))

        # 6. RECORD AUDIT LOG ENTRY
        exec_ms = (time.perf_counter() - start_time) * 1000
        cursor.execute("""
            INSERT INTO audit_logs (pnr, action_type, lock_mode, execution_time_ms, details)
            VALUES (?, 'BOOKING_SUCCESS', 'EXCLUSIVE_TRANSACTION', ?, ?)
        """, (pnr, exec_ms, f"Successfully allocated {len(seat_ids)} seats under exclusive lock."))

        # 7. COMMIT ATOMIC TRANSACTION
        cursor.execute("COMMIT")
        conn.close()

        result_payload = {
            "pnr": pnr,
            "booking_id": booking_id,
            "total_amount": total_fare,
            "allocated_seats": seat_ids,
            "execution_time_ms": round(exec_ms, 2)
        }
        return True, None, result_payload

    except sqlite3.OperationalError as op_err:
        try:
            cursor.execute("ROLLBACK")
        except Exception:
            pass
        conn.close()
        return False, f"Database locking busy or operational error: {str(op_err)}", None

    except Exception as exc:
        try:
            cursor.execute("ROLLBACK")
        except Exception:
            pass
        conn.close()
        return False, f"Internal transaction failure: {str(exc)}", None


def cancel_booking(pnr: str, db_path: Path = DB_FILE) -> Tuple[bool, Optional[str], Optional[Dict[str, Any]]]:
    """
    Cancels an active ticket atomically, releasing seats back to inventory.
    """
    start_time = time.perf_counter()
    conn = sqlite3.connect(str(db_path), timeout=25.0)
    conn.row_factory = sqlite3.Row
    conn.isolation_level = None
    cursor = conn.cursor()

    try:
        cursor.execute("BEGIN EXCLUSIVE")

        cursor.execute("SELECT booking_id, total_amount, status FROM bookings WHERE pnr = ?", (pnr,))
        booking = cursor.fetchone()
        if not booking:
            cursor.execute("ROLLBACK")
            conn.close()
            return False, f"Booking with PNR {pnr} not found.", None

        if booking["status"] == 'CANCELLED':
            cursor.execute("ROLLBACK")
            conn.close()
            return False, f"Booking {pnr} is already cancelled.", None

        booking_id = booking["booking_id"]
        total_fare = booking["total_amount"]

        # Fetch associated seats
        cursor.execute("SELECT seat_id FROM passengers WHERE booking_id = ?", (booking_id,))
        passenger_seats = [row["seat_id"] for row in cursor.fetchall()]

        # Release seats
        if passenger_seats:
            placeholders = ",".join("?" for _ in passenger_seats)
            cursor.execute(f"UPDATE seats SET is_booked = 0 WHERE seat_id IN ({placeholders})", passenger_seats)

        # Update booking status
        cursor.execute("UPDATE bookings SET status = 'CANCELLED' WHERE booking_id = ?", (booking_id,))

        # Cancellation fee logic: Flat 15% cancellation charge
        cancellation_fee = round(total_fare * 0.15, 2)
        refund_amount = round(total_fare - cancellation_fee, 2)

        exec_ms = (time.perf_counter() - start_time) * 1000
        cursor.execute("""
            INSERT INTO audit_logs (pnr, action_type, lock_mode, execution_time_ms, details)
            VALUES (?, 'CANCELLATION_SUCCESS', 'EXCLUSIVE_TRANSACTION', ?, ?)
        """, (pnr, exec_ms, f"Released {len(passenger_seats)} seats. Refund: Rs. {refund_amount}."))

        cursor.execute("COMMIT")
        conn.close()

        return True, None, {
            "pnr": pnr,
            "status": "CANCELLED",
            "refund_amount": refund_amount,
            "cancellation_fee": cancellation_fee,
            "released_seats": passenger_seats,
            "message": f"Ticket {pnr} successfully cancelled. Refund of Rs. {refund_amount} initiated."
        }

    except Exception as exc:
        try:
            cursor.execute("ROLLBACK")
        except Exception:
            pass
        conn.close()
        return False, f"Cancellation failure: {str(exc)}", None


def get_booking_details(pnr: str, db_path: Path = DB_FILE) -> Optional[Dict[str, Any]]:
    conn = get_db_connection(db_path)
    cursor = conn.cursor()

    query = """
    SELECT 
        b.booking_id, b.pnr, b.train_id, t.train_number, t.train_name,
        t.source_code, t.destination_code, b.journey_date,
        c.coach_code, c.coach_type, b.contact_name, b.contact_email,
        b.contact_phone, b.total_amount, b.status, b.created_at
    FROM bookings b
    JOIN trains t ON b.train_id = t.train_id
    JOIN coaches c ON b.coach_id = c.coach_id
    WHERE b.pnr = ?
    """
    cursor.execute(query, (pnr,))
    row = cursor.fetchone()
    if not row:
        conn.close()
        return None

    booking = dict(row)

    # Fetch passenger details
    p_query = """
    SELECT 
        p.passenger_id, p.full_name, p.age, p.gender, p.berth_preference,
        s.seat_number, s.berth_type
    FROM passengers p
    JOIN seats s ON p.seat_id = s.seat_id
    WHERE p.booking_id = ?
    ORDER BY s.seat_number ASC
    """
    cursor.execute(p_query, (booking["booking_id"],))
    booking["passengers"] = [dict(p) for p in cursor.fetchall()]
    conn.close()
    return booking


def get_bookings_by_email(email: str, db_path: Path = DB_FILE) -> List[Dict[str, Any]]:
    conn = get_db_connection(db_path)
    cursor = conn.cursor()

    query = """
    SELECT 
        b.booking_id, b.pnr, b.train_id, t.train_number, t.train_name,
        t.source_code, t.destination_code, b.journey_date,
        c.coach_code, c.coach_type, b.contact_name, b.contact_email,
        b.contact_phone, b.total_amount, b.status, b.created_at
    FROM bookings b
    JOIN trains t ON b.train_id = t.train_id
    JOIN coaches c ON b.coach_id = c.coach_id
    WHERE LOWER(b.contact_email) = LOWER(?)
    ORDER BY b.created_at DESC
    """
    cursor.execute(query, (email,))
    rows = cursor.fetchall()
    results = []

    for r in rows:
        item = dict(r)
        # Fetch passenger count
        cursor.execute("SELECT COUNT(*) FROM passengers WHERE booking_id = ?", (item["booking_id"],))
        item["passenger_count"] = cursor.fetchone()[0]
        results.append(item)

    conn.close()
    return results


def get_admin_metrics(db_path: Path = DB_FILE) -> Dict[str, Any]:
    conn = get_db_connection(db_path)
    cursor = conn.cursor()

    cursor.execute("SELECT COUNT(*) FROM trains WHERE is_active = 1")
    active_trains = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*), SUM(total_seats) FROM coaches")
    c_row = cursor.fetchone()
    total_coaches = c_row[0] or 0
    total_capacity = c_row[1] or 0

    cursor.execute("SELECT COUNT(*) FROM seats WHERE is_booked = 1")
    booked_seats = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*), COALESCE(SUM(total_amount), 0) FROM bookings WHERE status = 'CONFIRMED'")
    b_row = cursor.fetchone()
    total_bookings = b_row[0]
    total_revenue = b_row[1]

    cursor.execute("SELECT COUNT(*) FROM bookings WHERE status = 'CANCELLED'")
    total_cancelled = cursor.fetchone()[0]

    occupancy_rate = round((booked_seats / total_capacity * 100), 1) if total_capacity > 0 else 0.0

    conn.close()
    return {
        "active_trains": active_trains,
        "total_coaches": total_coaches,
        "total_capacity": total_capacity,
        "booked_seats": booked_seats,
        "occupancy_rate_percent": occupancy_rate,
        "total_bookings": total_bookings,
        "total_revenue": total_revenue,
        "cancelled_bookings": total_cancelled
    }


def get_audit_logs(limit: int = 50, db_path: Path = DB_FILE) -> List[Dict[str, Any]]:
    conn = get_db_connection(db_path)
    cursor = conn.cursor()
    cursor.execute("""
        SELECT log_id, pnr, action_type, lock_mode, execution_time_ms, details, created_at
        FROM audit_logs
        ORDER BY log_id DESC
        LIMIT ?
    """, (limit,))
    logs = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return logs


def _log_audit(db_path: Path, pnr: Optional[str], action: str, exec_time_ms: float, details: str):
    try:
        conn = sqlite3.connect(str(db_path))
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO audit_logs (pnr, action_type, lock_mode, execution_time_ms, details)
            VALUES (?, ?, 'EXCLUSIVE_TRANSACTION', ?, ?)
        """, (pnr, action, exec_time_ms, details))
        conn.commit()
        conn.close()
    except Exception:
        pass
