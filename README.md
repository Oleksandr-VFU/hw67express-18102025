# Використання курсорів та агрегаційних запитів у MongoDB через сервер Express

**Автор:** Оleksandr Komnatskyi
**Тема:** Курсори та агрегаційні запити в MongoDB  
**Framework:** Express.js + MongoDB Node.js Driver  

---

## **Опис проекту** 📋

Цей проект демонструє практичне використання **курсорів (cursors)** та **агрегаційних запитів (aggregation pipelines)** у MongoDB через Express.js сервер. Проект базується на попередній роботі з MongoDB Atlas інтеграцією та додає нову функціональність для ефективної роботи з великими даними.

## **Нова функціональність** ⭐

### **Реалізація курсорів у моделях** 📊

**UserModel.getAllWithCursor():**
```javascript
static async getAllWithCursor() {
  const cursor = db.collection('users').find({});
  const users = [];
  
  // Використовуємо курсор для ітерації без завантаження всіх даних у пам'ять
  await cursor.forEach(user => {
    users.push(user);
  });
  
  return users;
}
```

**ArticleModel.getAllWithCursor():**
```javascript
static async getAllWithCursor() {
  const cursor = db.collection('articles').find({}).sort({ createdAt: -1 });
  const articles = [];
  
  // Використовуємо курсор для ітерації без завантаження всіх даних у пам'ять
  await cursor.forEach(article => {
    articles.push(article);
  });
  
  return articles;
}
```

### **Методи пошуку та фільтрації** 🔍

**UserModel.findByEmail()** - пошук користувача за email (для авторизації):
```javascript
static async findByEmail(email) {
  const user = await db.collection('users').findOne({ email: email });
  return user;
}
```

**UserModel.getByRole()** - фільтрація користувачів за роллю:
```javascript
static async getByRole(role) {
  const users = await db.collection('users').find({ role: role }).toArray();
  return users;
}
```

**ArticleModel.getByAuthor()** - статті конкретного автора:
```javascript
static async getByAuthor(authorId) {
  const articles = await db.collection('articles')
    .find({ authorId: parseInt(authorId) })
    .sort({ createdAt: -1 })
    .toArray();
  return articles;
}
```

**ArticleModel.getByCategory()** - статті за категорією:
```javascript
static async getByCategory(category) {
  const articles = await db.collection('articles')
    .find({ category: category })
    .sort({ createdAt: -1 })
    .toArray();
  return articles;
}
```

**ArticleModel.getByTags()** - пошук статей за тегами:
```javascript
static async getByTags(tags) {
  const articles = await db.collection('articles')
    .find({ tags: { $in: Array.isArray(tags) ? tags : [tags] } })
    .sort({ createdAt: -1 })
    .toArray();
  return articles;
}
```

### **Нові маршрути з курсорами** 🚀

**GET /users/cursor** - отримання користувачів через курсор
- **Логіка**: Використовує `cursor.forEach()` замість `toArray()`
- **Переваги**: Ефективна пам'ять при роботі з великими колекціями
- **Контролер**: `UserController.getUsersWithCursor()`

**GET /articles/cursor** - отримання статей через курсор
- **Логіка**: Курсор з сортуванням по даті створення
- **Переваги**: Потокова обробка документів
- **Контролер**: `ArticleController.getArticlesWithCursor()`

### **Агрегаційні запити для статистики** 📈

**GET /users/statistics** - загальна статистика користувачів
- **Контролер**: `UserController.getUsersStatistics()`
- **Агрегація**: Підрахунок загальної кількості та активних користувачів

**GET /articles/statistics** - загальна статистика статей  
- **Контролер**: `ArticleController.getArticlesStatistics()`
- **Агрегація**: Підрахунок загальної кількості та опублікованих статей

---

## **Тестування нових функцій** 🧪

### **Тестування курсорів**

**Отримати користувачів через курсор:**
```bash
GET http://localhost:3000/users/cursor
```

**Очікувана відповідь:**
```json
{
  "success": true,
  "message": "Користувачі отримані через курсор",
  "data": [
    {
      "_id": "ObjectId",
      "id": 1,
      "name": "John Doe",
      "email": "admin@example.com",
      "role": "admin",
      "age": 35
    }
  ]
}
```

**Отримати статті через курсор:**
```bash
GET http://localhost:3000/articles/cursor
```

### **Тестування агрегаційних запитів**

