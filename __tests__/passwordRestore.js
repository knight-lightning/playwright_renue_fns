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
            args: ['--disable-dev-shm-usage']
        })
        context = await browser.newContext({
            viewport: { width: 1920, height: 1080 },
            recordVideo: { dir: 'videos/', size: { width: 1920, height: 1080 } }

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
            .description('Восстановление пароля аккаунта через gmail')
    })


    test('должен залогиниться после ввостановления', async () => {
        const loginPage = new LoginPage(page)
        await loginPage.navigate()

        // Вводим почту
        await page.fill('input[placeholder="Ваша почта"]', 'denivanovr@gmail.com')
        await page.click('text="Забыли пароль?"')

        // Открываем новую страницу, логинимся в gmail
        const page1 = await context.newPage()
        await page1.goto('https://gmail.com')
        // Имя почты
        let screen = await page.screenshot({ path: `screens/${today}-restorePassword1-${browserName}.png` })
        await page1.fill(':is(input[aria-label="Телефон или адрес эл. почты"], input[aria-label="Email or phone"]', 'denivanovr@gmail.com')
        // await page1.fill('input[aria-label="Телефон или адрес эл. почты"]', 'denivanovr@gmail.com')
        await page1.click('//button[normalize-space(.)=\'Далее\']/div[2]')
        // Пароль
        await page1.fill('//*[@id="password"]/div[1]/div/div[1]/input', '*ExK5%EI')
        await page1.click('//button[normalize-space(.)=\'Далее\']/div[2]')

        // Ждём загрузки ящика и прихода письма на восстановление, если тест падает, скорей всего нужно увеличить время ожидания
        await page.waitForTimeout(500)

        screen = await page.screenshot({ path: `screens/${today}-restorePassword2-${browserName}.png` })
        reporter.addAttachment("Screenshot1", screen, "image/png")
        // Ящик заходим в письмо (срабатывает только через выполнение js кода на странице, переход по xpath, selector, text ничего не даёт), копируем ссылку
        // await page1.dispatchEvent('div div div div div div div div div div div div div div div div div div div div table tbody tr', 'click')
        // await page1.evaluate(() =>
        //     document.querySelector("div div div div div div div div div div div div div div div div div div div div table tbody tr").click()
        // )
        await page1.click('div div div div div div div div div div div div div div div div div div div div table tbody tr')

        const passLink = await page1.textContent('//html/body/div[7]/div[3]/div/div[2]/div[1]/div[2]/div/div/div/div/div[2]/div/div[1]/div/div[2]/div/table/tr/td[1]/div[2]/div[2]/div/div[3]/div/div/div/div/div/div[1]/div[2]/div[3]/div[3]/div[1]/a')

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