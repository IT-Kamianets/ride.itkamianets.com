# Onboarding Guide

## Project Overview

This repository contains one Angular website for a HoReCa business.

Typical goals:
- present the brand clearly
- show menu and key offers
- make contacts and location easy to find
- support reservations, delivery, or events if needed
- rank well in search
- load fast on mobile

This is not a complex dashboard or product app. Treat it as a prerender-first marketing website.

## Start Here

Read in this order unless the task is extremely narrow:

1. `AGENTS.md`
2. this file
3. the one or two `.ai` guides relevant to the task

Do not read everything by default.

## First Things To Understand

- there is only one website in this repo
- the repo-level defaults live in `AGENTS.md`
- the website is static-first and SEO-oriented
- pages should stay simple and content-driven
- users need quick access to menu, hours, address, phone, delivery, reservation, and important offers
- mobile experience matters more than fancy effects

## What To Inspect Before Editing

- the nearest existing page
- shared layout pieces such as header, footer, topbar, hero, CTA, contact section
- existing route structure
- current styling approach with Tailwind and local SCSS
- current SEO/meta setup if the task affects page content or structure

## What To Avoid

- do not restate repo-wide policy in task-specific notes
- do not overengineer static sections
- do not introduce unnecessary services or state
- do not hide important business information inside images only
- do not add heavy motion, sliders, or effects unless requested
- do not break prerender compatibility
