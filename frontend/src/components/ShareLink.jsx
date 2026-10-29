import { toast } from "sonner";
import { PiCopyBold, PiShareFatBold, PiWhatsappLogoBold, PiXLogoBold } from "react-icons/pi";
import { displayHost, profilePath, profileUrl } from "../lib/format";

export default function ShareLink({ username, prompt }) {
  const url = profileUrl(username);
  const inviteText = `${prompt} 👀 Send me an anonymous message:`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied");
    } catch {
      toast.error("Couldn't copy. Select the link and copy it manually.");
    }
  };

  const share = async () => {
    try {
      await navigator.share({ title: "Anonymzzz", text: inviteText, url });
    } catch (error) {
      if (error.name !== "AbortError") copy();
    }
  };

  const encoded = encodeURIComponent(`${inviteText} ${url}`);

  return (
    <div>
      <div className="flex items-center gap-2 rounded-2xl border border-line bg-surface p-1.5 pl-4">
        <a
          href={profilePath(username)}
          target="_blank"
          rel="noreferrer"
          className="min-w-0 flex-1 truncate font-semibold text-ink hover:underline"
          title="Open your public page"
        >
          <span className="text-ink-soft">{displayHost()}</span>
          {profilePath(username)}
        </a>
        <button type="button" className="btn-primary shrink-0 px-4 py-2" onClick={copy}>
          <PiCopyBold aria-hidden="true" />
          Copy
        </button>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {typeof navigator.share === "function" && (
          <button type="button" className="btn-outline px-4 py-2 text-sm" onClick={share}>
            <PiShareFatBold aria-hidden="true" />
            Share
          </button>
        )}
        <a
          className="btn-outline px-4 py-2 text-sm"
          href={`https://wa.me/?text=${encoded}`}
          target="_blank"
          rel="noreferrer"
        >
          <PiWhatsappLogoBold aria-hidden="true" />
          WhatsApp
        </a>
        <a
          className="btn-outline px-4 py-2 text-sm"
          href={`https://x.com/intent/post?text=${encoded}`}
          target="_blank"
          rel="noreferrer"
        >
          <PiXLogoBold aria-hidden="true" />
          Post
        </a>
      </div>
    </div>
  );
}
