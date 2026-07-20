import { chromium } from "playwright";

const run = async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1600, height: 900 },
    deviceScaleFactor: 1,
  });
  page.on("pageerror", (e) => console.log("[pageerror]", e.message));

  await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);

  const top = await page.evaluate(() => {
    const el = document.querySelector("#stats");
    return el ? el.getBoundingClientRect().top + window.scrollY : -1;
  });

  // Approach in steps so ScrollSmoother stays settled, then hold.
  const targets = [0.3, 1.3, 2.3, 3.3].map((u) => Math.round(u * 990));
  for (const t of targets) {
    await page.evaluate((y) => window.scrollTo(0, y), top + t);
    await page.waitForTimeout(2600);
    await page.screenshot({ path: `/tmp/ledger-settled-${t}.png` });
    console.log("settled shot", t);
  }

  await browser.close();
};

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
