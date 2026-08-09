test.describe("Prompt Analyzer", () => {
  test.beforeEach(async ({ page }) => {
    await mockToolApi(page);
  });

  test("analyzes a prompt end to end and saves the optimized version to the library", async ({ page }) => {
    await page.goto("/");

    // On mobile viewports the sidebar starts off-screen (translated out via
    // CSS) and is only revealed by this toggle. On desktop it's hidden via
    // lg:hidden, so isVisible() is false there and this is a no-op.
    const menuToggle = page.getByRole("button", { name: /toggle sidebar/i });
    if (await menuToggle.isVisible()) {
      await menuToggle.click();
    }

    await page.getByRole("link", { name: /ai workspace/i }).click();
    await page.getByText(/^analyze prompt$/i).first().click();
    const textarea = page.getByPlaceholder(/write a blog post about productivity/i);
    await textarea.fill("Write a blog post about productivity");
    await page.getByRole("button", { name: /^analyze prompt$/i }).last().click();

    await expect(page.getByText(/completed/i)).toBeVisible({ timeout: 10_000 });
    await expect(page.getByText("88")).toBeVisible();
    await expect(page.getByText("Clear goal")).toBeVisible();
    await expect(page.getByText("Missing tone guidance")).toBeVisible();
    await expect(page.getByText("Specify desired tone")).toBeVisible();
    await expect(
      page.getByText(/write a 500-word blog post about productivity for remote workers/i)
    ).toBeVisible();

    await page.getByRole("button", { name: /save to prompt library/i }).click();
    await expect(page.getByText(/prompt saved successfully/i)).toBeVisible();

    // On mobile, navigating away closes the sidebar again, so reopen it
    // before clicking "Prompt Library".
    if (await menuToggle.isVisible()) {
      await menuToggle.click();
    }
    await page.getByRole("link", { name: /prompt library/i }).click();
    await expect(
      page.getByText(/write a blog post about productivity/i).first()
    ).toBeVisible();
  });

  test("shows a friendly error and a working retry button on API failure", async ({ page }) => {
    await page.unroute("**/api/tool");
    await page.route("**/api/tool", (route) => route.fulfill({ status: 500, body: "Internal Server Error" }));
    await page.goto("/");

    const menuToggle = page.getByRole("button", { name: /toggle sidebar/i });
    if (await menuToggle.isVisible()) {
      await menuToggle.click();
    }

    await page.getByRole("link", { name: /ai workspace/i }).click();
    await page.getByText(/^analyze prompt$/i).first().click();
    await page.getByPlaceholder(/write a blog post about productivity/i).fill("Test prompt");
    await page.getByRole("button", { name: /^analyze prompt$/i }).last().click();

    await expect(page.getByText(/^something went wrong$/i)).toBeVisible({ timeout: 10_000 });

    await mockToolApi(page);
    await page.getByRole("button", { name: /retry/i }).click();
    await expect(page.getByText("88")).toBeVisible({ timeout: 10_000 });
  });
});