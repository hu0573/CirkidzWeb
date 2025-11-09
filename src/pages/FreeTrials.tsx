import { useMemo, useState } from 'react';
import EntityDrawer from '../components/EntityDrawer';
import StatusBadge from '../components/StatusBadge';
import { type FreeTrialLead } from '../data/freeTrials';
import AssignmentModal from '../components/AssignmentModal';
import { useDemoData } from '../hooks/useDemoData';
import useToast from '../hooks/useToast';
import type { TrialBooking } from '../data/trialScheduling';

const statusOptions: FreeTrialLead['status'][] = [
  'New',
  'Contacted',
  'Trial Scheduled',
  'Converted',
  'Lost',
];

type LeadForm = Omit<FreeTrialLead, 'id' | 'notes'> & { notes?: string };

const coachOptions = [
  'Jordan Hale',
  'Priya Singh',
  'Amelia Woods',
  'Sam Collins',
  'Oliver Grant',
] as const;

const locationOptions = [
  'Cirkidz HQ · Main Hall',
  'Cirkidz HQ · Practice Room',
  'Aerial Studio',
  'Conditioning Studio',
] as const;

const getInitialForm = (): LeadForm => ({
  student: '',
  contact: '',
  preferredClass: '',
  status: 'New',
  owner: '',
  createdAt: new Date().toISOString().slice(0, 10),
});

type ScheduleForm = {
  scheduledAt: string;
  coach: string;
  location: string;
  notes: string;
};

const getInitialScheduleForm = (lead?: FreeTrialLead): ScheduleForm => ({
  scheduledAt: '',
  coach: lead?.owner ?? coachOptions[0],
  location: locationOptions[0],
  notes: lead?.notes ?? '',
});

