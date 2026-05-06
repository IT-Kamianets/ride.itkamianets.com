# 2026-05-06 Route Meta Defaults Policy

## Status

Accepted

## Context

The app uses `@wawjs/ngx-core` metadata handling with route-driven updates.

Without an explicit repo rule, agents may:
- forget to add route metadata for new pages
- override shared metadata with empty strings
- duplicate brand information in page titles
- split SEO logic between routes, components, and static files

## Decision

Use this metadata structure by default:

- app-wide defaults live in `provideNgxCore({ meta: { ... } })` in `src/app/app.config.ts`
- shared brand metadata comes from `src/data/company.json`
- new pages set page-specific metadata in route `data.meta`
- routes should override only the fields they actually need
- routes must not set empty-string values for `title`, `description`, `image`, or `robots`
- the home route may set `titleSuffix: ''` when the default title already equals the brand name

## Consequences

- page creation stays predictable for both humans and agents
- shared SEO defaults remain centralized
- page routes communicate intent clearly
- prerender-friendly metadata stays declarative and easy to review
