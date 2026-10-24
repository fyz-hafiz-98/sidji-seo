import type { Page } from "@playwright/test";

export async function installLocalSetupHandler(page: Page) {
  // No-key fixtures retain the real setup prompt. Dismiss it as a user would,
  // including when the asynchronous configuration check finishes late.
  await page.addLocatorHandler(
    page.getByRole("dialog", { name: "One quick setup step" }),
    async (dialog) => {
      await dialog
        .getByRole("button", { name: "Dismiss", exact: true })
        .click();
    },
  );
}
