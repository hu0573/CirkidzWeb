export type ClassSession = {
  id: string;
  name: string;
  schedule: string;
  coach: string;
  location: string;
  capacity: number;
  enrolled: number;
  tags?: string[];
};

export const classSessions: ClassSession[] = [
  {
    id: 'cs-201',
    name: 'Youth Circus Foundation',
    schedule: 'Tue · 4:30 – 5:45 PM',
    coach: 'Jamie Lee',
    location: 'Main Hall',
    capacity: 14,
    enrolled: 12,
    tags: ['6-9 yrs'],
  },
  {
    id: 'cs-202',
    name: 'Teens Aerial Level 2',
    schedule: 'Wed · 6:00 – 7:30 PM',
    coach: 'Morgan Fox',
    location: 'Rig Room',
    capacity: 12,
    enrolled: 11,
    tags: ['12-16 yrs'],
  },
  {
    id: 'cs-203',
    name: 'Adults Conditioning',
    schedule: 'Thu · 7:00 – 8:15 PM',
    coach: 'Alex Tse',
    location: 'Studio B',
    capacity: 18,
    enrolled: 16,
    tags: ['18+'],
  },
  {
    id: 'cs-204',
    name: 'Sensory Circus',
    schedule: 'Sat · 10:00 – 11:00 AM',
    coach: 'Casey Holt',
    location: 'Main Hall',
    capacity: 10,
    enrolled: 8,
    tags: ['Inclusive'],
  },
];

