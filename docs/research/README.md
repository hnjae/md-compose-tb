# Research

Research documents record what was investigated before committing to product behavior or architecture.

Use this directory for:

- Thunderbird MailExtension API behavior and constraints;
- browser and mail-client compatibility checks;
- PoC plans and observed results;
- implementation feasibility notes;
- risks that must be resolved before writing a spec.

Each research document should state the question being answered, summarize the current conclusion, link to primary sources where possible, and record enough detail for another contributor to repeat or challenge the finding. If a PoC exists, link to its directory under `experiments/` and record the tested Thunderbird version, compose mode, inputs, and observed result.

Move stable user-facing decisions into `docs/spec/`. Move stable implementation structure into `docs/architecture/`. Research notes can remain as historical context, but they should not be the only place where committed product behavior is defined.
