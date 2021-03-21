const { chromium, firefox, webkit } = require('playwright')
const { LoginPage } = require('../models/Login')
const globalVars = require('../models/globalVars')
const headfullBrowserState = globalVars.browserState
const browserName = process.env.BROWSER || globalVars.browser // chromium, firefox, webkit

// Тест неправильного и правильного логина
describe('Страница логина', () => {
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
    })

    afterAll(async () => {
        await context.close()
        await browser.close()
    })

    beforeEach(async () => {
        reporter
            .epic('E2E test')
            .feature('Login page')
            .severity('Critical')
            .description('Проверка логина пользователя')
    })

    test('should display correct header after login', async () => {
        const loginPage = new LoginPage(page)
        await loginPage.navigate()
        await loginPage.loginBad() // Проверяем неправильный логин

        // // Проверяем ответ на неверную пару
        // try {
        //     let content = await page.textContent('"Неверные учетные данные пользователя"')
        //     expect(content).toBe('Неверные учетные данные пользователя')
        // } catch {
        //     let content = await page.textContent('"Bad credentials"')
        //     expect(content).toBe('Bad credentials')
        // }

        await page.waitForTimeout(200)

        let screen = await page.screenshot({ path: `screens/${today}-badCredentialLogin-${browserName}.png` })
        reporter.addAttachment("Screenshot", screen, "image/png")

        await loginPage.login()

        // Проверяем заголовок
        content = await page.textContent('text="Номенклатура"')
        expect(content).toBe('Номенклатура')

        await page.waitForTimeout(300)

        screen = await page.screenshot({ path: `screens/${today}-loginPage-${browserName}.png` })
        reporter.addAttachment("Screenshot", screen, "image/png")

    })
})