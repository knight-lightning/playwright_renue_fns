const { chromium, firefox, webkit } = require('playwright')
const { LoginPage } = require('../models/Login')
const globalVars = require('../models/globalVars')
const baseurl = globalVars.baseurl
const headfullBrowserState = globalVars.browserState
const browserName = process.env.BROWSER || globalVars.browser // chromium, firefox, webkit

describe('Проверка 404 страницы', () => {
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
            .feature('404 check page')
            .severity('Normal')
            .description('Тест редиректа на 404 страницу')
    })

    test('должна отображаться страница 404 после редиректа', async () => {
        // Проверяем заголовок
        await page.waitForNavigation()
        await page.goto(baseurl + '/#/nomen2')

        const content = await page.textContent('"404"')
        expect(content).toBe('404')

        let screen = await page.screenshot({ path: `screens/${today}-404Page-${browserName}.png` })
        reporter.addAttachment("Screenshot", screen, "image/png")
    })
})