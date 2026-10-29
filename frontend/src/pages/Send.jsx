import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { AnimatePresence, motion } from "motion/react";
import { PiLockSimpleBold, PiPaperPlaneTiltBold } from "react-icons/pi";
import { api } from "../lib/api";
import { useAuth } from "../lib/auth";
import { MESSAGE_MAX_LENGTH } from "../lib/format";
import Logo from "../components/Logo";
import ThemeToggle from "../components/ThemeToggle";
import Loading, { Spinner } from "../components/Loading";
import { useSlowHint } from "../lib/useSlowHint";

function Shell({ children }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Logo />
        <ThemeToggle />
      </header>
      <main className="flex flex-1 items-start justify-center px-4 pt-6 pb-16 sm:items-center sm:pt-0">
        <div className="w-full max-w-xl">{children}</div>
      </main>
    </div>
  );
}

function Notice({ title, body, children }) {
  return (
    <div className="text-center">
      <h1 className="text-3xl font-extrabold tracking-tight">{title}</h1>
      <p className="mx-auto mt-3 max-w-sm text-ink-soft">{body}</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">{children}</div>
    </div>
  );
}

function GetYourOwn() {
  const { status } = useAuth();
  return status === "authed" ? (
    <Link to="/inbox" className="btn-outline">
      Go to your inbox
    </Link>
  ) : (
    <Link to="/register" className="btn-outline">
      Get your own link
    </Link>
  );
}

export default function Send() {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState("");
  const [sent, setSent] = useState(false);
  const slow = useSlowHint(sending);

  const load = useCallback(async () => {
    setLoadError(null);
    try {
      const data = await api(`/profiles/${encodeURIComponent(username)}`);
      setProfile(data.profile);
    } catch (err) {
      setLoadError(err);
    }
  }, [username]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial fetch
    load();
  }, [load]);

  useEffect(() => {
    document.title = `Send ${profile?.username ?? username} an anonymous note | Anonymzzz`;
  }, [profile, username]);

  const remaining = MESSAGE_MAX_LENGTH - message.length;
  const canSend = message.trim().length > 0 && remaining >= 0 && !sending;

  const send = async (event) => {
    event?.preventDefault();
    if (!canSend) return;
    setSending(true);
    setSendError("");
    try {
      await api(`/profiles/${encodeURIComponent(profile.username)}/messages`, {
        method: "POST",
        body: { message },
      });
      setSent(true);
      setMessage("");
    } catch (err) {
      setSendError(err.message);
      if (err.status === 403) setProfile((p) => ({ ...p, acceptingMessages: false }));
    } finally {
      setSending(false);
    }
  };

  if (loadError?.status === 404) {
    return (
      <Shell>
        <Notice
          title="This link doesn't lead anywhere"
          body={`Nobody goes by “${username}”. Check the spelling with whoever shared it.`}
        >
          <GetYourOwn />
        </Notice>
      </Shell>
    );
  }
  if (loadError) {
    return (
      <Shell>
        <Notice title="Couldn't open this link" body={loadError.message}>
          <button type="button" className="btn-primary" onClick={load}>
            Try again
          </button>
        </Notice>
      </Shell>
    );
  }
  if (!profile) return <Loading label="Opening link" />;

  if (!profile.acceptingMessages) {
    return (
      <Shell>
        <Notice
          title={`${profile.username} isn't taking notes right now`}
          body="They've paused their link. Try again another time."
        >
          <GetYourOwn />
        </Notice>
      </Shell>
    );
  }

  return (
    <Shell>
      <AnimatePresence mode="wait" initial={false}>
        {sent ? (
          <motion.div
            key="sent"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            role="status"
          >
            <Notice title="Sent" body={`Your note is in ${profile.username}'s inbox. They won't know it was you.`}>
              <button type="button" className="btn-primary" onClick={() => setSent(false)}>
                Send another
              </button>
              <GetYourOwn />
            </Notice>
          </motion.div>
        ) : (
          <motion.form
            key="compose"
            onSubmit={send}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -80, rotate: -4, transition: { duration: 0.35, ease: "easeIn" } }}
          >
            <p className="text-ink-soft">
              To <span className="font-semibold text-ink">{profile.username}</span>
            </p>
            <h1 className="mt-1 text-[clamp(2rem,6vw,3rem)] leading-[1.02] font-extrabold tracking-tight text-balance">
              {profile.prompt}
            </h1>

            <div className="slip slip-tape mt-8 -rotate-1 px-5 pt-7 pb-3 focus-within:rotate-0 motion-safe:transition-transform">
              <label htmlFor="message" className="sr-only">
                Your note
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) send();
                }}
                rows={6}
                maxLength={MESSAGE_MAX_LENGTH + 200}
                placeholder="Write it here…"
                autoFocus
                className="block w-full resize-none bg-transparent text-xl leading-snug font-semibold text-slip-ink outline-none placeholder:text-slip-soft/70"
              />
              <p
                className={`text-right text-sm ${remaining < 0 ? "font-semibold text-danger" : "text-slip-soft"}`}
                aria-live="polite"
              >
                {remaining < 100 ? `${remaining} characters left` : `${message.length}/${MESSAGE_MAX_LENGTH}`}
              </p>
            </div>

            {sendError && (
              <p role="alert" className="mt-4 rounded-xl bg-danger/10 px-4 py-3 text-sm font-medium text-danger">
                {sendError}
              </p>
            )}

            <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
              <p className="flex items-center gap-1.5 text-sm text-ink-soft">
                <PiLockSimpleBold aria-hidden="true" />
                Your name isn&apos;t attached to this note.
              </p>
              <button type="submit" className="btn-primary px-6 py-3 text-base" disabled={!canSend}>
                {sending ? <Spinner className="size-4" /> : <PiPaperPlaneTiltBold aria-hidden="true" />}
                Send anonymously
              </button>
            </div>
            {slow && (
              <p className="mt-3 text-right text-sm text-ink-soft" role="status">
                Waking the server up. This can take up to a minute.
              </p>
            )}
          </motion.form>
        )}
      </AnimatePresence>
    </Shell>
  );
}
