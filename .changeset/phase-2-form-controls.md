---
'@rajaramasami/mds-react': minor
---

Phase 2: form controls (matches Figma library v1.0.0).

- `TextField`: 3 sizes; Default, Hover, Focus, Filled, Error, Disabled and Read-only states; prefix and suffix icons, or a custom `suffix` such as a show-password IconButton; `hideLabel` for visually hidden labels.
- `Textarea`: grows with its content from `textarea/min-height`; optional character counter that announces the limit once.
- `FieldMessage`: Helper, Success, Warning and Error tones; non-helper tones always show their icon.
- `Checkbox` and `CheckboxGroup`: checked, unchecked and indeterminate; the whole row is the target; a group error marks every box.
- `RadioGroup` and `Radio`: arrow-key selection, vertical or horizontal; group error and description.
- `Switch`: platform-sized track and thumb (36×20 web, 51×31 iOS, 52×32 Android).
- Labels, descriptions and errors are wired with `aria-describedby` and `aria-invalid` automatically.
