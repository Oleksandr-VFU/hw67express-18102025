import { db } from '../config/database.mjs';

/**
 * MongoDB Article Model - повноцінні CRUD операції з реальною базою даних
 */
export class ArticleModel {
  
  // Отримати всі статті з MongoDB
  static async getAll() {
    try {
      const articles = await db.collection('articles')
        .find({})
        .sort({ createdAt: -1 }) // Сортуємо по даті створення (новіші спочатку)
        .toArray();
      return articles;
    } catch (error) {
      console.error('Помилка отримання статей:', error);
      throw error;
    }
  }

  // Отримати статтю за ID з MongoDB
  static async getById(articleId) {
    try {
      // Конвертуємо ID в правильний тип (string або number)
      const query = isNaN(articleId) ? { _id: articleId } : { _id: parseInt(articleId) };
      const article = await db.collection('articles').findOne(query);
      
      // Оновлюємо кількість переглядів при отриманні статті
      if (article) {
        await db.collection('articles').updateOne(
          query,
          { $inc: { views: 1 } }
        );
        article.views = (article.views || 0) + 1;
      }
      
      return article;
    } catch (error) {
      console.error('Помилка отримання статті за ID:', error);
      throw error;
    }
  }

  // Створити статтю в MongoDB
  static async create(articleData) {
    try {
      const result = await db.collection('articles').insertOne({
        ...articleData,
        createdAt: new Date(),
        updatedAt: new Date(),
        isPublished: true,
        views: 0,
        likes: 0
      });
      return result.acknowledged;
    } catch (error) {
      console.error('Помилка створення статті:', error);
      throw error;
    }
  }

  // Оновити статтю в MongoDB
  static async update(articleId, articleData) {
    try {
      const query = isNaN(articleId) ? { _id: articleId } : { _id: parseInt(articleId) };
      const result = await db.collection('articles').updateOne(
        query,
        { 
          $set: {
            ...articleData,
            updatedAt: new Date()
          }
        }
      );
      return result.matchedCount > 0;
    } catch (error) {
      console.error('Помилка оновлення статті:', error);
      throw error;
    }
  }

  // Видалити статтю з MongoDB
  static async delete(articleId) {
    try {
      const query = isNaN(articleId) ? { _id: articleId } : { _id: parseInt(articleId) };
      const result = await db.collection('articles').deleteOne(query);
      return result.deletedCount > 0;
    } catch (error) {
      console.error('Помилка видалення статті:', error);
      throw error;
    }
  }

  // Перевірити існування статті в MongoDB
  static async exists(articleId) {
    try {
      const query = isNaN(articleId) ? { _id: articleId } : { _id: parseInt(articleId) };
      const article = await db.collection('articles').findOne(query, { projection: { _id: 1 } });
      return article !== null;
    } catch (error) {
      console.error('Помилка перевірки існування статті:', error);
      throw error;
    }
  }

  // Отримати статті за автором
  static async getByAuthor(authorId) {
    try {
      const articles = await db.collection('articles')
        .find({ authorId: parseInt(authorId) })
        .sort({ createdAt: -1 })
        .toArray();
      return articles;
    } catch (error) {
      console.error('Помилка отримання статей за автором:', error);
      throw error;
    }
  }

  // Отримати статті за категорією
  static async getByCategory(category) {
    try {
      const articles = await db.collection('articles')
        .find({ category: category })
        .sort({ createdAt: -1 })
        .toArray();
      return articles;
    } catch (error) {
      console.error('Помилка отримання статей за категорією:', error);
      throw error;
    }
  }

  // Пошук статей за тегами
  static async getByTags(tags) {
    try {
      const articles = await db.collection('articles')
        .find({ tags: { $in: Array.isArray(tags) ? tags : [tags] } })
        .sort({ createdAt: -1 })
        .toArray();
      return articles;
    } catch (error) {
      console.error('Помилка пошуку статей за тегами:', error);
      throw error;
    }
  }

  // Текстовий пошук статей
  static async search(searchText) {
    try {
      const articles = await db.collection('articles')
        .find({ $text: { $search: searchText } })
        .sort({ score: { $meta: 'textScore' } })
        .toArray();
      return articles;
    } catch (error) {
      console.error('Помилка текстового пошуку статей:', error);
      throw error;
    }
  }

