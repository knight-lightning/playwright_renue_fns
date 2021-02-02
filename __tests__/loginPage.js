const playwright = require('playwright');
const { LoginPage } = require('../models/Login');

describe('Login page', () => {
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

      // Проверяем заголовок
      const content = await page.textContent('//html/body/div[1]/div/section/section/main/div/div[1]/span/strong')
      expect(content).toBe('Номенклатура')

      await page.waitForTimeout(1500)
      let today = new Date().toLocaleDateString()
      await page.screenshot({ path: `screens/loginPage${today}-${browserType}.png` })
      await browser.close()
    }
  })
})