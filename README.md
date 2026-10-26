# Master Design System

One design system for every product I build: design tokens and React components that mirror the
[Figma library](https://www.figma.com/design/1Uekteu5rjD24j283aFKIg) one to one.

| Package | What it is |
| --- | --- |
| [`@rajaramasami/mds-tokens`](packages/tokens) | The 406 Figma variables as CSS variables, a Tailwind v4 theme, Swift and Jetpack Compose files |
| [`@rajaramasami/mds-react`](packages/react) | React components on Radix UI, styled only with the semantic tokens |
| [`apps/storybook`](apps/storybook) | Docs site with a toolbar for every Figma mode |

## How it works

```
Figma variables ──► token JSON (W3C DTCG) ──► Style Dictionary ──┬─► CSS variables ──┐
  (406, 5 collections)                                           ├─► Tailwind v4 ────┴─► React components
                                                                 ├─► Swift (iOS)
                                                                 └─► Compose (Android)
```

Each Figma collection becomes an attribute, so switching a mode is one attribute change, no rebuild:

| Figma collection | Modes | In code |
| --- | --- | --- |
| Color | Light, Dark | `data-theme`, defaulting to the system setting |
| Brand | One per product | `data-brand` swaps the brand ramp; semantic tokens follow |
| Platform | Web, iOS, Android | `data-platform`; iOS and Android values also go to Swift and Compose |
| Density | Compact, Comfortable | `data-density` |

`<ThemeProvider>` sets these for you, and providers can be nested.

## Getting started

Needs Node 20+ and pnpm 10.

```bash
pnpm install
pnpm build        # tokens, then the React package
pnpm storybook    # docs site on http://localhost:6006
pnpm test         # token checks and component tests
```

## Updating tokens from Figma

1. Re-export the variables into `packages/tokens/figma-export/variables.json`.
2. `pnpm tokens:import` rewrites the DTCG files in `packages/tokens/src/`.
3. `pnpm --filter @rajaramasami/mds-tokens test` rebuilds every output and checks that all 406 tokens are present, every reference resolves and 114 colour pairs pass WCAG 2.2 AA in light and dark. A failing check blocks the pull request.

## Adding a product brand

Override the brand ramp only. Every button, link and focus ring follows.

```css
[data-brand='carepath'] {
  --mds-brand-primary-50: #…;
  /* … 100 to 950 */
}
```

Check that white text on your `600` step reaches 4.5:1. Light brand colours need dark text instead.

## Releasing

`pnpm changeset` describes a change; merging to `main` and running `pnpm release` publishes to npm.
Each changelog entry names the Figma library version it matches.

## Roadmap

| Phase | Scope | Status |
| --- | --- | --- |
| 0 Foundations | Tokens, ThemeProvider, icons, Storybook, CI | Done |
| 1 Actions | Button, IconButton | Next |
| 2 Form controls | TextField, Textarea, FieldMessage, Checkbox, Radio, Switch | Planned |
| 3 Overlays | Popover, Tooltip, Menu, Select, Dialog, Drawer, BottomSheet, Scrim | Planned |
| 4 Data display and feedback | Card, Badge, Tag, Avatar, ListRow, Alert, Toast, ProgressBar, Spinner, Skeleton, EmptyState | Planned |
| 5 Navigation | Tabs, Breadcrumbs, Pagination, Stepper, Sidebar, TopBar, TabBar | Planned |

Designed and built by Raja R, Lead Product Designer.
