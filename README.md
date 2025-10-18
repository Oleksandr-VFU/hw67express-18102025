# Express сервер з MongoDB Atlas інтеграцією

## Опис проекту

Цей проект є **інтеграцією MongoDB Atlas з існуючим Express.js сервером** з попереднього завдання. Основний фокус - **повноцінна робота з MongoDB Atlas** як основною базою даних замість mock даних та **реалізація всіх основних MongoDB операцій**.

**🎯 MongoDB досягнення:**
- ✅ **MongoDB Atlas підключення**: Інтеграція з хмарною базою даних
- ✅ **Автоматична ініціалізація**: Створення колекцій з реалістичними даними
- ✅ **CRUD операції**: Повноцінні CREATE, READ, UPDATE, DELETE операції
- ✅ **insertOne/insertMany**: Додавання одного та багатьох документів
- ✅ **updateOne/updateMany/replaceOne**: Оновлення та заміна документів
- ✅ **deleteOne/deleteMany**: Видалення одного та багатьох документів
- ✅ **find з проекціями**: Розширене читання з фільтрами та вибором полів
- ✅ **Динамічний контент**: Відображення реальних даних на сторінках
- ✅ **Видалення mock даних**: Повний перехід на реальну БД

## Базова функціональність

**Успадковано з попереднього проекту:**
- Express.js 5.1.0 сервер
- ✅ **Passport.js авторизація з MongoDB інтеграцією** (виправлено критичну помилку)
- Безпечні сесії з file storage
- Pug + EJS шаблонізатори
- Захищені маршрути з ролями

## MongoDB Atlas інтеграція

**Ключові технології:**
- **MongoDB Atlas + MongoDB Driver 6.20.0** - хмарна база даних
- **Асинхронні операції** - повна підтримка async/await
- **Автоматична ініціалізація** - seedDatabase.mjs
- **Повний набір MongoDB операцій** - insertOne/Many, updateOne/Many, replaceOne, deleteOne/Many, find

## Реалізовані завдання

### 🎯 **MongoDB Atlas Інтеграція + Розширені операції**
**Повна заміна mock даних на реальну хмарну базу даних з новими MongoDB методами**

#### 1. **Підключення MongoDB Atlas** 🔗
- ✅ Інтегровано **офіційний MongoDB Node.js Driver 6.20.0**
- ✅ Налаштовано **підключення до MongoDB Atlas** з URI та назвою БД
- ✅ Реалізовано **асинхронне підключення** з тестуванням ping
- ✅ Додано **коректне закриття з'єднання** при зупинці сервера
- ✅ Створено **експорт db та client** для використання в моделях

#### 2. **Автоматична ініціалізація бази даних** 🚀
- ✅ Створено **seedDatabase.mjs** з реалістичними даними
- ✅ **13 користувачів** з різними ролями (admin, editor, moderator, user)
- ✅ **11 статей** з повноцінним контентом українською мовою
- ✅ **Захист від дублювання** - перевірка існування колекцій
- ✅ **Детальне логування** процесу ініціалізації

#### 3. **Створення даних (insertOne/insertMany)** 📝
- ✅ **POST /users/insertOne** - додавання одного користувача
- ✅ **POST /users/insertMany** - додавання багатьох користувачів
- ✅ **POST /articles/insertOne** - додавання однієї статті
- ✅ **POST /articles/insertMany** - додавання багатьох статей
- ✅ **Автоматична генерація ID** - інкрементальні ідентифікатори
- ✅ **Валідація даних** з автоматичним додаванням метаданих

#### 4. **Оновлення даних (updateOne/updateMany/replaceOne)** 🔄
- ✅ **PUT /users/updateOne** - оновлення одного користувача за фільтром
- ✅ **PUT /users/updateMany** - оновлення багатьох користувачів за фільтром
- ✅ **PUT /users/replaceOne** - повна заміна одного користувача
- ✅ **PUT /articles/updateOne** - оновлення однієї статті за фільтром
- ✅ **PUT /articles/updateMany** - оновлення багатьох статей за фільтром
- ✅ **PUT /articles/replaceOne** - повна заміна однієї статті
- ✅ **Автоматичне оновлення updatedAt** при всіх операціях

#### 5. **Видалення даних (deleteOne/deleteMany)** 🗑️
- ✅ **DELETE /users/deleteOne** - видалення одного користувача за фільтром
- ✅ **DELETE /users/deleteMany** - видалення багатьох користувачів за фільтром
- ✅ **DELETE /articles/deleteOne** - видалення однієї статті за фільтром
- ✅ **DELETE /articles/deleteMany** - видалення багатьох статей за фільтром
- ✅ **Безпечне видалення** з поверненням інформації про видалені документи
- ✅ **Статистика операцій** - кількість знайдених/видалених документів

