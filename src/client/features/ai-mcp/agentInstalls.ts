import { ClaudeIcon, OpenAIIcon } from "./AgentIcons";
import { SETUP_GUIDE_URL } from "@/shared/brand";

export const ONE_CLICK_INSTALLS = [
  {
    agent: "chatgpt",
    name: "ChatGPT",
    href: `${SETUP_GUIDE_URL}#mcp-and-skills`,
    Icon: OpenAIIcon,
  },
  {
    agent: "claude",
    name: "Claude",
    href: `${SETUP_GUIDE_URL}#mcp-and-skills`,
    Icon: ClaudeIcon,
  },
];
