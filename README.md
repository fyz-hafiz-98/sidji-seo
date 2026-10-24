# SiDJI SEO

Personal, self-hosted fork/rebrand of [OpenSEO](https://github.com/every-app/open-seo). Existing design, navigation and SEO capabilities are preserved. Original source history and [MIT copyright/permission notice](LICENSE) remain intact; this is not a claim that the code was written from scratch.

The implementation is on `feat/sidji-seo-rebrand` pending maintainer review. The fork's default branch remains at its upstream baseline until that review is complete.

## Run locally (Windows PowerShell)

Use Node.js 22/24 and the declared pnpm 10.30.1 through Corepack:

```powershell
corepack pnpm install --frozen-lockfile
if (!(Test-Path .env.local)) { Copy-Item .env.example .env.local }
corepack pnpm run db:migrate:local
corepack pnpm exec vite dev --host 127.0.0.1 --strictPort
```

Open [SiDJI SEO locally](http://127.0.0.1:3001). Stop with Ctrl+C. The personal template selects trusted local no-auth mode and opts out of existing self-host telemetry. Keep it on loopback; public hosting is not configured.

## Existing capabilities

Keyword research and saved keywords; competitor/domain research; backlinks; rank tracking; site audits; Google Search Console and GA4; AI visibility; reports; project context; MCP and twelve public agent workflows. SAM retains its existing identity and behavior. Provider integrations need your own credentials and may incur provider charges.

Without keys, the app shows configuration-required/disconnected states. Local checks do not imply that live research, Google OAuth, AI generation or paid scheduling has been tested. Sharing retains the upstream hosted-only restrictions.

The inherited filter-performance budget under 6× CPU throttling also fails on the baseline application on this machine. It remains a failing check; see the validation record for the exact functional results and limitations.

## Personal setup

- [Setup, environment, local MCP and custom Docker build](docs/SIDJI_SEO_SETUP.md)
- [Operations, consistent backup, update and rollback](docs/SIDJI_SEO_OPERATIONS.md)
- [Validation evidence and limitations](docs/maintainers/sidji/VALIDATION.md)
- [Handoff](docs/maintainers/sidji/HANDOFF.md)

Compose builds this checkout as sidji-seo:local, with its host port on 127.0.0.1. It must not run the upstream image and be mistaken for the rebrand. Docker availability and runtime verification are recorded in validation.

The plugin targets http://127.0.0.1:3001/mcp. Technical openseo IDs, tool schemas, database IDs, theme keys and storage identifiers are preserved. Cloud clients require a separately configured authenticated HTTPS deployment; they cannot reach laptop localhost. No global AI client configuration is changed.

Remote deploy, release, registry and upload commands are guarded pending separate configuration/authorization. No public deployment, upstream push or paid API use is part of this fork setup.

## Upstream and historical content

Upstream documentation remains available in docs/ and the original repository. The separate web/ project contains inherited articles, testimonials, pricing, legal text and demo media. Shared branding/metadata are adapted, but historical claims are not renamed into SiDJI achievements. It is an unpublished archive requiring a separate review before any public marketing use.

GitHub source visibility is public because this is a public upstream fork. Keep API keys, databases, private responses and screenshots out of Git.
