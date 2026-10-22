import path from "node:path";
import { expect, test } from "@playwright/test";

const photoPath = path.join(process.cwd(), "public/photos/warehouse-loading.jpg");

test("summit line smoke: home, quote with photo, dashboard", async ({ page }) => {
  const stamp = Date.now().toString();
  const name = `E2E Smoke ${stamp}`;
  const description = `Warehouse pallet photo ${stamp}`;

  await test.step("home page loads with Summit Line Delivery", async () => {
    await page.goto("/");
    await expect(page.getByText("Summit Line Delivery").first()).toBeVisible();
  });

  await test.step("quote with a photo submits", async () => {
    await page.goto("/quote");
    await page.getByLabel("Name", { exact: true }).fill(name);
    await page.getByLabel("Business name").fill("E2E Warehouse");
    await page.getByLabel("Phone", { exact: true }).fill(stamp.slice(-10));
    await page.getByLabel("Email", { exact: true }).fill(`e2e-${stamp}@summitlinedelivery.demo`);
    await page.getByLabel("Pickup address").fill("100 Warehouse Way, Los Angeles, CA");
    await page.getByLabel("Drop-off address").fill("200 Dock Street, Ontario, CA");
    await page.getByLabel("What is being delivered").fill(description);
    await page.getByLabel("Date needed").fill("2026-11-15");
    await page.getByLabel("Photo (optional)").setInputFiles(photoPath);
    await page.getByRole("button", { name: "Get a Quote" }).click();
    await expect(page.getByRole("heading", { name: "Request received" })).toBeVisible();
  });

  await test.step("demo login shows the new quote", async () => {
    await page.goto("/login");
    await page.getByLabel("Email", { exact: true }).fill("owner@summitlinedelivery.demo");
    await page.getByLabel("Password", { exact: true }).fill("summit-demo");
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page).toHaveURL(/\/dashboard\/?$/);
    await page.goto("/dashboard/quotes");
    await expect(page.getByRole("heading", { name })).toBeVisible();
    await expect(page.getByText(description)).toBeVisible();
  });
});
