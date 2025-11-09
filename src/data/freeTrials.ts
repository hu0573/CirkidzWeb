export type FreeTrialLead = {
  id: string;
  student: string;
  contact: string;
  preferredClass: string;
  status: 'New' | 'Contacted' | 'Trial Scheduled' | 'In Follow-up' | 'Converted' | 'Lost';
  owner: string;
  createdAt: string;
  notes: string;
};

export const freeTrialLeads: FreeTrialLead[] = [
  {
    id: 'ft-001',
    student: 'Mia Jenkins',
    contact: 'Parent: Laura · 0401 222 345',
    preferredClass: 'Youth Circus Foundation',
    status: 'In Follow-up',
    owner: 'Evelyn Walker',
    createdAt: '2025-11-05',
    notes: 'Loves aerial silks; keen to join term program.',
  },
  {
    id: 'ft-002',
    student: 'Henry Chalmers',
    contact: 'Parent: Noah · henry.parent@email.com',
    preferredClass: 'Kids Intro Circus',
    status: 'New',
    owner: 'Sam Collins',
    createdAt: '2025-11-08',
    notes: 'Website enquiry; prefers weekend slot.',
  },
  {
    id: 'ft-003',
    student: 'Lena Wu',
    contact: 'Parent: Erin · 0402 555 102',
    preferredClass: 'Teens Aerial Level 2',
    status: 'Trial Scheduled',
    owner: 'Oliver Grant',
    createdAt: '2025-11-06',
    notes: 'Needs to confirm with school schedule.',
  },
  {
    id: 'ft-004',
    student: 'Sasha Rivera',
    contact: 'Self · sasha.rivera@email.com',
    preferredClass: 'Adults Conditioning',
    status: 'Converted',
    owner: 'Evelyn Walker',
    createdAt: '2025-11-01',
    notes: 'Signed up after trial; autopay set.',
  },
];

