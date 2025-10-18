import { ArticleModel } from '../models/index.mjs';
import { ArticleView } from '../views/index.mjs';

/**
 * MongoDB Article Controller - обробка запитів з реальною базою даних
 */
export class ArticleController {
  
  // GET /articles
  static async getAllArticles(req, res) {
    try {
      // Перевіряємо чи запит прийшов через браузер (Accept: text/html)
      const acceptsHtml = req.headers.accept && req.headers.accept.includes('text/html');
      
      if (acceptsHtml) {
        // Отримуємо реальні дані з MongoDB
        const articles = await ArticleModel.getAll();
        
        // Рендеримо HTML сторінку з EJS
        res.render('articles/articles.ejs', { 
          title: 'Статті',
          articles: articles
        });
      } else {
        // Повертаємо JSON для API
        const articles = await ArticleModel.getAll();
        res.json(ArticleView.renderArticlesList(articles));
      }
    } catch (error) {
      console.error('Помилка отримання статей:', error);
      res.status(500).send('Помилка сервера при отриманні статей');
    }
  }

  // GET /articles/:articleId
  static async getArticleById(req, res) {
    try {
      const articleId = req.params.articleId;
      const acceptsHtml = req.headers.accept && req.headers.accept.includes('text/html');
      
      // Отримуємо статтю з MongoDB (автоматично збільшується views)
      const article = await ArticleModel.getById(articleId);
      
      if (!article) {
        if (acceptsHtml) {
          // Рендеримо HTML сторінку з помилкою
          return res.status(404).render('articles/article.ejs', {
            title: 'Стаття не знайдена',
            articleId: articleId,
            articleExists: false,
            article: null
          });
        } else {
          // Повертаємо JSON помилку для API
          return res.status(404).send('Not Found');
        }
      }
      
      if (acceptsHtml) {
        // Рендеримо HTML сторінку статті
        res.render('articles/article.ejs', {
          title: article.title,
          articleId: articleId,
          articleExists: true,
          article: article
        });
      } else {
        // Повертаємо JSON для API
        res.json(ArticleView.renderArticleById(article));
      }
    } catch (error) {
      console.error('Помилка отримання статті:', error);
      res.status(500).send('Помилка сервера при отриманні статті');
    }
  }

  // POST /articles
  static async createArticle(req, res) {
    try {
      const { title, content } = req.body;
      
      // Валідація title
      if (!title || typeof title !== 'string') {
        return res.status(400).send('Bad Request: Title is required');
      }
      
      const trimmedTitle = title.trim();
      if (trimmedTitle.length < 3) {
        return res.status(400).send('Bad Request: Title must be at least 3 characters long');
      }
      
      if (trimmedTitle.length > 200) {
        return res.status(400).send('Bad Request: Title must not exceed 200 characters');
      }
      
      // Валідація content (опціональне)
      if (content !== undefined) {
        if (typeof content !== 'string') {
          return res.status(400).send('Bad Request: Content must be a string');
        }
        
        const trimmedContent = content.trim();
        if (trimmedContent.length > 0 && trimmedContent.length < 10) {
          return res.status(400).send('Bad Request: Content must be at least 10 characters long');
        }
        
        if (trimmedContent.length > 10000) {
          return res.status(400).send('Bad Request: Content must not exceed 10000 characters');
        }
      }
      
      // Створюємо статтю в MongoDB
      const articleData = {
        title: trimmedTitle,
        content: content ? content.trim() : '',
        authorId: req.user ? req.user.id : 1, // Використовуємо авторизованого користувача
        authorName: req.user ? req.user.username : 'Unknown',
        category: 'Загальне',
        tags: []
      };
      
      const created = await ArticleModel.create(articleData);
      
      if (created) {
        res.status(201).json(ArticleView.renderCreated());
      } else {
        res.status(500).send('Помилка створення статті');
      }
    } catch (error) {
      console.error('Помилка створення статті:', error);
      res.status(500).send('Помилка сервера при створенні статті');
    }
  }

