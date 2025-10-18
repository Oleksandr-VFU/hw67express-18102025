import { ArticleModel } from '../models/index.mjs';
import { ArticleView } from '../views/index.mjs';
import { getAuthorInfo } from '../utils/userUtils.mjs';

/**
 * MongoDB Article Controller - спрощені CRUD операції
 */
export class ArticleController {
  
  // GET /articles
  static async getAllArticles(req, res) {
    try {
      const acceptsHtml = req.headers.accept && req.headers.accept.includes('text/html');
      
      if (acceptsHtml) {
        const articles = await ArticleModel.getAll();
        res.render('articles/articles.ejs', { 
          title: 'Статті',
          articles: articles
        });
      } else {
        const articles = await ArticleModel.getAll();
        res.json(ArticleView.renderArticlesList(articles));
      }
    } catch (error) {
      console.error('Помилка отримання статей:', error);
      res.status(500).send('Помилка сервера');
    }
  }

  // GET /articles/:articleId
  static async getArticleById(req, res) {
    try {
      const articleId = req.params.articleId;
      const acceptsHtml = req.headers.accept && req.headers.accept.includes('text/html');
      
      const article = await ArticleModel.getById(articleId);
      
      if (!article) {
        if (acceptsHtml) {
          return res.status(404).render('articles/article', {
            title: 'Стаття не знайдена',
            articleId: articleId,
            articleExists: false,
            article: null
          });
        } else {
          return res.status(404).json({ error: 'Стаття не знайдена' });
        }
      }
      
      if (acceptsHtml) {
        res.render('articles/article.ejs', {
          title: article.title,
          articleId: articleId,
          articleExists: true,
          article: article
        });
      } else {
        res.json(ArticleView.renderArticle(article));
      }
    } catch (error) {
      console.error('Помилка отримання статті:', error);
      res.status(500).send('Помилка сервера');
    }
  }

