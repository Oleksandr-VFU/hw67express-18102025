// Контролер для головної сторінки
export const HomeController = {
  // GET / - головна сторінка
  getHomePage: (req, res) => {
    try {
      if (req.isAuthenticated()) {
        // Користувач авторизований - показуємо дашборд
        res.render('home/dashboard', { 
          title: 'Дашборд - Головна сторінка' 
        });
      } else {
        // Користувач не авторизований - показуємо форму авторизації
        res.render('home/auth', { 
          title: 'Авторизація - Вхід до системи' 
        });
      }
    } catch (error) {
      console.error('Помилка на головній сторінці:', error);
      res.status(500).send('Внутрішня помилка сервера');
    }
  }
};