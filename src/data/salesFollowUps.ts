export type FollowUpStatus = 'Pending Call' | 'Attempted' | 'Needs Manager' | 'Won' | 'Lost';

export type TrialOutcome = 'Attended' | 'No-show' | 'Cancelled';

export type SalesFollowUp = {
  id: string;
  leadId?: string;
  bookingId?: string;
  student: string;
  contact: string;
  owner: string;
  preferredClass: string;
  trialOutcome: TrialOutcome;
  followUpStatus: FollowUpStatus;
  lastContactedAt: string | null;
  nextAction: string;
  nextActionDue: string;
  notes: string;
  createdAt: string;
};

export const salesFollowUps: SalesFollowUp[] = [
  {
    id: 'sf-8001',
    leadId: 'ft-001',
    bookingId: 'tb-1001',
    student: 'Mia Jenkins',
    contact: 'Parent: Laura · 0401 222 345',
    owner: 'Evelyn Walker',
    preferredClass: 'Youth Circus Foundation',
    trialOutcome: 'Attended',
    followUpStatus: 'Pending Call',
    lastContactedAt: null,
    nextAction: 'Call parent to confirm enrolment options.',
    nextActionDue: '2025-11-12',
    notes: 'Trial completed; highly engaged during aerial segment.',
    createdAt: '2025-11-11',
  },
  {
    id: 'sf-8002',
    leadId: 'ft-003',
    bookingId: 'tb-1002',
    student: 'Lena Wu',
    contact: 'Parent: Erin · 0402 555 102',
    owner: 'Oliver Grant',
    preferredClass: 'Teens Aerial Level 2',
    trialOutcome: 'Attended',
    followUpStatus: 'Attempted',
    lastContactedAt: '2025-11-10T16:15:00+10:30',
    nextAction: 'Send pricing sheet and offer Thursday slot.',
    nextActionDue: '2025-11-13',
    notes: 'Left voicemail; parent requested info via email.',
    createdAt: '2025-11-09',
  },
  {
    id: 'sf-8003',
    student: 'Noah Patel',
    contact: 'Parent: Meera · 0403 882 201',
    owner: 'Sam Collins',
    preferredClass: 'Kids Intro Circus',
    trialOutcome: 'No-show',
    followUpStatus: 'Needs Manager',
    lastContactedAt: '2025-11-08T10:00:00+10:30',
    nextAction: 'Escalate to manager for second attempt.',
    nextActionDue: '2025-11-12',
    notes: 'Parent mentioned conflicting birthday party; needs weekend option.',
    createdAt: '2025-11-07',
  },
];


