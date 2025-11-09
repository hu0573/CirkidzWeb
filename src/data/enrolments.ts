export type Enrolment = {
  id: string;
  student: string;
  program: string;
  enrolmentDate: string;
  status: 'Pending Payment' | 'Active' | 'Paused' | 'Cancelled';
  nextPayment: string;
  notes: string;
};

export const enrolments: Enrolment[] = [
  {
    id: 'en-101',
    student: 'Sasha Rivera',
    program: 'Adults Conditioning',
    enrolmentDate: '2025-10-12',
    status: 'Active',
    nextPayment: '12 Dec 2025',
    notes: 'Prefers Monday sessions; autopay active.',
  },
  {
    id: 'en-102',
    student: 'Carlos Mendes',
    program: 'Youth Circus Foundation',
    enrolmentDate: '2025-08-20',
    status: 'Pending Payment',
    nextPayment: 'Overdue since 30 Oct',
    notes: 'Send reminder email with payment link.',
  },
  {
    id: 'en-103',
    student: 'Lena Wu',
    program: 'Teens Aerial Level 2',
    enrolmentDate: '2025-02-05',
    status: 'Paused',
    nextPayment: 'On hold',
    notes: 'Pause during exam period; resume Jan.',
  },
  {
    id: 'en-104',
    student: 'Nova Chen',
    program: 'Kids Intro Circus',
    enrolmentDate: '2025-09-01',
    status: 'Active',
    nextPayment: '01 Dec 2025',
    notes: 'Sibling discount applied.',
  },
];

