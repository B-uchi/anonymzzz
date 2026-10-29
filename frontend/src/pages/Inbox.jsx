import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router";
import { AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { PiChecksBold, PiCopyBold, PiMagnifyingGlassBold, PiPauseCircleBold } from "react-icons/pi";
import { useAuth } from "../lib/auth";
import { useMessages } from "../lib/useMessages";
import { shareMessageImage } from "../lib/shareCard";
import { fullDate } from "../lib/format";
import ShareLink from "../components/ShareLink";
import NoteCard, { NoteActions } from "../components/NoteCard";
import Dialog, { ConfirmDialog } from "../components/Dialog";
import Loading from "../components/Loading";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "unread", label: "Unread" },
  { id: "starred", label: "Starred" },
];

function EmptyState({ filter, query }) {
  let title = "Your inbox is empty";
  let body = "Share your link above. Notes people send will show up here.";
  if (query) {
    title = "No matches";
    body = `Nothing in this view contains “${query}”.`;
  } else if (filter === "unread") {
    title = "You're all caught up";
    body = "New notes will appear here until you open them.";
  } else if (filter === "starred") {
    title = "No starred notes";
    body = "Star the notes you want to keep and find them here.";
  }
  return (
    <div className="rounded-3xl border-2 border-dashed border-line px-6 py-16 text-center">
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="mx-auto mt-2 max-w-sm text-ink-soft">{body}</p>
    </div>
  );
}

