# LoLo Client – Coaching Dashboard Frontend

This Vite + React 19 workspace renders the LoLo coaching experience. It turns Riot match data, Bedrock insights, and shared DTOs into a motion-rich interface that feels like a post-game locker room debrief. Use this guide to install, explore, and extend the UI.

---

## Feature Highlights

- Guided Riot ID lookup with region picker and input validation overlays `(screenshot)`.
- Analyze flow with collapsible cards, practice-plan accordions, and export-ready recap banners.
- TanStack Query caching with persistence for offline refresh resilience.
- Tailwind CSS v4 + utility-first atoms/molecules for consistent theming.

---

## Prerequisites

- Node.js 20+
- pnpm 9 (root package manager)
- Server workspace running locally (default `http://localhost:3000`)

---

## Environment Setup

Create `client/.env` with:

```
VITE_SERVER_URL=http://localhost:3000
```

Adjust the URL when pointing to a staged API gateway.

---

## Everyday Commands

```bash
# Install dependencies from the monorepo root
pnpm install

# Run the client with hot module reload
pnpm run dev:client

# Type-check and lint before pushing changes
pnpm --filter client run lint
pnpm --filter client exec tsc -b

# Ship a production bundle into dist/
pnpm run build:client

# Preview the optimized build locally
pnpm --filter client run preview
```

When using `turbo dev --filter=client`, Turbo will watch shared packages automatically so updates show up in the browser without manual rebuilds.

---

## File System Tour

- `src/core/app/`: Layout shell, route registration, and global providers (query client, theming, router bindings).
- `src/features/`: Vertical slices (analyze, summarize, team, etc.) with co-located components, constants, and hooks.
- `src/ui/`: Reusable atoms, molecules, and organisms designed to compose quickly with Tailwind classes.
- `src/providers/query.provider.tsx`: Configures TanStack Query caching and persistence strategies.
- `public/`: Icons, fonts, and shareable assets surfaced throughout the dashboard.

---

## Working With Data

1. Components use `shared` TypeScript DTOs so API responses stay strongly typed.
2. Queries live under each feature slice to keep fetching logic near its UI.
3. Axios is wrapped by `shared/src/lib/axios.ts` to inject headers, handle errors, and respect cancel tokens.
4. Motion-heavy sections (like role trends) use `recharts` and `motion` for smooth transitions.

---

## UX Writing & Screenshots

When you add a new screen, capture a walkthrough `(screenshot)` and document the intent inside the feature folder README or `internal-docs/`. The coaching voice should stay calm, encouraging, and actionable.

---

## Extending the Frontend

1. Create or extend a feature slice under `src/features/<topic>`.
2. Model API contracts in `shared` if the response shape is new.
3. Add route wiring in `src/core/app/router.app.tsx` and link it from `layout.app.tsx`.
4. Update TanStack Query keys so caching stays consistent.
5. Write a short QA checklist covering loading, empty, and error states.

---

Happy building! Keep the coaching experience focused, concise, and encouraging.

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x';
import reactDom from 'eslint-plugin-react-dom';

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
});
```
