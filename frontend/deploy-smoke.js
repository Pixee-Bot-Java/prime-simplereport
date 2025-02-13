// Script that does a simple Selenium scrape of
// - A frontend page with a simple status message that hits a health check backend
// endpoint which does a simple ping to a non-sensitive DB table to verify
// all the connections are good.
// https://github.com/CDCgov/prime-simplereport/pull/7057

require("dotenv").config();
let { Builder } = require("selenium-webdriver");
const Chrome = require("selenium-webdriver/chrome");

const appUrl = process.env.REACT_APP_BASE_URL.includes("localhost")
  ? `${process.env.REACT_APP_BASE_URL}/health/deploy-smoke-test`
  : `https://${process.env.REACT_APP_BASE_URL}/app/health/deploy-smoke-test`;

console.log(`Running smoke test for ${appUrl}`);
const options = new Chrome.Options();
const driver = new Builder()
  .forBrowser("chrome")
  .setChromeOptions(options.addArguments("--headless=new"))
  .build();
driver
  .navigate()
  .to(`${appUrl}`)
  .then(() => {
    let value = driver.findElement({ id: "root" }).getText();
    return value;
  })
  .then((value) => {
    driver.quit();
    return value;
  })
  .then((value) => {
    if (value.includes("success")) {
      console.log(`Smoke test returned success status for ${appUrl}`);
      process.exitCode = 0;
      return;
    }
    if (value.includes("failure")) {
      console.log(`Smoke test returned failure status for ${appUrl}`);
      process.exitCode = 1;
      return;
    }
    console.log("Smoke test encountered unknown failure.");
    process.exitCode = 1;
  });
