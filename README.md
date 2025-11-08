# LoLo – Your Reflective League Coach

LoLo turns raw match logs into an actionable post-game huddle. It stitches together Riot Games telemetry, AWS Bedrock reasoning, and a React-powered experience so players can understand the _why_ behind their performance instead of just staring at spreadsheets. Use this guide to spin up the full stack, explore the major workflows, and learn how each package fits together. Add visual callouts wherever you see `(screenshot)`.

---

## Why Players Love It

- Personalized recaps highlight momentum, slump warnings, and habits worth reinforcing.
- AI-authored improvement plans adapt to your champion pool and recent trends.
- Shareable cards let you flex highlights on socials without leaving the dashboard `(screenshot)`.
- Coach-mode router keeps navigation calm and focused, even when juggling dozens of matches `(screenshot)`.

---

## Monorepo at a Glance

- `client`: Vite + React 19 SPA that renders the coaching flows, powered by TanStack Query and motion-enhanced UI primitives.
- `server`: Hono HTTP server that aggregates Riot data, orchestrates AWS Bedrock prompts, and exposes REST endpoints.
- `shared`: TypeScript utilities, DTOs, and constants consumed by both sides for type-safe handshakes.
- `turbo.json`: Defines a multi-package task graph so you can develop, lint, and build each workspace in isolation or together.

---

## Quick Start (Local Sandbox)

1. **Install core tooling**

```bash
npm install -g pnpm@9
pnpm install
```

2. **Fill in environment variables**
   Copy `.env.example` (create one if needed) into both `server/.env` and `client/.env`. Use the table below for required keys.
3. **Launch both services**

```bash
pnpm run dev
```

Turbo spawns the Vite client at `http://localhost:5173` and the Hono API at `http://localhost:3000`. 4. **Sign in with a Riot ID**
Enter your Riot ID + tagline in the home screen tag input, pick a region, and start your first reflective session.

---

## Environment Checklist

| Variable          | Lives In      | Purpose                                                 | Example                                  |
| ----------------- | ------------- | ------------------------------------------------------- | ---------------------------------------- |
| `VITE_SERVER_URL` | `client/.env` | Points the SPA at the API gateway.                      | `http://localhost:3000`                  |
| `PORT`            | `server/.env` | Customizes the Hono server port.                        | `3000`                                   |
| `RIOT_API_KEY`    | `server/.env` | Auth token for Riot Match v5 endpoints.                 | `RGAPI-xxxx`                             |
| `BEDROCK_REGION`  | `server/.env` | AWS region hosting your Bedrock model.                  | `us-east-1`                              |
| `AWS_MODEL_ID`    | `server/.env` | Bedrock model identifier (Nova Micro JSON recommended). | `anthropic.claude-3-haiku-20240307-v1:0` |
| `FRONTEND_URL`    | `server/.env` | CORS allow-list when deploying.                         | `https://your-domain.app`                |

Keep AWS credentials accessible via standard environment variables (for example `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`) so Bedrock calls can assume the right role.

---

## What You Can Do

- **Analyze**: Generate context-aware strengths, focus areas, and practice plans from the last 20 matches. Each prompt pulls event timelines, champion metadata, and player trends.
- **Summarize**: Quickly recap recent ranked sessions with W/L, CS, KP, damage deltas, and role trends.
- **Compare Pros**: Contrast your build and macro pacing against curated pro benchmarks using the `pro` routes.
- **Share Moments**: Export pre-built recap cards to PNG through `html-to-image`, ready to drop into Discord or socials.

---

## Under the Hood

| Layer                 | Highlights                                                                                                                                |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| **Routing**           | React Router 7 orchestrates feature routes; Hono handles REST endpoints with Zod validators and rate limiting.                            |
| **Data Flow**         | TanStack Query caches API calls, persisting via Async Storage so you can refresh without losing context.                                  |
| **LLM Orchestration** | Bedrock prompts wrap Riot timelines into structured JSON; responses feed directly into coaching cards.                                    |
| **Telemetry**         | Shared constants ensure Riot queue, tier, and champion mappings remain in sync across services.                                           |
| **Deployment**        | SST drives infrastructure-as-code for AWS Lambda and API Gateway. The `deploy` script builds server + shared before running `sst deploy`. |

---

## Everyday Commands

```bash
# Spin up everything with hot reload
pnpm run dev

# Focus on a single workspace
pnpm run dev:client
pnpm run dev:server

# Ensure code quality
pnpm run lint
pnpm run type-check

# Production build
pnpm run build

# Ship to AWS via SST (requires credentials and warm Bedrock config)
pnpm run deploy
```

