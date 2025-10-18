import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcryptjs';

// Простий список користувачів (замість бази даних)
const users = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@example.com',
    password: '', // буде заповнено
    role: 'admin'
  },
  {
    id: 2,
    username: 'user',
    email: 'user@example.com',
    password: '', // буде заповнено
    role: 'user'
  }
];

// Ініціалізація хешів паролів
async function initUsers() {
  users[0].password = await bcrypt.hash('admin123', 10);
  users[1].password = await bcrypt.hash('user123', 10);
}
initUsers();

// Конфігурація LocalStrategy для авторизації через email та пароль
passport.use(new LocalStrategy({
  usernameField: 'email', // Використовуємо email замість username
  passwordField: 'password'
}, async (email, password, done) => {
  try {
    // Знаходимо користувача за email
    const user = users.find(u => u.email === email);
    
    if (!user) {
      return done(null, false, { message: 'Неправильний email або пароль' });
    }
    
    // Перевіряємо пароль
    const validPassword = await bcrypt.compare(password, user.password);
    
    if (!validPassword) {
      return done(null, false, { message: 'Неправильний email або пароль' });
    }
    
    // Повертаємо користувача без пароля
    const userWithoutPassword = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    };
    
    return done(null, userWithoutPassword);
    
  } catch (error) {
    return done(error);
  }
}));

// Серіалізація користувача для збереження в сесії
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Десеріалізація користувача з сесії
passport.deserializeUser((id, done) => {
  const user = users.find(u => u.id === id);
  
  if (user) {
    const userWithoutPassword = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    };
    done(null, userWithoutPassword);
  } else {
    done(new Error('Користувача не знайдено'), null);
  }
});

// Функції для роботи з користувачами
export const findUserByEmail = (email) => users.find(u => u.email === email);
export const findUserById = (id) => users.find(u => u.id === id);

// Функція для створення нового користувача
export const createUser = async (userData) => {
  const { username, email, password } = userData;
  
  // Перевіряємо чи користувач з таким email існує
  if (findUserByEmail(email)) {
    throw new Error('Користувач з таким email вже існує');
  }
  
  // Хешуємо пароль
  const hashedPassword = await bcrypt.hash(password, 10);
  
  // Створюємо нового користувача
  const newUser = {
    id: users.length + 1,
    username,
    email,
    password: hashedPassword,
    role: 'user'
  };
  
  users.push(newUser);
  
  // Повертаємо користувача без пароля
  return {
    id: newUser.id,
    username: newUser.username,
    email: newUser.email,
    role: newUser.role
  };
};

export { users };