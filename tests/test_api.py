"""
Integration & Unit Test Suite for Railway CRUD & Validation
Author: Sub-Team D (Karthik Subramanian, Neha Deshmukh)
Project: Train Ticket Reservation & Dynamic Fleet Management System
"""

import sys
import unittest
from pathlib import Path

# Add root directory to sys.path
ROOT_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT_DIR))

from backend.database import init_db, get_db_connection, DB_FILE
from backend import crud


class TestRailwayAPIAndCRUD(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        init_db(DB_FILE, seed=True)

    def test_search_trains(self):
        """Test searching trains between New Delhi (NDLS) and Howrah (HWH)."""
        trains = crud.search_trains('NDLS', 'HWH', DB_FILE)
        self.assertGreater(len(trains), 0, "Should find at least 1 train between NDLS and HWH")
        
        train = trains[0]
        self.assertEqual(train["source_code"], "NDLS")
        self.assertEqual(train["destination_code"], "HWH")
        self.assertIn("coaches", train)
        self.assertGreater(len(train["coaches"]), 0)

    def test_coach_seats_matrix(self):
        """Test fetching interactive carriage seat grid."""
        coach_data = crud.get_coach_seats(1, DB_FILE)
        self.assertIsNotNone(coach_data)
        self.assertIn("seats", coach_data)
        self.assertGreater(len(coach_data["seats"]), 0)
        
        seat = coach_data["seats"][0]
        self.assertIn("berth_type", seat)
        self.assertIn("is_booked", seat)

    def test_atomic_booking_and_cancellation_lifecycle(self):
        """Test complete booking lifecycle: Reservation -> Verification -> Cancellation -> Refund."""
        # 1. Find an available seat
        conn = get_db_connection(DB_FILE)
        c = conn.cursor()
        c.execute("SELECT seat_id FROM seats WHERE coach_id = 2 AND is_booked = 0 LIMIT 2")
        seats = [r[0] for r in c.fetchall()]
        conn.close()

        self.assertEqual(len(seats), 2, "Should find at least 2 available seats")

        payload = {
            "train_id": 1,
            "coach_id": 2,
            "journey_date": "2026-10-25",
            "contact_name": "Dr. Aris Thorne",
            "contact_email": "aris.thorne@quantum.rail",
            "contact_phone": "9876543210",
            "passengers": [
                {"full_name": "Aris Thorne", "age": 34, "gender": "Male", "berth_preference": "WINDOW", "seat_id": seats[0]},
                {"full_name": "Elena Vance", "age": 31, "gender": "Female", "berth_preference": "AISLE", "seat_id": seats[1]}
            ]
        }

        # 2. Execute Booking
        success, err, res = crud.execute_atomic_booking(payload, DB_FILE)
        self.assertTrue(success, f"Booking should succeed: {err}")
        self.assertIsNotNone(res)
        pnr = res["pnr"]
        self.assertEqual(len(pnr), 10, "PNR should be 10 characters")

        # 3. Retrieve Details
        details = crud.get_booking_details(pnr, DB_FILE)
        self.assertIsNotNone(details)
        self.assertEqual(details["contact_email"], "aris.thorne@quantum.rail")
        self.assertEqual(len(details["passengers"]), 2)
        self.assertEqual(details["status"], "CONFIRMED")

        # 4. Cancel Ticket
        can_ok, can_err, can_res = crud.cancel_booking(pnr, DB_FILE)
        self.assertTrue(can_ok, f"Cancellation should succeed: {can_err}")
        self.assertEqual(can_res["status"], "CANCELLED")
        self.assertGreater(can_res["refund_amount"], 0)

        # 5. Verify seats released back to pool
        conn = get_db_connection(DB_FILE)
        c = conn.cursor()
        c.execute("SELECT is_booked FROM seats WHERE seat_id IN (?, ?)", (seats[0], seats[1]))
        statuses = [r[0] for r in c.fetchall()]
        conn.close()
        self.assertEqual(statuses, [0, 0], "Seats must be reset to unbooked (0)")

    def test_admin_metrics(self):
        """Test railway admin telemetry calculations."""
        metrics = crud.get_admin_metrics(DB_FILE)
        self.assertIn("active_trains", metrics)
        self.assertIn("occupancy_rate_percent", metrics)
        self.assertIn("total_revenue", metrics)
        self.assertGreater(metrics["active_trains"], 0)


if __name__ == "__main__":
    unittest.main()
