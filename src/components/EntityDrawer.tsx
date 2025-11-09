import type { ReactNode } from 'react';

type DrawerField = {
  label: string;
  value: ReactNode;
};

type EntityDrawerProps = {
  open: boolean;
  title: string;
  fields: DrawerField[];
  note?: string;
  onClose: () => void;
};

function EntityDrawer({
  open,
  title,
  fields,
  note,
  onClose,
}: EntityDrawerProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-slate-900/20 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={onClose} />
      <aside className="relative z-10 flex h-full w-full max-w-sm flex-col border-l border-slate-200 bg-white shadow-xl">
        <div className="flex items-start justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
            <p className="text-sm text-slate-500">Snapshot view</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-slate-200 px-2 py-1 text-sm text-slate-500 hover:bg-slate-100"
          >
            Close
          </button>
        </div>
        <div className="flex-1 space-y-5 overflow-y-auto px-5 py-4">
          {fields.map((field) => (
            <div key={field.label}>
              <div className="text-xs uppercase tracking-wide text-slate-400">
                {field.label}
              </div>
              <div className="mt-1 text-sm text-slate-900">{field.value}</div>
            </div>
          ))}
          {note ? (
            <div>
              <div className="text-xs uppercase tracking-wide text-slate-400">
                Notes
              </div>
              <p className="mt-1 rounded-md bg-slate-100 p-3 text-sm text-slate-700">
                {note}
              </p>
            </div>
          ) : null}
        </div>
      </aside>
    </div>
  );
}

export type { DrawerField };
export default EntityDrawer;

