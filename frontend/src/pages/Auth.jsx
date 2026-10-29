import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { api } from "../lib/api";
import { useAuth } from "../lib/auth";
import { displayHost, USERNAME_PATTERN } from "../lib/format";
import Logo from "../components/Logo";
import ThemeToggle from "../components/ThemeToggle";
import PasswordInput from "../components/PasswordInput";
import { Spinner } from "../components/Loading";
import { useSlowHint } from "../lib/useSlowHint";

const COPY = {
  login: {
    title: "Welcome back",
    lead: "Log in to read your notes.",
    submit: "Log in",
    switchText: "New here?",
    switchLink: "Create your link",
    switchTo: "/register",
  },
  register: {
    title: "Create your link",
    lead: "Pick a username. It becomes the link people use to message you.",
    submit: "Create account",
    switchText: "Already have an account?",
    switchLink: "Log in",
    switchTo: "/login",
  },
};

function UsernameField({ value, onChange }) {
  const invalid = value.length > 0 && !USERNAME_PATTERN.test(value);
  return (
    <div>
      <label htmlFor="username" className="label">
        Username
      </label>
      <input
        id="username"
        className="field"
        value={value}
        onChange={(event) => onChange(event.target.value.trim())}
        autoComplete="username"
        autoCapitalize="none"
        spellCheck="false"
        maxLength={20}
        required
        aria-invalid={invalid}
        aria-describedby="username-hint"
      />
      <p id="username-hint" className={`mt-1.5 text-sm ${invalid ? "text-danger" : "text-ink-soft"}`}>
        {invalid ? (
          "Use 3–20 letters, numbers, dots or underscores."
        ) : (
          <>
            Your link: {displayHost()}/u/
            <span className="font-semibold text-ink">{value || "you"}</span>
          </>
        )}
      </p>
    </div>
  );
}

export default function Auth({ mode }) {
  const copy = COPY[mode];
  const { startSession } = useAuth();
  const [params] = useSearchParams();

  const [username, setUsername] = useState(params.get("username") ?? "");
  const [identifier, setIdentifier] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const slow = useSlowHint(busy);

  useEffect(() => {
    document.title = `${copy.title} | Anonymzzz`;
  }, [copy.title]);

  const submit = async (event) => {
    event.preventDefault();
    if (mode === "register" && !USERNAME_PATTERN.test(username)) {
      setError("Pick a username with 3–20 letters, numbers, dots or underscores.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const session =
        mode === "login"
          ? await api("/auth/login", { method: "POST", body: { identifier, password } })
          : await api("/auth/register", { method: "POST", body: { username, email, password } });
      // Signed-out routes redirect to the inbox (or `state.from`) once this lands.
      startSession(session);
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <div className="flex flex-col px-4 py-4 sm:px-6">
        <div className="flex items-center justify-between">
          <Logo />
          <ThemeToggle />
        </div>

        <main className="flex flex-1 items-center justify-center py-10">
          <form onSubmit={submit} className="w-full max-w-sm" noValidate={mode === "login"}>
            <h1 className="text-4xl font-extrabold tracking-tight">{copy.title}</h1>
            <p className="mt-2 text-ink-soft">{copy.lead}</p>

            <div className="mt-8 space-y-5">
              {mode === "register" ? (
                <>
                  <UsernameField value={username} onChange={setUsername} />
                  <div>
                    <label htmlFor="email" className="label">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      className="field"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      autoComplete="email"
                      required
                    />
                    <p className="mt-1.5 text-sm text-ink-soft">Only used to log in. Never shown.</p>
                  </div>
                </>
              ) : (
                <div>
                  <label htmlFor="identifier" className="label">
                    Email or username
                  </label>
                  <input
                    id="identifier"
                    className="field"
                    value={identifier}
                    onChange={(event) => setIdentifier(event.target.value)}
                    autoComplete="username"
                    autoCapitalize="none"
                    spellCheck="false"
                    required
                  />
                </div>
              )}

              <div>
                <label htmlFor="password" className="label">
                  Password
                </label>
                <PasswordInput
                  id="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                  minLength={mode === "register" ? 6 : undefined}
                  required
                  aria-describedby={mode === "register" ? "password-hint" : undefined}
                />
                {mode === "register" && (
                  <p id="password-hint" className="mt-1.5 text-sm text-ink-soft">
                    At least 6 characters.
                  </p>
                )}
              </div>
            </div>

            {error && (
              <p role="alert" className="mt-5 rounded-xl bg-danger/10 px-4 py-3 text-sm font-medium text-danger">
                {error}
              </p>
            )}

            <button type="submit" className="btn-primary mt-6 w-full py-3 text-base" disabled={busy}>
              {busy && <Spinner className="size-4" />}
              {copy.submit}
            </button>
            {slow && (
              <p className="mt-3 text-center text-sm text-ink-soft" role="status">
                Waking the server up. This can take up to a minute.
              </p>
            )}

            <p className="mt-6 text-center text-ink-soft">
              {copy.switchText}{" "}
              <Link to={copy.switchTo} className="font-semibold text-ink underline underline-offset-4">
                {copy.switchLink}
              </Link>
            </p>
          </form>
        </main>
      </div>

      <aside
        className="relative hidden items-center justify-center overflow-hidden bg-lilac lg:flex"
        aria-hidden="true"
      >
        <div className="slip slip-tape w-[min(380px,70%)] -rotate-3 px-8 pt-10 pb-7">
          <p className="text-2xl leading-snug font-semibold">
            {mode === "login"
              ? "you have new notes waiting. go look 👀"
              : "finally. I've had something to tell you for months"}
          </p>
          <p className="mt-5 text-sm text-slip-soft">from someone, just now</p>
        </div>
      </aside>
    </div>
  );
}
