const { chromium, firefox, webkit } = require('playwright')
const { LoginPage } = require('../models/Login')
const globalVars = require('../models/globalVars')
const headfullBrowserState = globalVars.browserState
const browserName = process.env.BROWSER || globalVars.browser // chromium, firefox, webkit


describe('Тест страницы профиля', () => {
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

    beforeEach(async () => {
        reporter
            .epic('E2E test')
            .feature('Профиль пользователя')
            .severity('normal')
            .description('Проверка профиля пользователя')
    })

    it('должны отображаться все поля в профиле', async () => {
        // Переходим в профиль
        await page.click('"Тестировщик Тестировочный"')
        await page.click('"Перейти в профиль"')

        // Проверяем заголовок
        await page.waitForSelector('strong', {
            waitFor: "visible", timeout: 3000
        })

        // await page.waitForSelector('text=Генеральный директор')
        await page.waitForSelector('text=ИНН / КПП')
        await page.waitForSelector('text=ОГРН')
        await page.waitForSelector('text=Основной вид деятельности по ОКВЭД')
        await page.waitForSelector('text=Дополнительные виды деятельности по ОКВЭД')
        await page.waitForSelector('text=Единый реестр субъектов малого и среднего предпринимательства')
        await page.waitForSelector('text=GS1 Russia')
        // await page.waitForSelector('text=Префиксы организации (GS1 Russia)')
        // await page.waitForSelector('text=Места нахождения (GS1 Russia)')

        // await page.click('text=Показать еще')

        await page.waitForTimeout(100)
        let screen = await page.screenshot({ path: `screens/${today}-profilePage-${browserName}.png` })
        reporter.addAttachment("Screenshot", screen, "image/png")
    })
})