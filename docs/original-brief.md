# CLAUDE.md — Frontend Build Rules (Step Project)

This is an **Arabic (RTL-first)** React app with **64 screens**. Consistency and a
clean shared foundation matter more than speed. Read this fully before writing code.

---

## 0. WORKFLOW — DO NOT SKIP

Build in this order and **STOP for review** where noted:

1. Folder structure + tooling
2. Design tokens in `tailwind.config` + CSS variables
3. Shared UI primitives (Button, Input, Select, Card, Modal, Table, Badge, etc.)
4. **← STOP HERE.** Build only **2 sample screens**, write `ARCHITECTURE.md`, then wait for review.
5. After approval only: build the remaining screens in batches.

Never hardcode a value that belongs in a token. Never rebuild a primitive that already exists.

---

## 1. FOLDER STRUCTURE

```
src/
  components/ui/     # shared primitives ONLY (Button, Input, Card, Modal, Table...)
  components/        # shared composite components (Header, Sidebar, EmptyState...)
  layouts/           # AppLayout, AuthLayout, etc.
  features/          # OR screens/ — one folder per screen/domain
  routes/            # routing config
  hooks/             # reusable hooks
  lib/               # utils, api client, formatters (currency, dates)
  types/             # shared TS types
  styles/            # globals, tokens
```

Rules:
- A screen **imports** primitives from `components/ui`. It never redefines a button/input/card.
- No component file over ~300 lines. If it grows, split it.
- No business logic inside `components/ui` — primitives are dumb and reusable.

---

## 2. DESIGN TOKENS (single source of truth)

Put ALL of these in `tailwind.config` + CSS variables. **Zero raw hex** allowed inside components.

Colors:
- primary-tint:   `#eaeeff`
- text-primary:   `#0e1116`
- text-muted:     `#6b7280`
- border:         `#e5e9f2`
- surface-soft:   `#f5f7fb`
- success:        `#12b76a`   / success-bg: `#ecfdf3`
- warning:        `#f59e0b`   / warning-bg: `#fff9eb`
- error:          `#f04438`   / error-bg:   `#fef3f2`

Radii: `6 / 8 / 10 / 12 / 16` (px) → expose as `rounded-sm ... rounded-2xl` scale.

Shadow: `0 4px 6px rgba(31, 41, 55, .05)` → single `shadow-card` token.

Fonts:
- `Cairo` (weights 400–800) — default UI/body font
- `Spline Sans Mono` — numbers, codes, monospace

Enforcement check (should return near-zero hits in component files):
```
grep -rE "#[0-9a-fA-F]{6}" src/components src/features
```

---

## 3. RTL — THIS IS NON-NEGOTIABLE

The app is Arabic. RTL is the default, not an afterthought.

- Root: `<html dir="rtl" lang="ar">`
- Use **logical** Tailwind utilities ONLY:
  - `ps-*` / `pe-*`  (not `pl-*` / `pr-*`)
  - `ms-*` / `me-*`  (not `ml-*` / `mr-*`)
  - `text-start` / `text-end` (not `text-left` / `text-right`)
  - `border-s` / `border-e`
- Icons/arrows that imply direction must flip with direction.

Enforcement check (should be near-zero):
```
grep -rE "\b(pl-|pr-|ml-|mr-|text-left|text-right)" src/
```

---

## 4. SHARED PRIMITIVES (build these BEFORE any screen)

Each must support variants + sizes via props, use tokens only, and be RTL-safe:
Button, IconButton, Input, Textarea, Select, Checkbox, Radio, Switch, Card,
Modal/Dialog, Drawer, Table, Badge/Tag, Alert, Tabs, Tooltip, Pagination,
Avatar, EmptyState, Spinner/Skeleton.

If a screen needs something not in this list, add it here first, then use it.

---

## 5. QUALITY BAR

- TypeScript strict, no `any`, no unused vars.
- `npm run build` passes with **zero** TS errors before any "done".
- Consistent Arabic labels/formatting; numbers/dates via a shared formatter in `lib/`.
- Loading + empty + error states for any data-bound screen.
- No dead code, no commented-out blocks left behind.

---

## 6. ARCHITECTURE.md (write at step 4)

Must contain:
- The chosen folder structure and why.
- Full list of shared primitives with their props/variants.
- Token reference (colors, radii, shadow, fonts).
- How a new screen should be built (the recipe), so screens 3–64 are copy-paste consistent.

---

**Reminder:** Stop after 2 sample screens + ARCHITECTURE.md. Do not build all 64 screens
until the foundation is reviewed and approved.
