import { useMemo, useState } from 'react';
import EntityDrawer from '../components/EntityDrawer';
import StatusBadge from '../components/StatusBadge';
import AssignmentModal from '../components/AssignmentModal';
import useToast from '../hooks/useToast';
import { useDemoData } from '../hooks/useDemoData';
import type { FollowUpStatus, SalesFollowUp as SalesFollowUpRecord } from '../data/salesFollowUps';

type LogForm = {
  followUpStatus: FollowUpStatus;
  nextAction: string;
  nextActionDue: string;
  notes: string;
};

const statusFilters: (FollowUpStatus | 'All')[] = [
  'All',
  'Pending Call',
  'Attempted',
  'Needs Manager',
  'Won',
  'Lost',
];

const followUpStatuses: FollowUpStatus[] = [
  'Pending Call',
  'Attempted',
  'Needs Manager',
  'Won',
  'Lost',
];

const createLogForm = (target?: SalesFollowUpRecord): LogForm => {
  const defaultDue = new Date();
  defaultDue.setDate(defaultDue.getDate() + 1);
  return {
    followUpStatus: target?.followUpStatus ?? 'Pending Call',
    nextAction: target?.nextAction ?? '',
    nextActionDue: target?.nextActionDue ?? defaultDue.toISOString().slice(0, 10),
    notes: target?.notes ?? '',
  };
};

