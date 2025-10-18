import bcrypt from 'bcryptjs';

/**
 * Реалістичні дані для ініціалізації MongoDB колекцій
 */

// Функція для створення хешованого пароля
const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

// Користувачі з реалістичними даними
export const getUsersData = async () => {
  return [
    {
      _id: 1,
      username: 'admin',
      email: 'admin@example.com',
      password: await hashPassword('admin123'),
      role: 'admin',
      firstName: 'Олександр',
      lastName: 'Адміністратор',
      createdAt: new Date('2024-01-15T10:30:00Z'),
      isActive: true,
      profileImage: '/images/admin.jpg'
    },
    {
      _id: 2,
      username: 'user',
      email: 'user@example.com',
      password: await hashPassword('user123'),
      role: 'user',
      firstName: 'Марія',
      lastName: 'Петренко',
      createdAt: new Date('2024-02-20T14:15:00Z'),
      isActive: true,
      profileImage: '/images/user.jpg'
    },
    {
      _id: 3,
      username: 'ivanpetrenko',
      email: 'ivan.petrenko@gmail.com',
      password: await hashPassword('ivan2024'),
      role: 'user',
      firstName: 'Іван',
      lastName: 'Петренко',
      createdAt: new Date('2024-03-10T09:20:00Z'),
      isActive: true,
      profileImage: '/images/ivan.jpg'
    },
    {
      _id: 4,
      username: 'annakovalenko',
      email: 'anna.kovalenko@yahoo.com',
      password: await hashPassword('secure123'),
      role: 'editor',
      firstName: 'Анна',
      lastName: 'Коваленко',
      createdAt: new Date('2024-03-22T16:45:00Z'),
      isActive: true,
      profileImage: '/images/anna.jpg'
    },
    {
      _id: 5,
      username: 'dmitroivanov',
      email: 'dmitro.ivanov@ukr.net',
      password: await hashPassword('dmitro456'),
      role: 'user',
      firstName: 'Дмитро',
      lastName: 'Іванов',
      createdAt: new Date('2024-04-05T11:30:00Z'),
      isActive: true,
      profileImage: '/images/dmitro.jpg'
    },
    {
      _id: 6,
      username: 'olenashevchenko',
      email: 'olena.shevchenko@i.ua',
      password: await hashPassword('olena789'),
      role: 'user',
      firstName: 'Олена',
      lastName: 'Шевченко',
      createdAt: new Date('2024-04-18T13:10:00Z'),
      isActive: true,
      profileImage: '/images/olena.jpg'
    },
    {
      _id: 7,
      username: 'sergeymelnyk',
      email: 'sergey.melnyk@gmail.com',
      password: await hashPassword('sergey2024'),
      role: 'moderator',
      firstName: 'Сергій',
      lastName: 'Мельник',
      createdAt: new Date('2024-05-02T08:25:00Z'),
      isActive: true,
      profileImage: '/images/sergey.jpg'
    },
    {
      _id: 8,
      username: 'tatyanabondarenko',
      email: 'tatyana.bondarenko@outlook.com',
      password: await hashPassword('tatyana321'),
      role: 'user',
      firstName: 'Тетяна',
      lastName: 'Бондаренко',
      createdAt: new Date('2024-05-15T17:20:00Z'),
      isActive: true,
      profileImage: '/images/tatyana.jpg'
    },
    {
      _id: 9,
      username: 'andriymoroz',
      email: 'andriy.moroz@meta.ua',
      password: await hashPassword('andriy555'),
      role: 'user',
      firstName: 'Андрій',
      lastName: 'Мороз',
      createdAt: new Date('2024-06-01T12:40:00Z'),
      isActive: false,
      profileImage: '/images/andriy.jpg'
    },
    {
      _id: 10,
      username: 'yuliiatimchenko',
      email: 'yuliia.timchenko@gmail.com',
      password: await hashPassword('yuliia777'),
      role: 'user',
      firstName: 'Юлія',
      lastName: 'Тимченко',
      createdAt: new Date('2024-06-20T15:55:00Z'),
      isActive: true,
      profileImage: '/images/yuliia.jpg'
    },
    {
      _id: 11,
      username: 'viktorvolkov',
      email: 'viktor.volkov@ukr.net',
      password: await hashPassword('viktor999'),
      role: 'user',
      firstName: 'Віктор',
      lastName: 'Волков',
      createdAt: new Date('2024-07-08T10:15:00Z'),
      isActive: true,
      profileImage: '/images/viktor.jpg'
    },
    {
      _id: 12,
      username: 'svetlanakarpenko',
      email: 'svetlana.karpenko@i.ua',
      password: await hashPassword('svetlana111'),
      role: 'editor',
      firstName: 'Світлана',
      lastName: 'Карпенко',
      createdAt: new Date('2024-07-25T14:30:00Z'),
      isActive: true,
      profileImage: '/images/svetlana.jpg'
    },
    {
      _id: 123,
      username: 'testuser',
      email: 'test@test.com',
      password: await hashPassword('test123'),
      role: 'user',
      firstName: 'Тест',
      lastName: 'Користувач',
      createdAt: new Date('2024-08-01T09:00:00Z'),
      isActive: true,
      profileImage: '/images/test.jpg'
    }
  ];
};

