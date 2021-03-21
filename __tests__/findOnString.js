const { chromium, firefox, webkit } = require('playwright')
const { LoginPage } = require('../models/Login')
var globalVars = require('../models/globalVars')
const headfullBrowserState = globalVars.browserState
const browserName = process.env.BROWSER || globalVars.browser // chromium, firefox, webkit

// Тест поиска по подстроке
describe('Поиск по подстроке на главной странице', () => {
    let browser
    let context
    let page
    let today = new Date().toLocaleDateString()

    beforeAll(async () => {
        browser = await { chromium, webkit, firefox }[browserName].launch({
            headless: headfullBrowserState,
            args: ['--disable-dev-shm-usage']
        })
        context = await browser.newContext({
            viewport: { width: 1920, height: 1080 }
        })
        page = await context.newPage()
        const loginPage = new LoginPage(page)
        await loginPage.navigate()
        await loginPage.login()
    })

    afterAll(async () => {
        await context.close()
        await browser.close()
    })

    beforeEach(() => {
        reporter
            .epic('E2E test')
            .feature('Find on string')
            .severity('Normal')
            .description('Поиск номенклатуры по строке')
    })

    test('should display correct header after search and redirect', async () => {
        // Ищем по подстроке
        await page.fill('css=[placeholder="Поиск по номенклатуре"]', 'Скейт')

        await page.press('css=[placeholder="Поиск по номенклатуре"]', 'Enter')

        await page.waitForTimeout(1000)
        const contentStringFound = await page.textContent('//tbody/tr[2]/td[3]')

        await page.click('//tbody/tr[2]/td[3]')

        // Проверяем, что прогрузился заголовок на странице товарной позиции
        const contentString = await page.textContent('main div div div.ant-row.ant-row-middle strong span')
        expect(contentString).toBe(contentStringFound)

        let screen = await page.screenshot({ path: `screens/${today}-findOnString-${browserName}.png` })
        reporter.addAttachment("Screenshot", screen, "image/png")
    })
})