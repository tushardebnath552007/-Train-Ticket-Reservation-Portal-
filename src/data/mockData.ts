import { Station, Train, Coach, Seat, BerthType } from '../types/railway';

export const INITIAL_STATIONS: Station[] = [
  { code: 'NDLS', name: 'New Delhi Railway Station', city: 'New Delhi', state: 'Delhi', platformCount: 16 },
  { code: 'MMCT', name: 'Mumbai Central', city: 'Mumbai', state: 'Maharashtra', platformCount: 10 },
  { code: 'HWH', name: 'Howrah Junction', city: 'Kolkata', state: 'West Bengal', platformCount: 23 },
  { code: 'SBC', name: 'KSR Bengaluru City', city: 'Bengaluru', state: 'Karnataka', platformCount: 10 },
  { code: 'MAS', name: 'Chennai Central', city: 'Chennai', state: 'Tamil Nadu', platformCount: 12 },
  { code: 'ADI', name: 'Ahmedabad Junction', city: 'Ahmedabad', state: 'Gujarat', platformCount: 12 },
  { code: 'PNBE', name: 'Patna Junction', city: 'Patna', state: 'Bihar', platformCount: 10 },
  { code: 'GKP', name: 'Gorakhpur Junction', city: 'Gorakhpur', state: 'Uttar Pradesh', platformCount: 10 }
];

function generateSeats(coachId: number, count: number, coachType: string, startId: number): Seat[] {
  const seats: Seat[] = [];
  const berthOptions: BerthType[] = ['SL', '3A', '2A'].includes(coachType)
    ? ['LOWER', 'MIDDLE', 'UPPER', 'SIDE_LOWER', 'SIDE_UPPER']
    : ['WINDOW', 'AISLE', 'MIDDLE'];

  for (let i = 1; i <= count; i++) {
    const isPreBooked = [3, 7, 12, 18, 22].includes(i);
    seats.push({
      seatId: startId + i,
      coachId,
      seatNumber: i,
      berthType: berthOptions[(i - 1) % berthOptions.length],
      isBooked: isPreBooked
    });
  }
  return seats;
}

