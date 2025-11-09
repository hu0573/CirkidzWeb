import { useMemo, useState } from 'react';
import EntityDrawer from '../components/EntityDrawer';
import StatusBadge from '../components/StatusBadge';
import { type Enrolment } from '../data/enrolments';
import { useDemoData } from '../hooks/useDemoData';
import useToast from '../hooks/useToast';

const statusFilters: (Enrolment['status'] | 'All')[] = [
  'All',
  'Active',
  'Pending Payment',
  'Paused',
  'Cancelled',
];

type EnrolmentForm = Omit<Enrolment, 'id'>;

const initialForm: EnrolmentForm = {
  student: '',
  program: '',
  enrolmentDate: new Date().toISOString().slice(0, 10),
  status: 'Pending Payment',
  nextPayment: '',
  notes: '',
};

function Enrolments() {
  const { addToast } = useToast();
  const { enrolments, setEnrolments } = useDemoData();
  const [statusFilter, setStatusFilter] = useState<(typeof statusFilters)[number]>('All');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Enrolment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState(initialForm);

  const filtered = useMemo(() => {
    return enrolments.filter((record) => {
      const matchesStatus = statusFilter === 'All' ? true : record.status === statusFilter;
      const haystack = `${record.student}${record.program}`.toLowerCase();
      return matchesStatus && haystack.includes(search.toLowerCase());
    });
  }, [enrolments, search, statusFilter]);

  const handleAdd = () => {
    if (!form.student || !form.program) {
      addToast({ type: 'error', message: 'Student and program are required.' });
      return;
    }
    const newRecord: Enrolment = {
      ...form,
      id: `en-${Date.now()}`,
    };
    setEnrolments((prev) => [newRecord, ...prev]);
    setForm(initialForm);
    setIsModalOpen(false);
    addToast({ type: 'success', message: 'Enrolment added.' });
  };

  const handleStatusToggle = (record: Enrolment) => {
    setEnrolments((prev) =>
      prev.map((item) => {
        if (item.id !== record.id) return item;
        if (record.status === 'Pending Payment') {
          return { ...item, status: 'Active' };
        }
        if (record.status === 'Active') {
          return { ...item, status: 'Paused' };
        }
        if (record.status === 'Paused') {
          return { ...item, status: 'Active' };
        }
        return { ...item, status: 'Cancelled' };
      })
    );
    addToast({
      type: 'success',
      message: `${record.student} status updated.`,
    });
  };

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Enrolments</h2>
        <p className="mt-2 text-sm text-slate-500">
          Overview of current paid students. Adjustments only change local mock state.
        </p>
      </section>

      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 flex-col gap-2 md:flex-row md:items-center">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search enrolments"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 md:max-w-sm"
          />
          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value as (typeof statusFilters)[number])
            }
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900/10 md:w-48"
          >
            {statusFilters.map((status) => (
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
          Add Enrolment
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Student</th>
              <th className="px-4 py-3 text-left font-medium">Program</th>
              <th className="px-4 py-3 text-left font-medium">Enrolment Date</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
              <th className="px-4 py-3 text-left font-medium">Next Payment</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {filtered.map((record) => (
              <tr key={record.id} className="hover:bg-slate-50">
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => setSelected(record)}
                    className="text-sm font-medium text-slate-900 hover:text-slate-600"
                  >
                    {record.student}
                  </button>
                </td>
                <td className="px-4 py-3 text-xs text-slate-500">{record.program}</td>
                <td className="px-4 py-3 text-xs text-slate-500">{record.enrolmentDate}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={record.status} />
                </td>
                <td className="px-4 py-3 text-xs text-slate-500">
                  {record.nextPayment || '—'}
                </td>
                <td className="px-4 py-3 text-right text-xs">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setSelected(record)}
                      className="rounded-md border border-slate-200 px-2 py-1 text-slate-600 hover:bg-slate-100"
                    >
                      View
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStatusToggle(record)}
                      className="rounded-md border border-indigo-200 px-2 py-1 text-indigo-700 hover:bg-indigo-50"
                    >
                      Update Status
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 ? (
          <div className="px-4 py-6 text-center text-sm text-slate-500">
            No enrolments match your filters.
          </div>
        ) : null}
      </div>

      <EntityDrawer
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        title={selected?.student ?? ''}
        fields={
          selected
            ? [
                { label: 'Program', value: selected.program },
                { label: 'Status', value: <StatusBadge status={selected.status} /> },
                { label: 'Enrolment Date', value: selected.enrolmentDate },
                { label: 'Next Payment', value: selected.nextPayment || '—' },
              ]
            : []
        }
        note={selected?.notes}
      />

      {isModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">
                Add Enrolment
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
                placeholder="Student"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10"
              />
              <input
                value={form.program}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, program: event.target.value }))
                }
                placeholder="Program"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10"
              />
              <input
                value={form.enrolmentDate}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    enrolmentDate: event.target.value,
                  }))
                }
                type="date"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10"
              />
              <select
                value={form.status}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    status: event.target.value as Enrolment['status'],
                  }))
                }
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10"
              >
                {statusFilters
                  .filter((status): status is Enrolment['status'] => status !== 'All')
                  .map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
              </select>
              <input
                value={form.nextPayment}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, nextPayment: event.target.value }))
                }
                placeholder="Next payment"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10"
              />
              <textarea
                value={form.notes}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, notes: event.target.value }))
                }
                placeholder="Notes"
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
                onClick={handleAdd}
                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-slate-800"
              >
                Save enrolment
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default Enrolments;

