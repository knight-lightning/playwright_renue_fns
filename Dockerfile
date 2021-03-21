# Playwright и зависимости
FROM mcr.microsoft.com/playwright:bionic

# Install OpenJDK-8
RUN apt-get update && \
    apt-get install -y openjdk-8-jdk && \
    apt-get install -y ant && \
    apt-get clean;

# Fix certificate issues
RUN apt-get update && \
    apt-get install ca-certificates-java && \
    apt-get clean && \
    update-ca-certificates -f;

# Setup JAVA_HOME -- useful for docker commandline
ENV JAVA_HOME /usr/lib/jvm/java-8-openjdk-amd64/
RUN export JAVA_HOME

# Копируем
COPY . /tests

WORKDIR /tests

# Обновим npm
RUN npm install npm -g

# Добавляем allure
RUN npm install -g allure-commandline --save-dev

# Добавляем права на запуск
RUN chmod -R 777 /tests

# Запускаем тесты
# RUN sh testRun.sh

EXPOSE 9000