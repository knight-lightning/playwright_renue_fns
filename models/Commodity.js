const { generateName } = require('../models/generateRandomName')

class CommodityPage {
    constructor(page) {
        this.page = page
    }
    async navigate() {
        // await this.page.goto('https://stage.codifier.renue.ru/#/nomenclature/create')
        await this.page.click('"Создать позицию"')
    }
    async fillInCommodity(name) {
        await this.page.fill('#name', name) // Название товара

        await this.page.click('form > div:nth-child(2) > div.ant-col.ant-form-item-control > div > div > div > div') //ОКПД2
        await this.page.fill('//html/body/div[2]/div/div[2]/div/div[2]/div[2]/div[1]/form/span/input', '1')
        await this.page.click('div.ant-modal-wrap.ant-modal-centered > div > div.ant-modal-content > div.ant-modal-body  div > table > tbody > tr:nth-child(1)')

        await this.page.click('div > form > div:nth-child(3) > div.ant-col.ant-form-item-control > div > div > div > div') //ТНВЭД
        await this.page.fill('//html/body/div[2]/div/div[2]/div/div[2]/div[2]/div[1]/form/span/input', '1')
        await this.page.click('div.ant-modal-wrap.ant-modal-centered > div > div.ant-modal-content > div.ant-modal-body  div > table > tbody > tr:nth-child(1)')

        await this.page.fill('#description', generateName())

        await this.page.fill('#quantity', '10')

        await this.page.click('#unit')
        await this.page.click('text="Мегаватт"')
    }
}

module.exports = { CommodityPage }