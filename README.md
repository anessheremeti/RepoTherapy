# 🔥 RepoTherapy

> AI-powered GitHub profile roaster. Enter a username, pick a style, get professionally destroyed.

---

## What it does

RepoTherapy fetches a GitHub user's public profile — repos, languages, stars, commit patterns, bio — and feeds it to an AI model that produces a fully personalised roast. Every result includes:

- **Developer archetype** — a short, cutting title for what kind of developer you are
- **Roast** — headline + body, specific to your actual repos and stats
- **Strengths & Red Flags** — two-column breakdown
- **Scorecard** — three animated metric tiles (Commit Discipline, Tutorial Addiction, Bug Summoning)
- **Career Advice** — one sentence of brutal honesty

Three roast styles available:

| Style | Tone |
|---|---|
| 😇 Friendly | Warm mentor energy, gently humorous |
| 👔 Corporate | McKinsey buzzword hell, passive-aggressive performance review |
| 💀 Brutal | Zero patience, savage precision, technically specific |

Shared links always show the **exact same roast** — results are persisted to a SQLite database keyed by a unique ID. Opening `/roast/abc123` on any device, in any browser, returns the original generation.

---

## Getting started

### Prerequisites

- Node.js 18+
- A GitHub Personal Access Token (Settings → Developer settings → Fine-grained tokens → read-only public repos)
- A Groq API key — free at [console.groq.com](https://console.groq.com)

### Setup

```bash
# 1. Clone
git clone https://github.com/anessheremeti/RepoTherapy.git
cd RepoTherapy

# 2. Install dependencies
cd client && npm install
cd ../server && npm install

# 3. Configure the server environment
cp server/.env.example server/.env
# Edit server/.env and fill in your keys:
#   GITHUB_TOKEN=your_github_token_here
#   GROQ_API_KEY=your_groq_api_key_here

# 4. Run both servers (two terminals)
# Terminal 1 — backend (port 5000)
cd server && npm run dev

# Terminal 2 — frontend (port 3000)
cd client && npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment variables

| Variable | Required | Description |
|---|---|---|
| `GITHUB_TOKEN` | Yes | GitHub PAT — used to avoid rate limiting on the public API |
| `GROQ_API_KEY` | Yes | Groq AI key — free tier is sufficient |
| `PORT` | No | Server port, defaults to `5000` |
| `CLIENT_ORIGIN` | No | CORS origin, defaults to `http://localhost:3000` |

---

## Architecture

```
client (Vite + React)          server (Express + Node.js)
      │                                │
      │  POST /api/roast/generate      │
      │ ─────────────────────────────► │  fetchGitHub()
      │                                │  generateRoast() via Groq
      │                                │  saveRoast() → SQLite
      │  { id, ...roastData }          │
      │ ◄───────────────────────────── │
      │                                │
      │  navigate('/roast/:id')        │
      │  (Router state = data,         │
      │   zero second fetch)           │
      │                                │
      │  GET /api/roast/:id            │
      │ ─────────────────────────────► │  getRoastById() ← SQLite
      │  (only on fresh/shared URL)    │
```

Roasts are stored in `server/data/roasts.db` (SQLite, WAL mode). Each row has a random 11-character URL-safe ID (`crypto.randomBytes`). The file survives server restarts, so shared links stay valid indefinitely.

---

## What I would do with more time

1. **Public feed on the home page** — a live ticker of recent roasts so new visitors see real examples immediately, which also proves the app works before they commit to entering a username.

2. **Rate limiting** — one generation per IP per minute to prevent API abuse and Groq quota burns.

3. **Roast regeneration** — a "Re-roast" button that forces a new generation and saves it as a separate entry (keeping the original link intact).

4. **OG image generation** — dynamic social preview cards per roast ID so shared links render the roast headline and avatar when pasted into Slack, Twitter, iMessage.

5. **PostgreSQL + Litestream** — replace local SQLite with a replicated setup for true multi-instance deployment without rethinking the data access layer.

---

## Prompts used (Claude Code)

This project was built iteratively using Claude Code (claude-sonnet-4-6). Below are the key prompts, in the order they were used.

---

**1. Initial build — fix the roast button and wire up real AI**

```
act as the best software developer in the world, this app is about entering a
github repo and then roasting it when i press roast it nothing happens, so fix
that make it dynamic.

AI should analyze the profile and give: roast, strengths, developer archetype,
funny scorecards, survival tips.

Rules:
1) must be all dynamic data
2) no hardcode data
3) implement it with best practices
```

---

**2. Switch from repo input to GitHub username**

```
Detyr e ai osht qe kur e shkruan duhet me shkru profilin jo emrin e repos
(the task of ai is that when you enter it you should enter the profile not
the repo name)
```

---

**3. Loading states**

```
after the user submits the form it should show:
"Scanning README delusion levels..."
and also loading states with best practices
```

---

**4. Fix double-fetch on navigation**

```
once i click roast and once its redirecting me to the profile its like waiting
for 1 or 2 milliseconds and then refetching again, fix this problem with best
practices — analyse code
```

---

**5. Change AI response structure**

```
Return STRICT JSON:
{
  "developerType": "",
  "roastHeadline": "",
  "roast": "",
  "strengths": [],
  "redFlags": [],
  "careerAdvice": "",
  "scores": {
    "commitDiscipline": 0-100,
    "tutorialAddiction": 0-100,
    "bugSummoning": 0-100
  }
}
```

---

**6. Redesign the scorecard**

```
implement the Roast scorecards with best practices.
Rules:
1) must be best practices for ui/ux
2) dynamic data
3) keep it simple, not complicated
```

---

**7. Roast style selector**

```
Add a roast style selector that allows users to choose between three distinct
roast modes before generating their GitHub roast:

😇 Friendly Roast — warm, encouraging, gently humorous
👔 Corporate Roast — performance review meets LinkedIn cringe
💀 Brutal Roast — no mercy, full roast, zero survivors

The selected roast style must significantly influence the tone, wording, jokes,
and overall personality of the generated roast.
```

---

**8. Share button**

```
also add a button at the roast screen that allows me as a user to share the
roast with others who are not using the web, implement this with the best
practices as a software developer, dont make it complicated keep it simple
```

---

**9. Share bug — content regenerating on shared links**

```
the issue is still there — the content should be the same after i press share
because when i paste into the url the app is generating another roast. fix
this issue.
```

---

**10. Production-grade sharing architecture**

```
Act as a senior software architect and full-stack engineer with expertise in
React, Node.js, API design, database architecture, and scalable application
development.

Design and implement a robust sharing architecture so that shared links always
display the exact same generated roast content that was originally created.
Ensure the solution works across different browsers, devices, and user sessions.
Follow modern software engineering principles: scalability, maintainability,
security, performance optimization, clean architecture, separation of concerns.
```

---

**11. README, prompts, and thoughtful touches**

```
continue implementing:
- Clear README — how to run it, what it does, what you would do with more time
- The Claude Code prompts you used, pasted in the README. Show your work.
- One thoughtful touch — error state, empty state, a nice loading message —
  something that shows you cared.
- Honest commit history. Do not squash to look slick; we want to see how you
  actually worked.
```

---

## Tech stack

**Frontend**
- React 18 + React Router 6
- Vite
- Tailwind CSS (custom dark theme)
- Axios

**Backend**
- Node.js 22 (ESM)
- Express
- better-sqlite3 (WAL mode)
- Groq SDK — `llama-3.3-70b-versatile`
- GitHub REST API

---

## Project structure

```
github-roaster/
├── client/
│   └── src/
│       ├── pages/
│       │   ├── Home.jsx          # username input + style selector
│       │   ├── Results.jsx       # generation loading screen → redirects
│       │   └── RoastView.jsx     # permanent shareable result page
│       └── components/
│           ├── RoastStyleSelector.jsx
│           └── ProfileInput.jsx
└── server/
    ├── data/                     # SQLite DB (gitignored)
    └── src/
        ├── db.js                 # database setup + schema
        ├── services/
        │   ├── github.js         # GitHub API client
        │   ├── ai.js             # Groq integration + prompts
        │   └── roastStore.js     # roast persistence (save / get by id)
        └── routes/
            └── roast.js          # POST /generate · GET /:id
```
