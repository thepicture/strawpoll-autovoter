const { firefox } = require("@playwright/test");

const { AppPatcher } = require("./utils/AppPatcher");
const { Args, ArgTypes } = require("./utils/Args");
const { Proxy } = require("./utils/Proxy");

Array.prototype.choice = function () {
  return this[Math.random() * this.length];
};

prepareEnvironment();
startVoting();

let attempt = 0;

async function vote() {
  const browser = await firefox.launch({
    proxy: Args.get(ArgTypes.IGNORE_PROXY, false)
      ? void 0
      : await new Proxy().getProxy(),
    headless: Args.get(ArgTypes.HEADLESS, true),
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
    page.goto(
      `https://strawpoll.com/polls/${Args.get(
        ArgTypes.POLL_ID,
        shouldBeSpecifiedThrownError
      )}`
    ),
    () => setTimeout(() => page.evaluate(() => window.stop(), 2000)),
  ]);

  await page.click(
    `#option-${Args.get(ArgTypes.OPTION_ID, shouldBeSpecifiedThrownError)}`
  );
  await page.click("form > div:nth-child(9) > div > div:nth-child(2) > button");

  await page.waitForSelector("button.custom-text");

  console.log(
    `[${++attempt}/${Args.get(ArgTypes.ATTEMPTS, 4)}]: vote successful`
  );

  await context.close();
  await browser.close();
}
function prepareEnvironment() {}

async function startVoting() {
  await Promise.allSettled(
    new Array(Args.get(ArgTypes.ATTEMPTS, 4)).fill(new Promise(vote))
  );
}

function shouldBeSpecifiedThrownError(argType) {
  throw new Error(
    `missing required argument. argument should be specified with ${argType.join(
      " or "
    )}`
  );
}
