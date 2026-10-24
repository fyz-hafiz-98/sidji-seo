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

## Minimal baseline repairs

The original checkout's browser failed on the report routes: named handler exports retained `cloudflare:workers` and database imports in the client graph even though the routes had no component. The three handlers are explicitly wrapped with `createServerOnlyFn`, preserving their signatures, authorization, response headers and policies. This follows the existing stack's [environment boundary](https://tanstack.com/start/latest/docs/framework/react/guide/environment-functions); no alias or mock for Workers APIs is shipped to the browser.

The unmodified baseline remains recorded as a runtime failure. For the visual control, the same three boundary wrappers are applied to the detached baseline, with its original OpenSEO UI unchanged. The exact patch is retained locally in `.logs/baseline-runtime.patch`. The repaired control produced twenty captures with zero browser page errors and zero document overflow. It is not described as an unmodified baseline runtime pass.

Windows-only test harness issues were also reproduced before branding: `bash` selected the WSL launcher, and Google SQL tests could not delete their open/closing SQLite fixture files. The shell harness resolves Git's existing Bash on Windows. The Google tests use the repository's established per-client in-memory SQLite pattern because they assert SQL constraints/upserts/migration behavior, not disk persistence. All assertions and the production SQLite/D1 backend remain intact. No OS/WSL setup is changed.

The account-service fixture uses shared-cache memory because LibSQL reconnects after transactions; a private in-memory connection lost its schema in an intermediate test run. The other two fixtures do not reconnect. The corrected full suite passes all 1,656 tests.

Knip also reported both explicitly invoked Playwright configuration files as unused on the baseline. Their paths are now declared as CLI entry points, following the existing convention for standalone configurations; unused-code analysis remains enabled.

The legacy browser helper expected “Refine table results”, while the unchanged baseline panel already says “Refine results”. The selector now checks the actual title with the same open/closed assertions. The real no-key dialog is dismissed by one handler; its old duplicate manual dismissal was removed. The performance probe starts the existing CPU throttle only after startup and removes that setup handler before measuring the filter interactions. All original performance thresholds and the 6× rate remain intact.

The filter performance case still fails its responsiveness budget on both SiDJI and the baseline application with the same harness and fixtures on this machine. A trace-off control also failed, so tracing was not established as the cause. No performance threshold was raised, assertion removed, or production filter code changed to conceal the result. This is recorded as a preexisting failure requiring further investigation, separate from the rebrand. It prevents an unconditional all-green validation claim.
