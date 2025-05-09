Given this repository, please produce a deep architectural analysis that is specific to a client-side (frontend) application.

1 - Entry-point bootstrapping
 • Locate and describe the main entry files (e.g., index.html, main.js/ts, index.tsx, App.vue), the bundler/runtime that mounts them, and the exact call stack from first byte → root component render.

2 - Component & route topology
 • Draw the component tree starting at the root. Highlight page-level components and each registered route (React Router, Vue Router, Angular routes, etc.).

3 - Critical user flows
 • For each major route or interactive feature, trace the sequence: user event → state change → re-render → side-effects.
 • Note where navigation, modals, or global UI state are triggered.

4 - State & data layer
 • Identify state-management solutions (Redux, Context, Zustand, MobX, Vuex, Pinia, NgRx, etc.), how they are wired, and the data-flow direction (unidirectional, bidirectional).
 • Show where remote data is fetched (REST, GraphQL, SWR/React-Query/Apollo) and any caching, optimistic updates, or error handling.

5 - Side-effect orchestration
 • Map custom hooks, effects, sagas, thunks, observables, or services that perform I/O, subscriptions, or timers.

6 - Performance-sensitive paths
 • Indicate lazy-loaded chunks, dynamic imports, Web Workers, memoization boundaries, expensive renders, and any code-splitting strategy.

7 - Styling & assets pipeline
 • Explain how styling is organized (CSS/SCSS modules, CSS-in-JS, Tailwind, etc.), theming, and critical-path CSS.
 • Describe the asset build chain (images, fonts, SVG icons) and where they are imported.

8 - Build / test / CI hooks
 • Summarize linting, formatting, unit/integration/E2E tests, and any pre-commit or CI steps that affect runtime behavior.

9 - Call-stack snapshots
 • Provide a concise stack trace for
a) the initial render, and
b) one representative user interaction (e.g., clicking “Submit”)—highlighting which functions/components fire and in what order.
*10 - Risk & opportunity assessment
 • List architectural hotspots, anti-patterns, dead code, duplicated logic, or optimization opportunities.