function SalesFollowUp() {
  const { addToast } = useToast();
  const {
    salesFollowUps,
    setSalesFollowUps,
    setEnrolments,
    setFreeTrialLeads,
    setTrialBookings,
  } = useDemoData();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<(typeof statusFilters)[number]>('All');
  const [ownerFilter, setOwnerFilter] = useState('All');
  const [showOverdueOnly, setShowOverdueOnly] = useState(false);
  const [selected, setSelected] = useState<SalesFollowUpRecord | null>(null);
  const [logTarget, setLogTarget] = useState<SalesFollowUpRecord | null>(null);
  const [logForm, setLogForm] = useState<LogForm>(createLogForm());

  const ownerOptions = useMemo(() => {
    const owners = Array.from(new Set(salesFollowUps.map((item) => item.owner)));
    return ['All', ...owners];
  }, [salesFollowUps]);

  const filtered = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return salesFollowUps.filter((item) => {
      const matchesStatus = statusFilter === 'All' ? true : item.followUpStatus === statusFilter;
      const matchesOwner = ownerFilter === 'All' ? true : item.owner === ownerFilter;
      const haystack = `${item.student}${item.contact}${item.nextAction}${item.notes}`
        .toLowerCase()
        .trim();
      const matchesSearch = haystack.includes(search.toLowerCase().trim());
      const isOverdue = item.nextActionDue < today;
      const matchesOverdue = showOverdueOnly ? isOverdue : true;
      return matchesStatus && matchesOwner && matchesSearch && matchesOverdue;
    });
  }, [salesFollowUps, statusFilter, ownerFilter, search, showOverdueOnly]);

  const handleLogCall = () => {
    if (!logTarget) return;
    if (!logForm.nextActionDue) {
      addToast({ type: 'error', message: 'Next action due date is required.' });
      return;
    }
    if (!logForm.nextAction) {
      addToast({ type: 'error', message: 'Please describe the next action.' });
      return;
    }

    const timestamp = new Date().toISOString();

    setSalesFollowUps((prev) =>
      prev.map((item) =>
        item.id === logTarget.id
          ? {
              ...item,
              followUpStatus: logForm.followUpStatus,
              nextAction: logForm.nextAction,
              nextActionDue: logForm.nextActionDue,
              notes: logForm.notes,
              lastContactedAt: timestamp,
            }
          : item
      )
    );

    addToast({ type: 'success', message: 'Follow-up updated.' });
    setLogTarget(null);
  };

  const handleConvertToEnrolment = (record: SalesFollowUpRecord) => {
    setEnrolments((prev) => [
      {
        id: `en-${Date.now()}`,
        student: record.student,
        program: record.preferredClass,
        enrolmentDate: new Date().toISOString().slice(0, 10),
        status: 'Pending Payment',
        nextPayment: 'To be scheduled',
        notes: `Converted from follow-up ${record.id}. Contact: ${record.contact}`,
      },
      ...prev,
    ]);

    setSalesFollowUps((prev) => prev.filter((item) => item.id !== record.id));

    if (record.leadId) {
      setFreeTrialLeads((prev) =>
        prev.map((lead) =>
          lead.id === record.leadId ? { ...lead, status: 'Converted' } : lead
        )
      );
    }

    if (record.bookingId) {
      setTrialBookings((prev) =>
        prev.map((booking) =>
          booking.id === record.bookingId ? { ...booking, status: 'Converted' } : booking
        )
      );
    }

    addToast({
      type: 'success',
      message: `${record.student} converted to enrolment.`,
    });
  };

  const handleMarkLost = (record: SalesFollowUpRecord) => {
    setSalesFollowUps((prev) =>
      prev.map((item) =>
        item.id === record.id
          ? {
              ...item,
              followUpStatus: 'Lost',
              notes: record.notes,
            }
          : item
      )
    );
    if (record.leadId) {
      setFreeTrialLeads((prev) =>
        prev.map((lead) =>
          lead.id === record.leadId ? { ...lead, status: 'Lost' } : lead
        )
      );
    }
    addToast({ type: 'success', message: `${record.student} marked as lost.` });
  };

  const openLogModal = (record: SalesFollowUpRecord) => {
    setLogTarget(record);
    setLogForm(createLogForm(record));
  };

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Sales Follow-up</h2>
        <p className="mt-2 text-sm text-slate-500">
          Track post-trial conversations before a family commits to enrol. All data is mock only.
        </p>
      </section>

      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 flex-wrap items-center gap-2">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search student, contact or action"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 md:max-w-xs"
          />
          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value as (typeof statusFilters)[number])
            }
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
          >
            {statusFilters.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <select
            value={ownerFilter}
            onChange={(event) => setOwnerFilter(event.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
          >
            {ownerOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <label className="inline-flex items-center gap-2 text-xs text-slate-600">
            <input
              type="checkbox"
              checked={showOverdueOnly}
              onChange={(event) => setShowOverdueOnly(event.target.checked)}
              className="rounded border-slate-300 text-slate-900 focus:ring-slate-900/20"
            />
            Overdue only
          </label>
        </div>
        <button
          type="button"
          className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-100"
        >
          Export call log (mock)
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
          No follow-up tasks match the current filters.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((record) => {
            const isOverdue = record.nextActionDue < new Date().toISOString().slice(0, 10);
            return (
              <article
                key={record.id}
                className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-base font-semibold text-slate-900">
                        {record.student}
                      </h3>
                      <p className="text-xs text-slate-500">{record.contact}</p>
                    </div>
                    <StatusBadge status={record.followUpStatus} />
                  </div>
                  <dl className="space-y-2 text-sm text-slate-600">
                    <div className="flex items-center justify-between">
                      <dt>Owner</dt>
                      <dd className="font-medium text-slate-900">{record.owner}</dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt>Preferred Class</dt>
                      <dd className="font-medium text-slate-900">{record.preferredClass}</dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt>Trial Outcome</dt>
                      <dd className="font-medium text-slate-900">{record.trialOutcome}</dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt>Next Action</dt>
                      <dd className="text-right text-xs text-slate-500">{record.nextAction}</dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt>Due</dt>
                      <dd
                        className={`font-medium ${
                          isOverdue ? 'text-rose-600' : 'text-slate-900'
                        }`}
                      >
                        {record.nextActionDue}
                      </dd>
                    </div>
                  </dl>
                  {record.lastContactedAt ? (
                    <p className="rounded-md bg-slate-50 px-3 py-2 text-xs text-slate-500">
                      Last contacted:{' '}
                      {new Date(record.lastContactedAt).toLocaleString('en-AU', {
                        hour: '2-digit',
                        minute: '2-digit',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                  ) : (
                    <p className="rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-700">
                      No call logged yet.
                    </p>
                  )}
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setSelected(record)}
                    className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-600 hover:bg-slate-100"
                  >
                    View
                  </button>
                  <button
                    type="button"
                    onClick={() => openLogModal(record)}
                    className="flex-1 rounded-lg border border-indigo-200 px-3 py-2 text-xs text-indigo-700 hover:bg-indigo-50"
                  >
                    Log Call
                  </button>
                  <button
                    type="button"
                    onClick={() => handleConvertToEnrolment(record)}
                    className="flex-1 rounded-lg border border-emerald-200 px-3 py-2 text-xs text-emerald-700 hover:bg-emerald-50"
                  >
                    Convert
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMarkLost(record)}
                    className="flex-1 rounded-lg border border-rose-200 px-3 py-2 text-xs text-rose-700 hover:bg-rose-50"
                  >
                    Mark Lost
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <EntityDrawer
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        title={selected?.student ?? ''}
        fields={
          selected
            ? [
                { label: 'Contact', value: selected.contact },
                { label: 'Owner', value: selected.owner },
                { label: 'Preferred Class', value: selected.preferredClass },
                { label: 'Trial Outcome', value: selected.trialOutcome },
                { label: 'Status', value: <StatusBadge status={selected.followUpStatus} /> },
                { label: 'Next Action', value: selected.nextAction },
                { label: 'Due', value: selected.nextActionDue },
              ]
            : []
        }
        note={selected?.notes}
      />

      <AssignmentModal
        open={Boolean(logTarget)}
        title="Log call outcome"
        description={
          logTarget ? `${logTarget.student} · ${logTarget.preferredClass}` : undefined
        }
        confirmLabel="Save log"
        onClose={() => setLogTarget(null)}
        onConfirm={handleLogCall}
        fields={[
          {
            id: 'followUpStatus',
            label: 'Result',
            type: 'select',
            value: logForm.followUpStatus,
            options: followUpStatuses.map((status) => ({ value: status, label: status })),
            onChange: (value) =>
              setLogForm((prev) => ({
                ...prev,
                followUpStatus: value as FollowUpStatus,
              })),
          },
          {
            id: 'nextAction',
            label: 'Next action',
            type: 'textarea',
            value: logForm.nextAction,
            placeholder: 'Example: send pricing email, schedule second trial...',
            onChange: (value) =>
              setLogForm((prev) => ({
                ...prev,
                nextAction: value,
              })),
          },
          {
            id: 'nextActionDue',
            label: 'Due date',
            type: 'date',
            value: logForm.nextActionDue,
            onChange: (value) =>
              setLogForm((prev) => ({
                ...prev,
                nextActionDue: value,
              })),
          },
          {
            id: 'notes',
            label: 'Notes',
            type: 'textarea',
            value: logForm.notes,
            placeholder: 'Call summary or commitments.',
            onChange: (value) =>
              setLogForm((prev) => ({
                ...prev,
                notes: value,
              })),
          },
        ]}
      />
    </div>
  );
}

export default SalesFollowUp;


