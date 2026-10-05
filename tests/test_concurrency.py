"""
Multi-Threaded Concurrency Stress Testing Suite
Author: Sub-Team D (Karthik Subramanian, Neha Deshmukh)
Project: Train Ticket Reservation & Dynamic Fleet Management System

OBJECTIVE:
Simulate aggressive, multi-threaded concurrent reservation attempts competing
for the EXACT SAME railway seat to mathematically prove that SQLite3 `BEGIN EXCLUSIVE`
transaction locking guarantees ZERO double-bookings and absolute data consistency.
"""

import threading
import time
import sys
from pathlib import Path
from typing import List, Dict, Any

# Add workspace root to sys.path
ROOT_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT_DIR))

from backend.database import init_db, get_db_connection, DB_FILE
from backend import crud


def run_concurrency_race_condition_test(
    thread_count: int = 30,
    target_seat_number: int = 15
) -> Dict[str, Any]:
    """
    Spawns `thread_count` concurrent OS threads that simultaneously issue atomic
    reservation transactions for identical `seat_id`.
    """
    print("=" * 70)
    print(f"[*] LAUNCHING CONCURRENCY STRESS TEST WITH {thread_count} PARALLEL THREADS")
    print(f"[*] Target Seat: Seat #{target_seat_number} on Coach #1")
    print(f"[*] Transaction Isolation Strategy: SQLite BEGIN EXCLUSIVE")
    print("=" * 70)

    # 1. Reset database state for clean test isolation
    init_db(DB_FILE, seed=True)
    conn = get_db_connection(DB_FILE)
    cursor = conn.cursor()

    # Find the target seat_id in Coach 1
    cursor.execute("""
        SELECT seat_id, is_booked FROM seats
        WHERE coach_id = 1 AND seat_number = ?
    """, (target_seat_number,))
    seat_row = cursor.fetchone()
    if not seat_row:
        # Fallback to first seat
        cursor.execute("SELECT seat_id FROM seats WHERE coach_id = 1 LIMIT 1")
        target_seat_id = cursor.fetchone()[0]
    else:
        target_seat_id = seat_row[0]

    # Ensure target seat and previous test bookings are cleaned for clean isolation
    cursor.execute("DELETE FROM passengers WHERE seat_id = ?", (target_seat_id,))
    cursor.execute("UPDATE seats SET is_booked = 0 WHERE seat_id = ?", (target_seat_id,))
    conn.commit()
    conn.close()

    success_reservations = []
    conflict_exceptions = []
    thread_timings = []

    # Barrier to ensure all threads begin at the exact same millisecond
    start_barrier = threading.Barrier(thread_count)

    def worker_attempt_booking(thread_id: int):
        payload = {
            "train_id": 1,
            "coach_id": 1,
            "journey_date": "2026-11-20",
            "contact_name": f"Concurrent Traveler {thread_id}",
            "contact_email": f"traveler_{thread_id}@university.edu",
            "contact_phone": "9123456780",
            "passengers": [
                {
                    "full_name": f"Student {thread_id}",
                    "age": 20,
                    "gender": "Female" if thread_id % 2 == 0 else "Male",
                    "berth_preference": "WINDOW",
                    "seat_id": target_seat_id
                }
            ]
        }

        # Synchronize all threads at the barrier
        start_barrier.wait()
        
        t0 = time.perf_counter()
        success, error_msg, result = crud.execute_atomic_booking(payload, DB_FILE)
        dt = (time.perf_counter() - t0) * 1000

        if success:
            success_reservations.append((thread_id, result, dt))
            print(f"  [+] Thread {thread_id:02d} SUCCESS: Reserved Seat ID {target_seat_id} (PNR: {result['pnr']}) in {dt:.2f}ms")
        else:
            conflict_exceptions.append((thread_id, error_msg, dt))

        thread_timings.append(dt)

    threads: List[threading.Thread] = []
    for i in range(thread_count):
        t = threading.Thread(target=worker_attempt_booking, args=(i + 1,), name=f"Racer-{i+1}")
        threads.append(t)

    # Launch threads
    test_start = time.perf_counter()
    for t in threads:
        t.start()

    for t in threads:
        t.join()

    total_test_time = time.perf_counter() - test_start

    # Verify final database state directly
    conn_verify = get_db_connection(DB_FILE)
    c_verify = conn_verify.cursor()
    c_verify.execute("SELECT is_booked FROM seats WHERE seat_id = ?", (target_seat_id,))
    final_seat_status = c_verify.fetchone()[0]

    c_verify.execute("""
        SELECT COUNT(*) FROM passengers p
        JOIN bookings b ON p.booking_id = b.booking_id
        WHERE p.seat_id = ? AND b.status = 'CONFIRMED'
    """, (target_seat_id,))
    total_passenger_allocations = c_verify.fetchone()[0]
    conn_verify.close()

    print("\n" + "=" * 70)
    print("CONCURRENCY STRESS TEST RESULTS SUMMARY")
    print("=" * 70)
    print(f"Total Parallel Threads Launched:   {thread_count}")
    print(f"Successful Reservations:           {len(success_reservations)}")
    print(f"Blocked Conflicts Handled:         {len(conflict_exceptions)}")
    print(f"Database Final Seat is_booked:     {final_seat_status}")
    print(f"Confirmed Bookings on Seat:        {total_passenger_allocations}")
    print(f"Wall Clock Time:                   {total_test_time:.3f} seconds")
    print(f"Average Thread Latency:            {sum(thread_timings)/len(thread_timings):.2f} ms")

    # Assertions
    double_booking_detected = len(success_reservations) > 1 or total_passenger_allocations > 1
    
    if double_booking_detected:
        print("\n[CRITICAL FAILURE] RACE CONDITION DETECTED! MULTIPLE BOOKINGS CONFIRMED FOR SAME SEAT!")
        return {"status": "FAILED", "double_booking": True}
    elif len(success_reservations) == 1 and total_passenger_allocations == 1:
        print("\n[VERIFICATION PASSED] ZERO DOUBLE-BOOKINGS DETECTED!")
        print(">> SQLite BEGIN EXCLUSIVE transaction locking successfully serialized all concurrent accesses.")
        print(f">> 1 thread acquired the seat, {len(conflict_exceptions)} threads were safely blocked.")
        return {
            "status": "PASSED",
            "double_booking": False,
            "successes": len(success_reservations),
            "conflicts": len(conflict_exceptions),
            "total_time_seconds": round(total_test_time, 3)
        }
    else:
        print(f"\n[WARNING] Unexpected state: successes={len(success_reservations)}")
        return {"status": "INCONCLUSIVE", "double_booking": False}


if __name__ == "__main__":
    result = run_concurrency_race_condition_test(thread_count=25, target_seat_number=10)
    if result["status"] != "PASSED":
        sys.exit(1)
