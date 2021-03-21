cd /tests/

npm install

xvfb-run npm test

allure generate

allure serve --port 9000