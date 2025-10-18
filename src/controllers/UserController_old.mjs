import { UserModel } from '../models/index.mjs';
import { UserView } from '../views/index.mjs';

/**
 * MongoDB User Controller - обробка запитів з реальною базою даних
 */
export class UserController {
  
  // GET /users
  static async getAllUsers(req, res) {
    try {
      // Перевіряємо чи запит прийшов через браузер (Accept: text/html)
      const acceptsHtml = req.headers.accept && req.headers.accept.includes('text/html');
      
      if (acceptsHtml) {
        // Отримуємо реальні дані з MongoDB
        const users = await UserModel.getAll();
        
        // Рендеримо HTML сторінку з Pug
        res.render('users/users', { 
          title: 'Користувачі',
          users: users
        });
      } else {
        // Повертаємо JSON для API
        const users = await UserModel.getAll();
        res.json(UserView.renderUsersList(users));
      }
    } catch (error) {
      console.error('Помилка отримання користувачів:', error);
      res.status(500).send('Помилка сервера при отриманні користувачів');
    }
  }

  // GET /users/:userId
  static async getUserById(req, res) {
    try {
      const userId = req.params.userId;
      const acceptsHtml = req.headers.accept && req.headers.accept.includes('text/html');
      
      // Отримуємо користувача з MongoDB
      const user = await UserModel.getById(userId);
      
      if (!user) {
        if (acceptsHtml) {
          // Рендеримо HTML сторінку з помилкою
          return res.status(404).render('users/user', {
            title: 'Користувач не знайдений',
            userId: userId,
            userExists: false,
            user: null
          });
        } else {
          // Повертаємо JSON помилку для API
          return res.status(404).send('Not Found');
        }
      }
      
      if (acceptsHtml) {
        // Рендеримо HTML сторінку користувача
        res.render('users/user', {
          title: `Користувач ${user.firstName} ${user.lastName}`,
          userId: userId,
          userExists: true,
          user: user
        });
      } else {
        // Повертаємо JSON для API
        res.json(UserView.renderUserById(user));
      }
    } catch (error) {
      console.error('Помилка отримання користувача:', error);
      res.status(500).send('Помилка сервера при отриманні користувача');
    }
  }

  // POST /users
  static async createUser(req, res) {
    try {
      const { name, email } = req.body;
      
      // Валідація name
      if (!name || typeof name !== 'string') {
        return res.status(400).send('Bad Request: Name is required');
      }
      
      const trimmedName = name.trim();
      if (trimmedName.length < 2) {
        return res.status(400).send('Bad Request: Name must be at least 2 characters long');
      }
      
      if (trimmedName.length > 50) {
        return res.status(400).send('Bad Request: Name must not exceed 50 characters');
      }
      
      // Валідація email (опціональне)
      if (email !== undefined) {
        if (typeof email !== 'string') {
          return res.status(400).send('Bad Request: Invalid email format');
        }
        
        if (email.length > 100) {
          return res.status(400).send('Bad Request: Email must not exceed 100 characters');
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email.length > 0 && !emailRegex.test(email)) {
          return res.status(400).send('Bad Request: Invalid email format');
        }
      }
      
      // Створюємо користувача в MongoDB
      const userData = {
        username: trimmedName.toLowerCase().replace(/\s+/g, ''),
        firstName: trimmedName.split(' ')[0],
        lastName: trimmedName.split(' ').slice(1).join(' ') || '',
        email: email || '',
        role: 'user'
      };
      
      const created = await UserModel.create(userData);
      
      if (created) {
        res.status(201).json(UserView.renderCreated());
      } else {
        res.status(500).send('Помилка створення користувача');
      }
    } catch (error) {
      console.error('Помилка створення користувача:', error);
      res.status(500).send('Помилка сервера при створенні користувача');
    }
  }

