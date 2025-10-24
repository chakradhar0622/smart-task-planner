# Smart Task Planner — Local Development

Quick steps to run the app locally (Windows PowerShell):

1. Install dependencies:

```powershell
Set-Location -LiteralPath "E:\Projects\GoalBreakdown"
npm install
```

2. Start the dev server (enables Vite middleware and serves client + API):

```powershell
Set-Location -LiteralPath "E:\Projects\GoalBreakdown"
npm run dev
```

3. Open in your browser:

- Home: http://localhost:5000/
- Example test page: http://localhost:5000/about
- Unknown path (shows client 404): http://localhost:5000/does-not-exist

Notes
- The `dev` script uses `cross-env` so it works on Windows and Unix shells.
- If you see a PostCSS or browserslist warning, run the suggested update commands (optional).
- If the server fails to bind on port 5000, check for other listeners or change `PORT` env var before running:

```powershell
$env:PORT = '5001'
npm run dev
```

If you'd like, I can also:
- Add an npm script that runs the server in the background for testing, or
- Add a small smoke test to automatically hit `/` and `/about` after server start.

## Environment & API key

This project calls Gemini AI and requires an API key for production use. For local development there are two options:

- Provide a real API key by creating a `.env` file at the project root with:

```
GEMINI_API_KEY=your_real_key_here
PORT=5000
```

- Or rely on the built-in development mock: if `GEMINI_API_KEY` is not set and `NODE_ENV=development`, the server will return a deterministic mock plan so you can work on the UI without an API key.

Files added to help:

- `.env.example` — template for local environment variables.
- `.gitignore` updated to ignore `.env`.

Commands (PowerShell):

```powershell
# Install dependencies
npm install

# Typecheck
## Smart Task Planner

A small full-stack example that converts user goals into break-down task plans. The repo contains an Express server that serves an app built with React + Vite. The server can call Gemini AI (Google GenAI) to generate plans, but for local development a deterministic mock plan is returned when `GEMINI_API_KEY` is not configured.

This README focuses on getting you running locally, how the Gemini integration works, and common troubleshooting steps.

## Quick checklist (what I'll help you do)

- Install dependencies
- Configure environment variables (optional: `GEMINI_API_KEY`)
- Start the dev server (Express + Vite)
- Verify plan generation (mock in dev, real model if key present)

## Prerequisites

- Node.js (v18+ recommended)
- npm (comes with Node)

## Files to know

- `client/` — React app (Vite)
- `server/` — Express server, Vite middleware and API routes
- `shared/` — Zod schema shared between client and server
- `.env.example` — template for local environment variables

## Environment variables

Create a `.env` file in the project root (or set environment variables in your shell). Example values are in `.env.example`.

Required (for production / real Gemini):
- `GEMINI_API_KEY` — your Gemini / GenAI API key

Optional:
- `PORT` — port the Express server will listen on (default: `5000`)

Important: `.env` is ignored by Git (see `.gitignore`). Do not commit secrets.

## Installation

```powershell
Set-Location -LiteralPath "e:\Projects\GoalBreakdown"
npm install
```

## Development

Start the dev server (Express + Vite middleware). This serves both the API and the client on the same port.

```powershell
Set-Location -LiteralPath "e:\Projects\GoalBreakdown"
# default (PORT=5000 unless overridden)
npm run dev
```

If port 5000 is already in use, either free it or run on an alternate port:

```powershell
Set-Location -LiteralPath "e:\Projects\GoalBreakdown"
$env:PORT = '5001'
npm run dev
# or use the helper script: npm run dev:5001
```

Helpful scripts

- `npm run dev` — start server in development (reads `.env`)
- `npm run dev:5001` — start server on port 5001
- `npm run check-port` — check whether the configured port is free and print guidance
- `npm run check` — run TypeScript typecheck

## How Gemini integration behaves

- Development (default when `NODE_ENV=development`):
	- If `GEMINI_API_KEY` is not set, the server returns a deterministic mock plan so you can iterate on the UI.
	- This is intentional and logged to the server console: `Gemini API key not set — returning development mock plan.`

- Production (when `NODE_ENV !== 'development'`):
	- If `GEMINI_API_KEY` is missing or the key lacks permissions, the server returns a 503 JSON response with a clear message instructing you to set `GEMINI_API_KEY`.

If you want to test the real Gemini integration locally, set `GEMINI_API_KEY` in your session or a `.env` file (see below).

### Set GEMINI_API_KEY temporarily (PowerShell session)

```powershell
Set-Location -LiteralPath "e:\Projects\GoalBreakdown"
$env:GEMINI_API_KEY = 'your_real_key_here'
npm run dev
```

### Set GEMINI_API_KEY permanently (Windows user)

```powershell
setx GEMINI_API_KEY "your_real_key_here"
# then restart PowerShell
```

## API endpoints

- `POST /api/plan/generate` — request a plan. Body:

```json
{ "goal": "Write a blog post about productivity" }
```

Response: JSON `TaskPlan` when successful (either mock in dev or generated by Gemini in production).

- `GET /api/admin/env` — development-only endpoint that returns `{ nodeEnv, geminiConfigured }` so you can verify whether the server has picked up `GEMINI_API_KEY`.

## Example: test the API locally (PowerShell)

```powershell
Set-Location -LiteralPath "e:\Projects\GoalBreakdown"
$body = @{ goal = 'Build a personal website' } | ConvertTo-Json
Invoke-RestMethod -Uri http://localhost:5000/api/plan/generate -Method POST -Body $body -ContentType 'application/json'
```

If you see a JSON object with `tasks`, it worked. If you see a 503 with a message about Gemini, the key is missing or not permitted.

## Troubleshooting

- EADDRINUSE (port already in use):
	- Check which process holds the port:

	```powershell
	netstat -ano | Select-String ":5000"
	```

	- Kill a PID if appropriate (be careful):

	```powershell
	taskkill /PID <PID> /F
	```

	- Or run the dev server on a different port:

	```powershell
	$env:PORT='5001'; npm run dev
	```

- PostCSS / browserslist warnings: run the suggested commands in the terminal if you want the latest compatibility data:

```powershell
npx update-browserslist-db@latest
```

- If plan generation always returns the mock plan:
	- Confirm the server log at startup shows `GEMINI_API_KEY present: ...` masked value OR call the admin endpoint:

	```powershell
	Invoke-RestMethod -Uri http://localhost:5000/api/admin/env
	# { nodeEnv: 'development', geminiConfigured: true }
	```

	- If `geminiConfigured` is `false`, set `GEMINI_API_KEY` using the steps above.

## Build & Production

The `build` script bundles the client and the server entry point. Follow your usual deployment process and ensure `GEMINI_API_KEY` is set in your production environment. Example:

```powershell
npm run build
NODE_ENV=production node dist/index.js
```

Note: production deployment will attempt to call the real Gemini model and requires a valid key with the proper quota/permissions.

## Contributing

- Make changes on feature branches and open a PR with a short description.
- Don't commit secrets. Use `.env` locally and set secrets in your host's secret manager for deployments.

## License

MIT
