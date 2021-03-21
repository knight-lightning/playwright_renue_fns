const globalVars = require('../models/globalVars')
const baseurl = globalVars.baseurl

class Uploadcsv {
  constructor(page) {
    this.page = page
  }

  async upload(file) {
        await this.page.goto(baseurl)
        await this.page.waitForSelector('"Номенклатура"')
        // Загружаем файл
        await this.page.click('"Загрузить"')
        await this.page.setInputFiles('input[type="file"]', file)
        await this.page.click('.upload-btn')
        await this.page.waitForSelector('"Загрузка номенклатуры завершена"')
        // Переходим в отчёт о загрузке
        await this.page.click('"Посмотреть отчет о загрузке"')
  }
}

module.exports = { Uploadcsv }
