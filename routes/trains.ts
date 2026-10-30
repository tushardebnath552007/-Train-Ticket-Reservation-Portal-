import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma.js';

const router = Router();

// GET /api/v1/trains/search
// Search trains by source, destination, and date
router.get('/search', async (req: Request, res: Response): Promise<any> => {
  try {
    const { source, destination, date } = req.query;

    if (!source || !destination || !date) {
      return res.status(400).json({ success: false, message: 'Source, destination, and date are required' });
    }

    // Since we're keeping it simple for the demo, we just look for trains that have both stations.
    // In a real app, we would verify sequence order (source comes before destination).
    const trains = await prisma.train.findMany({
      where: {
        stations: {
          some: { stationCode: String(source) }
        },
        AND: {
          stations: {
            some: { stationCode: String(destination) }
          }
        }
      },
      include: {
        stations: {
          orderBy: { distance: 'asc' }
        },
        seats: true // include seats to check availability later
      }
    });

    res.json({ success: true, trains });
  } catch (error) {
    console.error('Train search error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /api/v1/trains/:trainNo/seats
// Get seats for a specific train
router.get('/:trainNo/seats', async (req: Request, res: Response): Promise<any> => {
  try {
    const { trainNo } = req.params;
    const seats = await prisma.seat.findMany({
      where: { trainNo }
    });

    res.json({ success: true, seats });
  } catch (error) {
    console.error('Fetch seats error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;
