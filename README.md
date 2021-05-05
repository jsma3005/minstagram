# Minstagram
Минималистичный клон известной социальной сети Instagram. Проект сделан на стеке технологий React - Firebase;

## Какие технологии были использованы в данном проекте:
### - React
### - Redux
### - React Router Dom
### - SCSS
### - Moment.js
### - React Icons
### - Swiper Carousel
### - Google Firebase ( Authentication, Realtime Database, Storage )

## Особенности проекта:
* - Регистрация и авторизация через Google Firebase Authentication и Realtime Database:
    * - При регистрации идет заполнение следующих полей формы: ФИО, Имя пользователя (username), Электронная почта (email), Пароль
    * - При регистрации также идет проверка имени пользователя и email на уникальность
    * - Авторизация проводится по принципу: email:password
    * - После авторизации uid, возвращаемый от firebase сохраняется в localStorage
* - Маршрутизация в проекте делится на 2: Приватный и Публичный
    * - В публичном роуте расположены страницы авторизации и регистрации
    * - В приватном роуте находятся все остальные страницы, которые доступны только после авторизации