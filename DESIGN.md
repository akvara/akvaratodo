---
name: akvaratodo
description: A keyboard-first personal ToDo list manager, built for one user's daily/weekly workflow
colors:
  ink: "#171717"
  paper: "#f5f8fa"
  fog: "#EFEFEF"
  alert-red: "red"
typography:
  body:
    fontFamily: "Raleway, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.6
rounded:
  sm: "4px"
components:
  button-primary:
    backgroundColor: "{colors.fog}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "4px 12px"
---

# Design System: akvaratodo

## Overview

**Creative North Star: "The Field Notebook"**

akvaratodo is a tool you reach for dozens of times a day without ever looking at the chrome. It is built on top of Bootstrap 3.3.7 (loaded straight from a CDN) for its grid, tables, forms, and Glyphicon iconography, with a thin custom stylesheet (`src/todo.css`) laid over it to add exactly as much personality as the workflow needs and no more. There is no brand identity to perform here: the product is a single person's daily/weekly task list, and the visual system exists only to keep that person moving fast with a keyboard, not to impress anyone.

The system is deliberately flat and terse: a near-black ink on off-white paper, one grey button shape, Bootstrap's default Glyphicon set for every action, and a single red accent reserved for destructive or attention states. Interaction feedback leans on sound and motion rather than color: every hotkey-triggered action plays an audible click, and the small action icons (trash, arrow, random, thumbs-down) scale up 1.5x on hover as their only state treatment.

**Key Characteristics:**
- Flat by construction: no shadows, no gradients, no elevation anywhere in the system.
- Bootstrap 3 is the structural and iconographic base; `todo.css` only adds what Bootstrap doesn't already provide.
- One custom interactive primitive — the grey `.rounded-button` — carries almost all button chrome in the app.
- Feedback is audible and kinetic before it is colorful: a click sound confirms hotkey actions, hover scales icons.
- A single functional accent (red) is reserved for destructive/alert meaning; it is not a brand color.
- Layout is column-constrained (Bootstrap grid, `col-md-10 col-lg-8`), not full-bleed, with one responsive breakpoint at 480px.

## Colors

A near-black ink on warm-white paper, with one grey surface and one functional red — no brand accent, because this system doesn't need one.

### Primary
- **Ink** (`#171717`): the dominant color of the whole interface — all body text, all button borders and button text. There is no separate brand accent color; ink carries the weight a primary color normally would.

### Tertiary
- **Alert Red** (`red`): reserved for destructive or attention states only — the trash icon turns red on hover, and the (currently unused) "settings" text treatment was red. Used sparingly and never decoratively.

### Neutral
- **Paper** (`#f5f8fa`): the page background.
- **Fog** (`#EFEFEF`): the background of the one button shape (`.rounded-button`) and other low-emphasis surfaces.

### Named Rules
**The One Accent Rule.** Red appears only on destructive/alert affordances (delete on hover). It never decorates a label, a heading, or a non-destructive action.

## Typography

**Body Font:** Raleway (with `sans-serif` fallback), loaded from Google Fonts.

**Character:** A plain, legible geometric sans at a small size (14px) and generous line-height (1.6) — built for scanning rows of short text quickly, not for display moments.

### Hierarchy
- **Title** (Bootstrap 3 default `h1`/`h2` weight and size — this project does not override heading size, only forces `display: inline`): used for page/list titles that sit inline next to their primary action button (e.g. "Lists" next to "Today").
- **Body** (400 weight, 14px, 1.6 line-height): all task text, list names, labels, and button text.
- **Label** (`<small>`): secondary metadata — e.g. the build version and environment tag in the user bar.

### Named Rules
**The Inline Heading Rule.** `h1`/`h2` are always `display: inline` so a heading and the action button beside it share one line — there is no stacked page-header pattern in this system.

## Layout

Content lives in a Bootstrap 3 grid container, constrained to `col-sm-12 col-md-10 col-lg-8` — never full-bleed, even on wide screens. A two-column status row (`#status` left, `#user` right-aligned) sits above the app, and a thin footer row sits below it.

Within the app itself, layout is almost entirely table-based (`<table className="table table-hover">` / `table-condensed`) for list rows and task rows, with `flex` used only for a handful of input rows (`.input-row`, `.actions-row`, `.separator-row`) that need an element to grow and a button to stay fixed-width.

