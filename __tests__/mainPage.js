const playwright = require('playwright');
const { LoginPage } = require('../models/Login');

describe('Main page after login', () => {
  test('should display correct header after login', async () => {
    for (const browserType of ['chromium', 'firefox', 'webkit']) {
      const browser = await playwright[browserType].launch({
        headless: false
      })
      const context = await browser.newContext({
        viewport: { width: 1920, height: 1080 }
      })
      const page = await context.newPage()
      const loginPage = new LoginPage(page);

      await loginPage.navigate();
      await loginPage.login()

      await page.waitForTimeout(1500)

      let today = new Date().toLocaleDateString()
      await page.screenshot({ path: `screens/mainPage${today}-${browserType}.png` })
      await browser.close()
    }
  })
})