// Статті з реалістичним контентом
export const getArticlesData = () => {
  return [
    {
      _id: 1,
      title: 'Введення в MongoDB для початківців',
      content: `MongoDB є однією з найпопулярніших NoSQL баз даних у світі. У цій статті ми розглянемо основні концепції MongoDB та навчимося створювати базові операції CRUD.

Основні переваги MongoDB:
- Гнучка схема документів
- Горизонтальне масштабування
- Підтримка складних запитів

MongoDB зберігає дані у форматі BSON (Binary JSON), що дозволяє ефективно працювати з різними типами даних включно з масивами та вкладеними об'єктами.`,
      authorId: 1,
      authorName: 'Олександр Адміністратор',
      category: 'Технології',
      tags: ['MongoDB', 'NoSQL', 'Бази даних', 'Backend'],
      createdAt: new Date('2024-09-01T10:00:00Z'),
      updatedAt: new Date('2024-09-01T10:00:00Z'),
      isPublished: true,
      views: 1250,
      likes: 89
    },
    {
      _id: 2,
      title: 'Express.js та RESTful API розробка',
      content: `Express.js є мінімалістичним та гнучким Node.js веб-фреймворком, який надає надійний набір функцій для веб та мобільних додатків.

Ключові особливості Express.js:
- Швидке налаштування серверу
- Middleware архітектура
- Підтримка шаблонізаторів
- Роутинг та обробка HTTP запитів

У цій статті ми створимо повноцінний RESTful API з аутентифікацією, валідацією даних та обробкою помилок.`,
      authorId: 4,
      authorName: 'Анна Коваленко',
      category: 'Веб-розробка',
      tags: ['Express.js', 'Node.js', 'REST API', 'Backend'],
      createdAt: new Date('2024-09-05T14:30:00Z'),
      updatedAt: new Date('2024-09-06T09:15:00Z'),
      isPublished: true,
      views: 980,
      likes: 76
    },
    {
      _id: 3,
      title: 'Безпека веб-додатків: найкращі практики',
      content: `Безпека веб-додатків є критично важливою у сучасному цифровому світі. Розглянемо основні загрози та методи захисту.

Основні загрози:
- SQL ін'єкції
- XSS (Cross-Site Scripting)
- CSRF (Cross-Site Request Forgery)
- Небезпечні десеріалізації

Методи захисту включають валідацію вхідних даних, використання HTTPS, правильне управління сесіями та регулярні оновлення безпеки.`,
      authorId: 7,
      authorName: 'Сергій Мельник',
      category: 'Безпека',
      tags: ['Безпека', 'Веб-розробка', 'Кібербезпека', 'HTTPS'],
      createdAt: new Date('2024-09-10T16:20:00Z'),
      updatedAt: new Date('2024-09-10T16:20:00Z'),
      isPublished: true,
      views: 1456,
      likes: 134
    },
    {
      _id: 4,
      title: 'React Hooks: глибоке занурення',
      content: `React Hooks змінили спосіб написання React компонентів, дозволяючи використовувати стан та інші можливості React без написання класових компонентів.

Основні Hooks:
- useState для управління станом
- useEffect для side effects
- useContext для глобального стану
- useReducer для складної логіки стану

Ми також розглянемо створення власних хуків та оптимізацію продуктивності за допомогою useMemo та useCallback.`,
      authorId: 12,
      authorName: 'Світлана Карпенко',
      category: 'Frontend',
      tags: ['React', 'Hooks', 'JavaScript', 'Frontend'],
      createdAt: new Date('2024-09-15T11:45:00Z'),
      updatedAt: new Date('2024-09-16T08:30:00Z'),
      isPublished: true,
      views: 2103,
      likes: 187
    },
    {
      _id: 5,
      title: 'Docker для початківців: контейнеризація додатків',
      content: `Docker революціонізував спосіб розгортання та управління додатками через контейнеризацію. 

Переваги Docker:
- Ізоляція додатків
- Портативність між середовищами
- Ефективне використання ресурсів
- Швидке розгортання

У цій статті ми навчимося створювати Dockerfile, управляти контейнерами та використовувати Docker Compose для мультиконтейнерних додатків.`,
      authorId: 3,
      authorName: 'Іван Петренко',
      category: 'DevOps',
      tags: ['Docker', 'Контейнеризація', 'DevOps', 'Розгортання'],
      createdAt: new Date('2024-09-20T13:15:00Z'),
      updatedAt: new Date('2024-09-20T13:15:00Z'),
      isPublished: true,
      views: 876,
      likes: 67
    },
    {
      _id: 6,
      title: 'TypeScript vs JavaScript: коли використовувати що',
      content: `TypeScript додає статичну типізацію до JavaScript, що допомагає виявляти помилки на етапі розробки.

Переваги TypeScript:
- Статична типізація
- Кращий IntelliSense
- Рефакторинг коду
- Об'єктно-орієнтоване програмування

Однак JavaScript залишається простішим для невеликих проектів. Розглянемо критерії вибору між цими мовами.`,
      authorId: 5,
      authorName: 'Дмитро Іванов',
      category: 'Програмування',
      tags: ['TypeScript', 'JavaScript', 'Типізація', 'Frontend'],
      createdAt: new Date('2024-09-25T09:30:00Z'),
      updatedAt: new Date('2024-09-25T09:30:00Z'),
      isPublished: true,
      views: 1678,
      likes: 145
    },
    {
      _id: 7,
      title: 'GraphQL проти REST: порівняння API підходів',
      content: `GraphQL та REST є двома популярними підходами до створення API. Кожен має свої переваги та недоліки.

GraphQL переваги:
- Точне отримання даних
- Один endpoint
- Сильна типізація
- Інтроспекція

REST переваги:
- Простота
- Кешування
- Стандартизовані HTTP методи
- Широка підтримка

Вибір залежить від специфіки проекту та команди розробників.`,
      authorId: 6,
      authorName: 'Олена Шевченко',
      category: 'API',
      tags: ['GraphQL', 'REST', 'API', 'Backend'],
      createdAt: new Date('2024-09-28T15:45:00Z'),
      updatedAt: new Date('2024-09-29T10:20:00Z'),
      isPublished: true,
      views: 743,
      likes: 58
    },
    {
      _id: 8,
      title: 'CSS Grid та Flexbox: сучасна верстка',
      content: `CSS Grid та Flexbox є потужними інструментами для створення сучасних макетів веб-сторінок.

CSS Grid підходить для:
- Двовимірних макетів
- Складних сіток
- Позиціонування елементів

Flexbox ідеальний для:
- Одновимірних макетів
- Вирівнювання елементів
- Розподілу простору

Розглянемо практичні приклади використання обох технологій.`,
      authorId: 8,
      authorName: 'Тетяна Бондаренко',
      category: 'CSS',
      tags: ['CSS', 'Grid', 'Flexbox', 'Верстка'],
      createdAt: new Date('2024-10-02T12:10:00Z'),
      updatedAt: new Date('2024-10-02T12:10:00Z'),
      isPublished: true,
      views: 1234,
      likes: 98
    },
    {
      _id: 9,
      title: 'Тестування JavaScript додатків з Jest',
      content: `Jest є популярним фреймворком для тестування JavaScript додатків, розробленим Facebook.

Типи тестів:
- Unit тести
- Integration тести
- Snapshot тести
- Тести покриття коду

Jest надає потужні можливості для мокування, асинхронного тестування та генерації звітів покриття. Розглянемо написання якісних тестів.`,
      authorId: 10,
      authorName: 'Юлія Тимченко',
      category: 'Тестування',
      tags: ['Jest', 'Тестування', 'JavaScript', 'QA'],
      createdAt: new Date('2024-10-05T14:25:00Z'),
      updatedAt: new Date('2024-10-05T14:25:00Z'),
      isPublished: true,
      views: 567,
      likes: 42
    },
    {
      _id: 10,
      title: 'Мікросервісна архітектура: переваги та виклики',
      content: `Мікросервісна архітектура розбиває монолітний додаток на незалежні сервіси.

Переваги:
- Незалежне розгортання
- Технологічна різноманітність
- Масштабованість
- Відмовостійкість

Виклики:
- Складність мережевої взаємодії
- Управління даними
- Моніторинг та логування
- Тестування

Розглянемо паттерни та інструменти для мікросервісів.`,
      authorId: 11,
      authorName: 'Віктор Волков',
      category: 'Архітектура',
      tags: ['Мікросервіси', 'Архітектура', 'Масштабування', 'Backend'],
      createdAt: new Date('2024-10-08T16:40:00Z'),
      updatedAt: new Date('2024-10-08T16:40:00Z'),
      isPublished: true,
      views: 891,
      likes: 73
    },
    {
      _id: 456,
      title: 'Optimizing Database Performance in Production',
      content: `Оптимізація продуктивності бази даних є критично важливою для високонавантажених додатків.

Основні стратегії:
- Оптимізація запитів
- Кешування результатів
- Партиціонування таблиць

Розглянемо практичні підходи до моніторингу та покращення продуктивності MongoDB та SQL баз даних у продакшн середовищі.`,
      authorId: 1,
      authorName: 'Олександр Адміністратор',
      category: 'Бази даних',
      tags: ['Оптимізація', 'База даних', 'Продуктивність', 'MongoDB'],
      createdAt: new Date('2024-10-10T10:30:00Z'),
      updatedAt: new Date('2024-10-11T08:15:00Z'),
      isPublished: true,
      views: 423,
      likes: 31
    }
  ];
};

