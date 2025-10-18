/**
 * MongoDB User View - форматування відповідей з реальними даними
 */
export class UserView {
  // Список користувачів
  static renderUsersList(users = []) {
    return {
      message: 'Список користувачів',
      count: users.length,
      users: users.map(user => ({
        id: user._id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt
      }))
    };
  }

  // Користувач за ID
  static renderUserById(user) {
    if (!user) {
      return { error: 'Користувач не знайдений' };
    }
    
    return {
      message: `Користувач ${user.firstName} ${user.lastName}`,
      user: {
        id: user._id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    };
  }

  // Створення користувача
  static renderCreated() {
    return {
      message: 'Користувач успішно створений',
      status: 'created'
    };
  }

  // Оновлення користувача
  static renderUpdated(userId) {
    return {
      message: `Користувач ${userId} успішно оновлений`,
      status: 'updated'
    };
  }

  // Помилки
  static renderError(message) {
    return {
      error: message,
      status: 'error'
    };
  }
}