import { expect, test, type Page } from "@playwright/test";
import { z } from "zod";
import {
  installLocalSetupHandler,
  openLocalPage,
  waitForLocalSetup,
} from "./local-setup-test-utils";

async function openLocal(page: Page, path: string) {
  await openLocalPage(page, path);
}

test.beforeEach(async ({ page }) => {
  await installLocalSetupHandler(page);
  // Browser checks cannot contact hosted services, analytics or providers.
  await page.route("**/*", (route) => {
    const host = new URL(route.request().url()).hostname;
    return ["localhost", "127.0.0.1"].includes(host)
      ? route.continue()
      : route.abort("blockedbyclient");
  });
});

test("renders the personal brand, honest no-key state and local setup links", async ({
  page,
}) => {
  await openLocal(page, "/");
  await page.waitForURL(/\/p\/[^/]+\/?$/);
  await expect(page).toHaveTitle("SiDJI SEO");
  await expect(
    page.getByRole("link", { name: "SiDJI SEO", exact: true }).first(),
  ).toBeVisible();
  await expect(
    page.getByText(/Setup needed: add your DataForSEO API key/),
  ).toBeVisible();
  await openLocal(page, "/ai");
  await expect(
    page.getByRole("heading", { name: "Agent setup", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText("http://localhost:3101/mcp", { exact: true }),
  ).toBeVisible();
  await expect(page.locator('a[href*="plugin_asdk_"]')).toHaveCount(0);
  await page.reload();
  await waitForLocalSetup(page);
  await expect(page).toHaveTitle("SiDJI SEO");
  await expect(
    page.getByRole("heading", { name: "Agent setup", exact: true }),
  ).toBeVisible();
});

test("keeps the fixture SEO table and project/settings routes accessible", async ({
  page,
}) => {
  await openLocal(page, "/");
  await page.waitForURL(/\/p\/[^/]+\/?$/);
  const projectPath = new URL(page.url()).pathname.replace(/\/$/, "");
  await openLocal(
    page,
    `${projectPath}/keywords?q=keyword%20research&loc=2840&kLimit=150&mode=auto`,
  );
  await expect(
    page.getByRole("heading", { name: "Keyword Research", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("row", { name: /keyword research/i }).first(),
  ).toBeVisible();
  await openLocal(page, `${projectPath}/settings/integrations`);
  await expect(
    page.getByText("Google OAuth client not configured").first(),
  ).toBeVisible();
  await openLocal(page, "/settings");
  await expect(
    page.getByRole("heading", { name: "Settings", exact: true }),
  ).toBeVisible();
  await openLocal(page, "/help/openrouter-api-key");
  await expect(page.getByText(/SiDJI SEO needs the/)).toBeVisible();
});

test("MCP initializes, discovers unchanged tools and reads local projects without a provider", async ({
  request,
}) => {
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json, text/event-stream",
  };
  const call = async (method: string, params: object) => {
    const response = await request.post("/mcp", {
      // The first dev request lazily loads the MCP server and tool graph.
      timeout: 30_000,
      headers,
      data: { jsonrpc: "2.0", id: 1, method, params },
    });
    expect(response.ok()).toBeTruthy();
    const body = z
      .object({
        result: z.record(z.string(), z.unknown()).optional(),
        error: z.unknown().optional(),
      })
      .parse(await response.json());
    expect(body.error).toBeUndefined();
    return body.result;
  };
  const initialized = await call("initialize", {
    protocolVersion: "2025-03-26",
    capabilities: {},
    clientInfo: { name: "sidji-local-validation", version: "1.0.0" },
  });
  expect(initialized?.serverInfo).toMatchObject({
    name: "SiDJI SEO MCP",
    title: "SiDJI SEO",
    websiteUrl: "http://localhost:3101",
  });
  const discovery = await call("tools/list", {});
  expect(discovery?.tools).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ name: "list_projects" }),
      expect.objectContaining({ name: "research_keywords" }),
    ]),
  );
  const projects = await call("tools/call", {
    name: "list_projects",
    arguments: {},
  });
  expect(projects?.isError).not.toBe(true);
  // A domain-free fixture project does not start an onboarding crawl.
  const created = await call("tools/call", {
    name: "create_project",
    arguments: { name: "SiDJI local validation fixture" },
  });
  expect(created?.isError).not.toBe(true);
  const data = created?.structuredContent;
  if (!data || typeof data !== "object" || !("project" in data))
    throw new Error("Missing created project");
  const project = data.project;
  if (
    !project ||
    typeof project !== "object" ||
    !("id" in project) ||
    typeof project.id !== "string"
  )
    throw new Error("Missing project ID");
  const updated = await call("tools/call", {
    name: "update_project_context",
    arguments: {
      projectId: project.id,
      updates: [
        {
          section: "current_goal",
          content: "Isolated local validation fixture; no paid research.",
        },
      ],
    },
  });
  expect(updated?.isError).not.toBe(true);
  const context = await call("tools/call", {
    name: "get_project_context",
    arguments: { projectId: project.id },
  });
  expect(JSON.stringify(context)).toContain(
    "Isolated local validation fixture; no paid research.",
  );
});
