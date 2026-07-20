import { chromium } from "playwright";

const run = async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1600, height: 900 },
    deviceScaleFactor: 1,
  });

  await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);

  const sectionTop = await page.evaluate(() => {
    const el = document.querySelector("#who-we-serve");
    return el ? el.getBoundingClientRect().top + window.scrollY : -1;
  });

  const inspect = () =>
    document
      ? undefined
      : undefined; /* placeholder so eslint doesn't complain */

  for (const offset of [0, 400, 1200]) {
    await page.evaluate((y) => window.scrollTo(0, y), sectionTop + offset);
    await page.waitForTimeout(1400);
    const state = await page.evaluate(() => {
      const section = document.querySelector("#who-we-serve");
      const panels = section?.querySelectorAll("[data-serve-panel]") ?? [];
      const imgs = section?.querySelectorAll("img") ?? [];
      const medias = section?.querySelectorAll("[data-serve-media]") ?? [];
      const firstPanel = panels[0];
      return {
        panelCount: panels.length,
        mediaCount: medias.length,
        imgCount: imgs.length,
        firstPanelHtmlLen: firstPanel?.innerHTML.length ?? -1,
        firstPanelHasImg: !!firstPanel?.querySelector("img"),
        firstPanelMediaDiv: !!firstPanel?.querySelector("[data-serve-media]"),
        pinSpacer: !!document.querySelector(".pin-spacer"),
        trackTransform:
          section?.querySelector(":scope > div")?.getAttribute("style") ?? "",
      };
    });
    console.log(`offset=${offset}`, JSON.stringify(state, null, 1));
  }

  await browser.close();
};

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