Spacing is not a formal scale; it's tuned per element (2px/4px/6px/8px/12px/15px/16px/32px nudges around icons and buttons) rather than drawn from shared steps. The one reused value is `12px` bottom margin after major blocks (`.bottom-margin`).

There is exactly one responsive breakpoint, at `480px`: below it, the "less useful" per-row timestamp is hidden entirely and icon margins tighten, so narrow screens show the same table with less decoration rather than a restructured layout.

## Elevation & Depth

Flat by design, with no exceptions. There are no shadows, no z-layering, and no tonal elevation anywhere in the system — not even on the one custom button. Depth and state are communicated through other means: icon hover does a `scale(1.5)` transform instead of lifting, and immutable/current list rows use italics and bold weight instead of a raised card.

### Named Rules
**The No-Shadow Rule.** This system never uses `box-shadow` for depth or state. If something needs to read as "elevated" or "focused," reach for weight, italics, color, or transform — not a shadow.

## Shapes

Corners are a consistent 4px across the system: Bootstrap 3's default control radius matches the custom `.rounded-button`'s own `border-radius: 4px`, so the one custom primitive sits naturally alongside untouched Bootstrap inputs and selects. Buttons additionally carry a 1px solid ink-colored border. Tables and rows are otherwise square — no radius, no clipping, no card containers.

## Components

### Buttons
- **Shape:** 4px corner radius, 1px solid ink (`#171717`) border (`{rounded.sm}`).
- **Primary (`.rounded-button`):** fog grey background (`{colors.fog}`), ink text, `4px 12px` padding. This is the system's one and only intentional button style — used for every primary action across the Lists and Tasks pages (Today, Plan week, Reload, Add task, Protect/Unprotect, import/export selects).
- **Disabled:** `opacity: 0.3`, no other change.
- **Hover / Focus:** none defined. `.rounded-button` has no custom hover or focus treatment at present; it relies on the browser's native default.
- **Coverage:** every button in the app, including the Move and Failure pages, uses `.rounded-button`. There is no second, unstyled button treatment anywhere in the system.

### Tables / Lists
- **Corner Style:** none (square).
- **Background:** paper white, no zebra striping beyond Bootstrap's built-in `table-hover` row highlight.
- **Row states:** immutable (Protected) lists and the "current" list render in italic, sometimes bold, text rather than a background change. Completed tasks get `text-decoration: line-through`.
- **Density:** `table-condensed` throughout the task lists; the Lists table stays at normal density.

### Inputs / Fields
- **Style:** plain Bootstrap 3 text inputs, no custom border or background; `.input` flexes to fill its row, `.task-input` / `.list-input` take fixed percentage widths outside flex rows.
- **Focus:** native browser default; not customized.

### Icons (Glyphicons)
- **Style:** Bootstrap 3's Glyphicon font, used as the entire iconography of the app (folder, trash, refresh, arrows, thumbs-down, random, cog, pencil, resize). No custom icon set exists.
- **State:** every clickable action icon (`.action-button`, `.delete-button`, `.list-item-glyph`) scales to `1.5×` on hover via `transform`; the delete icon additionally turns red on hover. This hover transform is the system's primary (and only) interactive feedback for icon-driven actions.

### Status / User Bar
- **Style:** plain text, `.status-bar` set in italics; the user bar shows the build version in a color procedurally derived from the version string's date (a small decorative flourish, not a reusable token), the environment tag in `<small><b>`, and a settings cog icon.

## Do's and Don'ts

### Do:
- **Do** use `.rounded-button` for every button in the app — fog background, ink border and text, 4px radius.
- **Do** keep icon feedback as a `scale(1.5)` hover transform, not a color or shadow change.
- **Do** reserve red for destructive/alert meaning only (e.g. delete-on-hover); never use it decoratively.
- **Do** play the confirmation click sound on hotkey-triggered actions, so keyboard-only use gets feedback without looking at the screen.

### Don't:
- **Don't** introduce shadows, gradients, or elevation anywhere — this system is flat by design.
- **Don't** add a new icon set; Bootstrap 3 Glyphicons cover every action already in the app.
- **Don't** add a plain unstyled native `<button>` anywhere — every button in the app uses `.rounded-button`.