#### 6. **Розширене читання (find з проекціями)** 🔍
- ✅ **GET /users/find** - пошук користувачів з фільтрами та проекціями
- ✅ **GET /articles/find** - пошук статей з фільтрами та проекціями
- ✅ **Підтримка MongoDB query синтаксису** у параметрах filter та projection
- ✅ **Гнучкі проекції** - вибір тільки потрібних полів
- ✅ **Комплексні фільтри** - підтримка всіх MongoDB операторів

#### 7. **Інтеграція Passport.js з MongoDB** 🔐
- ✅ **Passport LocalStrategy з MongoDB**: Повна інтеграція авторизації з реальною базою даних
- ✅ **Асинхронна аутентифікація**: Знаходження користувачів через UserModel.findByEmail()
- ✅ **Серіалізація/десеріалізація**: Збереження сесій з MongoDB даними
- ✅ **Bcrypt хешування**: Безпечне зберігання паролів в MongoDB
- ✅ **Валідація користувачів**: Перевірка існування через MongoDB запити

#### 8. **Операції читання даних** 📖
- ✅ **Повна заміна mock моделей** на MongoDB операції
- ✅ **Асинхронні CRUD методи** з async/await
- ✅ **Автоматичні лічільники**: збільшення переглядів статей
- ✅ **Обробка помилок** з детальним логуванням

#### 9. **Динамічне відображення даних** 🖥️
- ✅ **Оновлено Pug шаблони** для відображення реальних користувачів
- ✅ **Оновлено EJS шаблони** для відображення реальних статей
- ✅ **Детальна інформація**: імена, ролі, дати, статистика
- ✅ **JSON API відповіді** з структурованими даними

### 🔐 **Базова функціональність (успадковано)**
- Passport.js авторизація з LocalStrategy
- Безпечні сесії з 7-денним терміном життя
- Захищені маршрути з перевіркою ролей
- Статичні файли та теми через cookies
- Валідація даних згідно бізнес-правил

## Тестові акаунти
- `admin@example.com` / `admin123` - повний доступ
- `user@example.com` / `user123` - базовий доступ

## Запуск проекту

### 🚀 Швидкий старт для викладача/тестувальника

**Без створення власного MongoDB Atlas - використайте готову БД:**

```bash
# 1. Встановіть залежності
npm install

# 2. Створіть .env файл з готовими налаштуваннями
cp .env.example .env

# 3. Запустіть сервер
npm start
```

**Готово!** Додаток буде працювати з готовою базою даних (13 користувачів + 11 статей)
- Сервер: http://localhost:3000
- Логін: `admin@example.com` / `admin123`

---

### �️ Повна інсталяція для розробки

**Якщо потрібен повний доступ до БД (створення/редагування):**

### 1. Встановлення
```bash
npm install
```

### 2. Налаштування MongoDB Atlas

**🎯 ВАРІАНТ А: ГОТОВА БД (тільки читання - для перевірки)**
```bash
# Просто скопіюйте файл - налаштування вже готові
cp .env.example .env
```

**📚 ВАРІАНТ Б: ВЛАСНА БД (повний доступ - для розробки)**

