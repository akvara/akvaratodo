# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

A single user: the app's owner/developer (confirmed single-user tool, no plans to open it to others). The hardcoded account (`config.user`, id `1`, name `akvara`) is this person. There's a secondary `bin/userakvara` script that rewrites `config.js` to switch the hardcoded user, suggesting the codebase is shared/forked rather than genuinely multi-tenant.

## Product Purpose

A personal, keyboard-first ToDo list manager built around the owner's own daily/weekly task-management habits rather than a generic todo app. It exists to make adding, reviewing, and rolling over daily tasks as fast as possible, with minimal UI chrome.

## Positioning

Three mechanisms future work must preserve, since they are what make the app fit this specific workflow (not a generic todo product):

- **Keyboard-first speed** — single-keystroke actions (`a` add, `r`/`l` reload, `t` today, `p` plan week, `>` collect past days, plus auto-assigned per-list hotkeys) let the owner operate the whole app without a mouse.
- **Daily rollover workflow** — "Today" and "Collect past days" automatically carry unfinished tasks forward across dated lists, so nothing has to be manually copied day to day.
- **Named/dated list system** — freeform list names, with a dash-naming convention (`"Project - sub"`) that auto-groups/contracts related lists in the Lists view, plus a separate "Protected" (immutable) list category that can't be deleted.

## Operating Context

- Used daily on desktop, via keyboard, to manage personal task lists (dated lists like "Day of week", ad-hoc named lists, and protected/immutable reference lists).
- Core flows: Lists page (create/open/remove lists, jump to Today, Plan week, Collect past days, Reload), Tasks page (add/check off/edit tasks within a list, export/import a list), Move page (move or copy a task to another list, a new list, or tomorrow's list).
- Dates and day/month names are localized in Lithuanian (`src/locale/lt.js`); most UI labels are in English.
- Frontend (React 16 + Redux + TypeScript + Vite) talks to a separate Flask API backend (`akvaratodo-flask-api`, hosted on Heroku); frontend is deployed to Netlify.

## Capabilities and Constraints

- Lists have tasks (`itemsToDo`) and completed tasks (`itemsDone`), stored/transmitted as JSON strings.
- Lists can be `immutable` ("Protected") and are excluded from deletion and from dash-grouping.
- Per-user settings exist (`openListIfExists`, `addNewAt`, `displayListLength`, `displayDoneLength`, `displayLast`) but are only exposed via hardcoded config, not a settings UI.
- `browserslist` targets broad legacy browser support (`not ie <= 11`), so no bleeding-edge-only CSS/JS should be assumed without checking.
- No automated tests exist yet (`npm test` is a placeholder); manual test checklist lives in README.md.

## Brand Commitments

None confirmed. No formal brand identity — "akvaratodo" is a personal/internal project name, not a public-facing brand.

## Evidence on Hand

No marketing copy, testimonials, or case studies — this is an internal personal tool, not a product with external evidence to preserve or fabricate.

## Product Principles

1. Speed for the owner beats generality for unknown users — every interaction should assume one expert user who knows the hotkeys.
2. Never make the owner re-type or re-file a task that should roll forward automatically.
3. Protected/immutable lists are sacred reference data — never make them as easy to lose as a regular list.
4. Minimal chrome over visual polish — this is a tool to move through quickly, not a surface to linger on.
