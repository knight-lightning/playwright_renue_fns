const playwright = require('playwright')
const { LoginPage } = require('../models/Login');

// Фильтр по ОКПД2
describe('fillterOKPD2', () => {
  test('should display correct filltered table', async () => {
    for (const browserType of ['chromium']) {
      const browser = await playwright[browserType].launch({
        headless: false, slowMo: 300
      })
      const context = await browser.newContext({
        viewport: { width: 1920, height: 1080 }
      })
      const page = await context.newPage()
      const loginPage = new LoginPage(page)

      await loginPage.navigate()
      await loginPage.login()

      // Ищем по ОКПД2
      let OKPD2 = '01.45.11.190'
      await page.click('//html/body/div/div/section/section/main/div/div[2]/div[1]/div[1]/a/span')
      await page.fill('.ant-modal-body .ant-input', OKPD2)
      await page.click('text="Выбрать код"')

      // Название категории в столбце таблице
      const contentStringFound = await page.textContent('//html/body/div/div/section/section/main/div/div[2]/div[2]/div/div/div/div/div[2]/table/tbody/tr[2]/td[3]')

      // Проверяем, что в столбце с ОКПД2 + названии выбранный ОКПД2
      let fullOKPD2 = await page.textContent('//html/body/div[1]/div/section/section/main/div/div[2]/div[2]/div/div/div/div/div[2]/table/tbody/tr[2]/td[4]/span')
      expect(fullOKPD2).toBe('01.45.11.190 — Овцы чистопородные племенные прочие, не включенные в другие группировки')

      await page.click('//html/body/div/div/section/section/main/div/div[2]/div[2]/div/div/div/div/div[2]/table/tbody/tr[2]/td[3]')

      // Проверяем, что прогрузился заголовок на странице товарной позиции
      const contentString = await page.textContent('//html/body/div/div/section/section/main/div/div[1]/span/strong/span')
      expect(contentString).toBe(contentStringFound)



      let today = new Date().toLocaleDateString()
      await page.screenshot({ path: `screens/findOnString${today}-${browserType}.png` })
      await browser.close()
    }
  })
})