# Проект автотестов Renue ФНС
Используются Playwright + Jest

В папке __tests__ находятся автотесты. (Или отдельно, должны называться *.test.js)

в папке models находятся модели по паттерну PageObject.

### Что нужно для запуска:
node (тестировал только на 12+)

`npm install -g allure-commandline --save-dev` - глобально под npm установить allure

## Шаги запуска:
1. Устанавливаем node
2. `npm install` - устанавливаем зависимости
3. `npm test` - запускаем все тесты

В конце получаем отчёт с общим количеством, прошедших и непрошедших тестов, время выполнения.


#### Чтобы запустить отдельный тест:
`npm test -- loginPage.js`

#### Настройки Jest:

В файле jest.config.js:

jest.setTimeout(50000) - для избегания проблем с асинхронным кодом

В файле package.json:

"test": "jest -w=1 --detectOpenHandles --forceExit --verbose"

jest - указываем наш тест раннер

-w=1 - количество потоков. Может задать фикс количествои или в %, например, -w=50%

--detectOpenHandles и --forceExit - для избегания проблем с асинхронным кодом

--verbose - более подробный отчёт в консоли

#### Allure (отчёты в UI)
После тестов `allure generate` и `alure serve` (нужна Java 8+)

#### CI
.github\workflows\nodejs.yml - пример запуска тестов в Github Actions

#### Docker
Добавил Dockerfile

Для запуска в интерективном режиме:

`docker run -p 127.0.0.1:9000:9000 -it --rm --ipc=host renue-test /bin/bash`

`sh testRun.sh` - запуск тестов.

`http://127.0.0.1:9000` - смотрит отчёт в allure после окончания тестов.

[Доки по Jenkins + Playwright](https://playwright.dev/docs/ci#jenkins)
