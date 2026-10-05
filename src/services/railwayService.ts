import { Train, Station, Booking, AuditLog, AdminMetrics, Seat, Coach, Passenger, CoachClass, BerthType } from '../types/railway';
import { INITIAL_STATIONS, generateInitialTrains } from '../data/mockData';

const STORAGE_TRAINS_KEY = 'railfleet_trains_v1';
const STORAGE_BOOKINGS_KEY = 'railfleet_bookings_v1';
const STORAGE_AUDIT_KEY = 'railfleet_audit_v1';

class RailwayService {
  private trains: Train[] = [];
  private bookings: Booking[] = [];
  private auditLogs: AuditLog[] = [];
  private stations: Station[] = INITIAL_STATIONS;
  private isLockAcquired: boolean = false;
  private sequenceCounter: number = Math.floor(Math.random() * 500) + 1000;

  private generateUniqueLogId(): number {
    return Date.now() * 1000 + (this.sequenceCounter++ % 1000);
  }

  private generateUniqueBookingId(): number {
    return Date.now() * 1000 + (this.sequenceCounter++ % 1000);
  }

  constructor() {
    this.initData();
  }

  private initData() {
    try {
      const storedTrains = localStorage.getItem(STORAGE_TRAINS_KEY);
      const storedBookings = localStorage.getItem(STORAGE_BOOKINGS_KEY);
      const storedAudit = localStorage.getItem(STORAGE_AUDIT_KEY);

      if (storedTrains) {
        this.trains = JSON.parse(storedTrains);
      } else {
        this.trains = generateInitialTrains();
        this.saveTrains();
      }

      if (storedBookings) {
        try {
          const parsed: Booking[] = JSON.parse(storedBookings);
          const seenPnr = new Set<string>();
          this.bookings = parsed.filter((b, idx) => {
            const idKey = b.pnr || `b_${b.bookingId}_${idx}`;
            if (seenPnr.has(idKey)) return false;
            seenPnr.add(idKey);
            return true;
          });
        } catch {
          this.bookings = [];
        }
      } else {
        // Seed 1 confirmed booking for demonstration
        this.bookings = [
          {
            bookingId: 101,
            pnr: '2848920194',
            trainId: 1,
            trainNumber: '22436',
            trainName: 'Vande Bharat Express',
            sourceCode: 'NDLS',
            destinationCode: 'HWH',
            coachId: 11,
            coachCode: 'C1',
            coachType: 'CC',
            journeyDate: '2026-10-18',
            contactName: 'Prof. Anirudh Sen',
            contactEmail: 'anirudh.sen@iitd.ac.in',
            contactPhone: '9811223344',
            passengers: [
              {
                passengerId: 1,
                fullName: 'Anirudh Sen',
                age: 48,
                gender: 'Male',
                berthPreference: 'WINDOW',
                seatId: 153,
                seatNumber: 3,
                berthType: 'WINDOW'
              }
            ],
            totalAmount: 1850,
            status: 'CONFIRMED',
            createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
            transactionLatencyMs: 6.8
          }
        ];
        this.saveBookings();
      }

      if (storedAudit) {
        try {
          const parsedLogs: AuditLog[] = JSON.parse(storedAudit);
          const seenIds = new Set<number>();
          this.auditLogs = parsedLogs.map((l, index) => {
            let id = l.logId;
            if (!id || seenIds.has(id)) {
              id = Date.now() * 1000 + (this.sequenceCounter++ % 1000) + index;
            }
            seenIds.add(id);
            return { ...l, logId: id };
          });
        } catch {
          this.auditLogs = [];
        }
      } else {
        this.auditLogs = [
          {
            logId: 1,
            pnr: '2848920194',
            actionType: 'BOOKING_SUCCESS',
            lockMode: 'EXCLUSIVE_TRANSACTION',
            executionTimeMs: 6.8,
            details: 'Exclusive lock held. Seat #3 confirmed for Prof. Anirudh Sen.',
            createdAt: new Date(Date.now() - 3600000 * 5).toISOString()
          },
          {
            logId: 2,
            actionType: 'SCHEMA_INTEGRITY_CHECK',
            lockMode: 'EXCLUSIVE_TRANSACTION',
            executionTimeMs: 1.2,
            details: 'PRAGMA foreign_keys = ON; All 7 relational tables validated.',
            createdAt: new Date(Date.now() - 3600000 * 12).toISOString()
          }
        ];
        this.saveAudit();
      }
    } catch {
      this.trains = generateInitialTrains();
      this.bookings = [];
      this.auditLogs = [];
    }
  }

