import { displayHost, profilePath } from "./format";

const WIDTH = 1080;
const HEIGHT = 1350;
const FONT = '"Bricolage Grotesque", system-ui, sans-serif';

const COLORS = {
  bg: "#b9b6e7",
  dusk: "#484672",
  ink: "#1e1b3a",
  slip: "#fcefa1",
  slipInk: "#2a2611",
  tape: "rgba(243, 241, 251, 0.75)",
};

function wrap(ctx, text, maxWidth) {
  const lines = [];
  for (const paragraph of text.split(/\n+/)) {
    let line = "";
    for (const word of paragraph.split(/\s+/).filter(Boolean)) {
      const attempt = line ? `${line} ${word}` : word;
      if (ctx.measureText(attempt).width <= maxWidth || !line) {
        line = attempt;
      } else {
        lines.push(line);
        line = word;
      }
    }
    if (line) lines.push(line);
  }
  return lines;
}

// Shrinks the type until the note fits inside the slip.
function fitText(ctx, text, maxWidth, maxHeight) {
  for (let size = 68; size >= 30; size -= 4) {
    ctx.font = `600 ${size}px ${FONT}`;
    const lineHeight = size * 1.28;
    const lines = wrap(ctx, text, maxWidth);
    if (lines.length * lineHeight <= maxHeight) return { lines, size, lineHeight };
  }
  ctx.font = `600 30px ${FONT}`;
  const lineHeight = 30 * 1.28;
  const maxLines = Math.floor(maxHeight / lineHeight);
  const lines = wrap(ctx, text, maxWidth);
  const clipped = lines.slice(0, maxLines);
  if (lines.length > maxLines) clipped[maxLines - 1] += "…";
  return { lines: clipped, size: 30, lineHeight };
}

async function drawCard({ text, prompt, username }) {
  await Promise.all([
    document.fonts.load(`600 48px ${FONT}`),
    document.fonts.load(`800 48px ${FONT}`),
  ]).catch(() => {});

  const canvas = document.createElement("canvas");
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = COLORS.bg;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  ctx.fillStyle = COLORS.dusk;
  ctx.font = `800 46px ${FONT}`;
  ctx.textBaseline = "top";
  const promptLines = wrap(ctx, prompt, WIDTH - 200).slice(0, 2);
  promptLines.forEach((line, i) => ctx.fillText(line, 100, 110 + i * 58));

  // The slip
  const slip = { x: 100, y: 300, w: WIDTH - 200, h: 780 };
  ctx.save();
  ctx.translate(WIDTH / 2, slip.y + slip.h / 2);
  ctx.rotate((-1.6 * Math.PI) / 180);
  ctx.translate(-WIDTH / 2, -(slip.y + slip.h / 2));
  ctx.shadowColor = "rgba(30, 27, 58, 0.25)";
  ctx.shadowBlur = 40;
  ctx.shadowOffsetY = 18;
  ctx.fillStyle = COLORS.slip;
  ctx.fillRect(slip.x, slip.y, slip.w, slip.h);
  ctx.shadowColor = "transparent";

  ctx.fillStyle = COLORS.tape;
  ctx.save();
  ctx.translate(WIDTH / 2, slip.y);
  ctx.rotate((-3 * Math.PI) / 180);
  ctx.fillRect(-110, -26, 220, 52);
  ctx.restore();

  const pad = 80;
  const { lines, lineHeight } = fitText(ctx, text, slip.w - pad * 2, slip.h - pad * 2 - 60);
  ctx.fillStyle = COLORS.slipInk;
  const blockHeight = lines.length * lineHeight;
  const startY = slip.y + (slip.h - 60 - blockHeight) / 2;
  lines.forEach((line, i) => ctx.fillText(line, slip.x + pad, startY + i * lineHeight));

  ctx.font = `500 30px ${FONT}`;
  ctx.fillStyle = "rgba(42, 38, 17, 0.6)";
  ctx.fillText("from someone", slip.x + pad, slip.y + slip.h - pad - 10);
  ctx.restore();

  ctx.fillStyle = COLORS.ink;
  ctx.font = `500 32px ${FONT}`;
  ctx.fillText("Send me one anonymously at", 100, HEIGHT - 170);
  ctx.font = `800 40px ${FONT}`;
  ctx.fillText(`${displayHost()}${profilePath(username)}`, 100, HEIGHT - 124);

  return new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
}

// Returns "shared", "downloaded" or "cancelled".
export async function shareMessageImage(details) {
  const blob = await drawCard(details);
  const file = new File([blob], "anonymzzz-note.png", { type: "image/png" });

  if (navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file] });
      return "shared";
    } catch (error) {
      if (error.name === "AbortError") return "cancelled";
    }
  }

  const url = URL.createObjectURL(blob);
  const link = Object.assign(document.createElement("a"), {
    href: url,
    download: file.name,
  });
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  return "downloaded";
}
