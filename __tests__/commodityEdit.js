const { chromium, firefox, webkit } = require('playwright')
const { LoginPage } = require('../models/Login')
const { CommodityPage } = require('../models/Commodity')
const { generateName } = require('../models/generateRandomName')
const globalVars = require('../models/globalVars')
const headfullBrowserState = globalVars.browserState
const browserName = process.env.BROWSER || globalVars.browser // chromium, firefox, webkit

//Редактирование товара
describe('Редактирование товара', () => {
    let browser
    let context
    let page
    let today = new Date().toLocaleDateString()

    beforeAll(async () => {
        browser = await { chromium, webkit, firefox }[browserName].launch({
            headless: headfullBrowserState,
            slowMo: 200,  //тут обязательно slowMo, иначе падает в webkit
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
            .feature('Editing a commodity')
            .severity('Normal')
            .description('Редактирование товарной позиции')
    })

    test('должен появиться товар с новым названием', async () => {
        // Заходим в товар, кликаем кнопку Изменить
        await page.click('//tbody/tr[2]/td[3]')
        await page.click('text="Изменить"')

        // Меняем товарF
        const commodityPage = new CommodityPage(page)

        let generateFromName = generateName()
        await commodityPage.fillInCommodity(generateFromName)

        await page.click('text="Сохранить изменения"')

        await page.waitForTimeout(2000)

        // Проверяем, что товар изменился
        const content = await page.textContent('main div div div.ant-row.ant-row-middle strong span')
        expect(content).toBe(generateFromName)

        const screen = await page.screenshot({ path: `screens/${today}-commodityEdit-${browserName}.png` })
        reporter.addAttachment("Screenshot", screen, "image/png")
    })
})