  private saveTrains() {
    localStorage.setItem(STORAGE_TRAINS_KEY, JSON.stringify(this.trains));
  }

  private saveBookings() {
    localStorage.setItem(STORAGE_BOOKINGS_KEY, JSON.stringify(this.bookings));
  }

  private saveAudit() {
    localStorage.setItem(STORAGE_AUDIT_KEY, JSON.stringify(this.auditLogs));
  }

  public getStations(): Station[] {
    return this.stations;
  }

  public getAllTrains(): Train[] {
    return this.trains;
  }

  public searchTrains(source: string, destination: string, coachFilter?: string): Train[] {
    const s = source.toUpperCase();
    const d = destination.toUpperCase();

    let matching = this.trains.filter(t => t.isActive && t.sourceCode === s && t.destinationCode === d);
    if (coachFilter && coachFilter !== 'ALL') {
      matching = matching.filter(t => t.coaches.some(c => c.coachType === coachFilter));
    }
    return matching;
  }

  public getTrainById(trainId: number): Train | undefined {
    return this.trains.find(t => t.trainId === trainId);
  }

  public getCoach(trainId: number, coachId: number): { train: Train; coach: Coach } | null {
    const train = this.getTrainById(trainId);
    if (!train) return null;
    const coach = train.coaches.find(c => c.coachId === coachId);
    if (!coach) return null;
    return { train, coach };
  }

  public generateCryptographicPNR(): string {
    const prefix = '284';
    const rand = Math.floor(1000000 + Math.random() * 9000000);
    return `${prefix}${rand}`;
  }