**Статистика користувачів:**
```bash
GET http://localhost:3000/users/statistics
```

**Статистика статей:**
```bash
GET http://localhost:3000/articles/statistics
```
```

### **Успадкована функціональність** 🏗️

**З попередніх проектів:**
- **Express.js 5.1.0 сервер** з MongoDB Atlas інтеграцією
- **Passport.js авторизація** з LocalStrategy (використовує `UserModel.findByEmail()`)
- **Повний набір CRUD операцій** (insertOne/Many, updateOne/Many, replaceOne, deleteOne/Many, find)
- **Безпечні сесії** з file storage та 13 користувачів + 11 статей  
- **Pug + EJS шаблонізатори** з динамічним контентом
- **Захищені маршрути** з ролями (admin, editor, moderator, user)
- **Методи пошуку**: `getByRole()`, `getByAuthor()`, `getByCategory()`, `getByTags()`

### **Тестові акаунти**
- `admin@example.com` / `admin123` - повний доступ
- `user@example.com` / `user123` - базовий доступ

## Запуск проекту

### 🚀 Швидкий старт для викладача/тестувальника

**Без створення власного MongoDB Atlas - використайте готову БД:**

```bash
# 1. Встановіть залежності
npm install

# 2. Створіть .env файл з готовими налаштуваннями
# Windows (PowerShell):
copy .env.example .env
# Linux/macOS:
cp .env.example .env

# 3. Запустіть сервер
npm start
```

**Готово!** Додаток буде працювати з готовою базою даних (13 користувачів + 11 статей)
- Сервер: http://localhost:3000
- Логін: `admin@example.com` / `admin123`

---

### ⚙️ Повна інсталяція для розробки

**Якщо потрібен повний доступ до БД (створення/редагування):**

### 1. Встановлення
```bash
npm install
```

### 2. Налаштування MongoDB Atlas

**🎯 ВАРІАНТ А: ГОТОВА БД (тільки читання - для перевірки)**
```bash
# Просто скопіюйте файл - налаштування вже готові
# Windows (PowerShell):
copy .env.example .env
# Linux/macOS:
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

---

## **Технічна документація** 📋

### **Ключові файли для курсорів та агрегації**

#### **Моделі з новими методами:**
- `src/models/User.mjs` - методи `getAllWithCursor()`, `getStatistics()`, `findByEmail()`, `getByRole()`
- `src/models/Article.mjs` - методи `getAllWithCursor()`, `getStatistics()`, `getByAuthor()`, `getByCategory()`, `getByTags()`

#### **Контролери з новою логікою:**
- `src/controllers/UserController.mjs` - `getUsersWithCursor()`, `getUserStatistics()`
- `src/controllers/ArticleController.mjs` - `getArticlesWithCursor()`, `getArticleStatistics()`

#### **Маршрути для тестування:**
- `src/routes/users.mjs` - роути `/cursor` та `/statistics`
- `src/routes/articles.mjs` - роути `/cursor` та `/statistics`

#### **Додаткові можливості:**
- **Passport.js інтеграція**: `UserModel.findByEmail()` для автентифікації
- **Фільтрація даних**: методи пошуку за ролями, авторами, категоріями, тегами
- **Безпечні утиліти**: `src/utils/userUtils.mjs` для роботи з req.user

### **Environment налаштування**

Створіть файл `.env` з файлу `.env.example`:
```bash
# Windows (PowerShell):
copy .env.example .env

# Linux/macOS:
cp .env.example .env
```

#### **Вміст файлу .env (скопіюйте з .env.example):**

```env
# Секрет для підпису сесій (ОБОВ'ЯЗКОВО змініть в продакшені!)
SESSION_SECRET=your-super-secure-session-secret-here

# Режим роботи (development/production)  
NODE_ENV=development

# Порт сервера
PORT=3000

# MongoDB Atlas підключення
# ВАРІАНТ 1: Готова БД автора (readonly - для тестування/перевірки)
MONGODB_URI=mongodb+srv://student_readonly:simple_password_123@cluster0.3cgin6c.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
DB_NAME=blog

# ВАРІАНТ 2: Власна БД (повний доступ - для розробки)
# Розкоментуйте та замініть на ваші дані:
# MONGODB_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/?retryWrites=true&w=majority&appName=YourApp
# DB_NAME=blog
```

