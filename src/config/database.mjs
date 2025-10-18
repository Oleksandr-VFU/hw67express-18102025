import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import { initializeDatabase } from '../data/seedDatabase.mjs';

// Завантажуємо environment змінні
dotenv.config();

// MongoDB Atlas підключення з environment змінних
const uri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME || 'blog';

if (!uri) {
  console.error('❌ ПОМИЛКА: MONGODB_URI не встановлено в environment змінних!');
  console.error('📝 Створіть .env файл з прикладу .env.example та вкажіть ваш MongoDB Atlas URI');
  process.exit(1);
}

// Підключення до MongoDB Atlas
let db;
const client = new MongoClient(uri);

async function connectToMongoDB() {
  try {
    await client.connect();
    console.log('✅ Успішно підключено до MongoDB Atlas');
    
    db = client.db(dbName);
    console.log(`📄 Використовується база даних: ${dbName}`);
    
    // Тестування підключення
    await db.admin().ping();
    console.log('🏓 MongoDB Atlas відповідає на ping');
    
    // Ініціалізація колекцій з реалістичними даними
    await initializeDatabase(db);
    
    return db;
  } catch (error) {
    console.error('❌ Помилка підключення до MongoDB:', error);
    throw error;
  }
}

// Функція для закриття з'єднання
async function closeMongoDB() {
  try {
    await client.close();
    console.log('✅ MongoDB з\'єднання закрито');
  } catch (error) {
    console.error('❌ Помилка при закритті MongoDB:', error);
    throw error;
  }
}

// Експорт для використання в інших модулях
export { db, client, connectToMongoDB, closeMongoDB };