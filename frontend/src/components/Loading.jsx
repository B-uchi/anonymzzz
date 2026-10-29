import { useSlowHint } from "../lib/useSlowHint";

export function Spinner({ className = "size-5" }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block animate-spin rounded-full border-2 border-current border-r-transparent ${className}`}
    />
  );
}

export default function Loading({ label = "Loading" }) {
  const slow = useSlowHint(true);
  return (
    <div role="status" className="grid min-h-[60dvh] place-items-center px-4 text-center">
      <div className="flex flex-col items-center gap-3 text-ink-soft">
        <Spinner className="size-7 text-dusk" />
        <p className="text-[15px]">{label}</p>
        {slow && (
          <p className="max-w-xs text-sm">
            The server naps when it&apos;s quiet. Waking it up can take up to a minute.
          </p>
        )}
      </div>
    </div>
  );
}
