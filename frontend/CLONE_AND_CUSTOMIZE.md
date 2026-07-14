# Clone & Customize — turn 如意 into your own admin system

This repo is built as a **reusable, general-purpose management-system starter**. The goal:
copy it, change a few files, and ship a branded admin within hours.

## 1. Rebrand the look (no code changes)
All visual identity lives in **one file**: `frontend/src/theme/tokens.ts`.

| Token group | What to change |
| --- | --- |
| `color.canvas` / `color.panel` | background ink / panel base |
| `color.primary` / `jade` / `cyan` / `gold` / `violet` | accent palette |
| `aurora.c1..c4` | the drifting mesh-gradient background stops |
| `glass.bg` / `glass.blur` / `glass.border` | frosted-glass surface |
| `shadow.*` | elevation + glow |
| `radius.*` | corner rounding |
| `motion.*` | durations / easing / drift speed |
| `layout.headerH` / `sidebarW` | the fixed shell dimensions |

Edit values → the whole app re-themes. Nothing else to touch.

## 2. Add a feature page (à la carte)
Each feature is a **self-contained module** under `frontend/src/pages/<feature>/`.

```
pages/Reports/
  index.tsx          # the page (uses shared components + mock/<feature>.ts)
  components/         # page-local widgets, if any
```

Steps:
1. Create `pages/Reports/index.tsx` using `PageContainer`, `SectionTitle`, `GlassCard`, `StatTile`, `TrendBars`, `FadeUp`.
2. Add fixtures in `mock/reports.ts` (typed).
3. Register the route in `src/router.tsx` (`<Route path="/reports" element={<ReportsPage/>} />`).
4. Add a nav item in `src/layouts/AdminShell.tsx` (`NAV` array: `{ key:'/reports', icon:<.../>, label:'报表' }`).

That's it — sidebar, routing, and theme are wired automatically.

## 3. Component library (reuse across projects)
`frontend/src/components/` is the shared kit. Copy the whole folder into a new project:

- `ui/`      → primitives: `GlassCard`, `StatTile`, `SectionTitle`, `FadeUp`
- `charts/`  → `TrendBars` (dependency-free CSS bar chart)
- `common/`  → `AuroraBackground`, `PageContainer`

Conventions (so the kit stays reusable):
- **Tokens, not literals** — components read `theme/tokens.ts`; never hardcode a color.
- **Compose, don't fork** — pass `props` (title/icon/data/delay), don't branch on feature.
- **One responsibility** — a component does one thing; pages assemble them.
- **Mock behind a hook** — pages read data via `hooks/useMock` so swapping to a real API
  later requires no page changes (replace the hook body).

## 4. Connect a real backend later
- `frontend/src/hooks/useMock.ts` is the single seam. Replace its body with an `axios`
  call (the `backend/` Gin API is already built) — page signatures stay identical.
- Vite proxies `/api` → backend (see `vite.config.ts`, `VITE_API_HOST`).

## 5. Keep it lean
- Unused features: delete their `pages/<feature>/` + `mock/<feature>.ts` + nav item.
- The starter ships Dashboard/Users/Documents/AI/Chat/Search/Settings as examples — remove
  what you don't need.
