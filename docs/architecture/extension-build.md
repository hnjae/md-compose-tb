---
updated: 2026-05-22
---

# Extension Build Architecture

## Summary

The product extension uses TypeScript compiled by `tsc` without Vite or another bundler. The build output is a static Thunderbird MailExtension directory under `dist/`, and the package output is an XPI archive under `artifacts/`.

## Rationale

The first implementation target is a background-driven Thunderbird extension. The extension does not yet need a bundled web UI, hot module replacement, CSS asset processing, or framework-specific page entrypoints. A plain TypeScript compile keeps the package layout close to the WebExtension runtime layout and makes Thunderbird-specific manifest behavior explicit.

If the extension later adds a substantial popup, options page, preview UI, or editor UI, a bundler can be introduced for those UI entrypoints while keeping the background/send pipeline explicit.

## Layout

```text
src/
  manifest.json
  background.ts
dist/
  manifest.json
  background.js
```

`src/manifest.json` is copied into `dist/manifest.json`. `src/background.ts` is compiled into `dist/background.js`.

`pnpm run xpi` creates `artifacts/md-compose-tb.xpi` from the contents of `dist/`. The package step uses the system `zip` command and intentionally does not add a JavaScript bundler. The `justfile` keeps thin wrappers around these package scripts for developer convenience.

## Constraints

The initial TypeScript configuration does not bundle modules. Background entrypoint code should remain self-contained until a bundling strategy is introduced. Production packages must not import code from `experiments/`.
