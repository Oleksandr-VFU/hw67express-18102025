import { UserModel } from '../models/index.mjs';
import { UserView } from '../views/index.mjs';

/**
 * MongoDB User Controller - спрощені CRUD операції
 */
export class UserController {
  
  // GET /users
  static async getAllUsers(req, res) {
    try {
      const acceptsHtml = req.headers.accept && req.headers.accept.includes('text/html');
      
      if (acceptsHtml) {
        const users = await UserModel.getAll();
        res.render('users/users', { 
          title: 'Користувачі',
          users: users
        });
      } else {
        const users = await UserModel.getAll();
        res.json(UserView.renderUsersList(users));
      }
    } catch (error) {
      console.error('Помилка отримання користувачів:', error);
      res.status(500).send('Помилка сервера');
    }
  }

  // GET /users/:userId
  static async getUserById(req, res) {
    try {
      const userId = req.params.userId;
      const acceptsHtml = req.headers.accept && req.headers.accept.includes('text/html');
      
      const user = await UserModel.getById(userId);
      
      if (!user) {
        if (acceptsHtml) {
          return res.status(404).render('users/user', {
            title: 'Користувач не знайдений',
            userId: userId,
            userExists: false,
            user: null
          });
        } else {
          return res.status(404).json({ error: 'Користувач не знайдений' });
        }
      }
      
      if (acceptsHtml) {
        res.render('users/user', {
          title: `Користувач ${user.username}`,
          userId: userId,
          userExists: true,
          user: user
        });
      } else {
        res.json(UserView.renderUser(user));
      }
    } catch (error) {
      console.error('Помилка отримання користувача:', error);
      res.status(500).send('Помилка сервера');
    }
  }

  // POST /users
  static async createUser(req, res) {
    try {
      const userData = req.body;
      const created = await UserModel.create(userData);
      
      if (created) {
        res.status(201).json(UserView.renderCreated());
      } else {
        res.status(500).send('Помилка створення користувача');
      }
    } catch (error) {
      console.error('Помилка створення користувача:', error);
      res.status(500).send('Помилка сервера');
    }
  }

  // PUT /users/:userId
  static async updateUser(req, res) {
    try {
      const userId = req.params.userId;
      const userData = req.body;
      const updated = await UserModel.update(userId, userData);
      
      if (updated) {
        res.json(UserView.renderUpdated());
      } else {
        res.status(404).send('Користувач не знайдений');
      }
    } catch (error) {
      console.error('Помилка оновлення користувача:', error);
      res.status(500).send('Помилка сервера');
    }
  }

  // DELETE /users/:userId
  static async deleteUser(req, res) {
    try {
      const userId = req.params.userId;
      const deleted = await UserModel.delete(userId);
      
      if (deleted) {
        res.json(UserView.renderDeleted());
      } else {
        res.status(404).send('Користувач не знайдений');
      }
    } catch (error) {
      console.error('Помилка видалення користувача:', error);
      res.status(500).send('Помилка сервера');
    }
  }

  // POST /users/insertOne - додати одного користувача
  static async insertOneUser(req, res) {
    try {
      const userData = req.body;
      const result = await UserModel.insertOne(userData);
      
      if (result.success) {
        res.status(201).json({
          message: 'Користувача успішно створено',
          user: result.user
        });
      } else {
        res.status(500).json({ error: 'Помилка створення користувача' });
      }
    } catch (error) {
      console.error('Помилка insertOne користувача:', error);
      res.status(500).json({ error: 'Помилка сервера' });
    }
  }

  // POST /users/insertMany - додати багатьох користувачів
  static async insertManyUsers(req, res) {
    try {
      const usersData = req.body;
      const result = await UserModel.insertMany(usersData);
      
      if (result.success) {
        res.status(201).json({
          message: `Успішно створено ${result.insertedCount} користувачів`,
          users: result.users
        });
      } else {
        res.status(500).json({ error: 'Помилка створення користувачів' });
      }
    } catch (error) {
      console.error('Помилка insertMany користувачів:', error);
      res.status(500).json({ error: 'Помилка сервера' });
    }
  }

