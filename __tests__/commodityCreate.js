const { chromium, firefox, webkit } = require('playwright')
const { LoginPage } = require('../models/Login')
const { CommodityPage } = require('../models/Commodity')
const { generateName } = require('../models/generateRandomName')
const globalVars = require('../models/globalVars')
const headfullBrowserState = globalVars.browserState
const browserName = process.env.BROWSER || globalVars.browser // chromium, firefox, webkit

// Создаём новый товар
describe('Создание товара', () => {
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
            .feature('Добавление нового товара')
            .severity('Normal')
            .description('Добавление нового товара')
    })

    it('должен создаться товар с указанным именем', async () => {
        // Создаём новый товар
        const commodityPage = new CommodityPage(page)
        await commodityPage.navigate()
        let generateFromName = generateName()
        await commodityPage.fillInCommodity(generateFromName)

        await page.click('//button[@type="submit"]')

        await page.waitForTimeout(1000)

        // Проверяем, что создался товар
        const content = await page.textContent('//tbody/tr[2]/td[3]')
        expect(content).toBe(generateFromName)

        let screen = await page.screenshot({ path: `screens/${today}-createCommodity-${browserName}.png` })
        reporter.addAttachment("Screenshot", screen, "image/png")
    })
})