  // PUT /articles/:articleId
  static async updateArticle(req, res) {
    try {
      const articleId = req.params.articleId;
      
      // Перевірка існування статті
      const articleExists = await ArticleModel.exists(articleId);
      if (!articleExists) {
        return res.status(404).send('Not Found');
      }
      
      const { title, content } = req.body;
      
      // Валідація title
      if (!title || typeof title !== 'string') {
        return res.status(400).send('Bad Request: Title is required');
      }
      
      const trimmedTitle = title.trim();
      if (trimmedTitle.length < 3) {
        return res.status(400).send('Bad Request: Title must be at least 3 characters long');
      }
      
      if (trimmedTitle.length > 200) {
        return res.status(400).send('Bad Request: Title must not exceed 200 characters');
      }
      
      // Валідація content (опціональне)
      if (content !== undefined) {
        if (typeof content !== 'string') {
          return res.status(400).send('Bad Request: Content must be a string');
        }
        
        const trimmedContent = content.trim();
        if (trimmedContent.length > 0 && trimmedContent.length < 10) {
          return res.status(400).send('Bad Request: Content must be at least 10 characters long');
        }
        
        if (trimmedContent.length > 10000) {
          return res.status(400).send('Bad Request: Content must not exceed 10000 characters');
        }
      }
      
      // Оновлюємо статтю в MongoDB
      const articleData = {
        title: trimmedTitle,
        content: content ? content.trim() : ''
      };
      
      const updated = await ArticleModel.update(articleId, articleData);
      
      if (updated) {
        res.json(ArticleView.renderUpdated(articleId));
      } else {
        res.status(500).send('Помилка оновлення статті');
      }
    } catch (error) {
      console.error('Помилка оновлення статті:', error);
      res.status(500).send('Помилка сервера при оновленні статті');
    }
  }

  // DELETE /articles/:articleId
  static async deleteArticle(req, res) {
    try {
      const articleId = req.params.articleId;
      
      // Перевірка існування статті
      const articleExists = await ArticleModel.exists(articleId);
      if (!articleExists) {
        return res.status(404).send('Not Found');
      }
      
      // Видаляємо статтю з MongoDB
      const deleted = await ArticleModel.delete(articleId);
      
      if (deleted) {
        res.status(204).send();
      } else {
        res.status(500).send('Помилка видалення статті');
      }
    } catch (error) {
      console.error('Помилка видалення статті:', error);
      res.status(500).send('Помилка сервера при видаленні статті');
    }
  }

  // POST /articles/insertOne - додати одну статтю
  static async insertOneArticle(req, res) {
    try {
      const articleData = req.body;
      
      // Базова валідація
      if (!articleData.title || !articleData.content) {
        return res.status(400).json({
          error: 'Обов\'язкові поля: title, content'
        });
      }

      // Додаємо інформацію про автора з сесії
      const enrichedArticleData = {
        ...articleData,
        authorId: req.user ? req.user.id : 1,
        authorName: req.user ? req.user.username : 'Unknown Author'
      };

      const result = await ArticleModel.insertOne(enrichedArticleData);
      
      if (result.success) {
        res.status(201).json({
          message: 'Статтю успішно створено',
          insertedId: result.insertedId,
          article: result.article
        });
      } else {
        res.status(500).json({
          error: 'Помилка створення статті'
        });
      }
    } catch (error) {
      console.error('Помилка insertOne статті:', error);
      res.status(500).json({
        error: 'Помилка сервера при створенні статті'
      });
    }
  }

