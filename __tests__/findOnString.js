const playwright = require('playwright');
const { LoginPage } = require('../models/Login');

// Тест поиска по подстроке
describe('Find on string on main page', () => {
  test('should display correct header after search and redirect', async () => {
    for (const browserType of ['chromium', 'firefox', 'webkit']) {
      const browser = await playwright[browserType].launch({
        headless: false, slowMo: 500
      })
      const context = await browser.newContext({
        viewport: { width: 1920, height: 1080 }
      })
      const page = await context.newPage()
      const loginPage = new LoginPage(page)

      await loginPage.navigate()
      await loginPage.login()

      // Ищем по подстроке
      await page.fill('.ant-input', 'Скейт')
      const contentStringFound = await page.textContent('//html/body/div/div/section/section/main/div/div[2]/div[1]/div[2]/div/div/div[2]/ul/li/span')
      await page.click('//html/body/div/div/section/section/main/div/div[2]/div[1]/div[2]/div/div/div[2]/ul/li/span')

      // Проверяем, что прогрузился заголовок на странице товарной позиции
      const contentString = await page.textContent('//html/body/div/div/section/section/main/div/div[1]/span/strong/span')
      expect(contentString).toBe(contentStringFound)

      let today = new Date().toLocaleDateString()
      await page.screenshot({ path: `screens/findOnString${today}-${browserType}.png` })
      await browser.close()
    }
  })
})