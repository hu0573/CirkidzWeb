import type { ReactNode } from 'react';
import type { PageKey } from '../App';

type AdminLayoutProps = {
  activePage: PageKey;
  onNavigate: (page: PageKey) => void;
  children: ReactNode;
};

const NAV_ITEMS: { key: PageKey; label: string; description: string }[] = [
  { key: 'dashboard', label: 'Dashboard', description: 'Overview' },
  { key: 'freeTrials', label: 'Free Trials', description: 'Lead intake' },
  {
    key: 'trialScheduling',
    label: 'Trial Scheduling',
    description: 'Bookings & follow-up',
  },
  {
    key: 'salesFollowUp',
    label: 'Sales Follow-up',
    description: 'Post-trial calls',
  },
  { key: 'enrolments', label: 'Enrolments', description: 'Active students' },
  {
    key: 'classScheduling',
    label: 'Class Scheduling',
    description: 'Weekly roster',
  },
  { key: 'internships', label: 'Internships', description: 'Placements' },
];

function AdminLayout({ activePage, onNavigate, children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="flex h-screen overflow-hidden">
        <aside className="hidden w-64 flex-shrink-0 flex-col border-r border-slate-200 bg-white lg:flex">
          <div className="px-6 pb-4 pt-6">
            <h1 className="text-xl font-semibold text-slate-900">Cirkidz Ops</h1>
            <p className="text-sm text-slate-500">
              Digital Efficiency Restructure
            </p>
          </div>
          <nav className="flex-1 space-y-1 px-2">
            {NAV_ITEMS.map((item) => {
              const isActive = item.key === activePage;
              return (
                <button
                  key={item.key}
                  type="button"
                  className={`w-full rounded-lg px-4 py-3 text-left text-sm transition ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                  onClick={() => onNavigate(item.key)}
                >
                  <div className="font-medium">{item.label}</div>
                  <div className={`text-xs ${isActive ? 'text-slate-200' : 'text-slate-500'}`}>
                    {item.description}
                  </div>
                </button>
              );
            })}
          </nav>
          <div className="px-4 pb-6 pt-4 text-xs text-slate-400">
            Future modules placeholder
          </div>
        </aside>

        <div className="flex flex-1 flex-col overflow-hidden">
          <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 lg:px-8">
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Internal Admin Portal (mock data)
              </h2>
              <p className="text-sm text-slate-500">
                Key flows only · No live integrations
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="rounded-full border border-slate-200 px-3 py-1 text-sm text-slate-600 hover:bg-slate-100"
              >
                Quick Action
              </button>
              <div className="flex items-center gap-2">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-sm font-medium text-white">
                  AC
                </span>
                <div>
                  <div className="text-sm font-medium text-slate-900">
                    Alex Cooper
                  </div>
                  <div className="text-xs text-slate-500">Operations Lead</div>
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto bg-slate-100 px-4 py-6 lg:px-8">
            <div className="mx-auto max-w-6xl">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;