  // POST /articles/insertMany - додати багато статей
  static async insertManyArticles(req, res) {
    try {
      const articlesData = req.body;
      
      // Перевірка що це масив
      if (!Array.isArray(articlesData) || articlesData.length === 0) {
        return res.status(400).json({
          error: 'Очікується непорожній масив статей'
        });
      }

      // Валідація кожної статті
      for (let i = 0; i < articlesData.length; i++) {
        const article = articlesData[i];
        if (!article.title || !article.content) {
          return res.status(400).json({
            error: `Стаття ${i + 1}: обов'язкові поля title, content`
          });
        }
      }

      // Збагачуємо кожну статтю інформацією про автора
      const enrichedArticlesData = articlesData.map(articleData => ({
        ...articleData,
        authorId: req.user ? req.user.id : 1,
        authorName: req.user ? req.user.username : 'Unknown Author'
      }));

      const result = await ArticleModel.insertMany(enrichedArticlesData);
      
      if (result.success) {
        res.status(201).json({
          message: `Успішно створено ${result.insertedCount} статей`,
          insertedCount: result.insertedCount,
          insertedIds: result.insertedIds,
          articles: result.articles
        });
      } else {
        res.status(500).json({
          error: 'Помилка створення статей'
        });
      }
    } catch (error) {
      console.error('Помилка insertMany статей:', error);
      res.status(500).json({
        error: 'Помилка сервера при створенні статей'
      });
    }
  }

