import { test, expect } from "@playwright/test";

test.describe("protected routes", () => {
  test("redirects /train to signin when user is not logged in", async ({ page }) => {
    await page.goto("/train");

    await expect(page).toHaveURL(/.*signin/);
    await expect(page.getByText(/sign in/i)).toBeVisible();
  });

  test("redirects /stats to signin when user is not logged in", async ({ page }) => {
    await page.goto("/stats");

    await expect(page).toHaveURL(/.*signin/);
  });

  test("redirects /profile to signin when user is not logged in", async ({ page }) => {
    await page.goto("/profile");

    await expect(page).toHaveURL(/.*signin/);
  });

  test("allows public signin page", async ({ page }) => {
    await page.goto("/signin");

    await expect(page).toHaveURL(/.*signin/);
    await expect(page.getByText(/sign in/i)).toBeVisible();
  });
});