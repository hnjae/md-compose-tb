# Repository Instructions

## Documentation

- Keep architecture documents in `docs/architecture/`.
- Keep user-facing product and behavior specifications in `docs/spec/`, not internal implementation details.
- Write all documentation in a concise, technical style.
- Use Mermaid for diagrams when diagrams are needed.
- Do not hard-wrap prose in Markdown files. Keep ordinary paragraphs and list items on a single source line unless Markdown syntax or structured blocks require line breaks.

## Spec-Driven Workflow

- Follow Spec-driven development: document product behavior and externally visible behavior decisions in `docs/spec/`.
- If behavior changes, update the relevant specification before changing code.
- Update architecture documents when a change affects system structure, package boundaries, dependencies, or major implementation strategy.
- Commit documentation updates before starting code changes for the same behavior change.
- When discussing architecture or feature ideas, advise on UX fit and product risks, implementation complexity and tradeoffs, and suitable architecture options before proposing implementation.

## Commands

- Install dependencies: `pnpm install`.
- Run checks: `devenv tasks run ci:check`
- Format files: `devenv shell -- treefmt`
- Type-check: `pnpm run typecheck`.

## Commits

- Use Conventional Commits for all commit messages.
- Use a Conventional Commit scope when a clear scope exists.
- When a task is complete and the user has not said otherwise, commit the changes.
