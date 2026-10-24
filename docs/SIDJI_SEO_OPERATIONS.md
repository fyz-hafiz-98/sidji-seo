# SiDJI SEO — personal operations

## Start, stop and health

For native development, run `corepack pnpm exec vite dev --host 127.0.0.1 --strictPort` from this checkout after the setup/migrations. Stop with Ctrl+C, then rerun the command to restart. Check `http://127.0.0.1:3001/api/health`; use the browser and terminal logs together when diagnosing failures. The health response is readiness evidence, not proof that provider integrations are configured.

For Docker use `docker compose up -d --no-build`, `docker compose stop`, `docker compose restart`, and `docker compose logs --tail 100`. An image update needs `docker compose build` followed by `docker compose up -d --no-build`. Container health covers startup/migrations/build; first startup may take several minutes. No registry push is required.

## Data and backup

Native SQLite/D1, KV, R2 and Durable Object state live below ignored `.wrangler/`. Docker mounts the existing `open_seo_data` volume at `/app/.wrangler`; Compose prefixes the actual volume name with its project name. Inspect the running container mounts to identify the exact volume. Do not rename the project, volume, resource IDs or bindings when upgrading an existing installation. `.env.local` / `.env` and encryption secrets are also essential restore material and must remain private.

For a consistent native backup:

1. Stop **every** dev/preview/worker/scheduler process using this checkout. Confirm no worker is writing.
2. Copy the complete `.wrangler/` directory and the required env files to private backup storage outside the repository. Record the app commit and backup timestamp. Protect the backup because it contains account/provider data and secrets.
3. Restart the app and check health. Test restores in a separate folder before relying on a backup.

For Docker, stop the entire Compose stack first. Make a cold archive/copy of the exact mounted volume using your existing backup tooling, along with private env files and the image/commit reference. Restart only after the backup completes. Do not copy a live SQLite main file alone: WAL/SHM, KV, object storage and Durable Object files also matter. Never remove the volume as part of backup or rollback.

To restore, stop all writers, preserve a backup of the current state, and restore the complete cold state into an isolated compatible checkout/volume with the original encryption secrets. Verify data and health there before replacing the active installation. If using the optional Postgres backend, follow its established transactional backup/restore procedure; copying `.wrangler` is not a Postgres backup.

## Update upstream

Keep `origin` pointing to `fyz-hafiz-98/sidji-seo` and `upstream` to `every-app/open-seo` for fetch/read. Upstream push is disabled locally. With a clean working tree and a verified cold backup:

```powershell
git fetch upstream
git switch -c maintenance/upstream-update
git merge upstream/main
```

Resolve conflicts while preserving the brand module, local MCP endpoint, local image build, telemetry opt-out, and remote-operation guard. Review schema changes before running migrations. Install frozen dependencies, rerun checks and compare the UI. Push explicitly to `origin` on the maintenance branch and use a fork PR. Do not force-push or merge an unreviewed remote deployment workflow.

## Rollback

The implementation baseline is `c5f8db19c7ca9e750836b6ed5c8a6491d4f967f4`. Record the exact validated SiDJI commit from the handoff or `git log` before upgrading. For application-only rollback, stop the app and use a separate checkout of the known commit (or rebuild that commit's local image), keeping the correct existing data mount/configuration. Revert unwanted changes through normal commits/PRs; do not reset or force-push shared history.

The raw upstream baseline is a provenance reference, not a verified runnable rollback target: its original browser needs the minimal server-boundary repair described in the audit. Prefer the validated SiDJI application revision when restoring a working installation.

`git revert` changes application code, **not database state**. If an update introduced incompatible migrations, restore the matching verified cold backup into a separate instance and verify it before switching. This rebrand introduces no schema migration and preserves all persistent identifiers. Never mix old code with a newer schema without checking compatibility.

Remote hosting is outside this setup. Any future deployment needs owned resources, HTTPS, real authentication (for example Cloudflare Access), reviewed workflows and explicit authorization. Host allowlists, CORS and a secret URL do not provide authentication.
