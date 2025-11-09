export type TrialBookingStatus =
  | 'Scheduled'
  | 'Confirmed'
  | 'Completed'
  | 'Converted'
  | 'No-show';

export type TrialBooking = {
  id: string;
  leadId?: string;
  student: string;
  contact: string;
  preferredClass: string;
  owner: string;
  coach: string;
  location: string;
  scheduledAt: string;
  weekOf: string;
  status: TrialBookingStatus;
  notes: string;
};

export const trialBookings: TrialBooking[] = [
  {
    id: 'tb-1001',
    leadId: 'ft-001',
    student: 'Mia Jenkins',
    contact: 'Parent: Laura · 0401 222 345',
    preferredClass: 'Youth Circus Foundation',
    owner: 'Evelyn Walker',
    coach: 'Jordan Hale',
    location: 'Cirkidz HQ · Main Hall',
    scheduledAt: '2025-11-11T17:00:00+10:30',
    weekOf: '2025-11-10',
    status: 'Confirmed',
    notes: 'Requested early arrival for warm-up.',
  },
  {
    id: 'tb-1002',
    leadId: 'ft-003',
    student: 'Lena Wu',
    contact: 'Parent: Erin · 0402 555 102',
    preferredClass: 'Teens Aerial Level 2',
    owner: 'Oliver Grant',
    coach: 'Priya Singh',
    location: 'Aerial Studio',
    scheduledAt: '2025-11-12T18:30:00+10:30',
    weekOf: '2025-11-10',
    status: 'Scheduled',
    notes: 'Needs quick tour of rigging area.',
  },
  {
    id: 'tb-1003',
    student: 'Noah Patel',
    contact: 'Parent: Meera · 0403 882 201',
    preferredClass: 'Kids Intro Circus',
    owner: 'Sam Collins',
    coach: 'Jordan Hale',
    location: 'Cirkidz HQ · Practice Room',
    scheduledAt: '2025-11-15T10:00:00+10:30',
    weekOf: '2025-11-10',
    status: 'Scheduled',
    notes: 'First visit · send parking instructions.',
  },
  {
    id: 'tb-1004',
    leadId: 'ft-004',
    student: 'Sasha Rivera',
    contact: 'Self · sasha.rivera@email.com',
    preferredClass: 'Adults Conditioning',
    owner: 'Evelyn Walker',
    coach: 'Amelia Woods',
    location: 'Conditioning Studio',
    scheduledAt: '2025-11-07T19:00:00+10:30',
    weekOf: '2025-11-03',
    status: 'Completed',
    notes: 'Converted to enrolment · autopay active.',
  },
];


