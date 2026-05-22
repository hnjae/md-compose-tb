# Experiments

This directory contains reproducible PoC code used to answer product and architecture questions before implementation. Experiment code is not product code and must not be imported by production packages.

An experiment should be committed only when it is useful for later verification, documents a platform behavior, or supports a decision recorded under `docs/research/`, `docs/spec/`, or `docs/architecture/`.

Each experiment should keep its scope narrow and include:

- a short README with the question being tested;
- minimal setup and run instructions;
- expected observations or a link to the research document where results are recorded;
- no credentials, account-specific data, real message content, or user-private data.

Experiments should be deleted when the question is no longer relevant, or promoted into product code only through a normal implementation change that includes the relevant spec or architecture updates.
