/**
 * Утиліти для безпечної роботи з даними авторизованого користувача
 */

/**
 * Безпечне отримання ID авторизованого користувача
 * @param {Object} req - Express request object
 * @param {number} defaultId - ID за замовчуванням якщо користувач не авторизований
 * @returns {number} ID користувача або defaultId
 */
export const getAuthorId = (req, defaultId = 1) => {
  return req.user?.id || defaultId;
};

/**
 * Безпечне отримання імені авторизованого користувача
 * @param {Object} req - Express request object
 * @param {string} defaultName - Ім'я за замовчуванням якщо користувач не авторизований
 * @returns {string} Повне ім'я користувача або defaultName
 */
export const getAuthorName = (req, defaultName = 'Unknown Author') => {
  if (!req.user) {
    return defaultName;
  }

  // Спробуємо скласти повне ім'я з firstName та lastName
  const fullName = `${req.user.firstName || ''} ${req.user.lastName || ''}`.trim();
  
  // Якщо повне ім'я є, використовуємо його
  if (fullName) {
    return fullName;
  }
  
  // Інакше використовуємо username або defaultName
  return req.user.username || defaultName;
};

/**
 * Отримання повної інформації про автора для створення статей
 * @param {Object} req - Express request object
 * @param {Object} defaults - Значення за замовчуванням
 * @returns {Object} Об'єкт з authorId та authorName
 */
export const getAuthorInfo = (req, defaults = { id: 1, name: 'Unknown Author' }) => {
  return {
    authorId: getAuthorId(req, defaults.id),
    authorName: getAuthorName(req, defaults.name)
  };
};

/**
 * Перевірка чи користувач має права адміністратора
 * @param {Object} req - Express request object
 * @returns {boolean} true якщо користувач є адміністратором
 */
export const isAdmin = (req) => {
  return req.user && req.user.role === 'admin';
};

/**
 * Безпечне отримання ролі користувача
 * @param {Object} req - Express request object
 * @param {string} defaultRole - Роль за замовчуванням
 * @returns {string} Роль користувача або defaultRole
 */
export const getUserRole = (req, defaultRole = 'guest') => {
  return req.user?.role || defaultRole;
};