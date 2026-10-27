---
'@rajaramasami/mds-react': minor
---

Phase 3: overlays (matches Figma library v1.0.1).

- `Tooltip`: 4 placements, 300 ms delay, shows on keyboard focus, Esc hides it.
- `Popover`: titled, non-modal dialog with optional close and footer.
- `Menu`: items with icon, shortcut and Danger type; radio and checkbox items; section labels, separators and submenus; typeahead.
- `Select`: TextField anatomy with a Menu-style list, groups, error and disabled states.
- `Dialog` (sm, md, lg), `Drawer` (right, left; modal or not) and `BottomSheet` (drag the handle to dismiss), all over `Scrim`.
- Modals focus the first field, else the primary action, else Cancel when the primary is Danger; `data-autofocus` overrides.
- Overlays portal into the nearest `ThemeProvider`, so they keep its theme, brand, platform and density.
- Motion from the motion tokens (120/200/320 ms), off under reduced motion.
- `Button` exposes `data-variant`.
