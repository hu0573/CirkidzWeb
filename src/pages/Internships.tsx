import { useMemo, useState } from 'react';
import AssignmentModal from '../components/AssignmentModal';
import EntityDrawer from '../components/EntityDrawer';
import StatusBadge from '../components/StatusBadge';
import { useDemoData } from '../hooks/useDemoData';
import useToast from '../hooks/useToast';
import type { InternshipPlacement } from '../data/internships';

type HoursForm = {
  hours: string;
  notes: string;
};

type MentorForm = {
  mentor: string;
  notes: string;
};

function Internships() {
  const { addToast } = useToast();
  const { internshipPlacements, setInternshipPlacements } = useDemoData();
  const [program, setProgram] = useState('All');
  const [mentor, setMentor] = useState('All');
  const [location, setLocation] = useState('All');
  const [status, setStatus] = useState('All');
  const [drawerTarget, setDrawerTarget] = useState<InternshipPlacement | null>(null);
  const [hoursTarget, setHoursTarget] = useState<InternshipPlacement | null>(null);
  const [mentorTarget, setMentorTarget] = useState<InternshipPlacement | null>(null);
  const [hoursForm, setHoursForm] = useState<HoursForm>({ hours: '2', notes: '' });
  const [mentorForm, setMentorForm] = useState<MentorForm>({ mentor: '', notes: '' });

  const programOptions = useMemo(() => {
    const programs = Array.from(new Set(internshipPlacements.map((item) => item.program)));
    return ['All', ...programs];
  }, [internshipPlacements]);

  const mentorOptions = useMemo(() => {
    const mentors = Array.from(new Set(internshipPlacements.map((item) => item.mentor)));
    return ['All', ...mentors];
  }, [internshipPlacements]);

  const locationOptions = useMemo(() => {
    const locations = Array.from(new Set(internshipPlacements.map((item) => item.location)));
    return ['All', ...locations];
  }, [internshipPlacements]);

  const statusOptions = useMemo(() => {
    const statuses = Array.from(new Set(internshipPlacements.map((item) => item.status)));
    return ['All', ...statuses];
  }, [internshipPlacements]);

  const filtered = useMemo(() => {
    return internshipPlacements.filter((placement) => {
      const byProgram = program === 'All' || placement.program === program;
      const byMentor = mentor === 'All' || placement.mentor === mentor;
      const byLocation = location === 'All' || placement.location === location;
      const byStatus = status === 'All' || placement.status === status;
      return byProgram && byMentor && byLocation && byStatus;
    });
  }, [internshipPlacements, program, mentor, location, status]);

  const upcomingCheckIns = useMemo(() => {
    return [...internshipPlacements]
      .sort((a, b) => (a.nextCheckIn > b.nextCheckIn ? 1 : -1))
      .slice(0, 4);
  }, [internshipPlacements]);

  const openHoursModal = (placement: InternshipPlacement) => {
    setHoursTarget(placement);
    setHoursForm({ hours: '2', notes: '' });
  };

  const openMentorModal = (placement: InternshipPlacement) => {
    setMentorTarget(placement);
    setMentorForm({ mentor: placement.mentor, notes: '' });
  };

  const updatePlacement = (
    id: string,
    updater: (placement: InternshipPlacement) => InternshipPlacement
  ) => {
    setInternshipPlacements((prev) =>
      prev.map((placement) => (placement.id === id ? updater(placement) : placement))
    );
  };

  const handleLogHours = () => {
    if (!hoursTarget) return;
    const value = Number.parseFloat(hoursForm.hours);
    if (Number.isNaN(value) || value <= 0) {
      addToast({ type: 'error', message: 'Please enter a valid number of hours.' });
      return;
    }

    updatePlacement(hoursTarget.id, (prev) => {
      const nextHours = prev.hoursCompleted + value;
      const mergedNotes = hoursForm.notes
        ? [prev.notes, `• ${hoursForm.notes}`].filter(Boolean).join('\n')
        : prev.notes;
      return {
        ...prev,
        hoursCompleted: nextHours,
        status: nextHours >= prev.targetHours ? 'Completed' : prev.status,
        notes: mergedNotes,
      };
    });

    addToast({
      type: 'success',
      message: `${hoursTarget.intern} logged ${value} hours.`,
    });
    setHoursTarget(null);
  };

  const handleAssignMentor = () => {
    if (!mentorTarget) return;
    if (!mentorForm.mentor) {
      addToast({ type: 'error', message: 'Please choose a mentor.' });
      return;
    }

    updatePlacement(mentorTarget.id, (prev) => {
      const mergedNotes = mentorForm.notes
        ? [prev.notes, `• Mentor update: ${mentorForm.notes}`].filter(Boolean).join('\n')
        : prev.notes;
      return {
        ...prev,
        mentor: mentorForm.mentor,
        notes: mergedNotes,
      };
    });

    addToast({
      type: 'success',
      message: `${mentorTarget.intern}'s mentor has been updated.`,
    });
    setMentorTarget(null);
  };

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Internships</h2>
        <p className="mt-2 text-sm text-slate-500">
          Track staff and volunteer internship progress, including mentor assignments and hour logs. All data uses static mock entries.
        </p>
      </section>

      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 flex-wrap items-center gap-2">
          <select
            value={program}
            onChange={(event) => setProgram(event.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
          >
            {programOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <select
            value={mentor}
            onChange={(event) => setMentor(event.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
          >
            {mentorOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <select
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
          >
            {locationOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
          >
            {statusOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <button
          type="button"
          className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-100"
        >
          Export (mock)
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Intern</th>
                <th className="px-4 py-3 text-left font-medium">Program</th>
                <th className="px-4 py-3 text-left font-medium">Mentor</th>
                <th className="px-4 py-3 text-left font-medium">Hours</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-left font-medium">Next Check-in</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.map((placement) => (
                <tr key={placement.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => setDrawerTarget(placement)}
                      className="text-sm font-medium text-slate-900 hover:text-slate-600"
                    >
                      {placement.intern}
                    </button>
                    <div className="text-xs text-slate-500">{placement.location}</div>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500">{placement.program}</td>
                  <td className="px-4 py-3 text-xs text-slate-500">{placement.mentor}</td>
                  <td className="px-4 py-3 text-xs text-slate-500">
                    {placement.hoursCompleted} / {placement.targetHours}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={placement.status} />
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500">
                    {placement.nextCheckIn}
                  </td>
                  <td className="px-4 py-3 text-right text-xs">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setDrawerTarget(placement)}
                        className="rounded-md border border-slate-200 px-2 py-1 text-slate-600 hover:bg-slate-100"
                      >
                        View
                      </button>
                      <button
                        type="button"
                        onClick={() => openHoursModal(placement)}
                        className="rounded-md border border-emerald-200 px-2 py-1 text-emerald-700 hover:bg-emerald-50"
                      >
                        Log Hours
                      </button>
                      <button
                        type="button"
                        onClick={() => openMentorModal(placement)}
                        className="rounded-md border border-indigo-200 px-2 py-1 text-indigo-700 hover:bg-indigo-50"
                      >
                        Assign Mentor
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-6 text-center text-sm text-slate-500"
                  >
                    No internships match the current filters.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        <aside className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-slate-900">Upcoming Check-ins</h3>
            <span className="text-xs text-slate-400">Next 4 check-ins</span>
          </div>
          <ul className="mt-4 space-y-3">
            {upcomingCheckIns.map((placement) => (
              <li
                key={placement.id}
                className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-sm text-slate-600"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-900">{placement.intern}</span>
                  <span className="text-xs text-slate-500">{placement.nextCheckIn}</span>
                </div>
                <div className="mt-1 text-xs text-slate-500">
                  Mentor: {placement.mentor} · {placement.program}
                </div>
              </li>
            ))}
          </ul>
        </aside>
      </div>

      <EntityDrawer
        open={Boolean(drawerTarget)}
        onClose={() => setDrawerTarget(null)}
        title={drawerTarget?.intern ?? ''}
        fields={
          drawerTarget
            ? [
                { label: 'Program', value: drawerTarget.program },
                { label: 'Mentor', value: drawerTarget.mentor },
                { label: 'Placement Dates', value: drawerTarget.placementDates },
                { label: 'Location', value: drawerTarget.location },
                {
                  label: 'Hours Completed',
                  value: `${drawerTarget.hoursCompleted} / ${drawerTarget.targetHours}`,
                },
                { label: 'Status', value: <StatusBadge status={drawerTarget.status} /> },
                { label: 'Next Check-in', value: drawerTarget.nextCheckIn },
                { label: 'Goals', value: drawerTarget.goals },
              ]
            : []
        }
        note={drawerTarget?.notes}
      />

      <AssignmentModal
        open={Boolean(hoursTarget)}
        title="Log Internship Hours"
        description={
          hoursTarget
            ? `${hoursTarget.intern} · Current ${hoursTarget.hoursCompleted}/${hoursTarget.targetHours} hours`
            : undefined
        }
        confirmLabel="Save hours"
        onClose={() => setHoursTarget(null)}
        onConfirm={handleLogHours}
        fields={[
          {
            id: 'hours',
            label: 'Additional hours',
            type: 'number',
            value: hoursForm.hours,
            onChange: (value) =>
              setHoursForm((prev) => ({
                ...prev,
                hours: value,
              })),
          },
          {
            id: 'hoursNotes',
            label: 'Notes',
            type: 'textarea',
            value: hoursForm.notes,
            placeholder: 'e.g. Assisted with weekend performance prep',
            onChange: (value) =>
              setHoursForm((prev) => ({
                ...prev,
                notes: value,
              })),
          },
        ]}
      />

      <AssignmentModal
        open={Boolean(mentorTarget)}
        title="Update Mentor Assignment"
        description={
          mentorTarget ? `${mentorTarget.intern} · Current mentor ${mentorTarget.mentor}` : undefined
        }
        confirmLabel="Save mentor"
        onClose={() => setMentorTarget(null)}
        onConfirm={handleAssignMentor}
        fields={[
          {
            id: 'mentor',
            label: 'Select mentor',
            type: 'select',
            value: mentorForm.mentor,
            options: mentorOptions
              .filter((option) => option !== 'All')
              .map((option) => ({ value: option, label: option })),
            onChange: (value) =>
              setMentorForm((prev) => ({
                ...prev,
                mentor: value,
              })),
          },
          {
            id: 'mentorNotes',
            label: 'Notes',
            type: 'textarea',
            value: mentorForm.notes,
            placeholder: 'Use to capture reasons or next steps',
            onChange: (value) =>
              setMentorForm((prev) => ({
                ...prev,
                notes: value,
              })),
          },
        ]}
      />
    </div>
  );
}

export default Internships;


