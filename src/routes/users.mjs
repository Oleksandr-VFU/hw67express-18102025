import express from 'express';
import { UserController } from '../controllers/index.mjs';

const router = express.Router();

// JWT middleware вже застосовано в server.mjs

// GET /users - отримати всіх користувачів
router.get('/', UserController.getAllUsers);

// GET /users/find - розширене читання з фільтрами та проекціями
router.get('/find', UserController.findUsers);

// GET /users/cursor - отримання користувачів з використанням курсора
router.get('/cursor', UserController.getUsersWithCursor);

// POST /users - створити нового користувача
router.post('/', UserController.createUser);

// POST /users/insertOne - додати одного користувача (MongoDB insertOne)
router.post('/insertOne', UserController.insertOneUser);

// POST /users/insertMany - додати багатьох користувачів (MongoDB insertMany)
router.post('/insertMany', UserController.insertManyUsers);

// PUT /users/updateOne - оновити одного користувача за фільтром (MongoDB updateOne)
router.put('/updateOne', UserController.updateOneUser);

// PUT /users/updateMany - оновити багатьох користувачів за фільтром (MongoDB updateMany)
router.put('/updateMany', UserController.updateManyUsers);

// PUT /users/replaceOne - замінити одного користувача повністю (MongoDB replaceOne)
router.put('/replaceOne', UserController.replaceOneUser);

// DELETE /users/deleteOne - видалити одного користувача за фільтром (MongoDB deleteOne)
router.delete('/deleteOne', UserController.deleteOneUser);

// DELETE /users/deleteMany - видалити багатьох користувачів за фільтром (MongoDB deleteMany)
router.delete('/deleteMany', UserController.deleteManyUsers);

// GET /users/:userId - отримати користувача за ID
router.get('/:userId', UserController.getUserById);

// PUT /users/:userId - оновити користувача
router.put('/:userId', UserController.updateUser);

// DELETE /users/:userId - видалити користувача
router.delete('/:userId', UserController.deleteUser);

export default router;