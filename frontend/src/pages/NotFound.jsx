import { Link } from "react-router";
import Logo from "../components/Logo";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col px-4 py-4 sm:px-6">
      <Logo />
      <main className="flex flex-1 flex-col items-center justify-center text-center">
        <div className="slip slip-tape -rotate-2 px-10 pt-10 pb-8">
          <p className="text-6xl font-extrabold">404</p>
        </div>
        <h1 className="mt-10 text-3xl font-extrabold tracking-tight">This page doesn&apos;t exist</h1>
        <p className="mt-2 text-ink-soft">The link may be mistyped, or the page has moved.</p>
        <Link to="/" className="btn-primary mt-8">
          Go to the home page
        </Link>
      </main>
    </div>
  );
}
