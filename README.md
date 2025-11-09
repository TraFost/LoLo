# LoLo – Your Reflective League Coach

LoLo turns raw match logs into an actionable post-game huddle. It stitches together Riot Games telemetry, AWS Bedrock reasoning, and a React-powered experience so players can understand the _why_ behind their performance instead of just staring at spreadsheets. Use this guide to spin up the full stack, explore the major workflows, and learn how each package fits together.

---

## Why Players Love It

- Personalized recaps highlight momentum, slump warnings, and habits worth reinforcing.
- AI-authored improvement plans adapt to your champion pool and recent trends.
- Shareable cards let you flex highlights on socials without leaving the dashboard.
- Coach-mode router keeps navigation calm and focused, even when juggling dozens of matches.

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
4. Open the Analyze tab to generate strengths and focus areas.
5. Export a recap card and confirm the PNG downloads.

---

## License

MIT License © 2025 LoLo Team. See `LICENSE` for details.

---

## Legal Notice

LoLo isn't endorsed by Riot Games and doesn't reflect the views or opinions of Riot Games or anyone officially involved in producing or managing Riot Games properties. Riot Games, and all associated properties are trademarks or registered trademarks of Riot Games, Inc.

Artwork and imagery sourced from Riot Games' Data Dragon service (`https://ddragon.leagueoflegends.com`) and pro player portraits hosted by OP.GG (`https://s-qwer.op.gg/images/...`) are used under Riot's fan content guidelines.
