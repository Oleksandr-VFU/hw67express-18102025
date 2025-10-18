import express from 'express';

const router = express.Router();

// GET /settings - показати сторінку налаштувань
router.get('/', (req, res) => {
  const currentTheme = req.cookies.theme || 'light';
  
  // Перевіряємо чи запит прийшов через браузер
  const acceptsHtml = req.headers.accept && req.headers.accept.includes('text/html');
  
  if (acceptsHtml) {
    res.render('settings/settings', {
      title: 'Налаштування',
      currentTheme: currentTheme,
      themes: [
        { value: 'light', name: 'Світла тема' },
        { value: 'dark', name: 'Темна тема' },
        { value: 'blue', name: 'Синя тема' },
        { value: 'green', name: 'Зелена тема' }
      ]
    });
  } else {
    res.json({
      currentTheme: currentTheme,
      availableThemes: ['light', 'dark', 'blue', 'green']
    });
  }
});

// POST /settings/theme - зберегти вибрану тему
router.post('/theme', (req, res) => {
  console.log('POST /settings/theme - req.body:', req.body);
  console.log('Content-Type:', req.headers['content-type']);
  
  const { theme } = req.body;
  const validThemes = ['light', 'dark', 'blue', 'green'];
  
  // Валідація теми
  if (!theme || !validThemes.includes(theme)) {
    console.log('Invalid theme:', theme);
    return res.status(400).json({
      error: 'Invalid theme. Valid themes: ' + validThemes.join(', ')
    });
  }
  
  console.log('Setting theme to:', theme);
  
  // Зберігаємо тему в cookie на 30 днів
  res.cookie('theme', theme, {
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 днів в мілісекундах
    httpOnly: false, // Дозволяємо доступ з JavaScript
    secure: false, // Для розробки (для HTTPS потрібно true)
    sameSite: 'lax'
  });
  
  // Перевіряємо чи запит прийшов через браузер
  const acceptsHtml = req.headers.accept && req.headers.accept.includes('text/html');
  
  if (acceptsHtml) {
    // Для браузерних запитів - редірект назад на налаштування
    res.redirect('/settings');
  } else {
    // Для API запитів - JSON відповідь
    res.json({
      success: true,
      message: `Theme set to: ${theme}`,
      theme: theme
    });
  }
});

// GET /settings/theme - отримати поточну тему
router.get('/theme', (req, res) => {
  const currentTheme = req.cookies.theme || 'light';
  
  res.json({
    theme: currentTheme
  });
});

export default router;