  /**
   * ATOMIC TRANSACTION RESERVATION (SQLite BEGIN EXCLUSIVE simulation)
   * Prevents race conditions and double-bookings.
   */
  public async executeAtomicBooking(payload: {
    trainId: number;
    coachId: number;
    journeyDate: string;
    contactName: string;
    contactEmail: string;
    contactPhone: string;
    passengers: { fullName: string; age: number; gender: 'Male' | 'Female' | 'Other'; berthPreference: string; seatId: number }[];
  }): Promise<{ success: boolean; pnr?: string; totalAmount?: number; error?: string; latencyMs: number }> {
    const t0 = performance.now();

    // 1. Simulate SQLite BEGIN EXCLUSIVE lock wait if another process is writing
    if (this.isLockAcquired) {
      await new Promise(r => setTimeout(r, 60));
    }
    this.isLockAcquired = true;

    try {
      const train = this.trains.find(t => t.trainId === payload.trainId);
      if (!train) throw new Error('Selected train does not exist');

      const coach = train.coaches.find(c => c.coachId === payload.coachId);
      if (!coach) throw new Error('Selected coach does not exist');

      const seatIds = payload.passengers.map(p => p.seatId);

      // 2. Critical Check: Ensure NO requested seat is already booked
      const conflictSeats: number[] = [];
      coach.seats.forEach(s => {
        if (seatIds.includes(s.seatId) && s.isBooked) {
          conflictSeats.push(s.seatNumber);
        }
      });

      if (conflictSeats.length > 0) {
        const latency = performance.now() - t0;
        this.auditLogs.unshift({
          logId: this.generateUniqueLogId(),
          actionType: 'CONCURRENCY_CONFLICT_DETECTED',
          lockMode: 'EXCLUSIVE_TRANSACTION',
          executionTimeMs: Math.round(latency * 10) / 10,
          details: `Booking rejected: Seat(s) #${conflictSeats.join(', ')} already reserved by parallel transaction. ROLLBACK executed.`,
          createdAt: new Date().toISOString()
        });
        this.saveAudit();
        return {
          success: false,
          error: `Concurrency conflict: Seat(s) #${conflictSeats.join(', ')} were already reserved. Double-booking prevented by transaction isolation.`,
          latencyMs: Math.round(latency * 10) / 10
        };
      }

      // 3. Mark seats as booked
      coach.seats.forEach(s => {
        if (seatIds.includes(s.seatId)) {
          s.isBooked = true;
        }
      });

      const totalAmount = coach.baseFare * payload.passengers.length;
      const pnr = this.generateCryptographicPNR();

      const newBooking: Booking = {
        bookingId: this.generateUniqueBookingId(),
        pnr,
        trainId: train.trainId,
        trainNumber: train.trainNumber,
        trainName: train.trainName,
        sourceCode: train.sourceCode,
        destinationCode: train.destinationCode,
        coachId: coach.coachId,
        coachCode: coach.coachCode,
        coachType: coach.coachType,
        journeyDate: payload.journeyDate,
        contactName: payload.contactName,
        contactEmail: payload.contactEmail,
        contactPhone: payload.contactPhone,
        totalAmount,
        status: 'CONFIRMED',
        createdAt: new Date().toISOString(),
        transactionLatencyMs: Math.round((performance.now() - t0) * 10) / 10,
        passengers: payload.passengers.map((p, idx) => {
          const seatObj = coach.seats.find(s => s.seatId === p.seatId);
          return {
            passengerId: idx + 1,
            fullName: p.fullName,
            age: p.age,
            gender: p.gender,
            berthPreference: p.berthPreference,
            seatId: p.seatId,
            seatNumber: seatObj?.seatNumber || 0,
            berthType: seatObj?.berthType || 'WINDOW'
          };
        })
      };

      this.bookings.unshift(newBooking);
      this.saveTrains();
      this.saveBookings();

      const latency = performance.now() - t0;
      this.auditLogs.unshift({
        logId: this.generateUniqueLogId(),
        pnr,
        actionType: 'BOOKING_SUCCESS',
        lockMode: 'EXCLUSIVE_TRANSACTION',
        executionTimeMs: Math.round(latency * 10) / 10,
        details: `Exclusive lock held. Allocated ${seatIds.length} seat(s) on ${coach.coachCode}. PNR ${pnr} committed.`,
        createdAt: new Date().toISOString()
      });
      this.saveAudit();

      // Synchronize with backend on port 5500 via proxy
      try {
        fetch('/api/v1/bookings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newBooking)
        }).catch(() => {});
      } catch (_) {}

      return {
        success: true,
        pnr,
        totalAmount,
        latencyMs: Math.round(latency * 10) / 10
      };

    } finally {
      this.isLockAcquired = false;
    }
  }

  public cancelBooking(pnr: string): { success: boolean; message: string; refundAmount: number; cancellationFee: number } {
    const booking = this.bookings.find(b => b.pnr === pnr.trim());
    if (!booking) {
      return { success: false, message: `No booking record found for PNR ${pnr}`, refundAmount: 0, cancellationFee: 0 };
    }

    if (booking.status === 'CANCELLED') {
      return { success: false, message: `Ticket ${pnr} has already been cancelled previously.`, refundAmount: 0, cancellationFee: 0 };
    }

    // 1. Release seats back to coach
    const train = this.trains.find(t => t.trainId === booking.trainId);
    if (train) {
      const coach = train.coaches.find(c => c.coachId === booking.coachId);
      if (coach) {
        const releasedSeatIds = booking.passengers.map(p => p.seatId);
        coach.seats.forEach(s => {
          if (releasedSeatIds.includes(s.seatId)) {
            s.isBooked = false;
          }
        });
        this.saveTrains();
      }
    }

    // 2. Mark booking as cancelled
    booking.status = 'CANCELLED';
    this.saveBookings();

    const cancellationFee = Math.round(booking.totalAmount * 0.15);
    const refundAmount = booking.totalAmount - cancellationFee;

    this.auditLogs.unshift({
      logId: this.generateUniqueLogId(),
      pnr,
      actionType: 'CANCELLATION_SUCCESS',
      lockMode: 'EXCLUSIVE_TRANSACTION',
      executionTimeMs: 4.5,
      details: `PNR ${pnr} cancelled. Released ${booking.passengers.length} seat(s). Refund: ₹${refundAmount} (15% deduction: ₹${cancellationFee}).`,
      createdAt: new Date().toISOString()
    });
    this.saveAudit();

    // Synchronize cancellation with backend on port 5500 via proxy
    try {
      fetch('/api/v1/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pnr: pnr.trim() })
      }).catch(() => {});
    } catch (_) {}

    return {
      success: true,
      message: `Ticket ${pnr} cancelled. Refund of ₹${refundAmount} has been initiated to original payment source.`,
      refundAmount,
      cancellationFee
    };
  }

  public getBookingByPnr(pnr: string): Booking | undefined {
    return this.bookings.find(b => b.pnr === pnr.trim());
  }

  public getBookingsByEmail(email: string): Booking[] {
    const clean = email.trim().toLowerCase();
    return this.bookings.filter(b => b.contactEmail.toLowerCase().includes(clean));
  }

  public getAllBookings(): Booking[] {
    return this.bookings;
  }

  public getAdminMetrics(): AdminMetrics {
    const activeTrains = this.trains.filter(t => t.isActive).length;
    let totalCoaches = 0;
    let totalCapacity = 0;
    let bookedSeats = 0;

    this.trains.forEach(t => {
      t.coaches.forEach(c => {
        totalCoaches += 1;
        totalCapacity += c.totalSeats;
        bookedSeats += c.seats.filter(s => s.isBooked).length;
      });
    });

    const confirmedBookings = this.bookings.filter(b => b.status === 'CONFIRMED');
    const totalRevenue = confirmedBookings.reduce((sum, b) => sum + b.totalAmount, 0);
    const cancelledBookings = this.bookings.filter(b => b.status === 'CANCELLED').length;
    const occupancyRatePercent = totalCapacity > 0 ? Math.round((bookedSeats / totalCapacity) * 1000) / 10 : 0;

    return {
      activeTrains,
      totalCoaches,
      totalCapacity,
      bookedSeats,
      occupancyRatePercent,
      totalBookings: confirmedBookings.length,
      totalRevenue,
      cancelledBookings
    };
  }

  public getAuditLogs(): AuditLog[] {
    return this.auditLogs;
  }

  public addNewTrain(newTrainData: Omit<Train, 'trainId' | 'coaches'> & { coachClasses: CoachClass[]; baseFare: number }): Train {
    const newId = this.trains.length > 0 ? Math.max(...this.trains.map(t => t.trainId)) + 1 : 1;
    let seatStart = 5000 + newId * 100;

    const coaches: Coach[] = newTrainData.coachClasses.map((cc, idx) => {
      const cId = newId * 10 + idx + 1;
      const count = cc === 'EC' ? 16 : cc === '2A' ? 20 : 24;
      const fareMultiplier = cc === 'EC' ? 1.8 : cc === '1A' ? 2.2 : cc === '2A' ? 1.4 : cc === 'SL' ? 0.4 : 1.0;
      const actualFare = Math.round(newTrainData.baseFare * fareMultiplier);

      const seats: Seat[] = [];
      const berthOptions: BerthType[] = ['SL', '3A', '2A'].includes(cc)
        ? ['LOWER', 'MIDDLE', 'UPPER', 'SIDE_LOWER', 'SIDE_UPPER']
        : ['WINDOW', 'AISLE', 'MIDDLE'];

      for (let i = 1; i <= count; i++) {
        seats.push({
          seatId: (seatStart += 1),
          coachId: cId,
          seatNumber: i,
          berthType: berthOptions[(i - 1) % berthOptions.length],
          isBooked: false
        });
      }

      return {
        coachId: cId,
        trainId: newId,
        coachCode: `${cc}${idx + 1}`,
        coachType: cc,
        totalSeats: count,
        baseFare: actualFare,
        seats
      };
    });

    const newTrain: Train = {
      trainId: newId,
      trainNumber: newTrainData.trainNumber,
      trainName: newTrainData.trainName,
      sourceCode: newTrainData.sourceCode,
      sourceName: newTrainData.sourceName,
      destinationCode: newTrainData.destinationCode,
      destinationName: newTrainData.destinationName,
      departureTime: newTrainData.departureTime,
      arrivalTime: newTrainData.arrivalTime,
      durationHours: newTrainData.durationHours,
      runsOn: newTrainData.runsOn,
      trainType: newTrainData.trainType,
      isActive: true,
      coaches
    };

    this.trains.push(newTrain);
    this.saveTrains();

    this.auditLogs.unshift({
      logId: this.generateUniqueLogId(),
      actionType: 'TRAIN_SCHEDULE_CREATED',
      lockMode: 'EXCLUSIVE_TRANSACTION',
      executionTimeMs: 3.2,
      details: `Admin added Train #${newTrain.trainNumber} (${newTrain.trainName}) with ${coaches.length} coaches.`,
      createdAt: new Date().toISOString()
    });
    this.saveAudit();

    return newTrain;
  }

  public resetDatabase(): void {
    localStorage.removeItem(STORAGE_TRAINS_KEY);
    localStorage.removeItem(STORAGE_BOOKINGS_KEY);
    localStorage.removeItem(STORAGE_AUDIT_KEY);
    this.initData();
  }
}

export const railwayService = new RailwayService();
