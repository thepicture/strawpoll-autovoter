const { firefox } = require("@playwright/test");

const { AppPatcher } = require("./utils/AppPatcher");
const { Proxy } = require("./utils/Proxy");

const TOTAL_ATTEMPTS = 4;

Array.prototype.choice = function () {
  return this[Math.random() * this.length];
};

let attempt = 0;

const vote = async () => {
  const browser = await firefox.launch({
    proxy: await new Proxy().getFreeProxy(),
    headless: process.env.HEADLESS === "true",
  });

  const context = await browser.newContext();

  const page = await context.newPage();

  await page.route("**/*", async (route) => {
    if (route.request().url().includes("app.js")) {
      const response = await route.fetch();
      return route.fulfill({
        response,
        body: new AppPatcher().patch(await response.text()),
        headers: {
          ...response.headers(),
        },
      });
    }
    return [
      "image",
      "media",
      "font",
      "stylesheet",
      "eventsource",
      "websocket",
      "manifest",
      "other",
    ].some(
      (e) =>
        route.request().resourceType() === e ||
        !route.request().url().includes("strawpoll.com")
    )
      ? route.abort()
      : route.continue();
  });

  await Promise.race([
    page.goto(`https://strawpoll.com/polls/${process.env.POOL_ID}`),
    () => setTimeout(() => page.evaluate(() => window.stop(), 2000)),
  ]);

  await page.click(`#option-${process.env.OPTION_ID}`);
  await page.click("form > div:nth-child(9) > div > div:nth-child(2) > button");

  await page.waitForSelector("button.custom-text");

  console.log(`[${++attempt}/${TOTAL_ATTEMPTS}]: vote successful`);

  await context.close();
  await browser.close();
};

(async () => {
  await Promise.allSettled(new Array(TOTAL_ATTEMPTS).fill(new Promise(vote)));
})();
