import { createFileRoute } from "@tanstack/react-router";
import { LandingPage } from "@/components/landing-page";
import { buildPageSeo } from "@/lib/seo";

const homeTitle = "SiDJI SEO - Personal SEO Platform";
const homeDescription =
  "Personal self-hosted fork of OpenSEO with keyword research, backlinks, rank tracking, site audits and MCP. Bring your own provider credentials.";

export const Route = createFileRoute("/_marketing/")({
  head: () => {
    const seo = buildPageSeo({
      title: homeTitle,
      description: homeDescription,
      path: "/",
      imageAlt: "Upstream OpenSEO marketing archive",
    });

    return {
      ...seo,
      links: [
        ...(seo.links ?? []),
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossOrigin: "anonymous",
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500&family=JetBrains+Mono:wght@400;500&display=swap",
        },
      ],
    };
  },
  component: LandingPage,
});
