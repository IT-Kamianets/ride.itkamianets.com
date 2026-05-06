- Status: accepted
- Date: 2026-05-05
- Area: feature data
- Owners: team
- Related tasks: bootstrap fallback normalization
- Related files: src/app/feature/bootstrap, src/app/feature/company, src/data, .ai/architecture.md
- Supersedes:
- Superseded by:

## Context

This repo is mostly static, but a small set of features can be hydrated from the bootstrap API. Those features still need deterministic prerender-safe fallback data when the API is unavailable or a feature payload is empty.

## Decision

Bootstrap-backed features use this resolution order:

1. API bootstrap payload
2. local fallback JSON in `src/data`
3. explicit empty value in code

Feature conventions:

- each bootstrap-backed feature service owns its state signals and a loading signal
- object features use `src/data/<feature>.json`, for example `src/data/company.json`
- array features use plural JSON file names, for example `src/data/jobs.json`
- bootstrap resolution treats `undefined`, `null`, empty strings, empty objects, and empty arrays as empty values

## Consequences

- fallback content is reviewable without scanning environment files
- environment files stay limited to public runtime configuration
- new bootstrap-backed features should be added with three explicit pieces: service state, local JSON fallback, and empty fallback value

## Alternatives Considered

Keeping fallback business payloads in `environment.prod.ts` was rejected because it mixes runtime config with content and makes future feature setup less predictable.
