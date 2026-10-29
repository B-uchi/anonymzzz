import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { api } from "../lib/api";
import { useAuth } from "../lib/auth";
import { PROMPT_MAX_LENGTH } from "../lib/format";
import PasswordInput from "../components/PasswordInput";
import Dialog from "../components/Dialog";
import { Spinner } from "../components/Loading";

const PROMPT_IDEAS = [
  "Send me an anonymous message",
  "What do you really think of me?",
  "Ask me anything",
  "Rate me from 1 to 10",
  "Tell me a secret",
  "Confess something",
];

function Section({ title, description, children }) {
  return (
    <section className="grid gap-6 border-t border-line py-10 md:grid-cols-[1fr_1.6fr]">
      <div>
        <h2 className="text-xl font-bold">{title}</h2>
        {description && <p className="mt-1 max-w-[32ch] text-ink-soft">{description}</p>}
      </div>
      <div>{children}</div>
    </section>
  );
}

function Switch({ checked, onChange, label, description }) {
  return (
    <label className="flex cursor-pointer items-start justify-between gap-6">
      <span>
        <span className="block font-semibold">{label}</span>
        <span className="mt-0.5 block text-sm text-ink-soft">{description}</span>
      </span>
      <span className="relative mt-1 inline-flex shrink-0">
        <input
          type="checkbox"
          role="switch"
          className="peer sr-only"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
        />
        <span className="h-7 w-12 rounded-full bg-line transition-colors peer-checked:bg-dusk peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[var(--ring)]" />
        <span className="absolute top-1 left-1 size-5 rounded-full bg-surface shadow transition-transform peer-checked:translate-x-5" />
      </span>
    </label>
  );
}

function LinkSettings() {
  const { user, setUser } = useAuth();
  const [prompt, setPrompt] = useState(user.prompt);
  const [saving, setSaving] = useState(false);
  const dirty = prompt.trim() !== user.prompt;

  const save = async (changes) => {
    setSaving(true);
    try {
      const data = await api("/account", { method: "PATCH", body: changes, auth: true });
      setUser(data.user);
      setPrompt(data.user.prompt);
      return data.user;
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Section title="Your link" description="What people see when they open your link.">
      <form
        onSubmit={async (event) => {
          event.preventDefault();
          if (await save({ prompt })) toast.success("Prompt saved");
        }}
      >
        <label htmlFor="prompt" className="label">
          Prompt
        </label>
        <input
          id="prompt"
          className="field"
          value={prompt}
          maxLength={PROMPT_MAX_LENGTH}
          onChange={(event) => setPrompt(event.target.value)}
          aria-describedby="prompt-count"
        />
        <div className="mt-1.5 flex justify-between text-sm text-ink-soft">
          <span>Leave it empty to use the default.</span>
          <span id="prompt-count">
            {prompt.length}/{PROMPT_MAX_LENGTH}
          </span>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {PROMPT_IDEAS.map((idea) => (
            <button
              key={idea}
              type="button"
              onClick={() => setPrompt(idea)}
              className={`rounded-full border px-3 py-1 text-sm transition-colors ${
                prompt === idea
                  ? "border-dusk bg-dusk text-on-dusk"
                  : "border-line text-ink-soft hover:border-ink-soft hover:text-ink"
              }`}
            >
              {idea}
            </button>
          ))}
        </div>
        <button type="submit" className="btn-primary mt-5" disabled={!dirty || saving}>
          Save prompt
        </button>
      </form>

      <div className="mt-8 rounded-2xl border border-line p-4">
        <Switch
          checked={user.acceptingMessages}
          label="Accept new notes"
          description="When this is off, your link says you're not taking notes right now."
          onChange={async (acceptingMessages) => {
            const updated = await save({ acceptingMessages });
            if (updated) {
              toast.success(updated.acceptingMessages ? "Your link is open again" : "Your link is paused");
            }
          }}
        />
      </div>
    </Section>
  );
}

function PasswordSettings() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [busy, setBusy] = useState(false);

  return (
    <Section title="Password" description="Use at least 6 characters.">
      <form
        className="space-y-4"
        onSubmit={async (event) => {
          event.preventDefault();
          setBusy(true);
          try {
            await api("/account/password", {
              method: "PUT",
              body: { currentPassword: current, newPassword: next },
              auth: true,
            });
            setCurrent("");
            setNext("");
            toast.success("Password changed");
          } catch (err) {
            toast.error(err.message);
          } finally {
            setBusy(false);
          }
        }}
      >
        <div>
          <label htmlFor="current-password" className="label">
            Current password
          </label>
          <PasswordInput
            id="current-password"
            value={current}
            onChange={(event) => setCurrent(event.target.value)}
            autoComplete="current-password"
            required
          />
        </div>
        <div>
          <label htmlFor="new-password" className="label">
            New password
          </label>
          <PasswordInput
            id="new-password"
            value={next}
            onChange={(event) => setNext(event.target.value)}
            autoComplete="new-password"
            minLength={6}
            required
          />
        </div>
        <button type="submit" className="btn-primary" disabled={busy || !current || next.length < 6}>
          Change password
        </button>
      </form>
    </Section>
  );
}

function DeleteAccount() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  return (
    <Section title="Delete account" description="Removes your link, your account and every note you've received.">
      <button type="button" className="btn-outline border-danger/40 text-danger" onClick={() => setOpen(true)}>
        Delete account
      </button>

      <Dialog
        open={open}
        onClose={() => {
          setOpen(false);
          setPassword("");
          setError("");
        }}
        labelledBy="delete-title"
        className="rounded-2xl bg-surface p-6"
      >
        <form
          onSubmit={async (event) => {
            event.preventDefault();
            setBusy(true);
            setError("");
            try {
              await api("/account", { method: "DELETE", body: { password }, auth: true });
              logout();
              navigate("/", { replace: true });
              toast.success("Your account was deleted");
            } catch (err) {
              setError(err.message);
              setBusy(false);
            }
          }}
        >
          <h2 id="delete-title" className="text-xl font-bold">
            Delete your account?
          </h2>
          <p className="mt-2 text-ink-soft">
            Your link stops working and all your notes are erased. This can&apos;t be undone.
          </p>
          <label htmlFor="delete-password" className="label mt-5">
            Enter your password to confirm
          </label>
          <PasswordInput
            id="delete-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            required
          />
          {error && (
            <p role="alert" className="mt-3 text-sm font-medium text-danger">
              {error}
            </p>
          )}
          <div className="mt-6 flex justify-end gap-2">
            <button type="button" className="btn-ghost" onClick={() => setOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn-danger" disabled={busy || !password}>
              {busy && <Spinner className="size-4" />}
              Delete forever
            </button>
          </div>
        </form>
      </Dialog>
    </Section>
  );
}

export default function Settings() {
  const { user } = useAuth();

  useEffect(() => {
    document.title = "Settings | Anonymzzz";
  }, []);

  return (
    <main className="mx-auto max-w-4xl px-4 pb-20 sm:px-6">
      <div className="pt-4 pb-10">
        <h1 className="text-4xl font-extrabold tracking-tight">Settings</h1>
        <p className="mt-2 text-ink-soft">
          Signed in as <span className="font-semibold text-ink">{user.username}</span> ({user.email})
        </p>
      </div>
      <LinkSettings />
      <PasswordSettings />
      <DeleteAccount />
    </main>
  );
}
