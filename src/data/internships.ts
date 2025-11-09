export type InternshipStatus = 'Onboarding' | 'Active' | 'Paused' | 'Completed';

export type InternshipPlacement = {
  id: string;
  intern: string;
  program: string;
  placementDates: string;
  mentor: string;
  location: string;
  hoursCompleted: number;
  targetHours: number;
  status: InternshipStatus;
  nextCheckIn: string;
  goals: string;
  notes?: string;
};

export const internshipPlacements: InternshipPlacement[] = [
  {
    id: 'ip-2001',
    intern: 'Zoe Marshall',
    program: 'Youth Circus Coaching',
    placementDates: 'Sep 2025 – Dec 2025',
    mentor: 'Jordan Hale',
    location: 'Cirkidz HQ',
    hoursCompleted: 42,
    targetHours: 80,
    status: 'Active',
    nextCheckIn: '2025-11-14',
    goals: 'Co-lead warm-ups and assist with safety briefings.',
    notes: 'Strong rapport with teens group; schedule extra observation of rigging.',
  },
  {
    id: 'ip-2002',
    intern: 'Ben Howard',
    program: 'Circus Production Operations',
    placementDates: 'Oct 2025 – Jan 2026',
    mentor: 'Priya Singh',
    location: 'Warehouse Studio',
    hoursCompleted: 18,
    targetHours: 120,
    status: 'Onboarding',
    nextCheckIn: '2025-11-18',
    goals: 'Learn equipment load-in/out and show calling basics.',
  },
  {
    id: 'ip-2003',
    intern: 'Alisha Khan',
    program: 'Community Outreach',
    placementDates: 'Aug 2025 – Nov 2025',
    mentor: 'Evelyn Walker',
    location: 'Community Programs',
    hoursCompleted: 95,
    targetHours: 100,
    status: 'Completed',
    nextCheckIn: '2025-11-05',
    goals: 'Wrap-up report and handover presentations.',
    notes: 'Final presentation delivered; awaiting survey feedback.',
  },
  {
    id: 'ip-2004',
    intern: 'Lucas Nguyen',
    program: 'Performance Tech Support',
    placementDates: 'Nov 2025 – Feb 2026',
    mentor: 'Amelia Woods',
    location: 'Main Stage',
    hoursCompleted: 6,
    targetHours: 100,
    status: 'Paused',
    nextCheckIn: '2025-11-21',
    goals: 'Resume after exams; focus on lighting desk operation.',
    notes: 'Temporarily paused due to school assessment period.',
  },
];


