---
name: setup-openseo
description: Set up personal SiDJI SEO in the current AI agent, preserving its openseo compatibility identifier, endpoint and public skills.
metadata:
  internal: true
---

Set up SiDJI SEO in this agent. Do what you can; guide me through anything that needs my input.

## 1. Identify the agent

Identify this client and inspect its installed help before changing configuration. Check existing openseo connections and skills separately; preserve other integrations, credentials and personal edits. Avoid duplicates.

A regular ChatGPT web/desktop cloud conversation cannot install a local desktop integration or reach this laptop's localhost. Explain that remote setup needs a separately authorized HTTPS deployment with authentication. Do not create tunnels, alter OS/firewall settings or claim another client is connected.

## 2. Use this fork's plugin and public skills

Use the client's supported installation flow with this checkout on branch feat/sidji-seo-rebrand, not the hosted upstream marketplace connector:
https://github.com/fyz-hafiz-98/sidji-seo/tree/feat/sidji-seo-rebrand/plugins/openseo

Until the fork PR is merged, main still contains the upstream plugin and hosted MCP configuration. Do not install from the repository URL with an implicit default branch. Select the review branch explicitly if this client supports it; otherwise use this branch's local plugin directory or its verified custom MCP flow. Do not merge or publish the branch as part of agent setup.

Only install the twelve public workflows in plugins/openseo/skills. Never install internal repository maintenance skills. Use the existing scope, preserve personal edits and avoid duplicate skills.

## 3. Configure the instance

The literal Streamable HTTP endpoint is http://127.0.0.1:3001/mcp and settings are at http://127.0.0.1:3001/settings. Keep technical server ID openseo. Check this client's supported syntax instead of assuming environment placeholders expand. Never substitute hosted OpenSEO or install its hosted connector as a fallback.

If plugins are unsupported, use the client's verified custom MCP flow plus public skills separately. A tools connection without skills is only a tools connection; report that distinction.

## 4. Authenticate appropriately

Trusted local_noauth mode needs no OAuth or API token and must remain on loopback. A separately configured Cloudflare Access instance must follow its authentication instructions; never bypass them. Any future credential belongs in the client's secret settings, never chat, Git or logs.

## 5. Verify

Reload the client only if required. Verify the server identity with whoami and list_projects. These reads use no DataForSEO credits. Do not start research, crawling, AI generation, schedules, email or paid operations for setup verification. Verify the public workflow skills separately.

## 6. Report

Report the actual endpoint, authentication mode, installed workflows and what was independently verified. If input is required, give the exact next action without claiming success. Do not claim ChatGPT web, Hermes or another client is connected merely because this client is configured.

Personal guide:
https://github.com/fyz-hafiz-98/sidji-seo/blob/feat/sidji-seo-rebrand/docs/SIDJI_SEO_SETUP.md#mcp-and-skills

Suggest: Use SiDJI SEO to check my connection and list my projects.
