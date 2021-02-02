const playwright = require('playwright')
const { LoginPage } = require('../models/Login');

// Вывывод товара из оборота + ввод
describe('Out and In commodity from turnover', () => {
    test('should display correct status of commodity', async () => {
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

            // Заходим в товар
            await page.click('//html/body/div[1]/div/section/section/main/div/div[2]/div[2]/div/div/div/div/div[2]/table/tbody/tr[2]')

            await page.click('text="Вывести из оборота"')
            await page.click('text="Вывести"')

            // Проверяем, что вывелся из оборота
            let buttonSwitch = await page.textContent('main .ant-btn-link');
            expect(buttonSwitch).toBe('Вернуть в оборот')

            // Вводим обратно в оборот
            await page.click('text="Вернуть в оборот"')
            await page.click('text="Вернуть"')

            // Проверяем, что вывелся из оборота
            buttonSwitch = await page.textContent('main .ant-btn-link');
            expect(buttonSwitch).toBe('Вывести из оборота')

            let today = new Date().toLocaleDateString()
            await page.screenshot({ path: `screens/commodityEdit${today}-${browserType}.png` })
            await browser.close()
        }
    })
})