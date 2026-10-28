# Darsan Web — Execution Plan and Status

**Last updated:** 26 Oct 2026
**Status:** 4 of 5 modules finished and merged into `main`. Module 5 (deployment readiness) is mostly done but **not committed**; it was stopped on request.

The design reference (architecture, data model, mock API rules, colours) is [PLAN.md](./PLAN.md). This file records **what was built, in what order, what is still missing, and how to continue**.

---

## 1. Status at a glance

| #   | Module                                       | Status                           | Where                       |
| --- | -------------------------------------------- | -------------------------------- | --------------------------- |
| 0   | Base project (scaffold, mock API, tests)     | ✅ Done                          | `main` · `a4ebe13`          |
| 1   | Website: temples, notifications, login page  | ✅ Done                          | `main` · `d8afe2f`          |
| 2   | Login for devotees and admins, roles, guards | ✅ Done                          | `main` · `84a9e69`          |
| 3   | Admin portal                                 | ✅ Done                          | `main` · `2cfa095`          |
| 4   | Customer: darshan and vazhipadu              | ✅ Done                          | `main` · `b84aee5`          |
| 5   | Deployment readiness                         | 🟡 Stopped part-way, uncommitted | branch `chore/deploy-ready` |

| Check (last full run)                               | Result                                                                     |
| --------------------------------------------------- | -------------------------------------------------------------------------- |
| Tests                                               | **217 passed**, 0 failed (18 test files)                                   |
| Coverage                                            | 91.8% statements · 83.1% branches · 92.3% functions · 93.7% lines          |
| Type check (`tsc -b`, strict)                       | Passes                                                                     |
| Lint (oxlint)                                       | Passes, 0 warnings                                                         |
| Prettier                                            | 1 file left to format: `tests/lib/mockSettings.test.ts`                    |
| Production build                                    | Passes; first visit ≈ 212 kB JS gzipped (was 271 kB before code splitting) |
| CSP check (headless Chrome on the production build) | No violations, no console errors                                           |
| Layout at 360 px                                    | No sideways scroll on any page (checked with screenshots)                  |

---

## 2. Project facts

| Item      | Value                                                                                                                                                                                                          |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Project   | `darsan-web`: temple darshan and vazhipadu booking portal                                                                                                                                                      |
| Folder    | `C:\Bhagath\darsan-web`                                                                                                                                                                                        |
| Git       | Local repo: `main` + branch `chore/deploy-ready`. **Not on GitHub yet** (GitHub CLI `gh` is not installed). Commits are authored as `bhagathrudolf <bhagathrudolf@gmail.com>` (repo-local git config).         |
| Stack     | React 19 · TypeScript 6 (strict) · Vite 8 · Tailwind CSS v4 · shadcn/ui (Radix) · Redux Toolkit + redux-saga · React Router 8 · react-hook-form + zod 4 · Vitest 5 + React Testing Library · oxlint · Prettier |
| Node      | 24 locally and in CI (`.nvmrc`); `>=22.12` supported                                                                                                                                                           |
| Languages | English and Malayalam (typed dictionaries: a missing Malayalam key fails the type check)                                                                                                                       |
| Data      | In-browser mock API (`src/api/`): random 200–1500 ms delay, configurable failure rate, "saved but response lost" failures, idempotency keys, token and role checks                                             |
| Run       | `npm ci`, then `npm run dev` → http://localhost:5173                                                                                                                                                           |

### Demo users

| Login page     | Username  | Password     | Role    | Notes                                       |
| -------------- | --------- | ------------ | ------- | ------------------------------------------- |
| `/login`       | `devotee` | `devotee123` | DEVOTEE | Anil Kumar, 9847012345, has seeded bookings |
| `/login`       | `lakshmi` | `lakshmi123` | DEVOTEE | Lakshmi Nair, 9995012345                    |
| `/admin/login` | `staff`   | `staff123`   | STAFF   | Ravi Menon, Sree Krishna Temple only        |
| `/admin/login` | `admin`   | `admin123`   | ADMIN   | All temples                                 |

