export const dashboardStats = [
  { label: 'Free Trials (This Week)', value: 24, delta: '+6 vs last week' },
  { label: 'Leads Awaiting Follow-up', value: 8, delta: 'Target: ≤5' },
  { label: 'Active Enrolments', value: 142, delta: '+12 net new' },
  { label: 'Classes Today', value: 9, delta: '5 coaches scheduled' },
] as const;

export const upcomingClasses = [
  {
    id: 'cla-1',
    name: 'Youth Circus Foundation',
    start: 'Today · 4:30 PM',
    coach: 'Jamie Lee',
    location: 'Main Hall',
  },
  {
    id: 'cla-2',
    name: 'Teens Aerial Level 2',
    start: 'Today · 6:00 PM',
    coach: 'Morgan Fox',
    location: 'Rig Room',
  },
  {
    id: 'cla-3',
    name: 'Adults Conditioning',
    start: 'Tomorrow · 7:30 PM',
    coach: 'Alex Tse',
    location: 'Studio B',
  },
] as const;

export const latestFollowUps = [
  {
    id: 'lead-1',
    student: 'Mia Jenkins',
    status: 'Pending Call',
    owner: 'Evelyn Walker',
    due: 'Dial parent after 11 Nov trial',
  },
  {
    id: 'lead-2',
    student: 'Henry Chalmers',
    status: 'Attempted',
    owner: 'Sam Collins',
    due: 'Follow up voicemail before Friday',
  },
  {
    id: 'lead-3',
    student: 'Lena Wu',
    status: 'In Follow-up',
    owner: 'Oliver Grant',
    due: 'Offer Thursday aerial slot',
  },
] as const;

