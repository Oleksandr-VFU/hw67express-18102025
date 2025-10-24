import { db } from '../config/database.mjs';

/**
 * MongoDB User Model - повноцінні CRUD операції з реальною базою даних
 */
export class UserModel {
  
  // Отримати всіх користувачів з MongoDB
  static async getAll() {
    try {
      const users = await db.collection('users').find({}).toArray();
      return users;
    } catch (error) {
      console.error('Помилка отримання користувачів:', error);
      throw error;
    }
  }

  // Отримати користувача за ID з MongoDB
  static async getById(userId) {
    try {
      // Конвертуємо ID в правильний тип (string або number)
      const query = isNaN(userId) ? { _id: userId } : { _id: parseInt(userId) };
      const user = await db.collection('users').findOne(query);
      return user;
    } catch (error) {
      console.error('Помилка отримання користувача за ID:', error);
      throw error;
    }
  }

  // Створити користувача в MongoDB
  static async create(userData) {
    try {
      const result = await db.collection('users').insertOne({
        ...userData,
        createdAt: new Date(),
        isActive: true
      });
      return result.acknowledged;
    } catch (error) {
      console.error('Помилка створення користувача:', error);
      throw error;
    }
  }

  // Оновити користувача в MongoDB
  static async update(userId, userData) {
    try {
      const query = isNaN(userId) ? { _id: userId } : { _id: parseInt(userId) };
      const result = await db.collection('users').updateOne(
        query,
        { 
          $set: {
            ...userData,
            updatedAt: new Date()
          }
        }
      );
      return result.matchedCount > 0;
    } catch (error) {
      console.error('Помилка оновлення користувача:', error);
      throw error;
    }
  }

  // Видалити користувача з MongoDB
  static async delete(userId) {
    try {
      const query = isNaN(userId) ? { _id: userId } : { _id: parseInt(userId) };
      const result = await db.collection('users').deleteOne(query);
      return result.deletedCount > 0;
    } catch (error) {
      console.error('Помилка видалення користувача:', error);
      throw error;
    }
  }

  // Перевірити існування користувача в MongoDB
  static async exists(userId) {
    try {
      const query = isNaN(userId) ? { _id: userId } : { _id: parseInt(userId) };
      const user = await db.collection('users').findOne(query, { projection: { _id: 1 } });
      return user !== null;
    } catch (error) {
      console.error('Помилка перевірки існування користувача:', error);
      throw error;
    }
  }

  // Знайти користувача за email (для аутентифікації)
  static async findByEmail(email) {
    try {
      const user = await db.collection('users').findOne({ email: email });
      return user;
    } catch (error) {
      console.error('Помилка пошуку користувача за email:', error);
      throw error;
    }
  }

  // Отримати користувачів за роллю
  static async getByRole(role) {
    try {
      const users = await db.collection('users').find({ role: role }).toArray();
      return users;
    } catch (error) {
      console.error('Помилка отримання користувачів за роллю:', error);
      throw error;
    }
  }

  // Додати одного користувача до MongoDB (insertOne)
  static async insertOne(userData) {
    try {
      // Генеруємо наступний ID
      const lastUser = await db.collection('users')
        .findOne({}, { sort: { _id: -1 } });
      const nextId = lastUser ? lastUser._id + 1 : 1;

      const userToInsert = {
        _id: nextId,
        ...userData,
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: userData.isActive !== undefined ? userData.isActive : true,
        role: userData.role || 'user'
      };

      const result = await db.collection('users').insertOne(userToInsert);
      
      if (result.acknowledged) {
        return {
          success: true,
          insertedId: result.insertedId,
          user: userToInsert
        };
      }
      return { success: false };
    } catch (error) {
      console.error('Помилка додавання користувача (insertOne):', error);
      throw error;
    }
  }

  // Додати багатьох користувачів до MongoDB (insertMany)
  static async insertMany(usersData) {
    try {
      if (!Array.isArray(usersData) || usersData.length === 0) {
        throw new Error('usersData повинно бути непорожнім масивом');
      }

      // Отримуємо останній ID для генерації наступних
      const lastUser = await db.collection('users')
        .findOne({}, { sort: { _id: -1 } });
      let nextId = lastUser ? lastUser._id + 1 : 1;

      const usersToInsert = usersData.map(userData => ({
        _id: nextId++,
        ...userData,
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: userData.isActive !== undefined ? userData.isActive : true,
        role: userData.role || 'user'
      }));

      const result = await db.collection('users').insertMany(usersToInsert);
      
      if (result.acknowledged) {
        return {
          success: true,
          insertedCount: result.insertedCount,
          insertedIds: result.insertedIds,
          users: usersToInsert
        };
      }
      return { success: false };
    } catch (error) {
      console.error('Помилка додавання користувачів (insertMany):', error);
      throw error;
    }
  }

  // Оновити одного користувача за фільтром (updateOne)
  static async updateOneByFilter(filter, updateData) {
    try {
      const result = await db.collection('users').updateOne(
        filter,
        {
          $set: {
            ...updateData,
            updatedAt: new Date()
          }
        }
      );
      
      if (result.matchedCount > 0) {
        // Отримуємо оновлений документ
        const updatedUser = await db.collection('users').findOne(filter);
        return {
          success: true,
          matchedCount: result.matchedCount,
          modifiedCount: result.modifiedCount,
          user: updatedUser
        };
      }
      
      return {
        success: false,
        matchedCount: 0,
        modifiedCount: 0,
        message: 'Користувач не знайдений'
      };
    } catch (error) {
      console.error('Помилка оновлення користувача (updateOne):', error);
      throw error;
    }
  }

