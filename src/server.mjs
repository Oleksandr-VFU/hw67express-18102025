import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import ejs from 'ejs';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import FileStore from 'session-file-store';
import passport from 'passport';
import dotenv from 'dotenv';
import { connectToMongoDB, closeMongoDB } from './config/database.mjs';
import usersRouter from './routes/users.mjs';
import articlesRouter from './routes/articles.mjs';
import settingsRouter from './routes/settings.mjs';
import authRouter from './routes/auth.mjs';
import protectedRouter from './routes/protected.mjs';
import { requestLogger, passportAuthMiddleware, requireAdmin, protectedRouteMiddleware } from './middleware/index.mjs';
import { HomeController } from './controllers/HomeController.mjs';
import './config/passport.mjs'; // Конфігурація Passport стратегій 

// Завантажуємо environment змінні
dotenv.config();

// Отримуємо __dirname для ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Створюємо EXPRESS сервер
const app = express();
const PORT = process.env.PORT || 3000;

// Налаштування шаблонізаторів
app.set('view engine', 'pug'); // Дефолтний view engine для Pug
app.set('views', path.join(__dirname, 'views'));

// Реєстрація EJS engine для .ejs файлів
app.engine('ejs', ejs.renderFile);

// Middleware для парсингу JSON
app.use(express.json());

// Middleware для парсингу URL-encoded даних форм
app.use(express.urlencoded({ extended: true }));

// Middleware для парсингу cookies
app.use(cookieParser());

// Налаштування сесій для Passport з безпечними налаштуваннями
const isProduction = process.env.NODE_ENV === 'production';
const sessionSecret = process.env.SESSION_SECRET || 'development-session-secret-change-in-production';

// Створюємо FileStore для збереження сесій
const SessionFileStore = FileStore(session);

app.use(session({
  name: 'sessionId', // Кастомна назва cookie замість connect.sid
  secret: sessionSecret,
  resave: false, // Не зберігати сесію якщо вона не змінилась
  saveUninitialized: false, // Не зберігати порожні сесії
  rolling: true, // Оновлювати час життя cookie при кожному запиті
  store: new SessionFileStore({
    path: './sessions', // Папка для збереження сесій
    ttl: 7 * 24 * 60 * 60, // Час життя сесії в секундах (7 днів)
    retries: 2, // Зменшена кількість спроб
    factor: 2, // Фактор затримки між спробами
    minTimeout: 50, // Мінімальна затримка
    maxTimeout: 200, // Максимальна затримка
    logFn: function() {} // Вимикаємо логування помилок session-file-store
  }),
  cookie: { 
    httpOnly: true, // Захист від XSS атак - cookie недоступні через JavaScript
    secure: isProduction, // Тільки HTTPS в продакшені
    sameSite: 'lax', // Захист від CSRF атак
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 днів для тривалої авторизації
  }
}));

// Ініціалізація Passport
app.use(passport.initialize());
app.use(passport.session());

// Налаштування статичних файлів
app.use(express.static(path.join(__dirname, '..', 'public')));

// Маршрути сервера

// Root route з мідлваром логування - показуємо форму авторизації або дашборд
app.get('/', requestLogger, HomeController.getHomePage);

// Публічні маршрути (без авторизації)
app.use('/auth', authRouter);
app.use('/settings', settingsRouter);

// Захищені маршрути (потребують авторизації через Passport)
app.use('/users', passportAuthMiddleware, usersRouter);
app.use('/articles', passportAuthMiddleware, requireAdmin, articlesRouter);

// Спеціальний захищений маршрут з детальною перевіркою сесії
app.use('/protected', protectedRouteMiddleware, protectedRouter);

// Глобальні обробники помилок

// Обробка неіснуючих маршрутів (404)
app.use((req, res) => {
  res.status(404).send('Not Found');
});

// Глобальна обробка помилок (500)
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  // Перевіряємо чи вже відправлені заголовки
  if (!res.headersSent) {
    res.status(500).send('Internal Server Error');
  }
});

// Запускаємо сервер з підключенням до MongoDB
async function startServer() {
  try {
    // Спочатку підключаємося до MongoDB
    await connectToMongoDB();
    
    // Потім запускаємо Express сервер
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`🌐 http://localhost:${PORT}`);
    });
    
    // Обробка коректного закриття сервера
    process.on('SIGINT', async () => {
      console.log('\n⏹️ Отримано сигнал SIGINT. Закриваємо сервер...');
      
      try {
        await closeMongoDB();
        
        server.close(() => {
          console.log('✅ Express сервер закрито');
          process.exit(0);
        });
      } catch (error) {
        console.error('❌ Помилка при закритті:', error);
        process.exit(1);
      }
    });
    
  } catch (error) {
    console.error('❌ Помилка запуску сервера:', error);
    process.exit(1);
  }
}

// Запуск сервера
startServer();