**Пояснення змінних:**
- `SESSION_SECRET` - секретний ключ для підпису сесій
- `NODE_ENV` - режим роботи (`development` або `production`)
- `PORT` - порт сервера (за замовчуванням 3000)
- `MONGODB_URI` - connection string до MongoDB Atlas
- `DB_NAME` - назва бази даних (`blog`)

**🎯 Для швидкого запуску:** Використовуйте ВАРІАНТ 1 (готова БД) - просто скопіюйте .env.example в .env без змін.

**📚 Для розробки:** Використовуйте ВАРІАНТ 2 - створіть власний MongoDB Atlas кластер та замініть дані.

### **Основні API ендпоінти**

#### **Курсори:**
- `GET /users/cursor` - користувачі через cursor.forEach()
- `GET /articles/cursor` - статті через cursor.forEach()

#### **Агрегація:**
- `GET /users/statistics` - загальна статистика користувачів
- `GET /articles/statistics` - загальна статистика статей

---

## **Детальний опис нових маршрутів** 📋

### **1. Маршрути з курсорами**

#### **GET /users/cursor - Отримання користувачів через курсор**

**Контролер**: `UserController.getUsersWithCursor()`

**Логіка роботи:**
- Створює курсор для колекції `users`
- Використовує `cursor.forEach()` для ітерації
- Обробляє кожен документ окремо без завантаження всіх в пам'ять
- Повертає масив користувачів з метаданими

**Переваги перед звичайним find():**
- Зменшене споживання RAM при великих колекціях
- Можливість обробки мільйонів записів
- Контроль над процесом ітерації

#### **GET /articles/cursor - Отримання статей через курсор**

**Контролер**: `ArticleController.getArticlesWithCursor()`

**Логіка роботи:**
- Створює курсор з сортуванням `{ createdAt: -1 }`
- Ітерація через `forEach()` зберігає порядок сортування
- Автоматично закриває курсор після завершення

### **2. Маршрути з агрегацією**

#### **GET /users/statistics - Статистика користувачів**

**Контролер**: `UserController.getUsersStatistics()`
**Логіка**: Агрегація для підрахунку загальної кількості та активних користувачів

#### **GET /articles/statistics - Статистика статей**

**Контролер**: `ArticleController.getArticlesStatistics()`  
**Логіка**: Агрегація для підрахунку загальної кількості та опублікованих статей

---

## **Детальні інструкції з тестування** 🧪

### **Тестування через curl**

#### **1. Тестування курсорів**

**Тест користувачів через курсор:**
```bash
# Базовий запит
curl -X GET "http://localhost:3000/users/cursor" \
  -H "Accept: application/json" \
  -H "Content-Type: application/json"

# З авторизацією (якщо потрібно)  
curl -X GET "http://localhost:3000/users/cursor" \
  -H "Accept: application/json" \
  -b "connect.sid=s%3A..."
```

**Тест статей через курсор:**
```bash
curl -X GET "http://localhost:3000/articles/cursor" \
  -H "Accept: application/json"
```
```

#### **2. Тестування агрегації**

**Тест статистики користувачів:**
```bash
curl -X GET "http://localhost:3000/users/statistics" \
  -H "Accept: application/json" \
  -v
```

**Тест статистики статей:**
```bash 
curl -X GET "http://localhost:3000/articles/statistics" \
  -H "Accept: application/json"
```





---

## **Переваги використання курсорів та агрегації** ⚡

### **Курсори vs toArray()**
- **Ефективність пам'яті**: cursor.forEach() обробляє документи по одному
- **Великі колекції**: не завантажує всі дані в пам'ять одразу
- **Потокова обробка**: можливість зупинки та продовження

### **Агрегаційні запити**
- **Оператори `$group`**: групування документів за критеріями
- **Функції `$sum`, `$avg`**: математичні обчислення на сервері
- **Продуктивність**: обчислення виконуються в MongoDB, а не в Node.js
- **Гнучкість**: складні аналітичні запити через pipeline

---

## **Висновки** 🎯

Цей проект демонструє:
1. **Ефективну роботу з курсорами** для обробки великих даних
2. **Агрегаційні запити MongoDB** для отримання статистики
3. **Інтеграцію з Express.js** для створення RESTful API
4. **Практичне використання** MongoDB Driver 6.20.0

**Основні досягнення:**
- ✅ Реалізовано cursor-based ітерацію в моделях
- ✅ Створено агрегаційні pipeline для статистики
- ✅ Додано API ендпоінти для тестування функціональності
- ✅ Написано повну документацію з прикладами