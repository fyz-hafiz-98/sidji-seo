# SiDJI SEO — personal setup

SiDJI SEO is a personal self-hosted rebrand of [OpenSEO](https://github.com/every-app/open-seo), under the original [MIT license](../LICENSE). Its existing UI and SEO workflows are retained. Source visibility on GitHub does not make your local data public.

## Windows / PowerShell

Use Node.js 22 or 24 and Corepack. The repository declares pnpm `10.30.1`; `corepack pnpm` uses that version without replacing a globally installed package manager. Run from the repository folder:

```powershell
corepack pnpm install --frozen-lockfile
if (!(Test-Path .env.local)) { Copy-Item .env.example .env.local }
corepack pnpm run db:migrate:local
corepack pnpm exec vite dev --host 127.0.0.1 --strictPort
```

Open [the local app](http://127.0.0.1:3001). Keep `AUTH_MODE=local_noauth` limited to your trusted machine. Stop with Ctrl+C. Vite startup does not emit scheduled cron events; do not run the self-host scheduler during no-cost validation.

The first cold launch on the tested Windows machine took about five minutes while Vite prepared dependencies. Wait for the terminal's ready message and a successful health response before opening automated browser checks.

The built application was also verified using this native production-bundle path:

```powershell
corepack pnpm run build
corepack pnpm exec vite preview --host 127.0.0.1 --port 3001 --strictPort
```

The delivered checkout already has a successful build. Stop preview with Ctrl+C. Rebuild after changing source or configuration so the bundle and generated worker bindings reflect the current setup. Local preview is not a public deployment.

Production bundle and checks:

```powershell
corepack pnpm run types:check
corepack pnpm run lint
corepack pnpm run test:ci --maxWorkers=1
corepack pnpm run build
```

The website is a separate project: `corepack pnpm --dir web install --frozen-lockfile`, then its `types:check` and `build` scripts. `tests/badseo/` also has a separate lockfile. Root installation does not install either project. The inherited marketing archive contains upstream claims and legal material; it is not approved for publication as SiDJI marketing.

## Configuration

Edit ignored `.env.local` (native) or `.env` (Docker), never Git or chat. Templates contain no credentials.

| Variable                                         | Purpose / requirement                                                                                                                     |
| ------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `AUTH_MODE=local_noauth`                         | Trusted loopback use. Remote use needs separately configured authentication.                                                              |
| `PORT=3001`                                      | Local port. Keep MCP examples synchronized if changed.                                                                                    |
| `DATAFORSEO_API_KEY`                             | Optional for startup; required for live SEO research. Base64 of your DataForSEO `login:password`, not a free API entitlement.             |
| `OPENROUTER_API_KEY`, `OPENROUTER_MODEL`         | Optional for SAM/AI; provider usage can cost money. Leave blank until needed.                                                             |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`       | Optional Google OAuth client for GSC/GA4. Configure your own client, scopes and consent screen.                                           |
| `BETTER_AUTH_SECRET`                             | Required for Google token encryption and hosted auth. Generate at least 32 random characters locally; retain it across restarts/restores. |
| `BETTER_AUTH_URL`                                | Required only for hosted mode; use the actual configured app origin.                                                                      |
| `OPENSEO_TELEMETRY_DISABLED=1`, `DO_NOT_TRACK=1` | Existing self-host telemetry opt-outs, enabled for this personal configuration.                                                           |
| `ALLOWED_HOST`                                   | Optional host validation; it is not authentication. Leave empty for loopback.                                                             |
| `OPEN_SEO_IMAGE=sidji-seo:local`                 | Local image tag; compatibility variable name retained.                                                                                    |
| `TEAM_DOMAIN`, `POLICY_AUD`                      | Only for a separately authorized Cloudflare Access deployment.                                                                            |

Without DataForSEO, the app shows the existing setup prompt/banner. Google integrations stay disconnected until configured; SAM requests an OpenRouter key. Existing saved data remains readable. No fabricated SEO metrics are supplied.

Google setup details and callback paths are in [GSC](SELF_HOSTING_GOOGLE_SEARCH_CONSOLE.md) and [GA4](SELF_HOSTING_GOOGLE_ANALYTICS.md). Register callbacks using your actual origin and the exact paths from those guides; do not rename the paths for branding. No live OAuth or refresh is implied by local smoke tests.

## MCP and skills

The implemented endpoint is `/mcp`. The shipped plugin uses `http://127.0.0.1:3001/mcp`; technical server/plugin ID `openseo` is retained for compatibility. No token is required for trusted local no-auth mode. A client supporting Streamable HTTP can use this literal configuration:

```json
{
  "mcpServers": {
    "openseo": {
      "type": "http",
      "url": "http://127.0.0.1:3001/mcp"
    }
  }
}
```

Use the app's **Agent setup** prompt to get the actual current origin. Client-specific configuration syntax can differ: inspect your installed client's help and add the literal URL, rather than assuming environment placeholders expand. Public workflow sources are in `plugins/openseo/skills/`; do not install the repository's internal maintenance skills. Updating skills must preserve the configured endpoint, credentials and personal edits.

A cloud client cannot reach this laptop's loopback address. Remote connection is not ready: it needs a separately authorized HTTPS deployment with authentication. Do not use a public tunnel or replace the endpoint with hosted OpenSEO. No global Codex/Hermes configuration is modified by this repository.

## Docker (requires an existing Docker installation)

Docker is optional. Do not install or alter Docker Desktop, WSL, firewall or OS settings just for this guide.

```powershell
if (!(Test-Path .env)) { Copy-Item .env.example .env }
docker compose build
docker compose up -d --no-build
docker compose ps
docker compose logs --tail 100
```

Compose builds `deploy/docker/Dockerfile` from this checkout with tag `sidji-seo:local`. It binds the host port to `127.0.0.1`; internal `0.0.0.0` binding does not expose the host publicly. Verify `/api/health`, the browser title and the visible SiDJI SEO wordmark from this container. Do not substitute `ghcr.io/every-app/open-seo:latest` and call that the rebranded image. Never run `down -v` to troubleshoot.

The original Docker runtime supervisor can execute existing schedules. Review schedules and credentials before starting it with a live database. The validation database has no paid schedules. Remote deployment, registry publication and billing activation require a separate request/configuration.

See [operations](SIDJI_SEO_OPERATIONS.md) for data, backup and rollback. Actual validation status is in [the validation record](maintainers/sidji/VALIDATION.md); a command in this guide is not by itself a claim that it passed on every platform.
