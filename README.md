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
    index.ts
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

- **Coach Persona:** Adaptive AI mentor that adjusts tone and focus with time.
- **Pre Match Plan:** Builds a short strategic checklist from your past ten games.
- **Post Match Debrief:** Extracts key behavioral patterns and one improvement habit.
- **Season Arc Card:** JSON driven progress snapshot visualized in a compact summary UI.
- **Calm Mascot, Poro:** Animated companion that represents composure and growth.

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