New devotee accounts can be created at `/register`.

### What each role can do

| Action                                    |  Guest  | Devotee |   Staff    | Admin |
| ----------------------------------------- | :-----: | :-----: | :--------: | :---: |
| View temples, notices, slots, offerings   |   ✅    |   ✅    |     ✅     |  ✅   |
| Book darshan / place vazhipadu order      | → login |   ✅    |     ✅     |  ✅   |
| See and cancel own bookings and orders    |    —    |   ✅    |     ✅     |  ✅   |
| Search and cancel any booking / order     |    —    |    —    | own temple |  all  |
| Publish and delete notices                |    —    |    —    | own temple |  all  |
| Dashboard, slot capacity, offering prices |    —    |    —    |     —      |  ✅   |

### Pages (routes)

| Area                       | Routes                                                                                                                            |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Public website             | `/`, `/temples`, `/temples/:templeId`, `/notifications`, `/notifications/:noticeId`                                               |
| Accounts                   | `/login`, `/admin/login`, `/register`, `/account` (login needed), `/403`                                                          |
| Darshan                    | `/darshan?temple=&date=`, `/darshan/my-bookings` (login needed)                                                                   |
| Vazhipadu                  | `/vazhipadu?temple=&q=&category=`, `/vazhipadu/checkout`, `/vazhipadu/orders/:orderNumber`, `/vazhipadu/my-orders` (login needed) |
| Admin portal (staff/admin) | `/admin`, `/admin/dashboard`, `/admin/bookings`, `/admin/orders`, `/admin/slots`, `/admin/rates`, `/admin/notices`                |

---

## 3. How the execution order changed

The original plan built Darshan first (P1–P5), then Vazhipadu (V1–V5), then admin tools, with one GitHub PR per phase.

On 26 Oct 2026 the order was changed to **modules**, with the owner's confirmation after each one:

1. Website with temple details, notifications and login
2. Login for both customers and admins
3. Admin module
4. Customer module
5. Deployment ready

Each module was built on its own branch in small commits. Before confirmation it was checked: types, lint, tests, build, and screenshots at 360 px and desktop. After confirmation it was **squash-merged into `main`** locally. GitHub PRs were not possible (no `gh`), so the PR template exists but has not been used yet.

---

## 4. Completed work by module

### Module 0 — Base project ✅ (`a4ebe13`)

- [x] Vite + React + strict TypeScript, `@/` alias, Tailwind v4 + shadcn/ui with the temple colour theme
- [x] Domain types, 27 nakshatras, IST date helpers, ₹ formatting, phone validation, permission map
- [x] Mock API: network simulator, idempotency store, in-memory DB, seeded data (4 users, 3 temples, 30 offerings, 7 days × 6 slots per temple, ~20 bookings, 50 orders)
- [x] Test harness (`tests/setup.ts`, `renderWithProviders`, frozen-clock helpers) plus API and seed tests
- [x] PR template (`.github/pull_request_template.md`)
- [x] Fixed the missing `src/assets/images/credits.json` that stopped the dev server

### Module 1 — Website ✅ (`d8afe2f`)

- [x] Home: hero, latest important notices, temple cards
- [x] Temple list and temple detail: about, daily pooja schedule in IST, opening hours, address, tap-to-call phone, the temple's notices
- [x] **Notifications** (new feature):
  - 11 seeded notices (festival / timing change / closure / general)
  - temple and type filters kept in the URL, and a page for each notice
  - a header bell with the unread count
- [x] Login page: validation, show/hide password, demo-accounts box, safe `?redirect=`, session saved and restored
- [x] Responsive header with a phone menu, EN/ML switch, footer with quick links and photo credits, error page, focus moves to the content on navigation

### Module 2 — Login for devotees and admins ✅ (`84a9e69`)

