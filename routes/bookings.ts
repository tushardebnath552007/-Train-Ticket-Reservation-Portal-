import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import prisma from '../lib/prisma.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';

const router = Router();

// POST /api/v1/bookings
// Create a new booking with concurrency control
router.post('/', authenticate, async (req: AuthRequest, res: Response): Promise<any> => {
  const { trainNo, journeyDate, sourceCode, destinationCode, passengers } = req.body;
  const userId = req.user?.userId;

  if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });
  if (!trainNo || !passengers || passengers.length === 0) {
    return res.status(400).json({ success: false, message: 'Invalid booking data' });
  }

  try {
    const booking = await prisma.$transaction(async (tx) => {
      // 1. Verify all requested seats exist and fetch them
      const seatNos = passengers.map((p: any) => p.seatNo);
      
      // We would ideally use raw SQL for SELECT FOR UPDATE here to lock the rows
      // Prisma does this automatically in some scenarios, but to be safe:
      const seats = await tx.$queryRaw<any[]>`
        SELECT * FROM "Seat" 
        WHERE "trainNo" = ${trainNo} 
        AND "seatNo" = ANY(${seatNos}) 
        FOR UPDATE
      `;

      if (seats.length !== passengers.length) {
        throw new Error('Some seats do not exist');
      }

      // 2. Check if any of these seats are already booked for this date
      const existingBookings = await tx.booking.findMany({
        where: {
          trainNo,
          journeyDate: new Date(journeyDate),
          status: 'CONFIRMED',
          passengers: {
            some: {
              seatNo: { in: seatNos }
            }
          }
        },
        include: { passengers: true }
      });

      if (existingBookings.length > 0) {
        throw new Error('One or more selected seats are already booked for this date');
      }

      // 3. Calculate fare
      let totalFare = 0;
      for (const p of passengers) {
        const seat = seats.find(s => s.seatNo === p.seatNo);
        totalFare += seat.baseFare;
        // add taxes/service charges here
      }
      totalFare = totalFare * 1.18; // 18% GST example

      // 4. Generate PNR
      const pnr = Math.floor(1000000000 + Math.random() * 9000000000).toString(); // 10 digit PNR

      // 5. Create Booking
      const newBooking = await tx.booking.create({
        data: {
          pnr,
          userId,
          trainNo,
          journeyDate: new Date(journeyDate),
          sourceCode,
          destinationCode,
          totalFare,
          passengers: {
            create: passengers.map((p: any) => ({
              name: p.name,
              age: p.age,
              gender: p.gender,
              seatNo: p.seatNo,
              coachCode: p.coachCode || seats.find(s => s.seatNo === p.seatNo)?.coachCode || 'S1'
            }))
          }
        },
        include: { passengers: true }
      });

      return newBooking;
    });

    res.status(201).json({ success: true, message: 'Booking confirmed', booking });
  } catch (error: any) {
    console.error('Booking error:', error);
    res.status(400).json({ success: false, message: error.message || 'Booking failed' });
  }
});

// GET /api/v1/bookings/my-bookings
router.get('/my-bookings', authenticate, async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const userId = req.user?.userId;
    const bookings = await prisma.booking.findMany({
      where: { userId },
      include: { train: true, passengers: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;