---

## Testing the Experience

1. Launch the dev stack with `pnpm run dev`.
2. Visit `http://localhost:5173`.
3. Search for a Riot ID that has match history.
4. Open the Analyze tab to generate strengths and focus areas `(screenshot)`.
5. Export a recap card and confirm the PNG downloads `(screenshot)`.

---

## Contributing Workflow

- Create a feature branch from `dev` and keep it synced with upstream.
- Run `pnpm run lint && pnpm run type-check` before opening a PR.
- Add or update docs in `internal-docs/` when you introduce new coaching heuristics.
- Document new environment keys in the table above so deployment stays painless.

---

## License

MIT License © 2025 LoLo Team. See `LICENSE` for details.

# LoLo

**LoLo** is an AI powered League of Legends companion designed for reflective performance review rather than data overload. It provides post match insights, pre match planning, and trend based growth tracking. Built during the **Rift Rewind Hackathon 2025**, LoLo merges [Riot Games Match v5 API](https://developer.riotgames.com/docs/lol) data with AI reasoning to generate simple, actionable feedback instead of static stats.

---

## Overview

LoLo processes player match data through a multi stage system, fetch, feature extraction, reasoning, and visualization. The AI learns from your play history and offers next step advice rather than traditional analytics. Each reflection is concise, contextual, and shaped by an adaptive coach persona.

---

## Technologies and Libraries

- [Hono](https://hono.dev/) lightweight web framework for both frontend and backend routing.
- [Axios](https://axios-http.com/) request client with interceptors and cancel tokens.
- [React Query](https://tanstack.com/query/latest) data fetching and caching for React UIs.
- [AWS Lambda](https://aws.amazon.com/lambda/) compute and scalability.
- [AWS S3](https://aws.amazon.com/s3/) JSON caching and static file hosting.
- [OpenAI API](https://platform.openai.com/docs/api-reference) or [Anthropic API](https://docs.anthropic.com/) reasoning and habit generation.
- [Riot Games API](https://developer.riotgames.com/docs/lol) real match data.
- [Data Dragon](https://developer.riotgames.com/docs/lol#data-dragon) champion, item, and ability metadata.
- [Serverless Framework](https://www.serverless.com/) Lambda deployment automation.
- [Vite](https://vitejs.dev/) fast frontend build tool.
- [TypeScript](https://www.typescriptlang.org/) strong typing for both client and server.

---

## Project Structure

```bash
LoLo/

bun.lock
CONTRIBUTING.md
LICENSE
package.json
README.md
tsconfig.json
turbo.json
pnpm-workspace.yaml
client/
  eslint.config.js
  index.html
  package.json
  README.md
  tsconfig.app.json
  tsconfig.json
  tsconfig.node.json
  vite.config.ts
  public
  src/
    App.css
    App.tsx
    index.css
    main.tsx
    vite-env.d.ts
    assets
server/
  package.json
  README.md
  tsconfig.json
  src/
    server.ts
shared/
  package.json
  tsconfig.json
  src/
    index.ts
    types/
      index.ts
```

---

## Key Features

- **Instant Account Lookup UI:** A responsive Tag Input flow that splits Riot ID + tagline, lets players pick a region, and calls the account service for profile data and splash art.
- **Ranked Match Digest Cards:** Scroll-driven stat blocks highlight wins, kills, time played, pentas, and more, all powered by the statistics endpoint.
- **Champion Mastery Spotlight:** Desktop and mobile layouts showcase the top champions with matches, win rate, and mastery pulled from Riot mastery APIs.
- **Role Trend Dashboard:** Interactive charts focus on the player’s most played role, visualizing per-month KP, damage, CS, and vision metrics.
- **Shareable Recap Cards:** Frontend exports polished overview, champion spotlight, and pro-comparison cards to PNG via `html-to-image`, so players can flex their progress anywhere.
- **AI Improvement Endpoint:** Backend Bedrock Nova Micro JSON prompts package match timelines into strengths and improvement focuses, ready to surface in the Analyze experience.

---

## Architecture Summary

| Layer     | Responsibility                                |
| --------- | --------------------------------------------- |
| Fetch     | Retrieve and cache Riot API match data        |
| Extractor | Convert raw events to compact feature sets    |
| Agent     | Reason about habits and suggest focus areas   |
| UI        | Present reflections and growth card summaries |

---

## Branding

- **Primary Color:** `#535AFF`
- **Typography:** [Inter](https://fonts.google.com/specimen/Inter)
- **Mascot:** Calm Poro with idle, thinking, and resting states

---

## License

MIT License © 2025 LoLo Team