/**
 * Функція для ініціалізації колекцій у MongoDB
 */
export const initializeDatabase = async (db) => {
  try {
    console.log('🚀 Починаємо ініціалізацію бази даних...');

    // Перевіряємо чи колекції вже існують
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(col => col.name);

    // Ініціалізація колекції користувачів
    if (!collectionNames.includes('users')) {
      console.log('👥 Створюємо колекцію users...');
      const usersCollection = db.collection('users');
      const usersData = await getUsersData();
      
      await usersCollection.insertMany(usersData);
      
      console.log(`✅ Створено ${usersData.length} користувачів`);
    } else {
      console.log('👥 Колекція users вже існує');
    }

    // Ініціалізація колекції статей
    if (!collectionNames.includes('articles')) {
      console.log('📚 Створюємо колекцію articles...');
      const articlesCollection = db.collection('articles');
      const articlesData = getArticlesData();
      
      await articlesCollection.insertMany(articlesData);
      
      console.log(`✅ Створено ${articlesData.length} статей`);
    } else {
      console.log('📚 Колекція articles вже існує');
    }

    console.log('🎉 Ініціалізація бази даних завершена успішно!');
    
    // Виводимо статистику
    const usersCount = await db.collection('users').countDocuments();
    const articlesCount = await db.collection('articles').countDocuments();
    
    console.log(`📊 Статистика бази даних:`);
    console.log(`   👥 Користувачів: ${usersCount}`);
    console.log(`   📚 Статей: ${articlesCount}`);
    
  } catch (error) {
    console.error('❌ Помилка ініціалізації бази даних:', error);
    throw error;
  }
};