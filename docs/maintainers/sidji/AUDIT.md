# SiDJI SEO implementation audit

## Baseline and authorization

- Date: 24 October 2026. One agent; no delegation.
- Fork: `fyz-hafiz-98/sidji-seo`, public, parent/source `every-app/open-seo`.
- Fixed baseline: `c5f8db19c7ca9e750836b6ed5c8a6491d4f967f4` (existing fork `main`). Fork has no commits ahead and is 24 commits behind upstream `2d8236a4fd5d799bf5c089187d0131f4dac4f38c` at inspection. Updating upstream is a separate operation.
- Work branch: `feat/sidji-seo-rebrand`. The account has admin/push permission. The owner authorized renaming the existing fork to the requested name.
- Empty initial workspace; no user changes to preserve. Git history retained. Filtered clone plus the exact-commit GitHub archive recovered a stalled checkout; archive files were imported into Git's object store and checked against the baseline tree.

## Architecture and entry points

React 19, TanStack Start/Router/Query, Vite 7, TypeScript, Tailwind/Base UI. pnpm `10.30.1`; three independent projects/lockfiles: root app, `web/`, `tests/badseo/`. Root install has no application postinstall or deploy hook. Native dependencies may run their package build scripts.

`src/server.ts` serves the Cloudflare Worker, `/mcp`, health, and scheduled events. The separate audit worker owns crawling workflows. SQLite/D1 is the default; Postgres remains opt-in. Native dev and Docker use local Miniflare state in `.wrangler/`. SAM, reports, SEO tools, billing, OAuth, and all existing navigation remain in the codebase.

`src/routes/__root.tsx`, app shell/sidebar, auth/onboarding, report renderer, MCP metadata, public manifests, and plugin manifests expose product identity. `.agents/skills/` is the source; `sync-plugin-skills` copies twelve public workflows into the plugin. Plugin IDs, tool names/schemas, theme keys, cookies, database/binding IDs, and resource names are compatibility identifiers.

## Operational findings

- Compose already binds host ports to loopback, but originally selected the upstream prebuilt image. Personal Compose must build this checkout.
- Plugin `.mcp.json` originally targeted hosted OpenSEO. Personal configuration must use loopback `/mcp`; browser setup prompts must use the current origin.
- `AUTH_MODE=local_noauth` is suitable only for trusted loopback use. No public deployment or tunnel is authorized.
- Root remote deploy/migration/release/upload scripts can mutate external resources. They remain behind a failing personal-operation guard until separately configured and authorized. Inherited Docker publish and preview workflows have upstream repository gates. The sourcemap workflow originally had an inverse gate that would run on forks; it is restricted to the intended upstream private repository. CI builds/tests without deployment. No repository secrets were added or workflows dispatched.
- Self-host telemetry has existing opt-out variables. Personal templates opt out; the telemetry implementation stays intact.
- Provider/OAuth credentials were not supplied. No provider calls, LLM calls, scraping, email, or paid schedules are authorized during validation.
- `web/` contains upstream testimonials, pricing, legal pages, demo media, social links, analytics, and historical articles. These must retain their provenance; a personal rebrand does not make them SiDJI achievements or service commitments. The website is not approved for publication.
- Windows 11 / PowerShell 7 / Node 24. Docker executable is unavailable. Machine has about 8 GiB physical RAM, so tests/builds run with low concurrency.

## Review requirement

Upstream `AGENTS.md` requires explicit maintainer review for `.agents/skills/**` changes. Rebranding setup/public skills therefore ships on a reviewable fork branch/PR rather than being automatically merged. No instruction files, CODEOWNERS, or review protections are altered.

Actual checks, failures, and limitations are recorded in [VALIDATION.md](VALIDATION.md).
