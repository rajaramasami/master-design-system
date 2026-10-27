---
'@rajaramasami/mds-tokens': minor
---

Figma code syntax now matches the generated code (Figma library v1.0.2).

- Compose colours are a `MDSColors` class with `Light` and `Dark` instances and a `LocalMDSColors` composition local, replacing the `MDSLightColors` and `MDSDarkColors` objects.
- Compose density adds `LocalMDSDensity`; SwiftUI density adds the `mdsDensity` environment value.
- New `dist/json/code-syntax.json`, and the token check fails if any Figma code syntax names something the build doesn't generate.
