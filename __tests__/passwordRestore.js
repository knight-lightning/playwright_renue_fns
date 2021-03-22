const { chromium, firefox, webkit } = require('playwright');
const { LoginPage } = require('../models/Login')
const globalVars = require('../models/globalVars')
const headfullBrowserState = globalVars.browserState
const browserName = process.env.BROWSER || 'chromium' // chromium, firefox, webkit
// const browserName = process.env.BROWSER || globalVars.browser // chromium, firefox, webkit

describe('Восстановление пароля', () => {
    let browser
    let context
    let page
    let today = new Date().toLocaleDateString()

    beforeAll(async () => {
        browser = await { chromium, webkit, firefox }[browserName].launch({
            headless: false,
            args: ['--disable-dev-shm-usage'],
            slowMo: 300
        })
        context = await browser.newContext({
            viewport: { width: 1920, height: 1080 },
            recordVideo: { dir: 'videos/', size: { width: 1920, height: 1080 } },
            locale: 'ru-RU',
            timezoneId: 'Europe/Moscow',
            geolocation: { longitude: 51.638718, latitude: 36.135694 },
            permissions: ['geolocation']
        })
        page = await context.newPage()
    })

    afterAll(async () => {
        await context.close()
        await browser.close()
    })

    beforeEach(() => {
        reporter
            .epic('E2E test')
            .feature('Восстановление пароля')
            .severity('Normal')
            .description('Восстановление пароля аккаунта через почту')
    })


    test('должен залогиниться после ввостановления', async () => {
        const loginPage = new LoginPage(page)
        await loginPage.navigate()

        // Вводим почту
        await page.fill('input[placeholder="Ваша почта"]', 'denivanovr@yandex.ru')
        await page.click('text="Забыли пароль?"')

        // Открываем новую страницу, логинимся в gmail
        const page1 = await context.newPage()
        await page1.goto('https://mail.yandex.ru/')
        await page1.waitForTimeout(500)
        // Имя почты
        await page1.click('a:has-text("Войти")')
        await page1.waitForSelector('input[name="login"]')
        await page1.fill('input[name="login"]', 'denivanovr')
        await page1.click('button:has-text("Войти")')
        await page1.waitForSelector('input[name="passwd"]')
        await page1.fill('input[name="passwd"]', '*ExK5%EI')
        await page1.click('button:has-text("Войти")')
        await page1.waitForTimeout(1000)
        await page1.click('text=Восстановление доступа к Кодификатору ФНС России')

        const passLink = await page1.textContent('text=Здравствуйте!От вас поступил запрос на восстановление доступа к системе Кодифика >> a')
        await page1.close()
        await page.goto(passLink)

        // Вводим новый пароль
        await page.fill('input[placeholder="Новый пароль"]', 'A%*bcd124')
        await page.fill('input[placeholder="Новый пароль еще раз"]', 'A%*bcd124')
        await page.click('button')

        // Логин
        await loginPage.login()

        // Проверяем заголовок
        const content = await page.textContent('text="Номенклатура"')
        expect(content).toBe('Номенклатура')

        await page.waitForTimeout(300)

        screen = await page.screenshot({ path: `screens/${today}-restorePassword2-${browserName}.png` })
        reporter.addAttachment("Screenshot2", screen, "image/png")

    })
})