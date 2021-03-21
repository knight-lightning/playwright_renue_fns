const { chromium, firefox, webkit } = require('playwright')
const { LoginPage } = require('../models/Login');
var state = require('../models/globalVars')
const globalVars = require('../models/globalVars')
const headfullBrowserState = globalVars.browserState
const browserName = process.env.BROWSER || globalVars.browser // chromium, firefox, webkit

// Вывывод товара из оборота + ввод
describe('Вывод и ввод в оборот', () => {
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
            .feature('Commodity out and in')
            .severity('Normal')
            .description('Ввод и вывод позиций из оборота')
    })

    test('should display correct status of commodity', async () => {
        // Заходим в товар
        await page.click('//tbody/tr[2]/td[3]')
        await page.click('text="Вывести из оборота"')
        await page.click('//button[@class="ant-btn ant-btn-primary ant-btn-lg"]//span[contains(text(),"Вывести")]')

        // Проверяем, что вывелся из оборота
        let buttonSwitch = await page.textContent('"Вернуть в оборот"')
        expect(buttonSwitch).toBe('Вернуть в оборот')

        // Вводим обратно в оборот
        await page.click('text="Вернуть в оборот"')
        await page.click('//button[@class="ant-btn ant-btn-primary ant-btn-lg"]//span[contains(text(),"Вернуть")]')

        // Проверяем, что ввёлся в оборот
        await page.waitForSelector('"Вывести из оборота"')
        buttonSwitch = await page.textContent('"Вывести из оборота"')
        expect(buttonSwitch).toBe('Вывести из оборота')

        let screen = await page.screenshot({ path: `screens/${today}-commodityOutIn-${browserName}.png` })
        reporter.addAttachment("Screenshot", screen, "image/png")
    })
})