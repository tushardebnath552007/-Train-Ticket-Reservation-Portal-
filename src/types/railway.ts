export type CoachClass = '1A' | '2A' | '3A' | 'SL' | 'CC' | 'EC';
export type TrainType = 'VANDE_BHARAT' | 'SUPERFAST_EXPRESS' | 'SHATABDI' | 'TEJAS' | 'DURONTO';
export type BerthType = 'LOWER' | 'MIDDLE' | 'UPPER' | 'SIDE_LOWER' | 'SIDE_UPPER' | 'WINDOW' | 'AISLE';
export type BookingStatus = 'CONFIRMED' | 'CANCELLED';

export interface Station {
  code: string;
  name: string;
  city: string;
  state: string;
  platformCount: number;
}

export interface Seat {
  seatId: number;
  coachId: number;
  seatNumber: number;
  berthType: BerthType;
  isBooked: boolean;
}

export interface Coach {
  coachId: number;
  trainId: number;
  coachCode: string;
  coachType: CoachClass;
  totalSeats: number;
  baseFare: number;
  seats: Seat[];
}

export interface Train {
  trainId: number;
  trainNumber: string;
  trainName: string;
  sourceCode: string;
  sourceName: string;
  destinationCode: string;
  destinationName: string;
  departureTime: string;
  arrivalTime: string;
  durationHours: number;
  runsOn: string;
  trainType: TrainType;
  isActive: boolean;
  coaches: Coach[];
}

export interface Passenger {
  passengerId?: number;
  fullName: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  berthPreference: string;
  seatId: number;
  seatNumber?: number;
  berthType?: BerthType;
}

export interface Booking {
  bookingId: number;
  pnr: string;
  trainId: number;
  trainNumber: string;
  trainName: string;
  sourceCode: string;
  destinationCode: string;
  coachId: number;
  coachCode: string;
  coachType: CoachClass;
  journeyDate: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  passengers: Passenger[];
  totalAmount: number;
  status: BookingStatus;
  createdAt: string;
  transactionLatencyMs: number;
}

export interface AuditLog {
  logId: number;
  pnr?: string;
  actionType: string;
  lockMode: 'EXCLUSIVE_TRANSACTION' | 'SHARED_READ';
  executionTimeMs: number;
  details: string;
  createdAt: string;
}

export interface AdminMetrics {
  activeTrains: number;
  totalCoaches: number;
  totalCapacity: number;
  bookedSeats: number;
  occupancyRatePercent: number;
  totalBookings: number;
  totalRevenue: number;
  cancelledBookings: number;
}