- [x] **Two login pages**: `/login` (devotees) and `/admin/login` (staff/admin). Each refuses the other kind of account and links to the right page.
- [x] **Devotee sign-up** (`/register`) with an error summary; accounts survive a page reload
- [x] **My account**: edit name and phone, change password
- [x] `RequireAuth`, `RequireRole` and `RequirePermission` guards; 403 page; admin portal shell
- [x] Session after reload: a network error keeps the user logged in and retries; an invalid token logs them out
- [x] A "session expired" message when the server rejects a token mid-use

### Module 3 — Admin portal ✅ (`2cfa095`)

- [x] **Dashboard** (admin only), with a temple filter:
  - revenue headline; today's tickets and offerings; upcoming and cancelled bookings
  - slot-fill meter and orders by status
  - revenue-by-temple chart with a table view
- [x] Darshan booking search (part of a phone number, date, status, temple) with cancel
- [x] **Vazhipadu orders:**
  - filters and page number kept in the URL; an out-of-range page snaps to the last one
  - cancel shows at once and rolls back on failure
  - **CSV export** of all matching orders, protected against spreadsheet formula injection
- [x] Slot capacity (never below the tickets already booked) and close/open for booking, with rollback
- [x] Offering prices and on/off switch, with rollback
- [x] Bilingual notice publishing and deletion; staff limited to their own temple
- [x] Tables turn into cards on phones; the admin menu shows only permitted pages

### Module 4 — Customer ✅ (`b84aee5`)

**Darshan (original phases P1–P5)**

- [x] **P1:**
  - temple picker, 7-day picker, and slot cards (IST time, tickets left, Full / Started / Closed with the reason)
  - booking dialog with name and phone prefilled; 3 of 10 booked → 7 left
  - loading, empty and error states; guests are sent to login and back
- [x] **P2:**
  - `?temple=&date=` in the URL; Back restores the previous choice; bad links reset with a notice
  - `takeLatest` + request id, with a passing race test; Copy link with a fallback
- [x] **P3:**
  - `takeLeading`, a disabled button, and an idempotency key reused on retry
  - a failure keeps the typed values; a retry after a lost response returns the same booking
- [x] **P4:** My bookings, cancel shown at once with rollback, started bookings show the reason, IST on any device time zone
- [x] **P5:** Malayalam for every label, status and date; keyboard-only booking; focus moves to the confirmation, then returns to the Book button

**Vazhipadu (original phases V1–V3, and the devotee side of V4)**

- [x] **V1:** offerings with photo and ₹ price, category tabs, search on English and Malayalam names (debounced, kept in the URL), inactive offerings hidden
- [x] **V2:**
  - cart with 1–10 quantity steppers and ₹ totals, saved in localStorage
  - one temple per cart (asks before replacing); prices follow catalogue changes
  - order form with 27 nakshatras, a date from today to +90 days, and an error summary
- [x] **V3:** safe submit (same as darshan); a failure keeps the cart and form; printable receipt; cart emptied on success
- [x] My orders with cancel (a `mine` filter, so staff see only their own orders on this page)
- [x] Five offering photos from Wikimedia Commons (Pushpanjali, Archana, Homam, Nivedyam, Special), WebP up to 103 KB, with credits

### Module 5 — Deployment readiness 🟡 (branch `chore/deploy-ready`)

Committed:

- [x] The whole codebase formatted with Prettier (`0b91e51`)

Done but **not committed** (only in the working tree):

- [x] Code splitting: everything outside the public website loads on demand (`src/pages/lazyPages.tsx`). The login pages do too, which moved zod and react-hook-form out of the first download.
- [x] Mock settings at build time: `VITE_MOCK_FAILURE_RATE`, `VITE_MOCK_LATENCY_MS`, `VITE_MOCK_URL_PARAMS` (`src/mockSettings.ts`, `.env.example`, `src/env.d.ts`), with tests
- [x] Hosting configs: `netlify.toml`, `vercel.json`, `Dockerfile` + `nginx.conf` + `.dockerignore`. They provide:
  - the single-page-app fallback (refreshing any page works)
  - security headers: CSP, nosniff, no framing, referrer and permissions policies, HSTS
  - long-term caching for the hashed asset files
