import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { motion } from "motion/react";
import { useAuth } from "../lib/auth";
import { displayHost, USERNAME_PATTERN } from "../lib/format";
import Logo from "../components/Logo";
import ThemeToggle from "../components/ThemeToggle";
import Footer from "../components/Footer";

const NOTES = [
  { text: "your laugh is genuinely contagious. please never stop", ago: "2 min ago", tilt: -4, x: "4%", y: "0%" },
  { text: "be honest, was the group project all you or all us", ago: "18 min ago", tilt: 3, x: "36%", y: "25%" },
  { text: "I still listen to the playlist you made for the road trip", ago: "1 hr ago", tilt: -1.5, x: "0%", y: "50%" },
  { text: "start the podcast. seriously. I'd listen to every episode", ago: "3 hr ago", tilt: 4.5, x: "34%", y: "74%" },
];

const STEPS = [
  {
    title: "Claim a username",
    body: `Your link becomes ${displayHost()}/u/you. Add a prompt so people know what to send.`,
  },
  {
    title: "Share it anywhere",
    body: "Drop it in your bio, your story or the group chat. Anyone can send without an account.",
  },
  {
    title: "Read and reply",
    body: "Notes land in your inbox. Turn any of them into an image and post your answer.",
  },
];

const PRIVACY = [
  ["No sender accounts", "Senders don't sign in, and messages aren't tied to a name or profile."],
  ["Encrypted at rest", "Message text is encrypted before it's stored in the database."],
  ["Pause any time", "Stop taking messages with one switch and turn it back on when you're ready."],
  ["Delete everything", "Remove single notes, or your whole account and every message in it."],
];

function NoteStack() {
  return (
    <div className="relative mx-auto h-[480px] w-full max-w-[460px] sm:h-[540px]" aria-hidden="true">
      {NOTES.map((note, i) => (
        <motion.div
          key={note.text}
          className="slip slip-tape absolute w-[64%] px-5 pt-6 pb-4"
          style={{ left: note.x, top: note.y }}
          initial={{ opacity: 0, y: -60, rotate: note.tilt - 8 }}
          animate={{ opacity: 1, y: 0, rotate: note.tilt }}
          transition={{ type: "spring", stiffness: 140, damping: 16, delay: 0.25 + i * 0.22 }}
        >
          <p className="text-[17px] leading-snug font-semibold sm:text-lg">{note.text}</p>
          <p className="mt-3 text-[13px] text-slip-soft">from someone, {note.ago}</p>
        </motion.div>
      ))}
    </div>
  );
}

function ClaimForm() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const invalid = name.length > 0 && !USERNAME_PATTERN.test(name);

  return (
    <form
      className="mt-8 max-w-xl"
      onSubmit={(event) => {
        event.preventDefault();
        if (invalid) return;
        navigate(`/register${name ? `?username=${encodeURIComponent(name)}` : ""}`);
      }}
    >
      <label htmlFor="claim" className="sr-only">
        Username
      </label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="flex flex-1 items-center rounded-full bg-surface pl-5 text-[17px] text-ink focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[var(--ring)]">
          <span className="shrink-0 text-ink-soft">{displayHost()}/u/</span>
          <input
            id="claim"
            value={name}
            onChange={(event) => setName(event.target.value.trim())}
            placeholder="you"
            autoComplete="off"
            spellCheck="false"
            maxLength={20}
            aria-invalid={invalid}
            aria-describedby="claim-hint"
            className="min-w-0 flex-1 bg-transparent py-3.5 pr-4 font-semibold outline-none placeholder:text-ink-soft/50"
          />
        </div>
        <button type="submit" className="btn bg-slip px-6 py-3.5 text-slip-ink hover:opacity-90">
          Claim it
        </button>
      </div>
      <p id="claim-hint" className={`mt-2 pl-5 text-sm ${invalid ? "font-semibold text-on-dusk" : "text-on-dusk/70"}`}>
        {invalid
          ? "Use 3–20 letters, numbers, dots or underscores."
          : "Free. Takes about twenty seconds."}
      </p>
    </form>
  );
}

export default function Landing() {
  const { status } = useAuth();
  const authed = status === "authed";

  return (
    <div className="overflow-x-clip">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Logo />
        <nav className="flex items-center gap-1" aria-label="Main">
          <ThemeToggle />
          {authed ? (
            <Link to="/inbox" className="btn-primary ml-1">
              Open inbox
            </Link>
          ) : (
            <>
              <Link to="/login" className="btn-ghost">
                Log in
              </Link>
              <Link to="/register" className="btn-primary ml-1 hidden sm:inline-flex">
                Create your link
              </Link>
            </>
          )}
        </nav>
      </header>

      <main>
        <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 pt-10 pb-20 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:pt-16">
          <div>
            <h1 className="text-[clamp(2.75rem,7vw,5.25rem)] leading-[0.95] font-extrabold tracking-[-0.035em] text-balance">
              Get honest notes. Nobody signs their name.
            </h1>
            <p className="mt-6 max-w-[34ch] text-lg text-ink-soft sm:text-xl">
              Make a link, share it anywhere, and read what friends, followers and
              classmates send you anonymously.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to={authed ? "/inbox" : "/register"} className="btn-primary px-6 py-3 text-base">
                {authed ? "Open inbox" : "Create your link"}
              </Link>
              {!authed && (
                <Link to="/login" className="btn-outline px-6 py-3 text-base">
                  Log in
                </Link>
              )}
            </div>
          </div>
          <NoteStack />
        </section>

        <section className="border-y border-line bg-surface">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">How it works</h2>
            <ol className="mt-10 grid gap-10 sm:grid-cols-3">
              {STEPS.map((step, i) => (
                <li key={step.title}>
                  <span className="text-5xl font-extrabold text-lilac">{i + 1}</span>
                  <h3 className="mt-3 text-xl font-bold">{step.title}</h3>
                  <p className="mt-2 max-w-[32ch] text-ink-soft">{step.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">What stays private</h2>
            <p className="mt-3 max-w-[36ch] text-ink-soft">
              Anonymous should mean anonymous. Here&apos;s what that looks like in practice.
            </p>
          </div>
          <dl className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
            {PRIVACY.map(([term, detail]) => (
              <div key={term} className="border-l-2 border-lilac pl-4">
                <dt className="font-bold">{term}</dt>
                <dd className="mt-1 text-ink-soft">{detail}</dd>
              </div>
            ))}
          </dl>
        </section>

        {!authed && (
          <section className="px-4 pb-16 sm:px-6">
            <div className="mx-auto max-w-6xl rounded-[28px] bg-dusk px-6 py-12 text-on-dusk sm:px-12 sm:py-16">
              <h2 className="max-w-[18ch] text-3xl font-extrabold tracking-tight sm:text-5xl">
                Your link is one name away.
              </h2>
              <ClaimForm />
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
