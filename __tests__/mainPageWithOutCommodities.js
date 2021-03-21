const { chromium, firefox, webkit } = require('playwright');
const { LoginPage } = require('../models/Login')
const globalVars = require('../models/globalVars')
const baseurl = globalVars.baseurl
const headfullBrowserState = globalVars.browserState
const browserName = process.env.BROWSER || globalVars.browser // chromium, firefox, webkit

describe('Главная страница после с выведеными из оборота', () => {
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
            .feature('Main page after login')
            .description('Главная страница после логина с отображением выведенных из оборота товаров')
            .addEnvironment('Browser', `${browserName}`)
    })

    test('должен отображаться заголовок', async () => {
        await page.click('button.ant-btn.ant-btn-circle.ant-dropdown-trigger svg:nth-child(1)')
        await page.click('.ant-checkbox-input')

        await page.waitForSelector('"Номенклатура"')

        // Проверяем заголовок
        // const content = await page.textContent('text="Номенклатура"')
        expect(await page.textContent('text="Номенклатура"')).toBe('Номенклатура')

        const screen = await page.screenshot({ path: `screens/${today}-mainPage-${browserName}.png` })
        reporter.addAttachment(`${browserName}-Screenshot`, screen, "image/png")
    })
})