  // PUT /users/:userId
  static async updateUser(req, res) {
    try {
      const userId = req.params.userId;
      
      // Перевірка існування користувача
      const userExists = await UserModel.exists(userId);
      if (!userExists) {
        return res.status(404).send('Not Found');
      }
      
      const { name, email } = req.body;
      
      // Валідація name
      if (!name || typeof name !== 'string') {
        return res.status(400).send('Bad Request: Name is required');
      }
      
      const trimmedName = name.trim();
      if (trimmedName.length < 2) {
        return res.status(400).send('Bad Request: Name must be at least 2 characters long');
      }
      
      if (trimmedName.length > 50) {
        return res.status(400).send('Bad Request: Name must not exceed 50 characters');
      }
      
      // Валідація email (опціональне)
      if (email !== undefined) {
        if (typeof email !== 'string') {
          return res.status(400).send('Bad Request: Invalid email format');
        }
        
        if (email.length > 100) {
          return res.status(400).send('Bad Request: Email must not exceed 100 characters');
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email.length > 0 && !emailRegex.test(email)) {
          return res.status(400).send('Bad Request: Invalid email format');
        }
      }
      
      // Оновлюємо користувача в MongoDB
      const userData = {
        firstName: trimmedName.split(' ')[0],
        lastName: trimmedName.split(' ').slice(1).join(' ') || '',
        email: email || ''
      };
      
      const updated = await UserModel.update(userId, userData);
      
      if (updated) {
        res.json(UserView.renderUpdated(userId));
      } else {
        res.status(500).send('Помилка оновлення користувача');
      }
    } catch (error) {
      console.error('Помилка оновлення користувача:', error);
      res.status(500).send('Помилка сервера при оновленні користувача');
    }
  }

  // DELETE /users/:userId
  static async deleteUser(req, res) {
    try {
      const userId = req.params.userId;
      
      // Перевірка існування користувача
      const userExists = await UserModel.exists(userId);
      if (!userExists) {
        return res.status(404).send('Not Found');
      }
      
      // Видаляємо користувача з MongoDB
      const deleted = await UserModel.delete(userId);
      
      if (deleted) {
        res.status(204).send();
      } else {
        res.status(500).send('Помилка видалення користувача');
      }
    } catch (error) {
      console.error('Помилка видалення користувача:', error);
      res.status(500).send('Помилка сервера при видаленні користувача');
    }
  }

  // POST /users/insertOne - додати одного користувача
  static async insertOneUser(req, res) {
    try {
      const userData = req.body;
      
      // Базова валідація
      if (!userData.username || !userData.email) {
        return res.status(400).json({
          error: 'Обов\'язкові поля: username, email'
        });
      }

      // Перевірка унікальності email
      const existingUser = await UserModel.findByEmail(userData.email);
      if (existingUser) {
        return res.status(409).json({
          error: 'Користувач з таким email вже існує'
        });
      }

      const result = await UserModel.insertOne(userData);
      
      if (result.success) {
        res.status(201).json({
          message: 'Користувача успішно створено',
          insertedId: result.insertedId,
          user: result.user
        });
      } else {
        res.status(500).json({
          error: 'Помилка створення користувача'
        });
      }
    } catch (error) {
      console.error('Помилка insertOne користувача:', error);
      res.status(500).json({
        error: 'Помилка сервера при створенні користувача'
      });
    }
  }

  // POST /users/insertMany - додати багатьох користувачів
  static async insertManyUsers(req, res) {
    try {
      const usersData = req.body;
      
      // Перевірка що це масив
      if (!Array.isArray(usersData) || usersData.length === 0) {
        return res.status(400).json({
          error: 'Очікується непорожній масив користувачів'
        });
      }

      // Валідація кожного користувача
      for (let i = 0; i < usersData.length; i++) {
        const user = usersData[i];
        if (!user.username || !user.email) {
          return res.status(400).json({
            error: `Користувач ${i + 1}: обов'язкові поля username, email`
          });
        }
      }

      // Перевірка унікальності email для всіх користувачів
      const emails = usersData.map(user => user.email);
      const duplicateEmails = emails.filter((email, index) => emails.indexOf(email) !== index);
      if (duplicateEmails.length > 0) {
        return res.status(400).json({
          error: `Дублікати email в запиті: ${duplicateEmails.join(', ')}`
        });
      }

      // Перевірка існування email в БД
      for (const email of emails) {
        const existingUser = await UserModel.findByEmail(email);
        if (existingUser) {
          return res.status(409).json({
            error: `Користувач з email ${email} вже існує`
          });
        }
      }

      const result = await UserModel.insertMany(usersData);
      
      if (result.success) {
        res.status(201).json({
          message: `Успішно створено ${result.insertedCount} користувачів`,
          insertedCount: result.insertedCount,
          insertedIds: result.insertedIds,
          users: result.users
        });
      } else {
        res.status(500).json({
          error: 'Помилка створення користувачів'
        });
      }
    } catch (error) {
      console.error('Помилка insertMany користувачів:', error);
      res.status(500).json({
        error: 'Помилка сервера при створенні користувачів'
      });
    }
  }

