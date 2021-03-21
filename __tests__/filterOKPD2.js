const { chromium, firefox, webkit } = require('playwright')
const { LoginPage } = require('../models/Login')
const globalVars = require('../models/globalVars')
const headfullBrowserState = globalVars.browserState
const browserName = process.env.BROWSER || globalVars.browser // chromium, firefox, webkit

describe('Фильтр по ОКПД2', () => {
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
            .feature('Fillter OKPD2')
            .severity('Normal')
            .description('Фильтр по ОКПД2')
    })

    test('должна отображаться отфильтрованная таблица', async () => {
        // Ищем по ОКПД2
        let OKPD2 = '01.45.11.190'
        await page.click('text="Код по ОКПД2"')
        await page.fill('.ant-modal-body .ant-input', OKPD2)
        await page.click('//span[contains(text(),"Выбрать код")]')

        await page.waitForTimeout(1000)
        // Название категории в столбце таблиц
        const contentStringFound = await page.textContent('//tbody/tr[2]/td[3]')
        await page.waitForTimeout(2000)
        // Проверяем, что в столбце с ОКПД2 + названии выбранный ОКПД2
        let fullOKPD2 = await page.textContent('.ant-table-body > table > tbody > tr:nth-child(2) > td:nth-child(4) > span')
        expect(fullOKPD2).toBe('01.45.11.190 — Овцы чистопородные племенные прочие, не включенные в другие группировки')

        // Заходим в 1-ый отфильтрованный товар
        await page.click('//tbody/tr[2]/td[3]')

        // Проверяем, что прогрузился заголовок на странице товарной позиции
        const contentString = await page.textContent('main div div div.ant-row.ant-row-middle strong span')
        expect(contentString).toBe(contentStringFound)

        let screen = await page.screenshot({ path: `screens/${today}-fillterOKPD2-${browserName}.png` })
        reporter.addAttachment("Screenshot", screen, "image/png")
    })
})