- [x] zod switched to its no-eval mode (`src/lib/zod.ts`) so the CSP has no violations; a lint rule blocks direct `zod` imports
- [x] GitHub Actions CI (`.github/workflows/ci.yml`): format, types, lint, tests, build, upload `dist`
- [x] `package.json` at version 1.0.0 with `engines`, `format:check` and `check` scripts; `@vitest/coverage-v8` added and coverage configured
- [x] `.nvmrc`, `public/robots.txt`, and `.gitignore` entries for env files and coverage
- [x] Test async timeout raised to 3 s (lazy pages under coverage or on CI)
- [x] README rewritten for running, testing and deploying

---

## 5. What is missing

### Must do before calling the project finished

| #   | Item                                                                                                                                    | Why it matters                                                                                                                                                                           | Effort        |
| --- | --------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| 1   | Format `tests/lib/mockSettings.test.ts` (`npm run format`), run `npm run check`, commit Module 5 and merge it into `main`               | Module 5 work exists only in the working tree                                                                                                                                            | Small         |
| 2   | Photo credits for the original 7 photos (`hero`, `lamp`, `payasam`, `abhishekam`, `temple-krishna`, `temple-mahadeva`, `temple-sastha`) | Their sources were never recorded, and CC licences require attribution before a public launch. Find the sources and add them to `credits.json`, or replace the photos with credited ones | Medium        |
| 3   | Put the repo on GitHub: `winget install GitHub.cli`, `gh auth login`, `gh repo create darsan-web --public --source . --push`            | Needed for CI, PRs and hosting                                                                                                                                                           | Small (owner) |
| 4   | Deploy once and check the live site                                                                                                     | The configs are written but nothing has been deployed. The Docker image is untested (Docker isn't installed on this machine)                                                             | Small         |

### In the original plan but not done

| Item                                                     | Original phase     | Note                                                                           |
| -------------------------------------------------------- | ------------------ | ------------------------------------------------------------------------------ |
| One GitHub PR per phase, each with a line review comment | §3 working rules   | Replaced by local branches and squash merges; this can't be done retroactively |
| README PR links table and screenshots                    | Phase 14           | No PRs exist; screenshots were only taken locally                              |
| Automated accessibility checks (`vitest-axe`)            | PLAN §9 (optional) | Covered instead by tests that find elements by role and label                  |
| Real-device 360 px check and a screen-reader run         | Phases 12 and 14   | Checked only with headless Chrome at 360 px and keyboard tests                 |

### Nice to have (not started)

- Dark mode
- Error monitoring (e.g. Sentry) and analytics (needs a privacy decision)
- PWA / offline support (manifest + service worker)
- Multi-day vazhipadu (one order over a date range), deferred in PLAN.md
- A real backend instead of the mock API. The `src/api/*` functions are the place to swap: keep the signatures, replace the bodies with `fetch`.

---

## 6. Decisions that differ from the original plan

| Decision                                                                                         | Reason                                                                      |
| ------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------- |
| Module order instead of P1 → V5                                                                  | Requested by the owner on 26 Oct 2026                                       |
| Local git with squash merges, no PRs                                                             | GitHub CLI not installed                                                    |
| **Notifications** feature added (notices, filters, bell, admin publishing)                       | Requested as part of the website module                                     |
| Separate devotee and staff login pages, plus devotee sign-up and My account                      | Request for "login for both customer and admin"                             |
| Native `<select>` for temple, status and birth star                                              | Works with every screen reader, uses the phone's own picker, simple to test |
| Day picker as one radio group with arrow keys (instead of buttons plus a separate mobile select) | One control for every screen width, one Tab stop                            |
| Responsive tables (a table on desktop, cards on phones) with explicit ARIA roles                 | One DOM for both layouts, and the table semantics survive the card styling  |
| Optimistic cancel stores the previous status in the slice                                        | The saga can't read the old status once the reducer has changed it          |
| Mock user accounts kept in localStorage                                                          | So sign-ups survive a reload; bookings and orders still reset by design     |
| One `orders` slice shared by the admin list and My orders                                        | Same API and cancel logic                                                   |
| Lazy-loaded pages and zod's no-eval mode                                                         | Smaller first download, and a strict CSP without `eval`                     |
| Chart colour `#9b2c2c` instead of the primary `#7a1f1f`                                          | Passes the chart palette validator (lightness and contrast)                 |

---

## 7. How to continue

```bash
cd C:\Bhagath\darsan-web
git switch chore/deploy-ready
npm run format            # fixes the one unformatted test file
npm run check             # format, types, lint, tests, build
git add -A && git commit -m "Make the app deployment ready"
git switch main && git merge --squash chore/deploy-ready && git commit
```

Then install and log in to `gh` and create the GitHub repo. Connect it to Netlify or Vercel (on Vercel, set `VITE_MOCK_FAILURE_RATE=0.05`), and check the live site.

---

## 8. Folder structure (current)

```
darsan-web/
├── .github/            pull_request_template.md, workflows/ci.yml
├── docs/               PLAN.md, EXECUTION_PLAN.md
├── public/             favicon.svg, icons.svg, robots.txt
├── src/
│   ├── api/            mockClient, db, seed, rng, session, userStore, errors,
│   │                   authApi, templeApi, noticeApi, bookingApi, orderApi, adminApi
│   │   └── data/       users.json, temples.json, offerings.json, notices.json
│   ├── assets/images/  12 WebP photos + credits.json
│   ├── components/
│   │   ├── ui/         shadcn components (+ dropdown-menu, switch)
│   │   ├── common/     Header, Footer, menus, FormField, ErrorSummary, NativeSelect,
│   │   │               ConfirmDialog, Pagination, StatusBadge, states, CopyLinkButton…
│   │   └── auth/  temples/  notices/  darshan/  vazhipadu/  admin/
│   ├── hooks/          useTemples, useLatestNotices, useQueryParams, useDebouncedValue,
│   │                   useNow, useLogout, useWelcomeToast, useSessionExpiredNotice
│   ├── i18n/           en.ts, ml.ts, index.ts (useT)
│   ├── layouts/        AppLayout, AdminLayout, guards
│   ├── lib/            constants, date, currency, phone, permissions, validators, schemas,
│   │                   zod, csv, redirect, slots, images, demoAccounts, id, utils
│   ├── pages/          public pages, darshan/, vazhipadu/, admin/, lazyPages.tsx
│   ├── store/          auth, i18n, notices, temples, darshan, vazhipadu, orders, admin, ui
│   │                   + callApi, notify, sagaUtils, persistence, errors, types
│   ├── types/          index.ts
│   └── router.tsx, App.tsx, main.tsx, mockSettings.ts, env.d.ts, index.css
├── tests/              setup, utils/, api/, store/, lib/, integration/
├── Dockerfile, nginx.conf, netlify.toml, vercel.json, .env.example, .nvmrc
└── README.md
```

---

## 9. Risks and open questions

| Risk / question                           | Status                                                                  |
| ----------------------------------------- | ----------------------------------------------------------------------- |
| Uncredited photos (7)                     | **Open**, see §5 item 2                                                 |
| Mock data resets on a full reload         | By design; documented in the README                                     |
| Plain-text passwords in the mock          | Acceptable for a mock only; documented                                  |
| Failure rate on a public demo             | Darshan defaults to 20% failures; the Netlify and Docker configs set 5% |
| Docker image                              | Written but never built or run (no Docker on this machine)              |
| Can guests view slots without logging in? | Decided: yes, login is asked only when booking                          |
| Can staff book on behalf of devotees?     | Decided: yes (staff can book; name and phone are editable)              |
