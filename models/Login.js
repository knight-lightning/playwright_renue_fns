const globalVars = require('../models/globalVars')
const baseurl = globalVars.baseurl

class LoginPage {
  constructor(page) {
    this.page = page
  }

  async navigate() {
    await this.page.goto(baseurl)
  }

  // Логин пользователя
  async login() {
    await this.page.fill('#username', 'denivanovr@gmail.com')
    await this.page.fill('#password', 'A%*bcd124')
    await this.page.click('button.ant-btn')
  }

  // Логин таможенного органа
  async login_fns() {
    await this.page.fill('#username', '2pra@crtweb.ru')
    await this.page.fill('#password', 'A%*bcd124')
    await this.page.click('button.ant-btn')
  }

  // Неверная пара
  async loginBad() {
    await this.page.fill('#username', 'denivanovr@gmail.com')
    await this.page.fill('#password', 'asdasd')
    await this.page.click('button.ant-btn')
  }

}

module.exports = { LoginPage }