import { useMemo, useState } from 'react';
import { classSessions, type ClassSession } from '../data/classes';
import useToast from '../hooks/useToast';

const weekOptions = ['This Week', 'Next Week'] as const;
const studentPool = [
  'Mia Jenkins',
  'Henry Chalmers',
  'Lena Wu',
  'Nova Chen',
  'Logan Price',
] as const;

function ClassScheduling() {
  const { addToast } = useToast();
  const [records, setRecords] = useState(classSessions);
  const [week, setWeek] = useState<(typeof weekOptions)[number]>('This Week');
  const [coach, setCoach] = useState('All');
  const [location, setLocation] = useState('All');
  const [assignTarget, setAssignTarget] = useState<ClassSession | null>(null);
  const [editTarget, setEditTarget] = useState<ClassSession | null>(null);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);

  const coaches = useMemo(() => {
    const names = Array.from(new Set(records.map((item) => item.coach)));
    return ['All', ...names];
  }, [records]);

  const locations = useMemo(() => {
    const names = Array.from(new Set(records.map((item) => item.location)));
    return ['All', ...names];
  }, [records]);

  const filtered = useMemo(() => {
    return records.filter((item) => {
      const byCoach = coach === 'All' || item.coach === coach;
      const byLocation = location === 'All' || item.location === location;
      return byCoach && byLocation;
    });
  }, [records, coach, location]);

  const handleAssign = () => {
    if (!assignTarget) return;
    addToast({
      type: 'success',
      message: `${assignTarget.name}: assigned ${selectedStudents.length} students (mock).`,
    });
    setAssignTarget(null);
    setSelectedStudents([]);
  };

  const handleEdit = (updated: ClassSession) => {
    setRecords((prev) =>
      prev.map((item) => (item.id === updated.id ? updated : item))
    );
    setEditTarget(null);
    addToast({ type: 'success', message: 'Class details updated.' });
  };

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Class Scheduling</h2>
        <p className="mt-2 text-sm text-slate-500">
          Lightweight roster overview. Filters only affect mock client-side data.
        </p>
      </section>

      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 flex-wrap items-center gap-2">
          <select
            value={week}
            onChange={(event) =>
              setWeek(event.target.value as (typeof weekOptions)[number])
            }
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
          >
            {weekOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <select
            value={coach}
            onChange={(event) => setCoach(event.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
          >
            {coaches.map((option) => (
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
            {locations.map((option) => (
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

      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map((classItem) => (
          <article
            key={classItem.id}
            className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-semibold text-slate-900">
                    {classItem.name}
                  </h3>
                  <p className="text-sm text-slate-500">{classItem.schedule}</p>
                </div>
                <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600">
                  {week}
                </span>
              </div>
              <dl className="mt-4 space-y-2 text-sm text-slate-600">
                <div className="flex items-center justify-between">
                  <dt>Coach</dt>
                  <dd className="font-medium text-slate-900">{classItem.coach}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt>Location</dt>
                  <dd className="font-medium text-slate-900">{classItem.location}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt>Enrolled</dt>
                  <dd className="font-medium text-slate-900">
                    {classItem.enrolled} / {classItem.capacity}
                  </dd>
                </div>
              </dl>
              {classItem.tags ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {classItem.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setAssignTarget(classItem);
                  setSelectedStudents([]);
                }}
                className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:bg-slate-100"
              >
                Assign Students
              </button>
              <button
                type="button"
                onClick={() => setEditTarget(classItem)}
                className="flex-1 rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800"
              >
                Edit
              </button>
            </div>
          </article>
        ))}
      </div>

      {assignTarget ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">
                Assign Students
              </h3>
              <button
                type="button"
                onClick={() => setAssignTarget(null)}
                className="text-sm text-slate-500 hover:text-slate-700"
              >
                Close
              </button>
            </div>
            <p className="mt-2 text-sm text-slate-500">
              {assignTarget.name} · {assignTarget.schedule}
            </p>
            <div className="mt-4 space-y-2">
              {studentPool.map((student) => {
                const checked = selectedStudents.includes(student);
                return (
                  <label
                    key={student}
                    className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600"
                  >
                    <span>{student}</span>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() =>
                        setSelectedStudents((prev) =>
                          checked
                            ? prev.filter((item) => item !== student)
                            : [...prev, student]
                        )
                      }
                      className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900/10"
                    />
                  </label>
                );
              })}
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setAssignTarget(null)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAssign}
                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
              >
                Save mock assignment
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {editTarget ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">
                Edit Class
              </h3>
              <button
                type="button"
                onClick={() => setEditTarget(null)}
                className="text-sm text-slate-500 hover:text-slate-700"
              >
                Close
              </button>
            </div>
            <ClassEditForm
              classItem={editTarget}
              onCancel={() => setEditTarget(null)}
              onSave={handleEdit}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}

type ClassEditFormProps = {
  classItem: ClassSession;
  onSave: (updated: ClassSession) => void;
  onCancel: () => void;
};

function ClassEditForm({ classItem, onSave, onCancel }: ClassEditFormProps) {
  const [form, setForm] = useState(classItem);

  return (
    <form
      className="mt-4 space-y-3"
      onSubmit={(event) => {
        event.preventDefault();
        onSave(form);
      }}
    >
      <input
        value={form.name}
        onChange={(event) =>
          setForm((prev) => ({ ...prev, name: event.target.value }))
        }
        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10"
      />
      <input
        value={form.schedule}
        onChange={(event) =>
          setForm((prev) => ({ ...prev, schedule: event.target.value }))
        }
        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10"
      />
      <input
        value={form.coach}
        onChange={(event) =>
          setForm((prev) => ({ ...prev, coach: event.target.value }))
        }
        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10"
      />
      <input
        value={form.location}
        onChange={(event) =>
          setForm((prev) => ({ ...prev, location: event.target.value }))
        }
        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10"
      />
      <div className="flex gap-3">
        <input
          value={form.enrolled}
          onChange={(event) =>
            setForm((prev) => ({
              ...prev,
              enrolled: Number(event.target.value),
            }))
          }
          type="number"
          min={0}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10"
        />
        <input
          value={form.capacity}
          onChange={(event) =>
            setForm((prev) => ({
              ...prev,
              capacity: Number(event.target.value),
            }))
          }
          type="number"
          min={0}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10"
        />
      </div>
      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-100"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          Save changes
        </button>
      </div>
    </form>
  );
}

export default ClassScheduling;

