class LoginPage {
    constructor(page) {
      this.page = page
    }
    async navigate() {
      await this.page.goto('https://stage.codifier.renue.ru');
    }
    async login() {
        // Логин + пароль
        await this.page.fill('#username', 'pra@crtweb.ru')
        await this.page.fill('#password', 'A%*bcd124')
        await this.page.click('button.ant-btn')
    }
  }

module.exports = { LoginPage }