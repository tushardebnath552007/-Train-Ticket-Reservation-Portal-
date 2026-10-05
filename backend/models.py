"""
Pydantic Data Transfer Objects (DTOs) & Input Validators
Author: Sub-Team B (Sneha Gupta, Vikram Malhotra, Ananya Roy)
Project: Train Ticket Reservation & Dynamic Fleet Management System
"""

from typing import List, Optional, Literal
from pydantic import BaseModel, Field, EmailStr, field_validator


class StationDTO(BaseModel):
    code: str
    name: str
    city: str
    state: str
    platform_count: int


class CoachSummaryDTO(BaseModel):
    coach_id: int
    coach_code: str
    coach_type: str
    total_seats: int
    available_seats: int
    base_fare: float


class TrainSearchItemDTO(BaseModel):
    train_id: int
    train_number: str
    train_name: str
    source_code: str
    source_name: str
    destination_code: str
    destination_name: str
    departure_time: str
    arrival_time: str
    duration_hours: float
    runs_on: str
    train_type: str
    coaches: List[CoachSummaryDTO]


class SeatDTO(BaseModel):
    seat_id: int
    coach_id: int
    seat_number: int
    berth_type: str
    is_booked: bool


class PassengerInputDTO(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=100)
    age: int = Field(..., ge=1, le=120)
    gender: Literal['Male', 'Female', 'Other']
    berth_preference: str = Field(default='NO_PREFERENCE')
    seat_id: int = Field(..., gt=0)


class BookingRequestDTO(BaseModel):
    train_id: int = Field(..., gt=0)
    coach_id: int = Field(..., gt=0)
    journey_date: str = Field(..., pattern=r'^\d{4}-\d{2}-\d{2}$')
    contact_name: str = Field(..., min_length=2)
    contact_email: str
    contact_phone: str = Field(..., min_length=10, max_length=15)
    passengers: List[PassengerInputDTO] = Field(..., min_items=1, max_items=6)

    @field_validator('passengers')
    @classmethod
    def unique_seat_ids(cls, v: List[PassengerInputDTO]) -> List[PassengerInputDTO]:
        seat_ids = [p.seat_id for p in v]
        if len(seat_ids) != len(set(seat_ids)):
            raise ValueError("Duplicate seat_ids detected in passenger booking payload")
        return v


class BookedPassengerDTO(BaseModel):
    passenger_id: int
    full_name: str
    age: int
    gender: str
    berth_preference: str
    seat_number: int
    berth_type: str


class BookingDetailDTO(BaseModel):
    booking_id: int
    pnr: str
    train_id: int
    train_number: str
    train_name: str
    source_code: str
    destination_code: str
    journey_date: str
    coach_code: str
    coach_type: str
    contact_name: str
    contact_email: str
    contact_phone: str
    total_amount: float
    status: str
    created_at: str
    passengers: List[BookedPassengerDTO]


class CancelBookingResponseDTO(BaseModel):
    pnr: str
    status: str
    refund_amount: float
    cancellation_fee: float
    released_seats: List[int]
    message: str


class AdminCreateTrainDTO(BaseModel):
    train_number: str = Field(..., min_length=4, max_length=10)
    train_name: str = Field(..., min_length=3)
    source_code: str
    destination_code: str
    departure_time: str
    arrival_time: str
    duration_hours: float = Field(..., gt=0)
    runs_on: str = "Daily"
    train_type: Literal['VANDE_BHARAT', 'SUPERFAST_EXPRESS', 'SHATABDI', 'TEJAS', 'DURONTO']
    coaches: List[dict]


class AuditLogDTO(BaseModel):
    log_id: int
    pnr: Optional[str]
    action_type: str
    lock_mode: str
    execution_time_ms: float
    details: str
    created_at: str


class ConcurrencyStressTestResponse(BaseModel):
    total_threads: int
    target_seat_id: int
    successful_bookings: int
    blocked_conflicts: int
    execution_time_seconds: float
    double_booking_detected: bool
    summary: str
