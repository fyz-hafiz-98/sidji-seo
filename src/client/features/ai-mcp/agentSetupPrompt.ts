import installerSkill from "../../../../.agents/skills/setup-openseo/SKILL.md?raw";
import updatePrompt from "./agentUpdatePrompt.md?raw";
import { DEFAULT_LOCAL_ORIGIN } from "../../../shared/brand";

export const agentUpdatePrompt = updatePrompt.trim();

// The copyable installer and internal skill share one source of truth.
export function getAgentSetupPrompt(origin: string) {
  const url = new URL(origin);
  if (
    url.origin !== origin ||
    url.username ||
    url.password ||
    !(
      url.protocol === "https:" ||
      (url.protocol === "http:" &&
        (["127.0.0.1", "localhost", "[::1]"].includes(url.hostname) ||
          url.hostname.endsWith(".localhost")))
    )
  ) {
    throw new Error("Use an HTTPS origin or a trusted loopback HTTP origin.");
  }
  const instructions = installerSkill
    .replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, "")
    .trim();
  return instructions.replaceAll(DEFAULT_LOCAL_ORIGIN, url.origin);
}
