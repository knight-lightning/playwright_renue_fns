const { chromium, firefox, webkit } = require('playwright')
const { LoginPage } = require('../models/Login')
const { Uploadcsv } = require('../models/Uploadcsv')
const globalVars = require('../models/globalVars')
const baseurl = globalVars.baseurl
const headfullBrowserState = globalVars.browserState
const browserName = process.env.BROWSER || globalVars.browser // chromium, firefox, webkit

describe('История загрузок', () => {
    let browser
    let context
    let page
    let today = new Date().toLocaleDateString()

    let feature, severity, description

    beforeAll(async () => {
        browser = await { chromium, webkit, firefox }[browserName].launch({
            headless: headfullBrowserState,
            args: ['--disable-dev-shm-usage']
        })
        context = await browser.newContext({
            viewport: { width: 1920, height: 1080 },
            acceptDownloads: true
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
            .feature(feature)
            .severity(severity)
            .description(description)
    })

    test('должны присутствовать все заголовки столбцов', async () => {
        feature = 'Проверка всех элементов на странице История загрузок'
        severity = 'Normal'
        description = 'Проверка всех элементов на странице История загрузок'

        await page.click('"История загрузок"')

        // Проверяем все элементы вкладка Создано
        await page.waitForSelector('"Название файла"')
        await page.waitForSelector('"Дата загрузки"')
        await page.waitForSelector('"Всего позиций"')
        await page.waitForSelector('"Успешно обработано"')
        await page.waitForSelector('"С ошибками"')

        // Проверяем заголовок
        const content = await page.textContent('"История загрузок"')
        expect(content).toBe('История загрузок')

        let screen = await page.screenshot({ path: `screens/${today}-checkHistoryMainUploadPage-${browserName}.png` })
        reporter.addAttachment("Screenshot", screen, "image/png")
    })

    test('должны присутствовать все столбцов во всех вкладках', async () => {
        feature = 'Проверка всех элементов на странице после загрузки файлом'
        severity = 'Normal'
        description = 'Проверка всех элементов на странице после загрузки файлом'

        await page.click('"История загрузок"')
        await page.click('"good.csv"')

        // Вкладка Создано
        await page.waitForSelector('"NTIN"')
        await page.waitForSelector('"SKU"')
        await page.waitForSelector('"Название"')

        // Вкладка Изменено
        await page.click('"Изменено"')

        await page.waitForSelector('#rc-tabs-1-panel-2 >> text=NTIN')
        await page.waitForSelector('#rc-tabs-1-panel-2 >> text=SKU')
        await page.waitForSelector('#rc-tabs-1-panel-2 >> text=Название')
        await page.waitForSelector('text=Поле')
        await page.waitForSelector('text=Новое значение')

        // Вкладка С ошибками
        await page.click('"С ошибками"')

        await page.waitForSelector('text=Позиция в источнике')
        await page.waitForSelector('#rc-tabs-1-panel-3 >> text=NTIN')
        await page.waitForSelector('#rc-tabs-1-panel-3 >> text=SKU')
        await page.waitForSelector('#rc-tabs-1-panel-3 >> text=Название')
        await page.waitForSelector('th:has-text("Ошибка")')
        await page.waitForSelector('#rc-tabs-1-panel-3 >> text=Поле')
        await page.waitForSelector('#rc-tabs-1-panel-3 >> text=Значение')

        // Вкладка Проигнорировано
        await page.click('"Проигнорировано"')

        await page.waitForSelector('#rc-tabs-1-panel-4 >> text=NTIN')
        await page.waitForSelector('#rc-tabs-1-panel-4 >> text=SKU')
        await page.waitForSelector('#rc-tabs-1-panel-4 >> text=Название')
        await page.waitForSelector('text=Комментарий')

        // Проверяем всего позиций
        const content = await page.textContent('"Всего"')
        expect(content).toBe('Всегопозиций')

        let screen = await page.screenshot({ path: `screens/${today}-checkHistoryInFilePage-${browserName}.png` })
        reporter.addAttachment("Screenshot", screen, "image/png")
    })

    test('файл без ошибок - должен быть переход на вкладку "Создано"', async () => {
        feature = 'Загрузка товаров файлом csv'
        severity = 'Normal'
        description = 'Загрузка товаров пачками через csv'

        // Загружаем файл
        const uploadcsv = new Uploadcsv(page)
        await uploadcsv.upload('./files/good.csv')

        await page.waitForSelector('.ant-tabs-tab-active:has-text("Создано")')
        // Проверяем заголовок
        const content = await page.textContent('"К истории загрузок"')
        expect(content).toBe('К истории загрузок')

        let screen = await page.screenshot({ path: `screens/${today}-commodityGoodUpload-${browserName}.png` })
        reporter.addAttachment("Screenshot", screen, "image/png")
    })

    test('файл с ошибками - должен быть переход на вкладку "С ошибками"', async () => {
        feature = 'Загрузка товаров файлом csv'
        severity = 'Normal'
        description = 'Загрузка товаров через csv файла с ошибками'

        // Загружаем файл
        const uploadcsv = new Uploadcsv(page)
        await uploadcsv.upload('./files/example.csv')
        // Проверяем заголовок
        const content = await page.textContent('"К истории загрузок"')
        expect(content).toBe('К истории загрузок')

        let screen = await page.screenshot({ path: `screens/${today}-commodityWithFaultsUpload-${browserName}.png` })
        reporter.addAttachment("Screenshot", screen, "image/png")
    })

    test('скачивание отчёта о загрузке', async () => {
        feature = 'Скачивание отчёта о загрузке'
        severity = 'Normal'
        description = 'Скачивание отчёта о загрузке'

        // Переходим в историю загрузок и конкретный файл
        await page.goto(baseurl + 'ui/#/download-history')
        await page.click('"good.csv"')

        // Скачиваем файл
        const [download] = await Promise.all([
            page.waitForEvent('download'),
            page.click('text=Скачать файл отчета')
        ])
        // await download.saveAs('./files/')

        // Проверяем заголовок // добавить проверку скаченнего файла
        const content = await page.textContent('"К истории загрузок"')
        expect(content).toBe('К истории загрузок')

        let screen = await page.screenshot({ path: `screens/${today}-commodityWithFaultsUpload-${browserName}.png` })
        reporter.addAttachment("Screenshot", screen, "image/png")
    })

})
