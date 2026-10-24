import { expect, type Page } from "@playwright/test";

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

export async function waitForLocalSetup(page: Page) {
  // Attribute reads do not trigger locator handlers. Wait for the resolved
  // no-key state before tests read controls behind the asynchronous dialog.
  await expect(
    page.getByText(/Setup needed: add your DataForSEO API key/),
  ).toBeVisible({ timeout: 30_000 });
}

export async function openLocalPage(page: Page, path: string) {
  await page.goto(path);
  await waitForLocalSetup(page);
}
