import express from 'express';
import { ArticleController } from '../controllers/index.mjs';

const router = express.Router();

// JWT middleware та requireAdmin вже застосовані в server.mjs

// GET /articles - отримати всі статті
router.get('/', ArticleController.getAllArticles);

// GET /articles/find - розширене читання з фільтрами та проекціями
router.get('/find', ArticleController.findArticles);

// GET /articles/cursor - отримання статей з використанням курсора
router.get('/cursor', ArticleController.getArticlesWithCursor);

// POST /articles - створити нову статтю
router.post('/', ArticleController.createArticle);

// POST /articles/insertOne - додати одну статтю (MongoDB insertOne)
router.post('/insertOne', ArticleController.insertOneArticle);

// POST /articles/insertMany - додати багато статей (MongoDB insertMany)
router.post('/insertMany', ArticleController.insertManyArticles);

// PUT /articles/updateOne - оновити одну статтю за фільтром (MongoDB updateOne)
router.put('/updateOne', ArticleController.updateOneArticle);

// PUT /articles/updateMany - оновити багато статей за фільтром (MongoDB updateMany)
router.put('/updateMany', ArticleController.updateManyArticles);

// PUT /articles/replaceOne - замінити одну статтю повністю (MongoDB replaceOne)
router.put('/replaceOne', ArticleController.replaceOneArticle);

// DELETE /articles/deleteOne - видалити одну статтю за фільтром (MongoDB deleteOne)
router.delete('/deleteOne', ArticleController.deleteOneArticle);

// DELETE /articles/deleteMany - видалити багато статей за фільтром (MongoDB deleteMany)
router.delete('/deleteMany', ArticleController.deleteManyArticles);

// GET /articles/:articleId - отримати статтю за ID
router.get('/:articleId', ArticleController.getArticleById);

// PUT /articles/:articleId - оновити статтю
router.put('/:articleId', ArticleController.updateArticle);

// DELETE /articles/:articleId - видалити статтю
router.delete('/:articleId', ArticleController.deleteArticle);

export default router;