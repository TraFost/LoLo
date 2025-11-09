# LoLo Shared – Types & Utilities Hub

The shared workspace keeps client and server perfectly aligned. It exposes TypeScript DTOs, constants, and helper functions that model Riot data and LoLo-specific responses. Treat it as the single source of truth for cross-cutting contracts.

---

## What Lives Here

- **Types**: `src/types/` holds request/response interfaces for account, analyze, statistics, sharing, and pro comparison flows.
- **Constants**: `src/constants/` captures queue IDs, map data, and match metadata needed on both sides.
- **HTTP helpers**: `src/http-status/` re-exports status codes for consistent error handling.
- **Axios wrapper**: `src/lib/axios.ts` configures interceptors and base options shared across services.

---

## Building & Watching

```bash
# Compile once (runs automatically before server builds)
pnpm --filter shared run build

# Watch for contract changes while developing
pnpm --filter shared run dev
```

Turbo ensures downstream packages (client, server) rebuild when `shared` emits a new output.

---

## Workflow Tips

- Update the shared types **before** consuming new fields in the client or server.
- Export factory helpers for complex objects to keep DTO creation consistent.
- Coordinate version bumps by running `pnpm install` at the repo root so lockfiles stay in sync.
- When documenting a new contract, include a concise example payload and note which UI surfaces consume it.

---

## Publishing Strategy

- This workspace is private and consumed via `workspace:*` references; no npm publish required.
- Every production deploy (`pnpm run deploy`) builds `shared` first to guarantee type parity.
- Keep breaking changes well-documented in PRs and `internal-docs/` so feature teams can plan updates.

---

Happy typing! Keep the shared layer lean, predictable, and strongly typed.
