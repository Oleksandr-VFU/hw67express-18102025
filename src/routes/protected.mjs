import express from 'express';

const router = express.Router();

// GET /protected - захищений маршрут для демонстрації Passport авторизації
router.get('/', (req, res) => {
  // Перевіряємо чи запит прийшов через браузер (Accept: text/html) чи API (JSON)
  const acceptsHtml = req.headers.accept && req.headers.accept.includes('text/html');
  
  if (acceptsHtml) {
    // Рендеримо HTML сторінку для браузера
    res.render('protected/protected', {
      title: 'Захищена сторінка',
      user: req.user,
      sessionInfo: {
        sessionId: req.sessionID ? req.sessionID.slice(0, 8) + '...' : 'none',
        loginTime: req.session?.passport?.user ? 'Авторизований' : 'Не авторизований',
        sessionAge: req.session?.cookie?.maxAge ? Math.round(req.session.cookie.maxAge / 1000 / 60) + ' хв' : 'N/A'
      }
    });
  } else {
    // Повертаємо JSON для API запитів
    res.json({
      message: 'Доступ до захищеного ресурсу надано',
      user: {
        id: req.user.id,
        username: req.user.username,
        email: req.user.email,
        role: req.user.role
      },
      session: {
        id: req.sessionID,
        authenticated: req.isAuthenticated(),
        maxAge: req.session?.cookie?.maxAge,
        timestamp: new Date().toISOString()
      }
    });
  }
});

export default router;