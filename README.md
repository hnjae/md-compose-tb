# MD Compose for Thunderbird

## Development

Install dependencies with `pnpm install`.

Use `pnpm run typecheck` to run TypeScript checks, `pnpm run build` to create the unpacked extension in `dist/`, and `pnpm run xpi` to create `artifacts/md-compose-tb.xpi`. The XPI command requires the system `zip` command. The `justfile` exposes matching wrappers for common developer workflows.

## License

### Logo

The extension logo and toolbar icon are based on OpenMoji `E25D` ("edit") by Kai Wanschura / OpenMoji, licensed under `CC-BY-SA-4.0`.

The source SVG files are stored under [`assets/openmoji/`](assets/openmoji/).
