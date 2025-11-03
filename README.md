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
