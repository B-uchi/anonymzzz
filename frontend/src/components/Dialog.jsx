import { useEffect, useRef } from "react";

// Thin wrapper over <dialog>: the browser handles focus trapping and Escape.
export default function Dialog({ open, onClose, labelledBy, children, className = "" }) {
  const ref = useRef(null);

  useEffect(() => {
    const dialog = ref.current;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={labelledBy}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === ref.current) onClose();
      }}
    >
      <div className={className}>{open && children}</div>
    </dialog>
  );
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  body,
  confirmLabel,
  busy = false,
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      labelledBy="confirm-title"
      className="rounded-2xl bg-surface p-6"
    >
      <h2 id="confirm-title" className="text-xl font-bold">
        {title}
      </h2>
      <p className="mt-2 text-ink-soft">{body}</p>
      <div className="mt-6 flex justify-end gap-2">
        <button type="button" className="btn-ghost" onClick={onClose}>
          Cancel
        </button>
        <button type="button" className="btn-danger" onClick={onConfirm} disabled={busy}>
          {confirmLabel}
        </button>
      </div>
    </Dialog>
  );
}
