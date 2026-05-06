# SEO Guide

## Purpose

This website should be easy for search engines to understand and useful for local business discovery.

## Template SEO Workflow

This repository is a template. SEO work often overlaps with rebranding and project bootstrap.

When the task is phrased as "change SEO", "update brand metadata", "prepare template for a client", or similar, inspect this checklist instead of changing only one file:

- `src/data/company.json`
  Shared brand SEO values used by the app fallback: company name, title, description, image.
- `src/app/feature/company/company.interface.ts`
  Update only when the shape of `company.json` changes.
- `src/app/feature/company/company.const.ts`
  Keep `EMPTY_COMPANY` aligned when the company shape changes.
- `src/app/app.config.ts`
  Global metadata defaults wired through `provideNgxCore({ meta.defaults })`.
- `src/app/app.routes.ts`
  Per-page route metadata such as page-specific titles and descriptions.
- `src/index.html`
  Seed HTML title, description, author, robots, canonical, Open Graph, Twitter, and favicon links.
- `src/assets/`
  Replace template brand assets such as `logo.png`, `favicon.png`, and any public share images if present.
- `CNAME`
  Production domain for deployed static hosting.
- `src/environments/environment.prod.ts`
  Public bootstrap values such as `companyId` and other template defaults.

When changing SEO, also verify that visible page content still matches the metadata:

- the main H1 should agree with the page title intent
- hero and intro copy should support the description
- business name, location, contacts, and service type should be real text when relevant
- CTA labels should match the business goal

## Core SEO Rules

- every page should have a clear unique title
- every page should have a meaningful description
- keep headings structured and readable
- use semantic HTML where possible
- keep important business information in crawlable text, not only in images

## Local SEO

Where relevant, include:
- business name
- city / area
- address
- phone
- hours
- cuisine / service type
- reservation, delivery, or event keywords only when truthful

## Content Rules

- write naturally for users first
- avoid keyword stuffing
- keep page copy specific to the business
- make sure core selling points appear in real text
- do not bury important content below decorative sections

## Technical Direction

- keep routes clean
- preserve prerender compatibility
- avoid content that appears only after unnecessary client-side logic
- ensure internal links are easy to follow

## Route Meta Pattern

This repo uses app-level metadata defaults and route-level overrides.

- keep shared defaults in `provideNgxCore({ meta.defaults })` in `src/app/app.config.ts`
- source shared brand metadata from `src/data/company.json`
- when adding a new page route, fill `data.meta` only with page-specific overrides
- do not set empty strings for `title`, `description`, `image`, or `robots` in route data
- let pages inherit shared `description`, `image`, and `robots` unless the page truly needs its own values
- use `titleSuffix` intentionally:
  - default pages can rely on the global suffix
  - the home route may set `titleSuffix: ''` to avoid repeating the brand name

## `index.html` Expectations

Treat `src/index.html` as the static seed document that should already look valid before Angular applies route-level metadata.

- replace template brand strings, URLs, canonical, and social image URLs
- keep robots consistent with the project environment
- update favicon references when brand assets change
- adjust values there rather than deleting the tags unless the project has a clear replacement strategy

## Asset Expectations

Brand assets under `src/assets/` are part of SEO and project bootstrap, not just UI polish.

- replace `logo.png` when the project brand changes
- replace `favicon.png` when the project brand changes
- keep asset filenames stable when possible to reduce unnecessary code churn
- if filenames change, update every reference such as `src/index.html`, `src/data/company.json`, and templates using `ngSrc`

## Done Criteria

An SEO task is not complete just because route meta changed.

Consider the task complete only when the relevant surfaces are aligned:

- shared company data
- route metadata
- seed HTML metadata
- brand assets
- deployment domain
- visible page copy

Example route pattern:

```ts
{
	path: 'about',
	loadComponent: () => import('./pages/about/about.component').then((m) => m.AboutComponent),
	data: {
		meta: {
			title: 'About',
			description: 'Learn about the restaurant, team, and hospitality style.',
		},
	},
}
```

## Page Intent

Each page should serve one clear search/user intent:
- home -> brand and overview
- menu -> dishes and categories
- contacts -> reach and location
- events -> private events / catering / banquet information
