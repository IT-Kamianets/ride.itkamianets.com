# Content And Page Patterns

## Purpose

This repo is for HoReCa business pages. Content should support real visitor needs quickly.

## Typical Pages

Common page types:
- home
- menu
- about
- contacts
- gallery
- delivery
- reservation
- events / banquets / catering
- loyalty / special offers

## Home Page Priorities

A good home page usually makes these clear fast:
- what the place is
- what makes it special
- where it is
- how to contact it
- how to reserve or order
- what key products or experiences are offered

## Menu Page Rules

- make categories easy to scan
- keep names and prices readable
- show highlights or signatures clearly
- do not overcomplicate filters unless needed
- keep mobile readability high

## Contacts Page Rules

Important information should be easy to find:
- address
- phone
- working hours
- map/location
- reservation or booking action
- delivery details if relevant

## Gallery Rules

- prefer a small number of strong images over many weak ones
- use images that help users understand atmosphere, dishes, and interior
- keep gallery useful, not decorative noise

## Events / Banquets / Catering

If such pages exist, they should answer:
- what kinds of events are supported
- capacity or format
- what is included
- how to inquire or book

## CTA Principles

Strong CTA examples for HoReCa:
- reserve a table
- view menu
- call now
- order delivery
- ask about events

Keep CTAs visible and clear without being aggressive.

## New Page Checklist

When adding a new page:

- create the page under `src/app/pages/<page-name>/`
- add a clean route in `src/app/app.routes.ts`
- give the route a specific `data.meta.title`
- add `data.meta.description` when the page has a distinct search/user intent
- inherit shared `image` and `robots` from app defaults unless the page needs different values
- keep the page content aligned with the route metadata so title, description, heading, and visible copy tell the same story