  // PUT /users/updateOne - оновити одного користувача за фільтром
  static async updateOneUser(req, res) {
    try {
      const { filter, update } = req.body;
      
      // Базова валідація
      if (!filter || typeof filter !== 'object' || Object.keys(filter).length === 0) {
        return res.status(400).json({
          error: 'Обов\'язковий параметр: filter (непорожній об\'єкт)'
        });
      }

      if (!update || typeof update !== 'object' || Object.keys(update).length === 0) {
        return res.status(400).json({
          error: 'Обов\'язковий параметр: update (непорожній об\'єкт з даними для оновлення)'
        });
      }

      // Валідація даних оновлення
      if (update.email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(update.email)) {
          return res.status(400).json({
            error: 'Некоректний формат email'
          });
        }

        // Перевірка унікальності email (якщо змінюється)
        const existingUser = await UserModel.findByEmail(update.email);
        if (existingUser && !filter._id) {
          return res.status(409).json({
            error: 'Email вже використовується іншим користувачем'
          });
        }
      }

      const result = await UserModel.updateOneByFilter(filter, update);
      
      if (result.success) {
        res.json({
          message: 'Користувача успішно оновлено',
          matchedCount: result.matchedCount,
          modifiedCount: result.modifiedCount,
          user: result.user
        });
      } else {
        res.status(404).json({
          error: result.message || 'Користувач не знайдений'
        });
      }
    } catch (error) {
      console.error('Помилка updateOne користувача:', error);
      res.status(500).json({
        error: 'Помилка сервера при оновленні користувача'
      });
    }
  }

  // PUT /users/updateMany - оновити багатьох користувачів за фільтром
  static async updateManyUsers(req, res) {
    try {
      const { filter, update } = req.body;
      
      // Базова валідація
      if (!filter || typeof filter !== 'object') {
        return res.status(400).json({
          error: 'Обов\'язковий параметр: filter (об\'єкт фільтру)'
        });
      }

      if (!update || typeof update !== 'object' || Object.keys(update).length === 0) {
        return res.status(400).json({
          error: 'Обов\'язковий параметр: update (непорожній об\'єкт з даними для оновлення)'
        });
      }

      // Валідація email якщо присутній
      if (update.email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(update.email)) {
          return res.status(400).json({
            error: 'Некоректний формат email для масового оновлення'
          });
        }
      }

      const result = await UserModel.updateManyByFilter(filter, update);
      
      res.json({
        message: result.message,
        matchedCount: result.matchedCount,
        modifiedCount: result.modifiedCount
      });
    } catch (error) {
      console.error('Помилка updateMany користувачів:', error);
      res.status(500).json({
        error: 'Помилка сервера при масовому оновленні користувачів'
      });
    }
  }

  // PUT /users/replaceOne - замінити одного користувача повністю
  static async replaceOneUser(req, res) {
    try {
      const { filter, replacement } = req.body;
      
      // Базова валідація
      if (!filter || typeof filter !== 'object' || Object.keys(filter).length === 0) {
        return res.status(400).json({
          error: 'Обов\'язковий параметр: filter (непорожній об\'єкт)'
        });
      }

      if (!replacement || typeof replacement !== 'object') {
        return res.status(400).json({
          error: 'Обов\'язковий параметр: replacement (об\'єкт з повними даними користувача)'
        });
      }

      // Валідація обов'язкових полів для заміни
      if (!replacement.username || !replacement.email) {
        return res.status(400).json({
          error: 'Для заміни обов\'язкові поля: username, email'
        });
      }

      // Валідація email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(replacement.email)) {
        return res.status(400).json({
          error: 'Некоректний формат email'
        });
      }

      const result = await UserModel.replaceOneByFilter(filter, replacement);
      
      if (result.success) {
        res.json({
          message: 'Користувача успішно замінено',
          matchedCount: result.matchedCount,
          modifiedCount: result.modifiedCount,
          user: result.user
        });
      } else {
        res.status(404).json({
          error: result.message || 'Користувач для заміни не знайдений'
        });
      }
    } catch (error) {
      console.error('Помилка replaceOne користувача:', error);
      res.status(500).json({
        error: 'Помилка сервера при заміні користувача'
      });
    }
  }

  // DELETE /users/deleteOne - видалити одного користувача за фільтром
  static async deleteOneUser(req, res) {
    try {
      const { filter } = req.body;
      
      // Базова валідація
      if (!filter || typeof filter !== 'object' || Object.keys(filter).length === 0) {
        return res.status(400).json({
          error: 'Обов\'язковий параметр: filter (непорожній об\'єкт)'
        });
      }

      const result = await UserModel.deleteOneByFilter(filter);
      
      if (result.success) {
        res.json({
          message: result.message,
          deletedCount: result.deletedCount,
          deletedUser: result.deletedUser
        });
      } else {
        res.status(404).json({
          error: result.message || 'Користувач для видалення не знайдений'
        });
      }
    } catch (error) {
      console.error('Помилка deleteOne користувача:', error);
      res.status(500).json({
        error: 'Помилка сервера при видаленні користувача'
      });
    }
  }

  // DELETE /users/deleteMany - видалити багатьох користувачів за фільтром
  static async deleteManyUsers(req, res) {
    try {
      const { filter } = req.body;
      
      // Базова валідація
      if (!filter || typeof filter !== 'object' || Object.keys(filter).length === 0) {
        return res.status(400).json({
          error: 'Обов\'язковий параметр: filter (непорожній об\'єкт)'
        });
      }

      // Захист від випадкового видалення всіх користувачів
      if (Object.keys(filter).length === 0 || 
          (filter.hasOwnProperty('role') && filter.role === undefined)) {
        return res.status(400).json({
          error: 'Фільтр занадто широкий. Вкажіть більш конкретні критерії для безпеки.'
        });
      }

      const result = await UserModel.deleteManyByFilter(filter);
      
      if (result.success) {
        res.json({
          message: result.message,
          deletedCount: result.deletedCount,
          deletedUsers: result.deletedUsers.map(user => ({
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role
          }))
        });
      } else {
        res.status(404).json({
          error: result.message || 'Користувачі для видалення не знайдені'
        });
      }
    } catch (error) {
      console.error('Помилка deleteMany користувачів:', error);
      res.status(500).json({
        error: 'Помилка сервера при масовому видаленні користувачів'
      });
    }
  }

  // GET /users/find - розширене читання з фільтрами та проекціями
  static async findUsers(req, res) {
    try {
      const {
        filter = '{}',
        projection = '{}',
        sort = '{}',
        limit = '0',
        skip = '0'
      } = req.query;

      // Парсимо JSON параметри з безпечною обробкою помилок
      let parsedFilter, parsedProjection, parsedSort;
      
      try {
        parsedFilter = JSON.parse(filter);
        parsedProjection = JSON.parse(projection);
        parsedSort = JSON.parse(sort);
      } catch (parseError) {
        return res.status(400).json({
          error: 'Некоректний JSON формат у параметрах filter, projection або sort'
        });
      }

      const options = {
        filter: parsedFilter,
        projection: parsedProjection,
        sort: parsedSort,
        limit: parseInt(limit) || 0,
        skip: parseInt(skip) || 0
      };

      const result = await UserModel.findByFilter(options);
      
      res.json({
        message: `Знайдено ${result.count} користувачів`,
        ...result,
        pagination: {
          limit: options.limit,
          skip: options.skip,
          hasMore: result.hasMore
        }
      });
    } catch (error) {
      console.error('Помилка розширеного пошуку користувачів:', error);
      res.status(500).json({
        error: 'Помилка сервера при розширеному пошуку користувачів'
      });
    }
  }

  // GET /users/search - пошук користувачів за текстом
  static async searchUsers(req, res) {
    try {
      const { q, projection = '{}', limit = '20', skip = '0' } = req.query;

      if (!q || q.trim().length < 2) {
        return res.status(400).json({
          error: 'Параметр q (пошуковий запит) повинен містити мінімум 2 символи'
        });
      }

      let parsedProjection;
      try {
        parsedProjection = JSON.parse(projection);
      } catch (parseError) {
        return res.status(400).json({
          error: 'Некоректний JSON формат у параметрі projection'
        });
      }

      const options = {
        projection: parsedProjection,
        limit: parseInt(limit) || 20,
        skip: parseInt(skip) || 0
      };

      const result = await UserModel.searchUsers(q.trim(), options);
      
      res.json({
        message: `Знайдено ${result.count} користувачів за запитом "${q}"`,
        ...result
      });
    } catch (error) {
      console.error('Помилка пошуку користувачів:', error);
      res.status(500).json({
        error: 'Помилка сервера при пошуку користувачів'
      });
    }
  }

  // GET /users/basic - отримати базову інформацію користувачів
  static async getBasicUserInfo(req, res) {
    try {
      const { filter = '{}' } = req.query;

      let parsedFilter;
      try {
        parsedFilter = JSON.parse(filter);
      } catch (parseError) {
        return res.status(400).json({
          error: 'Некоректний JSON формат у параметрі filter'
        });
      }

      const result = await UserModel.getBasicInfo(parsedFilter);
      
      res.json({
        message: `Отримано базову інформацію про ${result.count} користувачів`,
        ...result
      });
    } catch (error) {
      console.error('Помилка отримання базової інформації користувачів:', error);
      res.status(500).json({
        error: 'Помилка сервера при отриманні базової інформації користувачів'
      });
    }
  }

  // GET /users/filtered - отримати користувачів з фільтрами
  static async getFilteredUsers(req, res) {
    try {
      const {
        role,
        isActive,
        dateFrom,
        dateTo,
        projection = '{}',
        sort = '{}',
        limit = '0',
        skip = '0'
      } = req.query;

      let parsedProjection, parsedSort;
      try {
        parsedProjection = JSON.parse(projection);
        parsedSort = JSON.parse(sort);
      } catch (parseError) {
        return res.status(400).json({
          error: 'Некоректний JSON формат у параметрах projection або sort'
        });
      }

      // Валідація isActive якщо передано
      let validIsActive;
      if (isActive !== undefined) {
        if (isActive === 'true') validIsActive = true;
        else if (isActive === 'false') validIsActive = false;
        else {
          return res.status(400).json({
            error: 'Параметр isActive повинен бути "true" або "false"'
          });
        }
      }

      const options = {
        role,
        isActive: validIsActive,
        dateFrom,
        dateTo,
        projection: parsedProjection,
        sort: parsedSort,
        limit: parseInt(limit) || 0,
        skip: parseInt(skip) || 0
      };

      const result = await UserModel.getWithFilters(options);
      
      res.json({
        message: `Знайдено ${result.count} користувачів з фільтрами`,
        ...result,
        appliedFilters: {
          role,
          isActive: validIsActive,
          dateFrom,
          dateTo
        }
      });
    } catch (error) {
      console.error('Помилка фільтрації користувачів:', error);
      res.status(500).json({
        error: 'Помилка сервера при фільтрації користувачів'
      });
    }
  }

  // GET /users/aggregated - агрегована статистика користувачів
  static async getAggregatedUsers(req, res) {
    try {
      const { groupBy = 'role', includeStats = 'true' } = req.query;

      const options = {
        groupBy,
        includeStats: includeStats === 'true'
      };

      const result = await UserModel.getAggregatedData(options);
      
      res.json({
        message: `Агреговані дані користувачів за полем "${groupBy}"`,
        ...result
      });
    } catch (error) {
      console.error('Помилка агрегації користувачів:', error);
      res.status(500).json({
        error: 'Помилка сервера при агрегації користувачів'
      });
    }
  }
}