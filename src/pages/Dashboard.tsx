import StatusBadge from '../components/StatusBadge';
import {
  dashboardStats,
  latestFollowUps,
  upcomingClasses,
} from '../data/dashboard';

function Dashboard() {
  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-500">
          Snapshot of this week&apos;s operations. All metrics are mock values
          for demo purposes.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {dashboardStats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="text-xs uppercase tracking-wide text-slate-400">
              {stat.label}
            </div>
            <div className="mt-2 text-2xl font-semibold text-slate-900">
              {stat.value}
            </div>
            <div className="text-sm text-slate-500">{stat.delta}</div>
          </div>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-slate-900">
              Upcoming Classes
            </h3>
            <button
              type="button"
              className="rounded-md border border-slate-200 px-3 py-1 text-xs text-slate-600 hover:bg-slate-100"
            >
              View roster
            </button>
          </div>
          <ul className="mt-4 space-y-4">
            {upcomingClasses.map((classItem) => (
              <li key={classItem.id} className="flex items-start justify-between">
                <div>
                  <div className="text-sm font-medium text-slate-900">
                    {classItem.name}
                  </div>
                  <div className="text-xs text-slate-500">
                    {classItem.start} · {classItem.location}
                  </div>
                </div>
                <span className="text-xs text-slate-500">{classItem.coach}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-slate-900">
              Free Trial Follow-ups
            </h3>
            <button
              type="button"
              className="rounded-md border border-slate-200 px-3 py-1 text-xs text-slate-600 hover:bg-slate-100"
            >
              See all leads
            </button>
          </div>
          <ul className="mt-4 space-y-4">
            {latestFollowUps.map((followUp) => (
              <li
                key={followUp.id}
                className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-3 py-2"
              >
                <div>
                  <div className="text-sm font-medium text-slate-900">
                    {followUp.student}
                  </div>
                  <div className="text-xs text-slate-500">{followUp.due}</div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <StatusBadge status={followUp.status} />
                  <span className="text-xs text-slate-500">
                    Owner: {followUp.owner}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;