export function generateInitialTrains(): Train[] {
  let seatCounter = 100;

  return [
    {
      trainId: 1,
      trainNumber: '22436',
      trainName: 'Vande Bharat Express',
      sourceCode: 'NDLS',
      sourceName: 'New Delhi',
      destinationCode: 'HWH',
      destinationName: 'Howrah Junction',
      departureTime: '06:00',
      arrivalTime: '14:00',
      durationHours: 8.0,
      runsOn: 'Daily except Thu',
      trainType: 'VANDE_BHARAT',
      isActive: true,
      coaches: [
        {
          coachId: 1,
          trainId: 1,
          coachCode: 'C1',
          coachType: 'CC',
          totalSeats: 24,
          baseFare: 1850,
          seats: generateSeats(1, 24, 'CC', (seatCounter += 50))
        },
        {
          coachId: 2,
          trainId: 1,
          coachCode: 'C2',
          coachType: 'CC',
          totalSeats: 24,
          baseFare: 1850,
          seats: generateSeats(2, 24, 'CC', (seatCounter += 50))
        },
        {
          coachId: 3,
          trainId: 1,
          coachCode: 'E1',
          coachType: 'EC',
          totalSeats: 16,
          baseFare: 3420,
          seats: generateSeats(3, 16, 'EC', (seatCounter += 50))
        }
      ]
    },
    {
      trainId: 2,
      trainNumber: '12952',
      trainName: 'Mumbai Rajdhani Express',
      sourceCode: 'NDLS',
      sourceName: 'New Delhi',
      destinationCode: 'MMCT',
      destinationName: 'Mumbai Central',
      departureTime: '16:55',
      arrivalTime: '08:35',
      durationHours: 15.6,
      runsOn: 'Daily',
      trainType: 'SUPERFAST_EXPRESS',
      isActive: true,
      coaches: [
        {
          coachId: 4,
          trainId: 2,
          coachCode: 'A1',
          coachType: '2A',
          totalSeats: 20,
          baseFare: 2850,
          seats: generateSeats(4, 20, '2A', (seatCounter += 50))
        },
        {
          coachId: 5,
          trainId: 2,
          coachCode: 'B1',
          coachType: '3A',
          totalSeats: 24,
          baseFare: 2150,
          seats: generateSeats(5, 24, '3A', (seatCounter += 50))
        },
        {
          coachId: 6,
          trainId: 2,
          coachCode: 'S1',
          coachType: 'SL',
          totalSeats: 32,
          baseFare: 740,
          seats: generateSeats(6, 32, 'SL', (seatCounter += 50))
        }
      ]
    },
    {
      trainId: 3,
      trainNumber: '12002',
      trainName: 'New Delhi Shatabdi Express',
      sourceCode: 'NDLS',
      sourceName: 'New Delhi',
      destinationCode: 'ADI',
      destinationName: 'Ahmedabad Junction',
      departureTime: '06:15',
      arrivalTime: '14:40',
      durationHours: 8.4,
      runsOn: 'Daily',
      trainType: 'SHATABDI',
      isActive: true,
      coaches: [
        {
          coachId: 7,
          trainId: 3,
          coachCode: 'C1',
          coachType: 'CC',
          totalSeats: 24,
          baseFare: 1420,
          seats: generateSeats(7, 24, 'CC', (seatCounter += 50))
        },
        {
          coachId: 8,
          trainId: 3,
          coachCode: 'E1',
          coachType: 'EC',
          totalSeats: 16,
          baseFare: 2680,
          seats: generateSeats(8, 16, 'EC', (seatCounter += 50))
        }
      ]
    },
    {
      trainId: 4,
      trainNumber: '20608',
      trainName: 'Vande Bharat Express',
      sourceCode: 'SBC',
      sourceName: 'KSR Bengaluru',
      destinationCode: 'MAS',
      destinationName: 'Chennai Central',
      departureTime: '05:45',
      arrivalTime: '10:10',
      durationHours: 4.4,
      runsOn: 'Daily except Wed',
      trainType: 'VANDE_BHARAT',
      isActive: true,
      coaches: [
        {
          coachId: 9,
          trainId: 4,
          coachCode: 'C1',
          coachType: 'CC',
          totalSeats: 24,
          baseFare: 980,
          seats: generateSeats(9, 24, 'CC', (seatCounter += 50))
        },
        {
          coachId: 10,
          trainId: 4,
          coachCode: 'E1',
          coachType: 'EC',
          totalSeats: 16,
          baseFare: 1850,
          seats: generateSeats(10, 16, 'EC', (seatCounter += 50))
        }
      ]
    },
    {
      trainId: 5,
      trainNumber: '22119',
      trainName: 'Tejas Superfast Express',
      sourceCode: 'MMCT',
      sourceName: 'Mumbai Central',
      destinationCode: 'ADI',
      destinationName: 'Ahmedabad Junction',
      departureTime: '15:25',
      arrivalTime: '21:55',
      durationHours: 6.5,
      runsOn: 'Daily except Thu',
      trainType: 'TEJAS',
      isActive: true,
      coaches: [
        {
          coachId: 11,
          trainId: 5,
          coachCode: 'C1',
          coachType: 'CC',
          totalSeats: 24,
          baseFare: 1540,
          seats: generateSeats(11, 24, 'CC', (seatCounter += 50))
        },
        {
          coachId: 12,
          trainId: 5,
          coachCode: 'E1',
          coachType: 'EC',
          totalSeats: 16,
          baseFare: 2950,
          seats: generateSeats(12, 16, 'EC', (seatCounter += 50))
        }
      ]
    }
  ];
}
