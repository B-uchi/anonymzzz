import { Link } from "react-router";

export default function Logo({ to = "/" }) {
  return (
    <Link
      to={to}
      className="group inline-flex items-center gap-2 rounded-md text-[19px] font-extrabold tracking-tight text-ink"
    >
      <img src="/favicon.svg" alt="" className="size-7 transition-transform group-hover:-rotate-6" />
      anonymzzz
    </Link>
  );
}