export default function Inbox() {
  const { user } = useAuth();
  const { messages, error, refresh, update, remove, markAllRead } = useMessages();
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const searchRef = useRef(null);

  const unread = messages?.filter((m) => !m.read).length ?? 0;
  const openNote = messages?.find((m) => m.id === openId);

  useEffect(() => {
    document.title = unread ? `(${unread}) Inbox | Anonymzzz` : "Inbox | Anonymzzz";
  }, [unread]);

  // "/" jumps to search, like most inboxes.
  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "/" && !event.target.closest("input, textarea, dialog")) {
        event.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return (messages ?? []).filter(
      (m) =>
        (filter === "all" || (filter === "unread" ? !m.read : m.starred)) &&
        (!needle || m.text.toLowerCase().includes(needle))
    );
  }, [messages, filter, query]);

  const open = (note) => {
    setOpenId(note.id);
    if (!note.read) update(note.id, { read: true });
  };

  const share = async (note) => {
    const id = toast.loading("Making your image");
    try {
      const result = await shareMessageImage({
        text: note.text,
        prompt: user.prompt,
        username: user.username,
      });
      if (result === "downloaded") toast.success("Image saved to your downloads", { id });
      else toast.dismiss(id);
    } catch {
      toast.error("Couldn't create the image. Try again.", { id });
    }
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await remove(deleteId);
      if (openId === deleteId) setOpenId(null);
      setDeleteId(null);
      toast.success("Note deleted");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDeleting(false);
    }
  };

  const actionsFor = (note) => ({
    onStar: () => update(note.id, { starred: !note.starred }),
    onShare: () => share(note),
    onDelete: () => setDeleteId(note.id),
  });

  return (
    <main className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
      <section className="grid grid-cols-1 gap-8 pt-4 pb-12 lg:grid-cols-[1fr_1.1fr] lg:items-end">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Hi, {user.username}</h1>
          <p className="mt-2 text-lg text-ink-soft">
            {messages === null
              ? "Checking for notes…"
              : unread
                ? `You have ${unread} unread ${unread === 1 ? "note" : "notes"}.`
                : messages.length
                  ? "You've read everything. Share your link for more."
                  : "Share your link to start getting notes."}
          </p>
        </div>

        <div className="min-w-0 rounded-3xl bg-lilac/50 p-5 sm:p-6">
          {!user.acceptingMessages && (
            <p className="mb-4 flex items-start gap-2 rounded-xl bg-surface px-4 py-3 text-sm">
              <PiPauseCircleBold className="mt-0.5 shrink-0 text-lg text-dusk" aria-hidden="true" />
              <span>
                Your link is paused, so nobody can send you notes.{" "}
                <Link to="/settings" className="font-semibold underline underline-offset-2">
                  Turn it back on
                </Link>
              </span>
            </p>
          )}
          <div className="mb-3 flex items-baseline justify-between gap-3">
            <p className="min-w-0 truncate font-semibold" title={user.prompt}>
              “{user.prompt}”
            </p>
            <Link to="/settings" className="shrink-0 text-sm text-ink-soft underline underline-offset-2 hover:text-ink">
              Edit prompt
            </Link>
          </div>
          <ShareLink username={user.username} prompt={user.prompt} />
        </div>
      </section>

      <section aria-labelledby="inbox-heading">
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <h2 id="inbox-heading" className="mr-auto text-2xl font-bold">
            Notes
            {messages?.length ? <span className="ml-2 text-ink-soft">{messages.length}</span> : null}
          </h2>

          <div role="tablist" aria-label="Filter notes" className="flex rounded-full bg-ink/[0.06] p-1">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                role="tab"
                aria-selected={filter === f.id}
                onClick={() => setFilter(f.id)}
                className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors ${
                  filter === f.id ? "bg-surface text-ink shadow-sm" : "text-ink-soft hover:text-ink"
                }`}
              >
                {f.label}
                {f.id === "unread" && unread > 0 && <span className="ml-1.5 text-dusk">{unread}</span>}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-56">
            <PiMagnifyingGlassBold className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-ink-soft" aria-hidden="true" />
            <input
              ref={searchRef}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search notes"
              aria-label="Search notes"
              className="field rounded-full py-2 pl-10 text-sm"
            />
          </div>

          {unread > 0 && (
            <button type="button" className="btn-ghost px-3 py-2 text-sm" onClick={markAllRead}>
              <PiChecksBold aria-hidden="true" />
              Mark all read
            </button>
          )}
        </div>

        {messages === null && !error ? (
          <Loading label="Loading your notes" />
        ) : error && messages === null ? (
          <div className="rounded-3xl border border-line px-6 py-14 text-center">
            <h3 className="text-xl font-bold">Couldn&apos;t load your notes</h3>
            <p className="mt-2 text-ink-soft">{error}</p>
            <button type="button" className="btn-primary mt-6" onClick={() => refresh()}>
              Try again
            </button>
          </div>
        ) : visible.length === 0 ? (
          <EmptyState filter={filter} query={query.trim()} />
        ) : (
          <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
            <AnimatePresence initial={false}>
              {visible.map((note) => (
                <NoteCard key={note.id} note={note} onOpen={() => open(note)} {...actionsFor(note)} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </section>

      <Dialog open={Boolean(openNote)} onClose={() => setOpenId(null)} labelledBy="note-title">
        {openNote && (
          <div className="slip slip-tape px-6 pt-9 pb-4 sm:px-8">
            <h2 id="note-title" className="sr-only">
              Note
            </h2>
            <p className="max-h-[60dvh] overflow-y-auto text-xl leading-snug font-semibold break-words whitespace-pre-line sm:text-2xl">
              {openNote.text}
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-between gap-2">
              <time dateTime={openNote.createdAt} className="text-sm text-slip-soft">
                {fullDate(openNote.createdAt)}
              </time>
              <div className="flex items-center gap-0.5">
                <button
                  type="button"
                  className="icon-btn text-slip-ink/70 hover:bg-slip-ink/10 hover:text-slip-ink"
                  aria-label="Copy text"
                  title="Copy text"
                  onClick={() =>
                    navigator.clipboard
                      .writeText(openNote.text)
                      .then(() => toast.success("Note copied"))
                      .catch(() => toast.error("Couldn't copy the note."))
                  }
                >
                  <PiCopyBold />
                </button>
                <NoteActions note={openNote} {...actionsFor(openNote)} />
              </div>
            </div>
          </div>
        )}
      </Dialog>

      <ConfirmDialog
        open={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
        busy={deleting}
        title="Delete this note?"
        body="It'll be gone for good. There's no way to get it back."
        confirmLabel="Delete note"
      />
    </main>
  );
}
