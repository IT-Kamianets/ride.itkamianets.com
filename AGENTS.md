# Agent Guide

This repository contains a single Angular 21 website for a HoReCa business. It is a static, prerender-first marketing website with a few simple pages such as home, menu, about, contacts, gallery, reservation, delivery, or events.

## Quick Reference

- Stack: Angular 21, TypeScript 5, Angular SSR/prerender, Tailwind CSS, SCSS
- Package manager: `npm`
- Main goal: fast, clean, SEO-friendly HoReCa landing pages
- Primary output: prerendered static site from `dist/app/browser`

## Universal Rules

- Treat this repo as a marketing website first, not as a complex application shell.
- Prefer simple, static, content-first pages over heavy abstractions.
- Preserve prerender compatibility by default.
- Keep changes small, clear, and easy to review.
- Prefer Tailwind for layout, spacing, typography, sizing, responsive behavior, and utility styling.
- Use local page content/config over new services unless reuse is real and repeated.
- Do not introduce CMS, API fetching, dashboards, or heavy state management unless explicitly requested.

## Default Technical Stance

Use these as defaults unless the local code or the task gives a concrete reason to do otherwise:

- Angular 21 modern patterns only.
- Standalone components are the default. Do not add NgModules for new work.
- Use `changeDetection: ChangeDetectionStrategy.OnPush` on new or touched components.
- Use signals for local UI state and derived state.
- Prefer native control flow (`@if`, `@for`, `@switch`) in templates.
- Use Angular bindings instead of manual DOM work.
- Use `NgOptimizedImage` for static images when feasible.
- Keep browser-only code guarded so prerender remains safe.

## Decision Memory

Durable repo-wide rules belong in `.ai/decisions/`, not duplicated ad hoc across docs or task notes.

Read `.ai/decisions/index.md` when:

- a task changes a long-lived repo convention
- a task resolves an ambiguity likely to come up again
- you are unsure whether a rule is temporary guidance or a durable policy

## Read Only What You Need

Start here, then open only the one or two relevant files in `.ai/`:

- `.ai/onboarding.md`
- `.ai/architecture.md`
- `.ai/code-style.md`
- `.ai/content-pages.md`
- `.ai/seo.md`
- `.ai/media.md`
- `.ai/tooling.md`
- `.ai/task-execution.md`

Suggested loading order:

1. `AGENTS.md`
2. one or two relevant `.ai` guides
3. `.ai/decisions/index.md` only if the task may affect durable policy

## Template Bootstrap Reminder

This repo is a template. When a user asks to "change SEO", "rebrand the site", "prepare the template", or similar, do not stop at route meta only.

At minimum, inspect these surfaces and update the ones that still contain template values:

- `src/data/company.json` for shared company name, title, description, and image
- `src/app/app.config.ts` for global metadata defaults that consume company data
- `src/app/app.routes.ts` for per-page `data.meta` overrides
- `src/index.html` for seed title/meta/canonical/social tags that should match the real project
- `src/assets/` for replaceable brand assets such as `logo.png` and `favicon.png`
- `CNAME` for the production domain
- `src/environments/environment.prod.ts` for `companyId` and any public runtime defaults that still point to template/demo values

Also check visible content so headings, hero copy, contacts, and CTA text stay aligned with the SEO metadata.