function FreeTrials() {
  const { addToast } = useToast();
  const { freeTrialLeads, setFreeTrialLeads, setTrialBookings } = useDemoData();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedLead, setSelectedLead] = useState<FreeTrialLead | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState<LeadForm>(getInitialForm());
  const [scheduleTarget, setScheduleTarget] = useState<FreeTrialLead | null>(null);
  const [scheduleForm, setScheduleForm] = useState<ScheduleForm>(getInitialScheduleForm());

  const filteredLeads = useMemo(() => {
    return freeTrialLeads.filter((lead) => {
      const matchesStatus =
        statusFilter === 'All' ? true : lead.status === statusFilter;
      const haystack = `${lead.student}${lead.contact}${lead.preferredClass}${lead.owner}`.toLowerCase();
      const matchesSearch = haystack.includes(search.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [freeTrialLeads, search, statusFilter]);

  const resetSchedule = () => {
    setScheduleTarget(null);
    setScheduleForm(getInitialScheduleForm());
  };

  const handleScheduleSubmit = () => {
    if (!scheduleTarget) return;
    if (!scheduleForm.scheduledAt) {
      addToast({ type: 'error', message: 'Please select a trial time.' });
      return;
    }

    const scheduledDate = new Date(scheduleForm.scheduledAt);
    if (Number.isNaN(scheduledDate.getTime())) {
      addToast({ type: 'error', message: 'Please enter a valid time.' });
      return;
    }

    const weekOf = (() => {
      const monday = new Date(scheduledDate);
      const day = monday.getDay(); // 0 Sunday ... 6 Saturday
      const diff = monday.getDate() - day + (day === 0 ? -6 : 1);
      monday.setDate(diff);
      monday.setHours(0, 0, 0, 0);
      return monday.toISOString().slice(0, 10);
    })();

    const booking: TrialBooking = {
      id: `tb-${Date.now()}`,
      leadId: scheduleTarget.id,
      student: scheduleTarget.student,
      contact: scheduleTarget.contact,
      preferredClass: scheduleTarget.preferredClass,
      owner: scheduleTarget.owner,
      coach: scheduleForm.coach,
      location: scheduleForm.location,
      scheduledAt: scheduleForm.scheduledAt,
      weekOf,
      status: 'Scheduled',
      notes: scheduleForm.notes || 'Booked via Free Trials intake.',
    };

    setTrialBookings((prev) => [booking, ...prev]);
    setFreeTrialLeads((prev) =>
      prev.map((lead) =>
        lead.id === scheduleTarget.id ? { ...lead, status: 'Trial Scheduled' } : lead
      )
    );

    addToast({
      type: 'success',
      message: `${scheduleTarget.student} trial booked.`,
    });
    resetSchedule();
  };

  const handleSubmit = () => {
    if (!form.student || !form.contact || !form.preferredClass) {
      addToast({ type: 'error', message: 'Please fill the required fields.' });
      return;
    }
    const newLead: FreeTrialLead = {
      id: `ft-${Date.now()}`,
      notes: form.notes ?? 'New lead added via quick intake.',
      ...form,
    };
    setFreeTrialLeads((prev) => [newLead, ...prev]);
    setIsModalOpen(false);
    setForm(getInitialForm());
    addToast({ type: 'success', message: 'Lead created.' });
  };

  const handleConvert = (lead: FreeTrialLead) => {
    setFreeTrialLeads((prev) =>
      prev.map((item) =>
        item.id === lead.id ? { ...item, status: 'Converted' } : item
      )
    );
    addToast({ type: 'success', message: `${lead.student} marked as converted.` });
  };

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Free Trials</h2>
        <p className="mt-2 text-sm text-slate-500">
          Manage incoming trial requests and track conversion steps. Data shown
          here uses static mock entries for demo purposes.
        </p>
      </section>

      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 flex-col gap-2 md:flex-row md:items-center">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by student, contact or owner"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 md:max-w-sm"
          />
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900/10 md:w-40"
          >
            <option value="All">All statuses</option>
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-slate-800"
        >
          Add Lead
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Student</th>
              <th className="px-4 py-3 text-left font-medium">Contact</th>
              <th className="px-4 py-3 text-left font-medium">Preferred Class</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
              <th className="px-4 py-3 text-left font-medium">Owner</th>
              <th className="px-4 py-3 text-left font-medium">Created</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {filteredLeads.map((lead) => (
              <tr key={lead.id} className="hover:bg-slate-50">
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => setSelectedLead(lead)}
                    className="text-sm font-medium text-slate-900 hover:text-slate-600"
                  >
                    {lead.student}
                  </button>
                </td>
                <td className="px-4 py-3 text-xs text-slate-500">
                  {lead.contact}
                </td>
                <td className="px-4 py-3 text-xs text-slate-500">
                  {lead.preferredClass}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={lead.status} />
                </td>
                <td className="px-4 py-3 text-xs text-slate-500">
                  {lead.owner}
                </td>
                <td className="px-4 py-3 text-xs text-slate-500">
                  {lead.createdAt}
                </td>
                <td className="px-4 py-3 text-right text-xs">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedLead(lead)}
                      className="rounded-md border border-slate-200 px-2 py-1 text-slate-600 hover:bg-slate-100"
                    >
                      View
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setScheduleTarget(lead);
                        setScheduleForm(getInitialScheduleForm(lead));
                      }}
                      className="rounded-md border border-indigo-200 px-2 py-1 text-indigo-700 hover:bg-indigo-50"
                    >
                      Schedule Trial
                    </button>
                    <button
                      type="button"
                      onClick={() => handleConvert(lead)}
                      className="rounded-md border border-emerald-200 px-2 py-1 text-emerald-700 hover:bg-emerald-50"
                    >
                      Convert
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredLeads.length === 0 ? (
          <div className="px-4 py-6 text-center text-sm text-slate-500">
            No leads match your filters.
          </div>
        ) : null}
      </div>

      <EntityDrawer
        open={Boolean(selectedLead)}
        onClose={() => setSelectedLead(null)}
        title={selectedLead?.student ?? ''}
        fields={
          selectedLead
            ? [
                { label: 'Contact', value: selectedLead.contact },
                { label: 'Preferred Class', value: selectedLead.preferredClass },
                { label: 'Status', value: <StatusBadge status={selectedLead.status} /> },
                { label: 'Owner', value: selectedLead.owner },
                { label: 'Created', value: selectedLead.createdAt },
              ]
            : []
        }
        note={selectedLead?.notes}
      />

      {isModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">
                Add Free Trial Lead
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-sm text-slate-500 hover:text-slate-700"
              >
                Close
              </button>
            </div>
            <div className="mt-4 space-y-3">
              <input
                value={form.student}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, student: event.target.value }))
                }
                placeholder="Student name"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10"
              />
              <input
                value={form.contact}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, contact: event.target.value }))
                }
                placeholder="Contact info"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10"
              />
              <input
                value={form.preferredClass}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    preferredClass: event.target.value,
                  }))
                }
                placeholder="Preferred class"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10"
              />
              <input
                value={form.owner}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, owner: event.target.value }))
                }
                placeholder="Owner / Staff"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10"
              />
              <select
                value={form.status}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    status: event.target.value as FreeTrialLead['status'],
                  }))
                }
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              <textarea
                value={form.notes ?? ''}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, notes: event.target.value }))
                }
                placeholder="Notes (optional)"
                rows={3}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10"
              />
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-slate-800"
              >
                Save lead
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <AssignmentModal
        open={Boolean(scheduleTarget)}
        title="Schedule Trial"
        description={
          scheduleTarget
            ? `${scheduleTarget.student} · ${scheduleTarget.preferredClass}`
            : undefined
        }
        confirmLabel="Save booking"
        onClose={resetSchedule}
        onConfirm={handleScheduleSubmit}
        fields={[
          {
            id: 'scheduledAt',
            label: 'Scheduled time',
            type: 'datetime-local',
            value: scheduleForm.scheduledAt,
            onChange: (value) =>
              setScheduleForm((prev) => ({
                ...prev,
                scheduledAt: value,
              })),
          },
          {
            id: 'coach',
            label: 'Coach',
            type: 'select',
            value: scheduleForm.coach,
            options: coachOptions.map((coach) => ({ value: coach, label: coach })),
            onChange: (value) =>
              setScheduleForm((prev) => ({
                ...prev,
                coach: value,
              })),
          },
          {
            id: 'location',
            label: 'Location',
            type: 'select',
            value: scheduleForm.location,
            options: locationOptions.map((location) => ({
              value: location,
              label: location,
            })),
            onChange: (value) =>
              setScheduleForm((prev) => ({
                ...prev,
                location: value,
              })),
          },
          {
            id: 'notes',
            label: 'Notes',
            type: 'textarea',
            value: scheduleForm.notes,
            placeholder: 'Optional: special requests or preparation notes',
            onChange: (value) =>
              setScheduleForm((prev) => ({
                ...prev,
                notes: value,
              })),
          },
        ]}
      />
    </div>
  );
}

export default FreeTrials;

