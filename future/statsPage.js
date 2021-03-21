const playwright = require('playwright')
const { LoginPage } = require('../models/Login')

// Тест неправильного и правильного логина
describe('Stats page', () => {
    test('should display all graphs', async () => {
        for (const browserType of ['chromium']) {
            const browser = await playwright[browserType].launch({
                headless: false
            })
            const context = await browser.newContext({
                viewport: { width: 1920, height: 1080 }
            })
            const page = await context.newPage()
            const loginPage = new LoginPage(page)

            await loginPage.navigate()
            await loginPage.login_fns()

            await page.click('"Статистика"')

            // Проверяем, что доступен фильтр по ИНН
            content = await page.textContent('text="ИНН организации"')
            expect(content).toBe('ИНН организации')

            // Таб с общими показателями
            await page.click('"Общие показатели"')


            //span[@class='ant-input-affix-wrapper ant-input-affix-wrapper-focused']//input[@placeholder='Выберите регион']

            // Таб ведение кодификатора
            await page.click('"Ведение кодификатора"')

            await page.waitForTimeout(300)
            await page.screenshot({ path: `screens/${today}-statsPage-${browserType}.png` })

            await page.close()
            await browser.close()
        }
    })
})