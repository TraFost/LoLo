# LoLo Server – Hono + AWS Bedrock Backend

The server workspace powers every coaching insight surfaced in the LoLo dashboard. Built with Hono, it fetches Riot data, persists caches to S3, and orchestrates AWS Bedrock prompts that transform timelines into strengths, focus areas, and practice plans. This README walks you through setup, routes, and extension points.

---

## Capabilities

- REST endpoints for account lookup, match statistics, AI analysis, and shareable recap assets.
- Riot API integration with cache-friendly utilities and queue/tier normalization.
- AWS Bedrock Nova prompts that return structured JSON suitable for frontend rendering.
- Rate limiting, logging middleware, and schema validation via Zod to keep the API reliable.

---

## Environment Setup

Create `server/.env` with the following keys:

```
PORT=3000
RIOT_API_KEY=RGAPI-your-token
BEDROCK_REGION=us-east-1
AWS_MODEL_ID=anthropic.claude-3-haiku-20240307-v1:0
FRONTEND_URL=http://localhost:5173
```

In addition, export your AWS credentials (for example `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`) so the Bedrock SDK can authenticate.

---

## Install & Run

```bash
# From the monorepo root
pnpm install

# Start the backend in watch mode
pnpm run dev:server

# Build once for deployment
pnpm run build:server
```

The dev entrypoint (`src/dev.ts`) spins up the Hono server on the configured port with hot reloading via `tsx`.

---

## Key Routes

| Method | Path                          | Description                                                                   |
| ------ | ----------------------------- | ----------------------------------------------------------------------------- |
| `GET`  | `/account/:gameName/:tagLine` | Fetches account profile, rank, and icon metadata.                             |
| `GET`  | `/statistics/:puuid`          | Returns aggregate match stats, role trends, and champion mastery summaries.   |
| `POST` | `/analyze/:puuid`             | Generates AI-driven strengths, focus areas, and practice plans using Bedrock. |
| `POST` | `/pro/:puuid`                 | Compares player metrics against curated pro data for the same role.           |
| `POST` | `/share-image/:puuid`         | Prepares shareable recap cards and stores them for download.                  |

All routes are validated with the schemas in `src/schemas/` and use service modules under `src/services/` for core logic.

---

## Code Map

- `src/server.ts`: Production entrypoint (used by SST deployments).
- `src/configs/`: Configuration helpers for environment variables, CORS, rate limiting, and Bedrock clients.
- `src/lib/llm/`: Prompt builders and response formatters for Nova models.
- `src/agents/`: Domain-specific reasoning agents (player analyst, practice plan, pro comparison).
- `src/routes/`: Route registrations that compose validators, middlewares, and services.
- `src/middlewares/`: Logging and validation utilities wired into the Hono pipeline.
- `src/constants/`: Override lists and curated data (for example pro name mappings).

---

## Observability & Logging

- `logger.middleware.ts` wraps incoming requests with structured logs.
- Add domain-level breadcrumbs inside services to trace Riot + Bedrock interactions.
- Describe new dashboard or API observability panels directly in the documentation.

---

## Deployment Notes

- SST handles bundling and provisioning Lambda + API Gateway resources.
- `pnpm run deploy` builds `shared` and `server`, then runs `sst deploy --stage production`.
- Ensure your AWS IAM role has permissions for Bedrock InvokeModel, S3 access, and CloudWatch logging.
- Set `FRONTEND_URL` to your hosted client domain so CORS remains tight.

---

## Extending the API

1. Define request/response schemas in `src/schemas/` using Zod.
2. Implement business logic in a new service under `src/services/`.
3. Wire the route in `src/routes/`, applying rate limiter and validator middlewares.
4. Update `shared` types if the payload is consumed by the client.
5. Document the addition in `internal-docs/` and add tests or manual QA steps.

---

Build confidently and keep the coaching insights flowing.

To install dependencies:

```sh
bun install
```

To run:

```sh
bun run dev
```

open http://localhost:3000