1. **Створіть безкоштовний аккаунт на [MongoDB Atlas](https://www.mongodb.com/atlas)**
2. **Створіть новий кластер** (безкоштовний M0 Sandbox)
3. **Налаштуйте доступ до мережі:** додайте `0.0.0.0/0` (всі IP)
4. **Створіть користувача бази даних** з правами читання/запису
5. **Отримайте connection string** через "Connect" → "Connect your application"

6. **Відредагуйте .env файл:**
```env
# Замініть на ваш власний URI для повного доступу
MONGODB_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/?retryWrites=true&w=majority
DB_NAME=blog
SESSION_SECRET=your-secure-secret-key
PORT=3000
```

### 3. Запуск сервера
```bash
npm start
```

**🚀 При першому запуску автоматично:**
- Підключиться до MongoDB Atlas
- Створить базу даних `blog`
- Додасть 13 користувачів та 11 статей

**⚠️ ВАЖЛИВО:** Без правильного .env файлу додаток не запуститься!

Сервер доступний на: **http://localhost:3000**

## 🔐 Рівні доступу

### Готова БД автора (readonly)
- ✅ **Перегляд** користувачів та статей
- ✅ **Авторизація** через існуючі акаунти
- ✅ **Навігація** по всіх сторінках
- ❌ **Створення/редагування** нових записів (тільки читання)

### Власна БД (повний доступ)  
- ✅ **Всі функції** готової БД
- ✅ **Створення** нових користувачів через API
- ✅ **Редагування** статей через API
- ✅ **Видалення** записів через API

## Тестові акаунти
**Для обох варіантів БД:**
- `admin@example.com` / `admin123` - повний доступ до інтерфейсу
- `user@example.com` / `user123` - базовий доступ до інтерфейсу

## Environment Змінні

Проект використовує наступні environment змінні:

```env
# .env файл (створіть з .env.example)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
DB_NAME=blog
SESSION_SECRET=your-secure-secret-key
PORT=3000
NODE_ENV=development
```

**Обов'язкові змінні:**
- `MONGODB_URI` - ваш персональний MongoDB Atlas connection string
- `DB_NAME` - назва бази даних (рекомендується: "blog")
- `SESSION_SECRET` - секретний ключ для підпису сесій

**Опціональні змінні:**
- `PORT` - порт сервера (за замовчуванням: 3000)
- `NODE_ENV` - режим роботи (development/production)

## API Ендпоінти

### Базові CRUD операції

#### Користувачі
- `GET /users` - всі користувачі (HTML/JSON)
- `GET /users/:id` - конкретний користувач
- `POST /users` - створення (з валідацією)
- `PUT /users/:id` - оновлення (з валідацією)
- `DELETE /users/:id` - видалення

#### Статті
- `GET /articles` - всі статті (HTML/JSON)
- `GET /articles/:id` - конкретна стаття
- `POST /articles` - створення (з валідацією)
- `PUT /articles/:id` - оновлення (з валідацією)
- `DELETE /articles/:id` - видалення

#### Авторизація
- `POST /auth/login` - вхід
- `POST /auth/register` - реєстрація
- `POST /auth/logout` - вихід

### Нові MongoDB операції

#### **Створення даних (insertOne/insertMany)**

##### **POST /users/insertOne** - Додавання одного користувача
```bash
curl -X POST http://localhost:3000/users/insertOne \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "username": "newuser",
    "firstName": "Іван",
    "lastName": "Новенький",
    "email": "ivan@example.com",
    "password": "password123",
    "role": "user"
  }'
```

**Очікувана відповідь:**
```json
{
  "message": "Користувача успішно створено",
  "user": {
    "_id": 14,
    "username": "newuser",
    "firstName": "Іван",
    "lastName": "Новенький",
    "email": "ivan@example.com",
    "role": "user",
    "isActive": true,
    "createdAt": "2024-10-17T20:30:15.123Z",
    "updatedAt": "2024-10-17T20:30:15.123Z"
  }
}
```

##### **POST /users/insertMany** - Додавання багатьох користувачів
```bash
curl -X POST http://localhost:3000/users/insertMany \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '[
    {
      "username": "user1",
      "firstName": "Петро",
      "lastName": "Перший",
      "email": "petro@example.com",
      "password": "pass123",
      "role": "user"
    },
    {
      "username": "user2",
      "firstName": "Марія",
      "lastName": "Друга",
      "email": "maria@example.com",
      "password": "pass456",
      "role": "editor"
    }
  ]'
```

**Очікувана відповідь:**
```json
{
  "message": "Успішно створено 2 користувачів",
  "users": [
    {
      "_id": 15,
      "username": "user1",
      "firstName": "Петро",
      "lastName": "Перший",
      "email": "petro@example.com",
      "role": "user",
      "isActive": true,
      "createdAt": "2024-10-17T20:30:15.123Z",
      "updatedAt": "2024-10-17T20:30:15.123Z"
    },
    {
      "_id": 16,
      "username": "user2",
      "firstName": "Марія",
      "lastName": "Друга",
      "email": "maria@example.com",
      "role": "editor",
      "isActive": true,
      "createdAt": "2024-10-17T20:30:15.123Z",
      "updatedAt": "2024-10-17T20:30:15.123Z"
    }
  ]
}
```

##### **POST /articles/insertOne** - Додавання однієї статті
```bash
curl -X POST http://localhost:3000/articles/insertOne \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "title": "Нова стаття про Node.js",
    "content": "Це детальна стаття про розробку з Node.js...",
    "category": "Програмування",
    "tags": ["Node.js", "JavaScript", "Backend"],
    "isPublished": true
  }'
```

**Очікувана відповідь:**
```json
{
  "message": "Статтю успішно створено",
  "article": {
    "_id": 12,
    "title": "Нова стаття про Node.js",
    "content": "Це детальна стаття про розробку з Node.js...",
    "authorId": 1,
    "authorName": "Олександр Адміністратор",
    "category": "Програмування",
    "tags": ["Node.js", "JavaScript", "Backend"],
    "views": 0,
    "likes": 0,
    "isPublished": true,
    "createdAt": "2024-10-17T20:30:15.123Z",
    "updatedAt": "2024-10-17T20:30:15.123Z"
  }
}
```

##### **POST /articles/insertMany** - Додавання багатьох статей
```bash
curl -X POST http://localhost:3000/articles/insertMany \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '[
    {
      "title": "Перша стаття",
      "content": "Контент першої статті...",
      "category": "Технології",
      "tags": ["tech"],
      "isPublished": true
    },
    {
      "title": "Друга стаття",
      "content": "Контент другої статті...",
      "category": "Освіта",
      "tags": ["education"],
      "isPublished": false
    }
  ]'
```

#### **Оновлення даних (updateOne/updateMany/replaceOne)**

##### **PUT /users/updateOne** - Оновлення одного користувача за фільтром
```bash
curl -X PUT http://localhost:3000/users/updateOne \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "filter": { "email": "ivan@example.com" },
    "update": { 
      "firstName": "Іван Оновлений",
      "role": "editor"
    }
  }'
```

**Очікувана відповідь:**
```json
{
  "message": "Користувача успішно оновлено",
  "user": {
    "_id": 14,
    "username": "newuser",
    "firstName": "Іван Оновлений",
    "lastName": "Новенький",
    "email": "ivan@example.com",
    "role": "editor",
    "isActive": true,
    "createdAt": "2024-10-17T20:30:15.123Z",
    "updatedAt": "2024-10-17T20:35:22.456Z"
  }
}
```

##### **PUT /users/updateMany** - Оновлення багатьох користувачів за фільтром
```bash
curl -X PUT http://localhost:3000/users/updateMany \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "filter": { "role": "user" },
    "update": { "isActive": false }
  }'
```

**Очікувана відповідь:**
```json
{
  "message": "Оновлено 3 з 5 користувачів",
  "matchedCount": 5,
  "modifiedCount": 3
}
```

##### **PUT /users/replaceOne** - Повна заміна одного користувача
```bash
curl -X PUT http://localhost:3000/users/replaceOne \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "filter": { "_id": 14 },
    "replacement": {
      "username": "completely_new",
      "firstName": "Повністю",
      "lastName": "Новий",
      "email": "new@example.com",
      "password": "newpass123",
      "role": "moderator",
      "isActive": true
    }
  }'
```

**Очікувана відповідь:**
```json
{
  "message": "Користувача успішно замінено",
  "user": {
    "_id": 14,
    "username": "completely_new",
    "firstName": "Повністю",
    "lastName": "Новий",
    "email": "new@example.com",
    "role": "moderator",
    "isActive": true,
    "createdAt": "2024-10-17T20:30:15.123Z",
    "updatedAt": "2024-10-17T20:40:10.789Z"
  }
}
```

##### **PUT /articles/updateOne** - Оновлення однієї статті за фільтром
```bash
curl -X PUT http://localhost:3000/articles/updateOne \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "filter": { "title": "Нова стаття про Node.js" },
    "update": { 
      "title": "Оновлена стаття про Node.js",
      "views": 100,
      "likes": 10
    }
  }'
```

##### **PUT /articles/updateMany** - Оновлення багатьох статей за фільтром
```bash
curl -X PUT http://localhost:3000/articles/updateMany \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "filter": { "category": "Технології" },
    "update": { "isPublished": true }
  }'
```

##### **PUT /articles/replaceOne** - Повна заміна однієї статті
```bash
curl -X PUT http://localhost:3000/articles/replaceOne \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "filter": { "_id": 12 },
    "replacement": {
      "title": "Повністю нова стаття",
      "content": "Цілком новий контент статті...",
      "category": "Новини",
      "tags": ["новини", "оновлення"],
      "isPublished": true
    }
  }'
```

#### **Видалення даних (deleteOne/deleteMany)**

##### **DELETE /users/deleteOne** - Видалення одного користувача за фільтром
```bash
curl -X DELETE http://localhost:3000/users/deleteOne \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "filter": { "email": "ivan@example.com" }
  }'
```

**Очікувана відповідь:**
```json
{
  "message": "Користувача Іван Новенький успішно видалено",
  "deletedUser": {
    "_id": 14,
    "username": "newuser",
    "firstName": "Іван",
    "lastName": "Новенький",
    "email": "ivan@example.com",
    "role": "user",
    "isActive": true,
    "createdAt": "2024-10-17T20:30:15.123Z",
    "updatedAt": "2024-10-17T20:30:15.123Z"
  }
}
```

##### **DELETE /users/deleteMany** - Видалення багатьох користувачів за фільтром
```bash
curl -X DELETE http://localhost:3000/users/deleteMany \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "filter": { "isActive": false }
  }'
```

**Очікувана відповідь:**
```json
{
  "message": "Успішно видалено 3 користувачів",
  "deletedCount": 3
}
```

##### **DELETE /articles/deleteOne** - Видалення однієї статті за фільтром
```bash
curl -X DELETE http://localhost:3000/articles/deleteOne \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "filter": { "title": "Стаття для видалення" }
  }'
```

##### **DELETE /articles/deleteMany** - Видалення багатьох статей за фільтром
```bash
curl -X DELETE http://localhost:3000/articles/deleteMany \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "filter": { "isPublished": false }
  }'
```

**Очікувана відповідь:**
```json
{
  "message": "Успішно видалено 2 статей",
  "deletedCount": 2
}
```

#### **Розширене читання (find з проекціями)**

##### **GET /users/find** - Пошук користувачів з фільтрами та проекціями
```bash
# Знайти всіх адміністраторів, показати тільки ім'я та email
curl "http://localhost:3000/users/find?filter=%7B%22role%22%3A%22admin%22%7D&projection=%7B%22firstName%22%3A1%2C%22lastName%22%3A1%2C%22email%22%3A1%7D" \
  -H "Accept: application/json" \
  -b cookies.txt

# URL декодований filter: {"role":"admin"}
# URL декодований projection: {"firstName":1,"lastName":1,"email":1}
```

**Очікувана відповідь:**
```json
{
  "message": "Знайдено 1 користувачів",
  "users": [
    {
      "_id": 1,
      "firstName": "Олександр",
      "lastName": "Адміністратор",
      "email": "admin@example.com"
    }
  ]
}
```

```bash
# Знайти активних користувачів з роллю editor або moderator
curl "http://localhost:3000/users/find?filter=%7B%22isActive%22%3Atrue%2C%22role%22%3A%7B%22%24in%22%3A%5B%22editor%22%2C%22moderator%22%5D%7D%7D&projection=%7B%22username%22%3A1%2C%22role%22%3A1%7D" \
  -H "Accept: application/json" \
  -b cookies.txt

# URL декодований filter: {"isActive":true,"role":{"$in":["editor","moderator"]}}
# URL декодований projection: {"username":1,"role":1}
```

##### **GET /articles/find** - Пошук статей з фільтрами та проекціями
```bash
# Знайти опубліковані статті категорії "Технології", показати тільки заголовок та автора
curl "http://localhost:3000/articles/find?filter=%7B%22isPublished%22%3Atrue%2C%22category%22%3A%22%D0%A2%D0%B5%D1%85%D0%BD%D0%BE%D0%BB%D0%BE%D0%B3%D1%96%D1%97%22%7D&projection=%7B%22title%22%3A1%2C%22authorName%22%3A1%2C%22views%22%3A1%7D" \
  -H "Accept: application/json" \
  -b cookies.txt

# URL декодований filter: {"isPublished":true,"category":"Технології"}
# URL декодований projection: {"title":1,"authorName":1,"views":1}
```

**Очікувана відповідь:**
```json
{
  "message": "Знайдено 3 статей",
  "articles": [
    {
      "_id": 1,
      "title": "Введення в MongoDB для початківців",
      "authorName": "Олександр Адміністратор",
      "views": 1250
    },
    {
      "_id": 2,
      "title": "Express.js та MongoDB: Повний гід",
      "authorName": "Марина Редакторка",
      "views": 890
    },
    {
      "_id": 4,
      "title": "Aggregation Pipeline в MongoDB",
      "authorName": "Олександр Адміністратор",
      "views": 567
    }
  ]
}
```

```bash
# Знайти статті з тегом "MongoDB" з більш ніж 500 переглядами
curl "http://localhost:3000/articles/find?filter=%7B%22tags%22%3A%22MongoDB%22%2C%22views%22%3A%7B%22%24gt%22%3A500%7D%7D&projection=%7B%22title%22%3A1%2C%22views%22%3A1%2C%22likes%22%3A1%7D" \
  -H "Accept: application/json" \
  -b cookies.txt

# URL декодований filter: {"tags":"MongoDB","views":{"$gt":500}}
# URL декодований projection: {"title":1,"views":1,"likes":1}
```

## Файлова структура

```
hw02-mongodb/
├── src/
│   ├── server.mjs              # Головний сервер з MongoDB Atlas підключенням
│   ├── data/
│   │   └── seedDatabase.mjs    # 🆕 Автоматична ініціалізація БД
│   ├── config/
│   │   └── passport.mjs        # Passport LocalStrategy
│   ├── models/
│   │   ├── User.mjs           # 🔄 MongoDB CRUD + нові операції
│   │   ├── Article.mjs        # 🔄 MongoDB CRUD + нові операції
│   │   └── index.mjs          # Експорт моделей
│   ├── controllers/
│   │   ├── UserController.mjs # 🔄 Спрощені CRUD + MongoDB методи
│   │   ├── ArticleController.mjs # 🔄 Спрощені CRUD + MongoDB методи
│   │   └── index.mjs          # Експорт контролерів
│   ├── routes/                # 🔄 Маршрути з новими endpoints
│   │   ├── users.mjs          # CRUD + insertOne/Many, updateOne/Many, тощо
│   │   ├── articles.mjs       # CRUD + insertOne/Many, updateOne/Many, тощо
│   │   ├── auth.mjs           # Авторизація
│   │   └── settings.mjs       # Налаштування
│   ├── views/                 # 🔄 Pug/EJS шаблони для реальних даних
│   │   ├── users/             # Pug шаблони користувачів
│   │   ├── articles/          # EJS шаблони статей
│   │   ├── auth/              # Сторінки авторизації
│   │   └── home/              # Головні сторінки
│   └── middleware/            # Middleware для авторизації
├── public/                    # Статичні файли
├── sessions/                  # Persistent сесії
├── .env                      # 🆕 Environment змінні (MongoDB URI)
├── package.json              # Залежності з MongoDB driver
└── README.md                 # Ця документація
```

## Залежності

### Основні
- `express` 5.1.0 - веб фреймворк
- `mongodb` 6.20.0 - **🆕 MongoDB Driver для нових операцій**
- `passport` 0.7.0 - авторизація
- `express-session` - управління сесіями
- `bcryptjs` - хешування паролів
- `pug` / `ejs` - шаблонізатори
- `dotenv` - **🆕 Environment змінні**

### Розробка
- `nodemon` - автоперезапуск під час розробки

## Технології

- **Backend**: Node.js + Express.js 5.1.0
- **База даних**: **🆕 MongoDB Atlas** (замість mock даних)
- **Автентифікація**: Passport.js LocalStrategy
- **Сесії**: Express-session з file-store
- **Шаблони**: Pug + EJS
- **Нові MongoDB операції**: insertOne/insertMany, updateOne/updateMany/replaceOne, deleteOne/deleteMany, find з проекціями

---

**MongoDB Atlas Integration** ✅ **Реалізовано повністю!**

**У браузері:**
- Відкрийте `http://localhost:3000`
- Переглядайте реальні дані користувачів і статей
- Тестуйте нові API endpoints з curl

**Через MongoDB Atlas:**
- Увійдіть у свій кластер
- Перевірте наявність бази `blog`
- Переглядайте колекції `users` та `articles`

### **Технічна реалізація**

#### **Архітектура реалізації:**
- **Моделі** (`src/models/`): MongoDB операції (insertOne, updateOne, find, тощо)
- **Контролери** (`src/controllers/`): HTTP обробка запитів та відповідей
- **Маршрути** (`src/routes/`): REST API endpoints для кожної операції

#### **Ключові методи в моделях:**
```javascript
// UserModel.mjs та ArticleModel.mjs
static async insertOne(data)              // MongoDB insertOne
static async insertMany(dataArray)       // MongoDB insertMany  
static async updateOneByFilter(filter, update)    // MongoDB updateOne
static async updateManyByFilter(filter, update)   // MongoDB updateMany
static async replaceOneByFilter(filter, replacement) // MongoDB replaceOne
static async deleteOneByFilter(filter)    // MongoDB deleteOne
static async deleteManyByFilter(filter)   // MongoDB deleteMany
static async findWithProjection(filter, projection) // MongoDB find з проекціями
```

#### **HTTP Endpoints:**
- **POST** `/users/insertOne` та `/articles/insertOne`
- **POST** `/users/insertMany` та `/articles/insertMany`  
- **PUT** `/users/updateOne` та `/articles/updateOne`
- **PUT** `/users/updateMany` та `/articles/updateMany`
- **PUT** `/users/replaceOne` та `/articles/replaceOne`
- **DELETE** `/users/deleteOne` та `/articles/deleteOne`
- **DELETE** `/users/deleteMany` та `/articles/deleteMany`
- **GET** `/users/find` та `/articles/find`

#### **Приклади використання:**
Детальні приклади curl запитів та JSON відповідей наведені в секції "API Ендпоінти" вище.

## 🔧 **Технічні деталі MongoDB інтеграції**

### **Колекції та схеми**

#### **Колекція `users`:**
```javascript
{
  _id: Number,           // Унікальний ідентифікатор
  username: String,      // Унікальне ім'я користувача  
  firstName: String,     // Ім'я
  lastName: String,      // Прізвище
  email: String,         // Унікальний email
  password: String,      // Хешований пароль (bcryptjs)
  role: String,          // admin, editor, moderator, user
  isActive: Boolean,     // Статус активності
  createdAt: Date,       // Дата реєстрації
  updatedAt: Date,       // Дата останнього оновлення
  profileImage: String   // Шлях до аватара
}
```

#### **Колекція `articles`:**
```javascript
{
  _id: Number,           // Унікальний ідентифікатор
  title: String,         // Заголовок статті
  content: String,       // Повний текст статті
  authorId: Number,      // ID автора з колекції users
  authorName: String,    // Ім'я автора (денормалізовано)
  category: String,      // Категорія статті
  tags: [String],        // Масив тегів
  views: Number,         // Кількість переглядів
  likes: Number,         // Кількість лайків
  isPublished: Boolean,  // Статус публікації
  createdAt: Date,       // Дата створення
  updatedAt: Date        // Дата останнього оновлення
}
```

### **Особливості реалізації**

#### **Підключення та життєвий цикл:**
```javascript
// Асинхронне підключення при старті
async function connectToMongoDB() {
  await client.connect();
  db = client.db(dbName);
  await db.admin().ping(); // Тестування
  await initializeDatabase(db); // Ініціалізація
}

// Коректне закриття при зупинці
process.on('SIGINT', async () => {
  await client.close();
  process.exit(0);
});
```

#### **Захист від дублювання:**
```javascript
// Перевірка існування колекцій
const collections = await db.listCollections().toArray();
const collectionNames = collections.map(col => col.name);

if (!collectionNames.includes('users')) {
  // Створюємо тільки якщо не існує
}
```

#### **Гнучка обробка ID:**
```javascript
// Підтримка string та number ID
const query = isNaN(userId) 
  ? { _id: userId } 
  : { _id: parseInt(userId) };
```

### **Переваги MongoDB рішення**

#### **Продуктивність:**
- ✅ **Сортування на рівні БД** замість в пам'яті
- ✅ **Лімітовані запити** для великих колекцій
- ✅ **Projection** для отримання тільки потрібних полів

#### **Масштабованість:**
- ✅ **MongoDB Atlas** автоматично масштабується
- ✅ **Реплікація** для високої доступності
- ✅ **Горизонтальне шардування** при потребі
- ✅ **Кешування** на рівні драйвера

#### **Функціональність:**
- ✅ **Текстовий пошук** з релевантністю
- ✅ **Aggregation pipeline** для складної аналітики
- ✅ **Геопросторові запити** (можна додати)
- ✅ **Транзакції** для критичних операцій

#### **Безпека:**
- ✅ **Хешування паролів** з bcryptjs salt=10
- ✅ **Валідація на рівні програми** перед збереженням
- ✅ **HTTPS підключення** до Atlas

## 📊 **Моніторинг та налагодження**

### **Логування операцій:**
```javascript
// Всі MongoDB операції логуються
console.log('✅ Успішно підключено до MongoDB Atlas');
console.log('📄 Використовується база даних: blog');
console.log('🏓 MongoDB Atlas відповідає на ping');

// Помилки з деталями
console.error('❌ Помилка отримання користувачів:', error);
```

### **Статистика використання:**
```javascript
// Автоматичні лічильники
await db.collection('articles').updateOne(
  query,
  { $inc: { views: 1 } }
);

// Агрегована статистика
const stats = await UserModel.getStats();
// { total: 13, active: 12, byRole: [...] }
```

### **Відстеження у MongoDB Atlas:**
- Перегляд запитів у реальному часі
- Моніторинг з'єднань та операцій
- Сповіщення про помилки

Сервер буде доступний на `http://localhost:3000`

## Приклади використання

### Браузерні маршрути
- `http://localhost:3000` - Головна сторінка з авторизацією
- `http://localhost:3000/users` - Користувачі (потребує авторизацію)
- `http://localhost:3000/articles` - Статті (потребує роль admin)
- `http://localhost:3000/settings` - Налаштування тем (публічно)
- `http://localhost:3000/protected` - Захищений маршрут з інформацією про сесію

### API запити з Passport сесіями
Сесії автоматично підтримуються через express-session після авторизації.

**Отримати користувачів (потребує активну сесію):**
```bash
# Спочатку авторизуйтеся через браузер
# Потім використовуйте cookie-jar для збереження session cookie
curl http://localhost:3000/users \
  -H "Accept: application/json" \
  --cookie-jar cookies.txt
```

**Створити користувача (потребує активну сесію):**
```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"name": "John", "email": "john@example.com"}'
```

**Перевірка статусу сесії:**
```bash
curl http://localhost:3000/protected \
  -H "Accept: application/json" \
  -b cookies.txt
```

## Безпека

### Passport + Express Session
- **httpOnly cookies** - захист від XSS атак
- **Хешування паролів** через bcryptjs з salt=10
- **Persistent session storage** - файлове зберігання сесій
- **Час життя сесії**: 7 днів з автоматичним оновленням
- **CSRF захист** через різноманітні middleware

### Рівні доступу
- **Публічні**: /, /auth/*, /settings/*
- **Користувачі**: /users/* (активна сесія)
- **Адміністратори**: /articles/* (сесія + admin роль)
- **Захищений**: /protected (демонстрація сесійної інформації)

## Обробка помилок

### Помилки авторизації
- **401 Unauthorized**: Відсутня активна сесія
- **403 Forbidden**: Недостатньо прав (не admin для статей)
- **Session expired**: Сесія закінчилася (7 днів)

### Загальні помилки  
- **404 Not Found**: Ресурс не знайдено
- **500 Internal Server Error**: Помилка сервера

## Архітектурні рішення

## 🏗️ **Архітектурні рішення**

### **MongoDB інтеграція**
- **Офіційний драйвер**: MongoDB Node.js Driver 6.20.0 для максимальної сумісності
- **Асинхронна архітектура**: Повна підтримка async/await у всіх шарах
- **Централізоване підключення**: Єдиний db експорт для всіх моделей
- **Автоматична ініціалізація**: Створення колекцій при першому запуску

### **Еволюція від mock даних**
- **Було**: Статичні масиви у `mockData.mjs`
- **Стало**: Динамічні запити до MongoDB Atlas
- **Переваги**: Персистентність, масштабованість, реальні дані

### **Модульна структура**
- **Моделі**: Повноцінні CRUD операції з MongoDB
- **Контролери**: Асинхронна обробка з обробкою помилок  
- **View класи**: Структуроване форматування реальних даних
- **Шаблони**: Динамічне відображення з MongoDB

### **Обробка даних**
```javascript
// Потік обробки запитів з MongoDB:
GET /users → UserController → 
  await UserModel.getAll() → 
  MongoDB Query → 
  Pug Template → HTML

GET /articles → ArticleController → 
  await ArticleModel.getAll() → 
  MongoDB Query → 
  EJS Template → HTML

// API запити:
GET /users (JSON) → UserController → 
  await UserModel.getAll() → 
  UserView.renderUsersList() → JSON
```

## 📋 **Конфігурація та використання**

### **Шаблонізатори з реальними даними**
```javascript
// server.mjs
app.set('view engine', 'pug');      // Дефолтний для Pug
app.engine('ejs', ejs.renderFile);  // Додатковий для EJS

// Контролери з MongoDB даними
res.render('users/users', { users: await UserModel.getAll() });     // Pug
res.render('articles/articles.ejs', { articles: await ArticleModel.getAll() }); // EJS
```

### **Реальні дані замість mock**
- **Було**: `existingUserIds = ['1', '2', '3', '123']`
- **Стало**: `await db.collection('users').find({}).toArray()`
- **Результат**: 13 користувачів з повною інформацією

Проект успішно мігровано з статичних mock даних на повноцінну хмарну базу даних MongoDB Atlas з автоматичною ініціалізацією та новими MongoDB операціями згідно завдання.

## 🔧 **Виправлені помилки**

### **❌➡️✅ Passport.js інтеграція з MongoDB**
**Проблема:** Passport.js був налаштований на роботу зі статичним масивом користувачів замість MongoDB.

**Виправлення (18.10.2025):**
- ✅ **Замінено статичний масив** на MongoDB запити через UserModel
- ✅ **Оновлено LocalStrategy**: тепер використовує `UserModel.findByEmail()`
- ✅ **Виправлено серіалізацію/десеріалізацію**: асинхронні запити до MongoDB
- ✅ **Додано обробку помилок**: детальне логування MongoDB операцій
- ✅ **Підтримка повних даних користувача**: firstName, lastName, role з MongoDB

**Результат:** Тепер авторизація працює з реальними користувачами з MongoDB Atlas (admin@example.com/admin123, user@example.com/user123).

### **❌➡️✅ Виправлення циклічних залежностей**
**Проблема:** Циклічна залежність між server.mjs ↔ passport.mjs ↔ models/User.mjs ↔ server.mjs

**Виправлення (18.10.2025):**
- ✅ **Створено окремий файл database.mjs**: Винесено підключення MongoDB в src/config/database.mjs
- ✅ **Усунуто циклічні імпорти**: Моделі тепер імпортують db з config/database.mjs
- ✅ **Оптимізовано архітектуру**: Чітке розділення відповідальності між компонентами
- ✅ **Додано updatedAt поле**: Автоматичне додавання для сумісності з Passport
- ✅ **Захист від відсутніх полів**: Безпечна обробка необов'язкових полів користувачів

**Результат:** Усунуто несумісність, код стає більш модульним та підтримуваним.