  // POST /articles
  static async createArticle(req, res) {
    try {
      // Безпечне отримання даних авторизованого користувача
      const { authorId, authorName } = getAuthorInfo(req);

      const articleData = {
        ...req.body,
        authorId,
        authorName,
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
      res.status(500).send('Помилка сервера');
    }
  }

  // PUT /articles/:articleId
  static async updateArticle(req, res) {
    try {
      const articleId = req.params.articleId;
      const articleData = req.body;
      const updated = await ArticleModel.update(articleId, articleData);
      
      if (updated) {
        res.json(ArticleView.renderUpdated());
      } else {
        res.status(404).send('Стаття не знайдена');
      }
    } catch (error) {
      console.error('Помилка оновлення статті:', error);
      res.status(500).send('Помилка сервера');
    }
  }

  // DELETE /articles/:articleId
  static async deleteArticle(req, res) {
    try {
      const articleId = req.params.articleId;
      const deleted = await ArticleModel.delete(articleId);
      
      if (deleted) {
        res.json(ArticleView.renderDeleted());
      } else {
        res.status(404).send('Стаття не знайдена');
      }
    } catch (error) {
      console.error('Помилка видалення статті:', error);
      res.status(500).send('Помилка сервера');
    }
  }

  // POST /articles/insertOne - додати одну статтю
  static async insertOneArticle(req, res) {
    try {
      // Безпечне отримання даних авторизованого користувача
      const { authorId, authorName } = getAuthorInfo(req);

      const articleData = {
        ...req.body,
        authorId,
        authorName
      };

      const result = await ArticleModel.insertOne(articleData);
      
      if (result.success) {
        res.status(201).json({
          message: 'Статтю успішно створено',
          article: result.article
        });
      } else {
        res.status(500).json({ error: 'Помилка створення статті' });
      }
    } catch (error) {
      console.error('Помилка insertOne статті:', error);
      res.status(500).json({ error: 'Помилка сервера' });
    }
  }

  // POST /articles/insertMany - додати багато статей
  static async insertManyArticles(req, res) {
    try {
      // Безпечне отримання даних авторизованого користувача
      const { authorId, authorName } = getAuthorInfo(req);

      const articlesData = req.body.map(articleData => ({
        ...articleData,
        authorId,
        authorName
      }));

      const result = await ArticleModel.insertMany(articlesData);
      
      if (result.success) {
        res.status(201).json({
          message: `Успішно створено ${result.insertedCount} статей`,
          articles: result.articles
        });
      } else {
        res.status(500).json({ error: 'Помилка створення статей' });
      }
    } catch (error) {
      console.error('Помилка insertMany статей:', error);
      res.status(500).json({ error: 'Помилка сервера' });
    }
  }

  // PUT /articles/updateOne - оновити одну статтю за фільтром
  static async updateOneArticle(req, res) {
    try {
      const { filter, update } = req.body;
      const result = await ArticleModel.updateOneByFilter(filter, update);
      
      if (result.success) {
        res.json({
          message: 'Статтю успішно оновлено',
          article: result.article
        });
      } else {
        res.status(404).json({ error: 'Стаття не знайдена' });
      }
    } catch (error) {
      console.error('Помилка updateOne статті:', error);
      res.status(500).json({ error: 'Помилка сервера' });
    }
  }

  // PUT /articles/updateMany - оновити багато статей за фільтром
  static async updateManyArticles(req, res) {
    try {
      const { filter, update } = req.body;
      const result = await ArticleModel.updateManyByFilter(filter, update);
      
      res.json({
        message: result.message,
        matchedCount: result.matchedCount,
        modifiedCount: result.modifiedCount
      });
    } catch (error) {
      console.error('Помилка updateMany статей:', error);
      res.status(500).json({ error: 'Помилка сервера' });
    }
  }

  // PUT /articles/replaceOne - замінити одну статтю повністю
  static async replaceOneArticle(req, res) {
    try {
      const { filter, replacement } = req.body;
      
      // Безпечне отримання даних авторизованого користувача
      const { authorId, authorName } = getAuthorInfo(req);
      
      const enrichedReplacement = {
        ...replacement,
        authorId,
        authorName
      };

      const result = await ArticleModel.replaceOneByFilter(filter, enrichedReplacement);
      
      if (result.success) {
        res.json({
          message: 'Статтю успішно замінено',
          article: result.article
        });
      } else {
        res.status(404).json({ error: 'Стаття не знайдена' });
      }
    } catch (error) {
      console.error('Помилка replaceOne статті:', error);
      res.status(500).json({ error: 'Помилка сервера' });
    }
  }

  // DELETE /articles/deleteOne - видалити одну статтю за фільтром
  static async deleteOneArticle(req, res) {
    try {
      const { filter } = req.body;
      const result = await ArticleModel.deleteOneByFilter(filter);
      
      if (result.success) {
        res.json({
          message: result.message,
          deletedArticle: result.deletedArticle
        });
      } else {
        res.status(404).json({ error: 'Стаття не знайдена' });
      }
    } catch (error) {
      console.error('Помилка deleteOne статті:', error);
      res.status(500).json({ error: 'Помилка сервера' });
    }
  }

  // DELETE /articles/deleteMany - видалити багато статей за фільтром
  static async deleteManyArticles(req, res) {
    try {
      const { filter } = req.body;
      const result = await ArticleModel.deleteManyByFilter(filter);
      
      if (result.success) {
        res.json({
          message: result.message,
          deletedCount: result.deletedCount
        });
      } else {
        res.status(404).json({ error: 'Статті не знайдені' });
      }
    } catch (error) {
      console.error('Помилка deleteMany статей:', error);
      res.status(500).json({ error: 'Помилка сервера' });
    }
  }

  // GET /articles/find - розширене читання з фільтрами та проекціями
  static async findArticles(req, res) {
    try {
      const { filter = '{}', projection = '{}' } = req.query;
      
      const parsedFilter = JSON.parse(filter);
      const parsedProjection = JSON.parse(projection);
      
      const articles = await ArticleModel.findWithProjection(parsedFilter, parsedProjection);
      
      res.json({
        message: `Знайдено ${articles.length} статей`,
        articles: articles
      });
    } catch (error) {
      console.error('Помилка пошуку статей:', error);
      res.status(500).json({ error: 'Помилка сервера' });
    }
  }
}