import { useMemo, useState } from 'react';
import AssignmentModal from '../components/AssignmentModal';
import EntityDrawer from '../components/EntityDrawer';
import StatusBadge from '../components/StatusBadge';
import { useDemoData } from '../hooks/useDemoData';
import useToast from '../hooks/useToast';
import type { TrialBooking } from '../data/trialScheduling';

type RescheduleForm = {
  scheduledAt: string;
  coach: string;
  location: string;
  notes: string;
};

function TrialScheduling() {
  const { addToast } = useToast();
  const { trialBookings, setTrialBookings } = useDemoData();
  const [week, setWeek] = useState('All');
  const [coach, setCoach] = useState('All');
  const [location, setLocation] = useState('All');
  const [owner, setOwner] = useState('All');
  const [detailTarget, setDetailTarget] = useState<TrialBooking | null>(null);
  const [rescheduleTarget, setRescheduleTarget] = useState<TrialBooking | null>(null);
  const [rescheduleForm, setRescheduleForm] = useState<RescheduleForm>({
    scheduledAt: '',
    coach: '',
    location: '',
    notes: '',
  });

  const weekOptions = useMemo(() => {
    const weeks = Array.from(new Set(trialBookings.map((booking) => booking.weekOf)));
    return ['All', ...weeks.sort().reverse()];
  }, [trialBookings]);

  const coachOptions = useMemo(() => {
    const names = Array.from(new Set(trialBookings.map((booking) => booking.coach)));
    return ['All', ...names];
  }, [trialBookings]);

  const locationOptions = useMemo(() => {
    const locations = Array.from(new Set(trialBookings.map((booking) => booking.location)));
    return ['All', ...locations];
  }, [trialBookings]);

  const ownerOptions = useMemo(() => {
    const owners = Array.from(new Set(trialBookings.map((booking) => booking.owner)));
    return ['All', ...owners];
  }, [trialBookings]);

  const filtered = useMemo(() => {
    return trialBookings.filter((booking) => {
      const byWeek = week === 'All' || booking.weekOf === week;
      const byCoach = coach === 'All' || booking.coach === coach;
      const byLocation = location === 'All' || booking.location === location;
      const byOwner = owner === 'All' || booking.owner === owner;
      return byWeek && byCoach && byLocation && byOwner;
    });
  }, [trialBookings, week, coach, location, owner]);

  const groupedByDay = useMemo(() => {
    return filtered.reduce<Record<string, TrialBooking[]>>((acc, booking) => {
      const day = booking.scheduledAt.slice(0, 10);
      if (!acc[day]) {
        acc[day] = [];
      }
      acc[day].push(booking);
      return acc;
    }, {});
  }, [filtered]);

  const sortedDays = useMemo(() => Object.keys(groupedByDay).sort(), [groupedByDay]);

  const openReschedule = (booking: TrialBooking) => {
    setRescheduleTarget(booking);
    setRescheduleForm({
      scheduledAt: booking.scheduledAt,
      coach: booking.coach,
      location: booking.location,
      notes: booking.notes,
    });
  };

  const updateBooking = (
    bookingId: string,
    updater: (booking: TrialBooking) => TrialBooking
  ) => {
    setTrialBookings((prev) =>
      prev.map((booking) => (booking.id === bookingId ? updater(booking) : booking))
    );
  };

  const handleStatusChange = (booking: TrialBooking, status: TrialBooking['status']) => {
    updateBooking(booking.id, (prev) => ({
      ...prev,
      status,
    }));

    addToast({
      type: 'success',
      message: `${booking.student} status updated to ${status}.`,
    });
  };

  const handleReschedule = () => {
    if (!rescheduleTarget) return;
    if (!rescheduleForm.scheduledAt) {
      addToast({ type: 'error', message: 'Please select a new time.' });
      return;
    }
    const nextDate = new Date(rescheduleForm.scheduledAt);
    if (Number.isNaN(nextDate.getTime())) {
      addToast({ type: 'error', message: 'Please enter a valid time.' });
      return;
    }

    const weekOf = (() => {
      const monday = new Date(nextDate);
      const day = monday.getDay();
      const diff = monday.getDate() - day + (day === 0 ? -6 : 1);
      monday.setDate(diff);
      monday.setHours(0, 0, 0, 0);
      return monday.toISOString().slice(0, 10);
    })();

    updateBooking(rescheduleTarget.id, (prev) => ({
      ...prev,
      scheduledAt: rescheduleForm.scheduledAt,
      coach: rescheduleForm.coach,
      location: rescheduleForm.location,
      notes: rescheduleForm.notes,
      status: 'Scheduled',
      weekOf,
    }));

    addToast({ type: 'success', message: 'Booking time updated.' });
    setRescheduleTarget(null);
  };

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Trial Scheduling</h2>
        <p className="mt-2 text-sm text-slate-500">
          Review and manage free trial bookings. The data below is mock content to demonstrate follow-up workflows.
        </p>
      </section>

      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 flex-wrap items-center gap-2">
          <select
            value={week}
            onChange={(event) => setWeek(event.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
          >
            {weekOptions.map((option) => (
              <option key={option} value={option}>
                {option === 'All' ? 'All weeks' : `Week of ${option}`}
              </option>
            ))}
          </select>
          <select
            value={coach}
            onChange={(event) => setCoach(event.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
          >
            {coachOptions.map((option) => (
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
            value={owner}
            onChange={(event) => setOwner(event.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
          >
            {ownerOptions.map((option) => (
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

      {sortedDays.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
          No bookings match the current filters.
        </div>
      ) : (
        <div className="space-y-6">
          {sortedDays.map((day) => (
            <section key={day} className="space-y-3">
              <div className="text-xs uppercase tracking-wide text-slate-400">
                {new Date(day).toLocaleDateString('en-AU', {
                  month: 'long',
                  day: 'numeric',
                  weekday: 'short',
                })}
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {groupedByDay[day].map((booking) => (
                  <article
                    key={booking.id}
                    className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-base font-semibold text-slate-900">
                            {booking.student}
                          </h3>
                          <p className="text-sm text-slate-500">
                            {booking.preferredClass}
                          </p>
                        </div>
                        <StatusBadge status={booking.status} />
                      </div>
                      <dl className="space-y-2 text-sm text-slate-600">
                        <div className="flex items-center justify-between">
                          <dt>Time</dt>
                          <dd className="font-medium text-slate-900">
                            {new Date(booking.scheduledAt).toLocaleTimeString('en-AU', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </dd>
                        </div>
                        <div className="flex items-center justify-between">
                          <dt>Coach</dt>
                          <dd className="font-medium text-slate-900">{booking.coach}</dd>
                        </div>
                        <div className="flex items-center justify-between">
                          <dt>Location</dt>
                          <dd className="font-medium text-slate-900">{booking.location}</dd>
                        </div>
                        <div className="flex items-center justify-between">
                          <dt>Owner</dt>
                          <dd className="font-medium text-slate-900">{booking.owner}</dd>
                        </div>
                      </dl>
                      <p className="rounded-md bg-slate-50 px-3 py-2 text-xs text-slate-500">
                        {booking.notes}
                      </p>
                    </div>
                    <div className="mt-5 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => setDetailTarget(booking)}
                        className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-600 hover:bg-slate-100"
                      >
                        View
                      </button>
                      <button
                        type="button"
                        onClick={() => handleStatusChange(booking, 'Confirmed')}
                        className="flex-1 rounded-lg border border-emerald-200 px-3 py-2 text-xs text-emerald-700 hover:bg-emerald-50"
                      >
                        Confirm
                      </button>
                      <button
                        type="button"
                        onClick={() => openReschedule(booking)}
                        className="flex-1 rounded-lg border border-indigo-200 px-3 py-2 text-xs text-indigo-700 hover:bg-indigo-50"
                      >
                        Reschedule
                      </button>
                      <button
                        type="button"
                        onClick={() => handleStatusChange(booking, 'No-show')}
                        className="flex-1 rounded-lg border border-rose-200 px-3 py-2 text-xs text-rose-700 hover:bg-rose-50"
                      >
                        No-show
                      </button>
                      <button
                        type="button"
                        onClick={() => handleStatusChange(booking, 'Completed')}
                        className="flex-1 rounded-lg bg-slate-900 px-3 py-2 text-xs font-medium text-white hover:bg-slate-800"
                      >
                        Mark Completed
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      <EntityDrawer
        open={Boolean(detailTarget)}
        onClose={() => setDetailTarget(null)}
        title={detailTarget?.student ?? ''}
        fields={
          detailTarget
            ? [
                { label: 'Contact', value: detailTarget.contact },
                { label: 'Preferred Class', value: detailTarget.preferredClass },
                { label: 'Coach', value: detailTarget.coach },
                { label: 'Location', value: detailTarget.location },
                { label: 'Scheduled At', value: detailTarget.scheduledAt },
                { label: 'Status', value: <StatusBadge status={detailTarget.status} /> },
                { label: 'Owner', value: detailTarget.owner },
              ]
            : []
        }
        note={detailTarget?.notes}
      />

      <AssignmentModal
        open={Boolean(rescheduleTarget)}
        title="Update Trial Booking"
        description={
          rescheduleTarget
            ? `${rescheduleTarget.student} · ${rescheduleTarget.preferredClass}`
            : undefined
        }
        confirmLabel="Save changes"
        onClose={() => setRescheduleTarget(null)}
        onConfirm={handleReschedule}
        fields={[
          {
            id: 'rescheduledAt',
            label: 'New time',
            type: 'datetime-local',
            value: rescheduleForm.scheduledAt,
            onChange: (value) =>
              setRescheduleForm((prev) => ({
                ...prev,
                scheduledAt: value,
              })),
          },
          {
            id: 'coach',
            label: 'Coach',
            type: 'select',
            value: rescheduleForm.coach,
            options: coachOptions
              .filter((option) => option !== 'All')
              .map((option) => ({ value: option, label: option })),
            onChange: (value) =>
              setRescheduleForm((prev) => ({
                ...prev,
                coach: value,
              })),
          },
          {
            id: 'location',
            label: 'Location',
            type: 'select',
            value: rescheduleForm.location,
            options: locationOptions
              .filter((option) => option !== 'All')
              .map((option) => ({ value: option, label: option })),
            onChange: (value) =>
              setRescheduleForm((prev) => ({
                ...prev,
                location: value,
              })),
          },
          {
            id: 'notes',
            label: 'Notes',
            type: 'textarea',
            value: rescheduleForm.notes,
            placeholder: 'Record attendee or parent requests',
            onChange: (value) =>
              setRescheduleForm((prev) => ({
                ...prev,
                notes: value,
              })),
          },
        ]}
      />
    </div>
  );
}

export default TrialScheduling;