  // PUT /users/updateOne - оновити одного користувача за фільтром
  static async updateOneUser(req, res) {
    try {
      const { filter, update } = req.body;
      const result = await UserModel.updateOneByFilter(filter, update);
      
      if (result.success) {
        res.json({
          message: 'Користувача успішно оновлено',
          user: result.user
        });
      } else {
        res.status(404).json({ error: 'Користувач не знайдений' });
      }
    } catch (error) {
      console.error('Помилка updateOne користувача:', error);
      res.status(500).json({ error: 'Помилка сервера' });
    }
  }

  // PUT /users/updateMany - оновити багатьох користувачів за фільтром
  static async updateManyUsers(req, res) {
    try {
      const { filter, update } = req.body;
      const result = await UserModel.updateManyByFilter(filter, update);
      
      res.json({
        message: result.message,
        matchedCount: result.matchedCount,
        modifiedCount: result.modifiedCount
      });
    } catch (error) {
      console.error('Помилка updateMany користувачів:', error);
      res.status(500).json({ error: 'Помилка сервера' });
    }
  }

  // PUT /users/replaceOne - замінити одного користувача повністю
  static async replaceOneUser(req, res) {
    try {
      const { filter, replacement } = req.body;
      const result = await UserModel.replaceOneByFilter(filter, replacement);
      
      if (result.success) {
        res.json({
          message: 'Користувача успішно замінено',
          user: result.user
        });
      } else {
        res.status(404).json({ error: 'Користувач не знайдений' });
      }
    } catch (error) {
      console.error('Помилка replaceOne користувача:', error);
      res.status(500).json({ error: 'Помилка сервера' });
    }
  }

  // DELETE /users/deleteOne - видалити одного користувача за фільтром
  static async deleteOneUser(req, res) {
    try {
      const { filter } = req.body;
      const result = await UserModel.deleteOneByFilter(filter);
      
      if (result.success) {
        res.json({
          message: result.message,
          deletedUser: result.deletedUser
        });
      } else {
        res.status(404).json({ error: 'Користувач не знайдений' });
      }
    } catch (error) {
      console.error('Помилка deleteOne користувача:', error);
      res.status(500).json({ error: 'Помилка сервера' });
    }
  }

  // DELETE /users/deleteMany - видалити багатьох користувачів за фільтром
  static async deleteManyUsers(req, res) {
    try {
      const { filter } = req.body;
      const result = await UserModel.deleteManyByFilter(filter);
      
      if (result.success) {
        res.json({
          message: result.message,
          deletedCount: result.deletedCount
        });
      } else {
        res.status(404).json({ error: 'Користувачі не знайдені' });
      }
    } catch (error) {
      console.error('Помилка deleteMany користувачів:', error);
      res.status(500).json({ error: 'Помилка сервера' });
    }
  }

  // GET /users/find - розширене читання з фільтрами та проекціями
  static async findUsers(req, res) {
    try {
      const { filter = '{}', projection = '{}' } = req.query;
      
      const parsedFilter = JSON.parse(filter);
      const parsedProjection = JSON.parse(projection);
      
      const users = await UserModel.findWithProjection(parsedFilter, parsedProjection);
      
      res.json({
        message: `Знайдено ${users.length} користувачів`,
        users: users
      });
    } catch (error) {
      console.error('Помилка пошуку користувачів:', error);
      res.status(500).json({ error: 'Помилка сервера' });
    }
  }

  // GET /users/cursor - отримання користувачів з використанням курсора
  static async getUsersWithCursor(req, res) {
    try {
      const users = await UserModel.getAllWithCursor();
      
      res.json({
        message: `Отримано ${users.length} користувачів за допомогою курсора`,
        method: 'cursor',
        users: users
      });
    } catch (error) {
      console.error('Помилка отримання користувачів з курсором:', error);
      res.status(500).json({ error: 'Помилка сервера' });
    }
  }

  // GET /users/statistics - отримання статистики користувачів
  static async getUsersStatistics(req, res) {
    try {
      const statistics = await UserModel.getStatistics();
      
      res.json({
        message: 'Статистика користувачів',
        method: 'aggregation',
        statistics: statistics
      });
    } catch (error) {
      console.error('Помилка отримання статистики користувачів:', error);
      res.status(500).json({ error: 'Помилка сервера' });
    }
  }
}