  // Оновити багатьох користувачів за фільтром (updateMany)
  static async updateManyByFilter(filter, updateData) {
    try {
      const result = await db.collection('users').updateMany(
        filter,
        {
          $set: {
            ...updateData,
            updatedAt: new Date()
          }
        }
      );
      
      return {
        success: true,
        matchedCount: result.matchedCount,
        modifiedCount: result.modifiedCount,
        message: `Оновлено ${result.modifiedCount} з ${result.matchedCount} користувачів`
      };
    } catch (error) {
      console.error('Помилка оновлення користувачів (updateMany):', error);
      throw error;
    }
  }

  // Замінити одного користувача повністю (replaceOne)
  static async replaceOneByFilter(filter, replacementData) {
    try {
      // Зберігаємо оригінальні дати та ID якщо вони існують
      const existingUser = await db.collection('users').findOne(filter);
      
      if (!existingUser) {
        return {
          success: false,
          matchedCount: 0,
          modifiedCount: 0,
          message: 'Користувач для заміни не знайдений'
        };
      }

      const replacementUser = {
        _id: existingUser._id,
        ...replacementData,
        createdAt: existingUser.createdAt,
        updatedAt: new Date(),
        role: replacementData.role || 'user',
        isActive: replacementData.isActive !== undefined ? replacementData.isActive : true
      };

      const result = await db.collection('users').replaceOne(
        filter,
        replacementUser
      );
      
      if (result.matchedCount > 0) {
        return {
          success: true,
          matchedCount: result.matchedCount,
          modifiedCount: result.modifiedCount,
          user: replacementUser
        };
      }
      
      return {
        success: false,
        matchedCount: 0,
        modifiedCount: 0,
        message: 'Помилка заміни користувача'
      };
    } catch (error) {
      console.error('Помилка заміни користувача (replaceOne):', error);
      throw error;
    }
  }

  // Видалити одного користувача за фільтром (deleteOne)
  static async deleteOneByFilter(filter) {
    try {
      // Спочатку отримуємо користувача для повернення інформації
      const userToDelete = await db.collection('users').findOne(filter);
      
      if (!userToDelete) {
        return {
          success: false,
          deletedCount: 0,
          message: 'Користувач для видалення не знайдений'
        };
      }

      const result = await db.collection('users').deleteOne(filter);
      
      if (result.deletedCount > 0) {
        return {
          success: true,
          deletedCount: result.deletedCount,
          deletedUser: userToDelete,
          message: `Користувача ${userToDelete.name || userToDelete.email} успішно видалено`
        };
      }
      
      return {
        success: false,
        deletedCount: 0,
        message: 'Помилка видалення користувача'
      };
    } catch (error) {
      console.error('Помилка видалення користувача (deleteOne):', error);
      throw error;
    }
  }

  // Видалити багатьох користувачів за фільтром (deleteMany)
  static async deleteManyByFilter(filter) {
    try {
      // Спочатку отримуємо користувачів для статистики
      const usersToDelete = await db.collection('users').find(filter).toArray();
      
      if (usersToDelete.length === 0) {
        return {
          success: false,
          deletedCount: 0,
          message: 'Користувачі для видалення не знайдені'
        };
      }

      const result = await db.collection('users').deleteMany(filter);
      
      return {
        success: true,
        deletedCount: result.deletedCount,
        deletedUsers: usersToDelete,
        message: `Успішно видалено ${result.deletedCount} користувачів`
      };
    } catch (error) {
      console.error('Помилка видалення користувачів (deleteMany):', error);
      throw error;
    }
  }

  // Розширене читання з фільтрами та проекціями (find)
  static async findWithProjection(filter = {}, projection = {}) {
    try {
      let query = db.collection('users').find(filter);
      
      if (Object.keys(projection).length > 0) {
        query = query.project(projection);
      }
      
      const users = await query.toArray();
      return users;
    } catch (error) {
      console.error('Помилка читання з проекцією:', error);
      throw error;
    }
  }

  // Отримати всіх користувачів за допомогою курсора (для великих обсягів даних)
  static async getAllWithCursor() {
    try {
      const cursor = db.collection('users').find({});
      const users = [];
      
      // Використовуємо курсор для ітерації без завантаження всіх даних у пам'ять
      await cursor.forEach(user => {
        users.push(user);
      });
      
      return users;
    } catch (error) {
      console.error('Помилка отримання користувачів з курсором:', error);
      throw error;
    }
  }

  // Агрегаційний запит для отримання статистики користувачів
  static async getStatistics() {
    try {
      const statistics = await db.collection('users').aggregate([
        {
          $group: {
            _id: null,
            totalUsers: { $sum: 1 },
            activeUsers: { $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] } },
            usersByRole: { $push: '$role' }
          }
        },
        {
          $addFields: {
            roleStats: {
              $arrayToObject: {
                $map: {
                  input: { $setUnion: ['$usersByRole'] },
                  as: 'role',
                  in: {
                    k: '$$role',
                    v: { $size: { $filter: { input: '$usersByRole', cond: { $eq: ['$$this', '$$role'] } } } }
                  }
                }
              }
            }
          }
        }
      ]).toArray();

      return statistics[0] || { totalUsers: 0, activeUsers: 0, roleStats: {} };
    } catch (error) {
      console.error('Помилка отримання статистики користувачів:', error);
      throw error;
    }
  }
}