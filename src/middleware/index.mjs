// Мідлвар для логування запитів з інформацією про сесію
export const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.originalUrl || req.url;
  const ip = req.ip || req.connection.remoteAddress || req.socket.remoteAddress || 'unknown';
  const sessionId = req.sessionID ? req.sessionID.slice(0, 8) : 'none';
  const authenticated = req.isAuthenticated ? req.isAuthenticated() : false;
  
  console.log(`[${timestamp}] ${method} ${url} - IP: ${ip} - Session: ${sessionId} - Auth: ${authenticated}`);
  next();
};

// Passport middleware для захищених маршрутів з покращеною обробкою сесій
export const passportAuthMiddleware = (req, res, next) => {
  if (req.isAuthenticated()) {
    // Оновлюємо час останньої активності для rolling sessions
    req.session.touch();
    return next();
  }
  
  // Для API запитів (JSON)
  const acceptsJson = req.headers.accept && req.headers.accept.includes('application/json');
  if (acceptsJson) {
    return res.status(401).json({ 
      error: 'Доступ заборонено: потрібна авторизація' 
    });
  }
  
  // Для браузерних запитів - редирект на логін
  res.redirect('/auth/login');
};

// Middleware для перевірки admin прав
export const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    // Для API запитів (JSON)
    const acceptsJson = req.headers.accept && req.headers.accept.includes('application/json');
    if (acceptsJson) {
      return res.status(403).json({ 
        error: 'Потрібні права адміністратора' 
      });
    }
    
    // Для браузерних запитів
    return res.status(403).send(`
      <h1>Доступ заборонено</h1>
      <p>Потрібні права адміністратора для доступу до цього ресурсу.</p>
      <a href="/">Повернутися на головну</a>
    `);
  }
  next();
};

// Спеціальний middleware для захищеного маршруту /protected
// Перевіряє наявність та валідність сесії користувача перед наданням доступу
export const protectedRouteMiddleware = (req, res, next) => {
  // Детальна перевірка стану сесії та авторизації
  const sessionExists = req.session && req.sessionID;
  const isAuthenticated = req.isAuthenticated();
  const userExists = req.user && req.user.id;
  
  // Логування для моніторингу доступу
  console.log(`[PROTECTED ROUTE] Session ID: ${req.sessionID?.slice(0, 8)}... | Authenticated: ${isAuthenticated} | User: ${userExists ? req.user.username : 'none'}`);
  
  // Перевірка валідності сесії
  if (!sessionExists) {
    console.log('[PROTECTED ROUTE] Access denied: No session found');
    return handleUnauthenticated(req, res, 'Сесія не знайдена');
  }
  
  // Перевірка авторизації через Passport
  if (!isAuthenticated) {
    console.log('[PROTECTED ROUTE] Access denied: User not authenticated');
    return handleUnauthenticated(req, res, 'Користувач не авторизований');
  }
  
  // Перевірка наявності користувача в сесії
  if (!userExists) {
    console.log('[PROTECTED ROUTE] Access denied: User data not found in session');
    return handleUnauthenticated(req, res, 'Дані користувача не знайдені в сесії');
  }
  
  // Перевірка терміну дії сесії
  if (req.session.cookie && req.session.cookie.expires) {
    const now = new Date();
    const expires = new Date(req.session.cookie.expires);
    if (now > expires) {
      console.log('[PROTECTED ROUTE] Access denied: Session expired');
      return handleUnauthenticated(req, res, 'Сесія закінчилася');
    }
  }
  
  // Оновлюємо час останньої активності
  req.session.lastAccess = new Date();
  req.session.touch();
  
  console.log(`[PROTECTED ROUTE] Access granted to user: ${req.user.username} (${req.user.role})`);
  next();
};

// Допоміжна функція для обробки неавторизованих запитів
function handleUnauthenticated(req, res, reason) {
  const acceptsJson = req.headers.accept && req.headers.accept.includes('application/json');
  
  if (acceptsJson) {
    // API відповідь
    return res.status(401).json({
      error: 'Доступ заборонено до захищеного ресурсу',
      reason: reason,
      redirectTo: '/auth/login'
    });
  } else {
    // Браузерна відповідь з інформативною сторінкою
    return res.status(401).send(`
      <!DOCTYPE html>
      <html lang="uk">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Доступ заборонено</title>
        <link rel="icon" href="/favicon.ico" type="image/x-icon">
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; background: #f8d7da; }
          .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; border: 1px solid #f5c6cb; }
          .error-header { color: #721c24; text-align: center; margin-bottom: 20px; }
          .reason { background: #f8d7da; padding: 15px; border-radius: 5px; color: #721c24; margin: 20px 0; }
          .actions { text-align: center; margin-top: 30px; }
          .btn { display: inline-block; padding: 10px 20px; margin: 0 10px; text-decoration: none; border-radius: 5px; }
          .btn-primary { background: #007bff; color: white; }
          .btn-secondary { background: #6c757d; color: white; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="error-header">
            <h1>🔒 Доступ заборонено</h1>
            <p>Ви не маєте доступу до цього захищеного ресурсу.</p>
          </div>
          <div class="reason">
            <strong>Причина:</strong> ${reason}
          </div>
          <div class="actions">
            <a href="/auth/login" class="btn btn-primary">Увійти до системи</a>
            <a href="/" class="btn btn-secondary">На головну</a>
          </div>
        </div>
      </body>
      </html>
    `);
  }
}

// Middleware для очищення сесії
export const destroySession = (req, res, next) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        console.error('Помилка при знищенні сесії:', err);
        return next(err);
      }
      res.clearCookie('sessionId'); // Очищуємо cookie сесії
      next();
    });
  } else {
    next();
  }
};