  // PUT /articles/updateOne - оновити одну статтю за фільтром
  static async updateOneArticle(req, res) {
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

      // Валідація заголовку
      if (update.title && (typeof update.title !== 'string' || update.title.length < 3)) {
        return res.status(400).json({
          error: 'Заголовок має містити мінімум 3 символи'
        });
      }

      // Валідація контенту
      if (update.content && (typeof update.content !== 'string' || update.content.length < 10)) {
        return res.status(400).json({
          error: 'Контент має містити мінімум 10 символів'
        });
      }

      const result = await ArticleModel.updateOneByFilter(filter, update);
      
      if (result.success) {
        res.json({
          message: 'Статтю успішно оновлено',
          matchedCount: result.matchedCount,
          modifiedCount: result.modifiedCount,
          article: result.article
        });
      } else {
        res.status(404).json({
          error: result.message || 'Стаття не знайдена'
        });
      }
    } catch (error) {
      console.error('Помилка updateOne статті:', error);
      res.status(500).json({
        error: 'Помилка сервера при оновленні статті'
      });
    }
  }

  // PUT /articles/updateMany - оновити багато статей за фільтром
  static async updateManyArticles(req, res) {
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

      // Валідація заголовку для масового оновлення
      if (update.title && (typeof update.title !== 'string' || update.title.length < 3)) {
        return res.status(400).json({
          error: 'Заголовок для масового оновлення має містити мінімум 3 символи'
        });
      }

      const result = await ArticleModel.updateManyByFilter(filter, update);
      
      res.json({
        message: result.message,
        matchedCount: result.matchedCount,
        modifiedCount: result.modifiedCount
      });
    } catch (error) {
      console.error('Помилка updateMany статей:', error);
      res.status(500).json({
        error: 'Помилка сервера при масовому оновленні статей'
      });
    }
  }

  // PUT /articles/replaceOne - замінити одну статтю повністю
  static async replaceOneArticle(req, res) {
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
          error: 'Обов\'язковий параметр: replacement (об\'єкт з повними даними статті)'
        });
      }

      // Валідація обов'язкових полів для заміни
      if (!replacement.title || !replacement.content) {
        return res.status(400).json({
          error: 'Для заміни обов\'язкові поля: title, content'
        });
      }

      // Валідація заголовку та контенту
      if (replacement.title.length < 3) {
        return res.status(400).json({
          error: 'Заголовок має містити мінімум 3 символи'
        });
      }

      if (replacement.content.length < 10) {
        return res.status(400).json({
          error: 'Контент має містити мінімум 10 символів'
        });
      }

      // Збагачуємо дані автора з сесії
      const enrichedReplacement = {
        ...replacement,
        authorId: req.user ? req.user.id : 1,
        authorName: req.user ? req.user.username : 'Unknown Author'
      };

      const result = await ArticleModel.replaceOneByFilter(filter, enrichedReplacement);
      
      if (result.success) {
        res.json({
          message: 'Статтю успішно замінено',
          matchedCount: result.matchedCount,
          modifiedCount: result.modifiedCount,
          article: result.article
        });
      } else {
        res.status(404).json({
          error: result.message || 'Стаття для заміни не знайдена'
        });
      }
    } catch (error) {
      console.error('Помилка replaceOne статті:', error);
      res.status(500).json({
        error: 'Помилка сервера при заміні статті'
      });
    }
  }

  // DELETE /articles/deleteOne - видалити одну статтю за фільтром (тільки для адміністраторів)
  static async deleteOneArticle(req, res) {
    try {
      // Перевіряємо права адміністратора
      if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({
          error: 'Доступ заборонено. Тільки адміністратори можуть видаляти статті.'
        });
      }

      const { filter } = req.body;
      
      // Базова валідація
      if (!filter || typeof filter !== 'object' || Object.keys(filter).length === 0) {
        return res.status(400).json({
          error: 'Обов\'язковий параметр: filter (непорожній об\'єкт)'
        });
      }

      const result = await ArticleModel.deleteOneByFilter(filter);
      
      if (result.success) {
        res.json({
          message: result.message,
          deletedCount: result.deletedCount,
          deletedArticle: {
            _id: result.deletedArticle._id,
            title: result.deletedArticle.title,
            authorName: result.deletedArticle.authorName,
            category: result.deletedArticle.category
          }
        });
      } else {
        res.status(404).json({
          error: result.message || 'Стаття для видалення не знайдена'
        });
      }
    } catch (error) {
      console.error('Помилка deleteOne статті:', error);
      res.status(500).json({
        error: 'Помилка сервера при видаленні статті'
      });
    }
  }

  // DELETE /articles/deleteMany - видалити багато статей за фільтром (тільки для адміністраторів)
  static async deleteManyArticles(req, res) {
    try {
      // Перевіряємо права адміністратора
      if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({
          error: 'Доступ заборонено. Тільки адміністратори можуть масово видаляти статті.'
        });
      }

      const { filter } = req.body;
      
      // Базова валідація
      if (!filter || typeof filter !== 'object' || Object.keys(filter).length === 0) {
        return res.status(400).json({
          error: 'Обов\'язковий параметр: filter (непорожній об\'єкт)'
        });
      }

      // Захист від випадкового видалення всіх статей
      if (Object.keys(filter).length === 0 || 
          (filter.hasOwnProperty('isPublished') && filter.isPublished === undefined)) {
        return res.status(400).json({
          error: 'Фільтр занадто широкий. Вкажіть більш конкретні критерії для безпеки.'
        });
      }

      const result = await ArticleModel.deleteManyByFilter(filter);
      
      if (result.success) {
        res.json({
          message: result.message,
          deletedCount: result.deletedCount,
          deletedArticles: result.deletedArticles.map(article => ({
            _id: article._id,
            title: article.title,
            authorName: article.authorName,
            category: article.category,
            createdAt: article.createdAt
          }))
        });
      } else {
        res.status(404).json({
          error: result.message || 'Статті для видалення не знайдені'
        });
      }
    } catch (error) {
      console.error('Помилка deleteMany статей:', error);
      res.status(500).json({
        error: 'Помилка сервера при масовому видаленні статей'
      });
    }
  }

  // GET /articles/find - розширене читання з фільтрами та проекціями
  static async findArticles(req, res) {
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

      const result = await ArticleModel.findByFilter(options);
      
      res.json({
        message: `Знайдено ${result.count} статей`,
        ...result,
        pagination: {
          limit: options.limit,
          skip: options.skip,
          hasMore: result.hasMore
        }
      });
    } catch (error) {
      console.error('Помилка розширеного пошуку статей:', error);
      res.status(500).json({
        error: 'Помилка сервера при розширеному пошуку статей'
      });
    }
  }

  // GET /articles/search - пошук статей за текстом
  static async searchArticles(req, res) {
    try {
      const { 
        q, 
        projection = '{}', 
        limit = '20', 
        skip = '0',
        publishedOnly = 'true'
      } = req.query;

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
        skip: parseInt(skip) || 0,
        publishedOnly: publishedOnly === 'true'
      };

      const result = await ArticleModel.searchArticles(q.trim(), options);
      
      res.json({
        message: `Знайдено ${result.count} статей за запитом "${q}"`,
        ...result
      });
    } catch (error) {
      console.error('Помилка пошуку статей:', error);
      res.status(500).json({
        error: 'Помилка сервера при пошуку статей'
      });
    }
  }

  // GET /articles/basic - отримати базову інформацію статей
  static async getBasicArticleInfo(req, res) {
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

      const result = await ArticleModel.getBasicInfo(parsedFilter);
      
      res.json({
        message: `Отримано базову інформацію про ${result.count} статей`,
        ...result
      });
    } catch (error) {
      console.error('Помилка отримання базової інформації статей:', error);
      res.status(500).json({
        error: 'Помилка сервера при отриманні базової інформації статей'
      });
    }
  }

  // GET /articles/filtered - отримати статті з фільтрами
  static async getFilteredArticles(req, res) {
    try {
      const {
        category,
        authorId,
        isPublished,
        dateFrom,
        dateTo,
        minViews,
        maxViews,
        tags,
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

      // Валідація isPublished якщо передано
      let validIsPublished;
      if (isPublished !== undefined) {
        if (isPublished === 'true') validIsPublished = true;
        else if (isPublished === 'false') validIsPublished = false;
        else {
          return res.status(400).json({
            error: 'Параметр isPublished повинен бути "true" або "false"'
          });
        }
      }

      // Парсимо теги якщо передані
      let parsedTags;
      if (tags) {
        try {
          parsedTags = JSON.parse(tags);
          if (!Array.isArray(parsedTags)) {
            throw new Error('Tags повинні бути масивом');
          }
        } catch (parseError) {
          return res.status(400).json({
            error: 'Параметр tags повинен бути JSON масивом'
          });
        }
      }

      const options = {
        category,
        authorId,
        isPublished: validIsPublished,
        dateFrom,
        dateTo,
        minViews,
        maxViews,
        tags: parsedTags,
        projection: parsedProjection,
        sort: parsedSort,
        limit: parseInt(limit) || 0,
        skip: parseInt(skip) || 0
      };

      const result = await ArticleModel.getWithFilters(options);
      
      res.json({
        message: `Знайдено ${result.count} статей з фільтрами`,
        ...result,
        appliedFilters: {
          category,
          authorId,
          isPublished: validIsPublished,
          dateFrom,
          dateTo,
          minViews,
          maxViews,
          tags: parsedTags
        }
      });
    } catch (error) {
      console.error('Помилка фільтрації статей:', error);
      res.status(500).json({
        error: 'Помилка сервера при фільтрації статей'
      });
    }
  }

  // GET /articles/aggregated - агрегована статистика статей
  static async getAggregatedArticles(req, res) {
    try {
      const { groupBy = 'category', includeStats = 'true' } = req.query;

      const options = {
        groupBy,
        includeStats: includeStats === 'true'
      };

      const result = await ArticleModel.getAggregatedData(options);
      
      res.json({
        message: `Агреговані дані статей за полем "${groupBy}"`,
        ...result
      });
    } catch (error) {
      console.error('Помилка агрегації статей:', error);
      res.status(500).json({
        error: 'Помилка сервера при агрегації статей'
      });
    }
  }

  // GET /articles/top - топ статей за переглядами/лайками
  static async getTopArticles(req, res) {
    try {
      const { 
        sortBy = 'views', 
        limit = '10', 
        publishedOnly = 'true',
        projection = '{}'
      } = req.query;

      // Валідація sortBy
      const allowedSortFields = ['views', 'likes', 'createdAt'];
      if (!allowedSortFields.includes(sortBy)) {
        return res.status(400).json({
          error: `Параметр sortBy повинен бути одним з: ${allowedSortFields.join(', ')}`
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
        sortBy,
        limit: parseInt(limit) || 10,
        publishedOnly: publishedOnly === 'true',
        projection: parsedProjection
      };

      const result = await ArticleModel.getTopArticles(options);
      
      res.json({
        message: `Топ ${result.count} статей за ${sortBy}`,
        ...result
      });
    } catch (error) {
      console.error('Помилка отримання топ статей:', error);
      res.status(500).json({
        error: 'Помилка сервера при отриманні топ статей'
      });
    }
  }
}