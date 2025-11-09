import type { ReactNode } from 'react';

type AssignmentField = {
  id: string;
  label: string;
  value: string;
  type?: 'text' | 'textarea' | 'select' | 'datetime-local' | 'date' | 'number';
  placeholder?: string;
  options?: { value: string; label: string }[];
  onChange: (value: string) => void;
};

type AssignmentModalProps = {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  fields: AssignmentField[];
  onClose: () => void;
  onConfirm: () => void;
  extraContent?: ReactNode;
};

function AssignmentModal({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  fields,
  onClose,
  onConfirm,
  extraContent,
}: AssignmentModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
            {description ? (
              <p className="mt-1 text-sm text-slate-500">{description}</p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-sm text-slate-500 hover:text-slate-700"
          >
            Close
          </button>
        </div>

        <div className="mt-4 space-y-3">
          {fields.map((field) => {
            if (field.type === 'textarea') {
              return (
                <label key={field.id} className="block text-sm text-slate-600">
                  <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-400">
                    {field.label}
                  </span>
                  <textarea
                    value={field.value}
                    onChange={(event) => field.onChange(event.target.value)}
                    placeholder={field.placeholder}
                    rows={3}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                  />
                </label>
              );
            }

            if (field.type === 'select') {
              return (
                <label key={field.id} className="block text-sm text-slate-600">
                  <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-400">
                    {field.label}
                  </span>
                  <select
                    value={field.value}
                    onChange={(event) => field.onChange(event.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                  >
                    {(field.options ?? []).map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
              );
            }

            return (
              <label key={field.id} className="block text-sm text-slate-600">
                <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-400">
                  {field.label}
                </span>
                <input
                  value={field.value}
                  onChange={(event) => field.onChange(event.target.value)}
                  type={field.type ?? 'text'}
                  placeholder={field.placeholder}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                />
              </label>
            );
          })}
        </div>

        {extraContent ? <div className="mt-4">{extraContent}</div> : null}

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-100"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-slate-800"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export type { AssignmentField };
export default AssignmentModal;


