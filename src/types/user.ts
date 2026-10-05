export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'traveler' | 'admin' | 'officer';
  avatar?: string;
  membershipTier: 'Standard' | 'Silver' | 'Gold' | 'Executive Platinum';
  walletBalance: number;
  totalTrips: number;
  savedPassengers: {
    fullName: string;
    age: number;
    gender: 'Male' | 'Female' | 'Other';
    berthPreference: string;
  }[];
}

export const DEMO_USERS: Record<string, UserProfile> = {
  traveler: {
    id: 'usr_88291',
    name: 'Rahul Sharma',
    email: 'rahul.sharma@railfleet.gov.in',
    phone: '+91 98765 43210',
    role: 'traveler',
    membershipTier: 'Executive Platinum',
    walletBalance: 2850,
    totalTrips: 18,
    savedPassengers: [
      { fullName: 'Rahul Sharma', age: 34, gender: 'Male', berthPreference: 'Window / Lower' },
      { fullName: 'Ananya Sharma', age: 31, gender: 'Female', berthPreference: 'Lower' },
      { fullName: 'Aarav Sharma', age: 7, gender: 'Male', berthPreference: 'Middle' }
    ]
  },
  admin: {
    id: 'usr_admin_01',
    name: 'Priya Sen',
    email: 'priya.sen@railfleet.gov.in',
    phone: '+91 91234 56789',
    role: 'admin',
    membershipTier: 'Executive Platinum',
    walletBalance: 12500,
    totalTrips: 42,
    savedPassengers: [
      { fullName: 'Priya Sen', age: 29, gender: 'Female', berthPreference: 'Window' }
    ]
  }
};