  // Отримати тільки опубліковані статті
  static async getPublished() {
    try {
      const articles = await db.collection('articles')
        .find({ isPublished: true })
        .sort({ createdAt: -1 })
        .toArray();
      return articles;
    } catch (error) {
      console.error('Помилка отримання опублікованих статей:', error);
      throw error;
    }
  }

  // Отримати статистику статей
  static async getStats() {
    try {
      const total = await db.collection('articles').countDocuments();
      const published = await db.collection('articles').countDocuments({ isPublished: true });
      const byCategory = await db.collection('articles').aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } }
      ]).toArray();
      
      return { total, published, byCategory };
    } catch (error) {
      console.error('Помилка отримання статистики статей:', error);
      throw error;
    }
  }

  // Додати одну статтю до MongoDB (insertOne)
  static async insertOne(articleData) {
    try {
      // Генеруємо наступний ID
      const lastArticle = await db.collection('articles')
        .findOne({}, { sort: { _id: -1 } });
      const nextId = lastArticle ? lastArticle._id + 1 : 1;

      const articleToInsert = {
        _id: nextId,
        ...articleData,
        createdAt: new Date(),
        updatedAt: new Date(),
        isPublished: articleData.isPublished !== undefined ? articleData.isPublished : true,
        views: articleData.views || 0,
        likes: articleData.likes || 0,
        tags: articleData.tags || [],
        category: articleData.category || 'Загальне'
      };

      const result = await db.collection('articles').insertOne(articleToInsert);
      
      if (result.acknowledged) {
        return {
          success: true,
          insertedId: result.insertedId,
          article: articleToInsert
        };
      }
      return { success: false };
    } catch (error) {
      console.error('Помилка додавання статті (insertOne):', error);
      throw error;
    }
  }

  // Додати багато статей до MongoDB (insertMany)
  static async insertMany(articlesData) {
    try {
      if (!Array.isArray(articlesData) || articlesData.length === 0) {
        throw new Error('articlesData повинно бути непорожнім масивом');
      }

      // Отримуємо останній ID для генерації наступних
      const lastArticle = await db.collection('articles')
        .findOne({}, { sort: { _id: -1 } });
      let nextId = lastArticle ? lastArticle._id + 1 : 1;

      const articlesToInsert = articlesData.map(articleData => ({
        _id: nextId++,
        ...articleData,
        createdAt: new Date(),
        updatedAt: new Date(),
        isPublished: articleData.isPublished !== undefined ? articleData.isPublished : true,
        views: articleData.views || 0,
        likes: articleData.likes || 0,
        tags: articleData.tags || [],
        category: articleData.category || 'Загальне'
      }));

      const result = await db.collection('articles').insertMany(articlesToInsert);
      
      if (result.acknowledged) {
        return {
          success: true,
          insertedCount: result.insertedCount,
          insertedIds: result.insertedIds,
          articles: articlesToInsert
        };
      }
      return { success: false };
    } catch (error) {
      console.error('Помилка додавання статей (insertMany):', error);
      throw error;
    }
  }

  // Оновити одну статтю за фільтром (updateOne)
  static async updateOneByFilter(filter, updateData) {
    try {
      const result = await db.collection('articles').updateOne(
        filter,
        {
          $set: {
            ...updateData,
            updatedAt: new Date()
          }
        }
      );
      
      if (result.matchedCount > 0) {
        // Отримуємо оновлену статтю
        const updatedArticle = await db.collection('articles').findOne(filter);
        return {
          success: true,
          matchedCount: result.matchedCount,
          modifiedCount: result.modifiedCount,
          article: updatedArticle
        };
      }
      
      return {
        success: false,
        matchedCount: 0,
        modifiedCount: 0,
        message: 'Стаття не знайдена'
      };
    } catch (error) {
      console.error('Помилка оновлення статті (updateOne):', error);
      throw error;
    }
  }

  // Оновити багато статей за фільтром (updateMany)
  static async updateManyByFilter(filter, updateData) {
    try {
      const result = await db.collection('articles').updateMany(
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
        message: `Оновлено ${result.modifiedCount} з ${result.matchedCount} статей`
      };
    } catch (error) {
      console.error('Помилка оновлення статей (updateMany):', error);
      throw error;
    }
  }

  // Замінити одну статтю повністю (replaceOne)
  static async replaceOneByFilter(filter, replacementData) {
    try {
      // Зберігаємо оригінальні дані
      const existingArticle = await db.collection('articles').findOne(filter);
      
      if (!existingArticle) {
        return {
          success: false,
          matchedCount: 0,
          modifiedCount: 0,
          message: 'Стаття для заміни не знайдена'
        };
      }

      const replacementArticle = {
        _id: existingArticle._id,
        ...replacementData,
        createdAt: existingArticle.createdAt,
        updatedAt: new Date(),
        isPublished: replacementData.isPublished !== undefined ? replacementData.isPublished : true,
        views: replacementData.views !== undefined ? replacementData.views : existingArticle.views || 0,
        likes: replacementData.likes !== undefined ? replacementData.likes : existingArticle.likes || 0,
        tags: replacementData.tags || [],
        category: replacementData.category || 'Загальне'
      };

      const result = await db.collection('articles').replaceOne(
        filter,
        replacementArticle
      );
      
      if (result.matchedCount > 0) {
        return {
          success: true,
          matchedCount: result.matchedCount,
          modifiedCount: result.modifiedCount,
          article: replacementArticle
        };
      }
      
      return {
        success: false,
        matchedCount: 0,
        modifiedCount: 0,
        message: 'Помилка заміни статті'
      };
    } catch (error) {
      console.error('Помилка заміни статті (replaceOne):', error);
      throw error;
    }
  }

  // Видалити одну статтю за фільтром (deleteOne)
  static async deleteOneByFilter(filter) {
    try {
      // Спочатку отримуємо статтю для повернення інформації
      const articleToDelete = await db.collection('articles').findOne(filter);
      
      if (!articleToDelete) {
        return {
          success: false,
          deletedCount: 0,
          message: 'Стаття для видалення не знайдена'
        };
      }

      const result = await db.collection('articles').deleteOne(filter);
      
      if (result.deletedCount > 0) {
        return {
          success: true,
          deletedCount: result.deletedCount,
          deletedArticle: articleToDelete,
          message: `Статтю "${articleToDelete.title}" успішно видалено`
        };
      }
      
      return {
        success: false,
        deletedCount: 0,
        message: 'Помилка видалення статті'
      };
    } catch (error) {
      console.error('Помилка видалення статті (deleteOne):', error);
      throw error;
    }
  }

  // Видалити багато статей за фільтром (deleteMany)
  static async deleteManyByFilter(filter) {
    try {
      // Спочатку отримуємо статті для статистики
      const articlesToDelete = await db.collection('articles').find(filter).toArray();
      
      if (articlesToDelete.length === 0) {
        return {
          success: false,
          deletedCount: 0,
          message: 'Статті для видалення не знайдені'
        };
      }

      const result = await db.collection('articles').deleteMany(filter);
      
      return {
        success: true,
        deletedCount: result.deletedCount,
        deletedArticles: articlesToDelete,
        message: `Успішно видалено ${result.deletedCount} статей`
      };
    } catch (error) {
      console.error('Помилка видалення статей (deleteMany):', error);
      throw error;
    }
  }

  // Розширене читання з фільтрами та проекціями (find)
  static async findWithProjection(filter = {}, projection = {}) {
    try {
      let query = db.collection('articles').find(filter);
      
      if (Object.keys(projection).length > 0) {
        query = query.project(projection);
      }
      
      const articles = await query.toArray();
      return articles;
    } catch (error) {
      console.error('Помилка читання статей з проекцією:', error);
      throw error;
    }
  }

  // Отримати всі статті за допомогою курсора (для великих обсягів даних)
  static async getAllWithCursor() {
    try {
      const cursor = db.collection('articles').find({}).sort({ createdAt: -1 });
      const articles = [];
      
      // Використовуємо курсор для ітерації без завантаження всіх даних у пам'ять
      await cursor.forEach(article => {
        articles.push(article);
      });
      
      return articles;
    } catch (error) {
      console.error('Помилка отримання статей з курсором:', error);
      throw error;
    }
  }
}