# Minstagram
Минималистичный клон известной социальной сети Instagram. Проект сделан на стеке технологий React - Firebase;
### Потыкай проект 🙀👇:
### https://jsma-minstagram.netlify.app/

## Какие технологии были использованы в данном проекте:
### - React
### - Redux
### - React Router Dom
### - SCSS
### - Moment.js
### - React Icons
### - Swiper Carousel
### - Google Firebase ( Authentication, Realtime Database, Storage )

## Особенности и описание проекта:
* Регистрация и авторизация через Google Firebase Authentication и Realtime Database
    * при регистрации идет заполнение следующих полей формы: ФИО, Имя пользователя (username), Электронная почта (email), Пароль
    * при регистрации также идет проверка имени пользователя и email на уникальность
    * авторизация проводится по принципу: email:password
    * после авторизации uid, возвращаемый от firebase сохраняется в localStorage
    * после авторизации по uid проект сохраняет в Redux store данные пользователя
    * имеется авторизация по Google почте
        * если пользователь под указанной Google-почтой уже был зарегистрирован, то он просто авторизуется в приложение
        * если пользователь в первый раз авторизуется под указанной Google-почтой, то его перекидывает на страницу для ввода имени пользователя (username) и завершение регистрации
* Маршрутизация в проекте делится на 2: Приватный и Публичный
    * в публичном роуте расположены страницы авторизации и регистрации
    * в приватном роуте находятся все остальные страницы, которые доступны только после авторизации
* Основные страницы
    * Главная страница
        * отображение всех постов из базы, с возможностью перехода на страницу специфичного поста
    * Добавление нового поста
        * заполнение описания поста с валидацией заполнения от 0 до 1000 символов
        * выбор одного или несколько фото для прикрепления поста
    * Посты действующего пользователя
        * отображение всех постов действующего пользователя, с возможностью перехода на страницу специфичного поста ( own posts )
    * Все пользователи
        * вывод всех пользователей проекта
        * поиск пользователя/пользователей по имени пользователя
        * возможность перехода к постам выбранного пользователя
    * Профиль действующего пользователя
        * вывод всей информации действующего пользователя
        * возможность поменять пароль
        * возможность поменять имя пользователя (username)
            * также имеется проверка нового имени пользователя на уникальность
        * возможность поменять электронную почту
            * имеется валидация заполнения от 0 до 50 символов
        * редактирование данных
            * возможность изменения аватара пользователя
            * возможность изменения ФИО пользователя
    * Специфичный пост
        * вывод всей информации специфичного поста с полями:
            * изображения поста
            * имя пользователя, который загрузил пост
            * время добавления
            * описание поста 
            * комментарии поста
        * возможность добавления комментария к посту
            * валидация текста от 0 до 250 символов
            * отображения текста, времени добавления, аватар и имя пользователя, создавшего комментария
            * возможность редактирования комментария от его создателя
                * будет видно время редактирования
            * возможность удаления комментария от его создателя или от создателя поста 
    * Посты специфичного пользователя
        * вывод постов специфичного пользователя
* Выход из аккаунта
    * закрывается доступ к приватным роутам
    * стирается вся информация пользователя


## Лень читать всё, что сверху?🥱 Потыкай сам весь проект 🙀👇:
### https://jsma-minstagram.netlify.app/