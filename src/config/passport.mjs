import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcryptjs';
import { UserModel } from '../models/index.mjs';

// Конфігурація LocalStrategy для авторизації через email та пароль з MongoDB
passport.use(new LocalStrategy({
  usernameField: 'email', // Використовуємо email замість username
  passwordField: 'password'
}, async (email, password, done) => {
  try {
    // Знаходимо користувача за email в MongoDB
    const user = await UserModel.findByEmail(email);
    
    if (!user) {
      return done(null, false, { message: 'Неправильний email або пароль' });
    }
    
    // Перевіряємо пароль
    const validPassword = await bcrypt.compare(password, user.password);
    
    if (!validPassword) {
      return done(null, false, { message: 'Неправильний email або пароль' });
    }
    
    // Повертаємо користувача без пароля з перевіркою наявності полів
    const userWithoutPassword = {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      isActive: user.isActive !== undefined ? user.isActive : true,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
    
    return done(null, userWithoutPassword);
    
  } catch (error) {
    console.error('Помилка авторизації через Passport:', error);
    return done(error);
  }
}));

// Серіалізація користувача для збереження в сесії
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Десеріалізація користувача з сесії з MongoDB
passport.deserializeUser(async (id, done) => {
  try {
    const user = await UserModel.getById(id);
    
    if (user) {
      const userWithoutPassword = {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        isActive: user.isActive !== undefined ? user.isActive : true,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      };
      done(null, userWithoutPassword);
    } else {
      done(new Error('Користувача не знайдено в базі даних'), null);
    }
  } catch (error) {
    console.error('Помилка десеріалізації користувача:', error);
    done(error, null);
  }
});

// Функції для роботи з користувачами через MongoDB
export const findUserByEmail = async (email) => {
  try {
    return await UserModel.findByEmail(email);
  } catch (error) {
    console.error('Помилка пошуку користувача за email:', error);
    return null;
  }
};

export const findUserById = async (id) => {
  try {
    return await UserModel.getById(id);
  } catch (error) {
    console.error('Помилка пошуку користувача за ID:', error);
    return null;
  }
};

// Функція для створення нового користувача в MongoDB
export const createUser = async (userData) => {
  try {
    const { username, email, password, firstName, lastName } = userData;
    
    // Перевіряємо чи користувач з таким email існує
    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      throw new Error('Користувач з таким email вже існує');
    }
    
    // Хешуємо пароль
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Створюємо нового користувача через модель
    const newUserData = {
      username,
      email,
      password: hashedPassword,
      role: 'user',
      firstName: firstName || '',
      lastName: lastName || ''
    };
    
    const result = await UserModel.insertOne(newUserData);
    
    if (result.success) {
      // Повертаємо користувача без пароля з повними даними
      return {
        id: result.user._id,
        username: result.user.username,
        email: result.user.email,
        role: result.user.role,
        firstName: result.user.firstName || '',
        lastName: result.user.lastName || '',
        isActive: result.user.isActive !== undefined ? result.user.isActive : true,
        createdAt: result.user.createdAt,
        updatedAt: result.user.updatedAt
      };
    } else {
      throw new Error('Помилка створення користувача в базі даних');
    }
    
  } catch (error) {
    console.error('Помилка створення користувача:', error);
    throw error;
  }
};