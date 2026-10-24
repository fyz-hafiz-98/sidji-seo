import { describe, expect, it } from "vitest";
import { getAgentSetupPrompt } from "./agentSetupPrompt";

describe("agent setup prompt", () => {
  it("supports the existing portless localhost origin", () => {
    expect(getAgentSetupPrompt("http://open-seo.localhost:1355")).toContain(
      "http://open-seo.localhost:1355/mcp",
    );
  });
  it("uses this instance for MCP/settings and this fork for public skills", () => {
    const prompt = getAgentSetupPrompt("https://seo.example.com");
    expect(prompt).toContain("https://seo.example.com/mcp");
    expect(prompt).toContain("https://seo.example.com/settings");
    expect(prompt).not.toContain("https://app.openseo.so");
    expect(prompt).toContain(
      "https://github.com/fyz-hafiz-98/sidji-seo/tree/feat/sidji-seo-rebrand/plugins/openseo",
    );
    expect(prompt).toContain(
      "Do not install from the repository URL with an implicit default branch.",
    );
    expect(prompt).not.toContain("plugin_asdk_");
    expect(prompt).toContain("SiDJI SEO");
    expect(prompt).not.toContain("internal: true");
  });

  it.each([
    "http://remote.example",
    "https://seo.example.com/path",
    "https://user:secret@seo.example.com",
    "javascript:alert(1)",
  ])("rejects a non-origin or insecure remote endpoint: %s", (origin) => {
    expect(() => getAgentSetupPrompt(origin)).toThrow();
  });
});
