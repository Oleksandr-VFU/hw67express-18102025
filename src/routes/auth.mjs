import express from 'express';
import passport from 'passport';
import { createUser } from '../config/passport.mjs';
import { destroySession } from '../middleware/index.mjs';

const router = express.Router();

// GET /auth/login - форма входу
router.get('/login', (req, res) => {
  res.render('auth/login', { title: 'Вхід' });
});

// GET /auth/register - форма реєстрації
router.get('/register', (req, res) => {
  res.render('auth/register', { title: 'Реєстрація' });
});

// GET /auth/profile - профіль користувача
router.get('/profile', (req, res) => {
  if (req.isAuthenticated()) {
    res.render('auth/profile', { 
      title: 'Профіль користувача', 
      user: req.user
    });
  } else {
    res.render('auth/profile', { 
      title: 'Профіль користувача', 
      user: null 
    });
  }
});

// POST /auth/login - вхід через Passport
router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }
    
    if (!user) {
      return res.send(`
        <h1>Помилка входу</h1>
        <p style="color: red;">${info.message || 'Неправильний email або пароль'}</p>
        <a href="/">Спробувати знову</a>
      `);
    }
    
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      // Редирект на головну сторінку після успішного входу
      return res.redirect('/');
    });
  })(req, res, next);
});

// POST /auth/register - реєстрація через Passport
router.post('/register', async (req, res, next) => {
  const { username, email, password } = req.body;
  
  try {
    // Створюємо нового користувача
    const newUser = await createUser({ username, email, password });
    
    // Автоматично входимо після реєстрації
    req.logIn(newUser, (err) => {
      if (err) {
        return next(err);
      }
      // Редирект на головну сторінку після успішної реєстрації
      return res.redirect('/');
    });
    
  } catch (error) {
    return res.send(`
      <h1>Помилка реєстрації</h1>
      <p style="color: red;">${error.message}</p>
      <a href="/">Спробувати знову</a>
    `);
  }
});

// POST /auth/logout - вихід через Passport з повним очищенням сесії
router.post('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    
    // Повне знищення сесії після logout
    destroySession(req, res, () => {
      // Редирект на головну сторінку після виходу
      res.redirect('/');
    });
  });
});

export default router;