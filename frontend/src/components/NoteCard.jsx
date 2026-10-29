import { motion } from "motion/react";
import { PiShareNetworkBold, PiStarBold, PiStarFill, PiTrashBold } from "react-icons/pi";
import { fullDate, tiltFor, timeAgo } from "../lib/format";

export function NoteActions({ note, onStar, onShare, onDelete, size = "" }) {
  return (
    <div className="flex items-center gap-0.5">
      <button
        type="button"
        className={`icon-btn text-slip-ink/70 hover:bg-slip-ink/10 hover:text-slip-ink ${size}`}
        onClick={onStar}
        aria-pressed={note.starred}
        aria-label={note.starred ? "Unstar" : "Star"}
        title={note.starred ? "Unstar" : "Star"}
      >
        {note.starred ? <PiStarFill className="text-[#b7791f]" /> : <PiStarBold />}
      </button>
      <button
        type="button"
        className={`icon-btn text-slip-ink/70 hover:bg-slip-ink/10 hover:text-slip-ink ${size}`}
        onClick={onShare}
        aria-label="Share as image"
        title="Share as image"
      >
        <PiShareNetworkBold />
      </button>
      <button
        type="button"
        className={`icon-btn text-slip-ink/70 hover:bg-slip-ink/10 hover:text-slip-ink ${size}`}
        onClick={onDelete}
        aria-label="Delete"
        title="Delete"
      >
        <PiTrashBold />
      </button>
    </div>
  );
}

export default function NoteCard({ note, onOpen, ...actions }) {
  return (
    <motion.article
      layout
      initial={false}
      exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.15 } }}
      className="slip mb-5 break-inside-avoid"
      style={{ rotate: `${tiltFor(note.id)}deg` }}
    >
      <button
        type="button"
        onClick={onOpen}
        className="block w-full rounded-[3px] px-5 pt-5 pb-2 text-left"
        aria-label={`${note.read ? "" : "Unread note. "}Open note from ${timeAgo(note.createdAt)}`}
      >
        {!note.read && (
          <span className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-dusk px-2 py-0.5 text-xs font-semibold text-on-dusk">
            New
          </span>
        )}
        <p
          className={`line-clamp-6 text-[17px] leading-snug break-words whitespace-pre-line ${
            note.read ? "font-medium" : "font-bold"
          }`}
        >
          {note.text}
        </p>
      </button>
      <div className="flex items-center justify-between pr-2 pb-2 pl-5">
        <time dateTime={note.createdAt} title={fullDate(note.createdAt)} className="text-[13px] text-slip-soft">
          {timeAgo(note.createdAt)}
        </time>
        <NoteActions note={note} {...actions} size="size-9 text-[17px]" />
      </div>
    </motion.article>
  );
}
