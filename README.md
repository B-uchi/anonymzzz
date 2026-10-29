# Anonymzzz

Get honest notes. Nobody signs their name.

Make a link, share it anywhere, and read what people send you anonymously. Live at [anonymzzz.vercel.app](https://anonymzzz.vercel.app).

## Features

- **Your link** at `/u/<username>`, with a custom prompt ("Ask me anything", "Rate me 1–10", …)
- **Inbox** with unread/starred filters, search, mark-all-read and auto-refresh
- **Share as image**: turn any note into a 1080×1350 card for stories and posts
- **Pause your link** when you don't want new notes
- **Account settings**: change password, delete account and every note
- Light and dark themes, mobile-first layout, keyboard shortcuts (`/` to search, `Ctrl/⌘+Enter` to send)
- Old `/<username>/zzz` links keep working

## Privacy

Senders don't need an account and nothing ties a note to them. Note text is encrypted at rest with `ENCRYPTION_KEY` before it reaches the database. This is server-side encryption, not end-to-end: the server can decrypt notes to show them to their owner.

## Stack

- **Frontend:** React 19, React Router 7, Tailwind CSS 4, Motion, Vite
- **Backend:** Node, Express 5, MongoDB (Mongoose), JWT auth, rate limiting

## Running locally

```bash
# API
cd backend
cp .env.example .env   # fill in values
npm install
npm run dev            # http://localhost:5555

# Web
cd frontend
cp .env.example .env
npm install
npm run dev            # http://localhost:5173
```

## API

| Method | Path | Auth | |
| --- | --- | --- | --- |
| POST | `/auth/register` | | `{ username, email, password }` |
| POST | `/auth/login` | | `{ identifier, password }` (email or username) |
| GET | `/auth/me` | ✓ | |
| GET | `/profiles/:username` | | Public prompt and status |
| POST | `/profiles/:username/messages` | | `{ message }`, rate limited |
| GET | `/messages` | ✓ | |
| PATCH | `/messages/:id` | ✓ | `{ read?, starred? }` |
| DELETE | `/messages/:id` | ✓ | |
| POST | `/messages/read-all` | ✓ | |
| PATCH | `/account` | ✓ | `{ prompt?, acceptingMessages? }` |
| PUT | `/account/password` | ✓ | `{ currentPassword, newPassword }` |
| DELETE | `/account` | ✓ | `{ password }` |

v1 accounts stored messages inline on the user document. They're moved into the `messages` collection automatically the first time each user opens their inbox.
