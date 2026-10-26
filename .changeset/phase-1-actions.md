---
'@rajaramasami/mds-react': minor
'@rajaramasami/mds-tokens': minor
---

Phase 1: Button and IconButton (matches Figma library v1.0.0).

- `Button`: the 5 Figma variants (primary, primary-tinted, secondary, danger, ghost), 3 sizes, leading and trailing icons, `loading` (spinner replaces the leading icon, label kept), `disabled`, and `asChild` for links.
- `IconButton`: the 4 Figma variants, 3 square sizes, required `label` as the accessible name, `loading`.
- Interaction states `hovered`, `pressed`, `unavailable` and `loading` as Tailwind variants, shared with Storybook.
- `Icon`: `filled` now accepts any icon name and only applies to the 12 icons with a filled glyph.
