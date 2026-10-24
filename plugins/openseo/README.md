# SiDJI SEO personal plugin

Personal fork of the OpenSEO plugin, retaining its MIT attribution, technical plugin/server ID openseo, tool contracts and twelve public workflows.

## Connect your instance

The shipped Streamable HTTP URL is http://127.0.0.1:3001/mcp. Run your SiDJI checkout first, then use your client's supported local/custom plugin installation flow. Do not install the upstream marketplace connector as a fallback: that connector uses hosted OpenSEO.

Use this checkout's `feat/sidji-seo-rebrand` branch until its PR is merged. The fork's `main` still contains the upstream hosted configuration; do not install from an implicit default branch. Select the review branch explicitly, or use its local plugin directory/custom MCP configuration if the client cannot select a branch.

Trusted local_noauth needs no API token and stays on loopback. Cloud clients cannot access this laptop's localhost; authenticated HTTPS hosting needs separate configuration and authorization. No global client settings are modified by this repository.

The plugin provides keyword/competitor research, audits, backlinks, rankings, GSC/GA4 and AI visibility workflows. Live data requires the owner's provider keys; open source does not make paid providers free. Check identity and list projects without purchasing data.

The twelve workflow folders are generated from .agents/skills; maintainers run the repository's sync-plugin-skills script after source edits. Rebranding alone does not change their model choices or workflow steps. Plugin version remains 1.0.23; no tool or shipped workflow was added.

[Personal setup](https://github.com/fyz-hafiz-98/sidji-seo/blob/feat/sidji-seo-rebrand/docs/SIDJI_SEO_SETUP.md) · [Upstream attribution](https://github.com/every-app/open-seo)
