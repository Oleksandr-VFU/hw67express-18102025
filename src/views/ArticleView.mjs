/**
 * MongoDB Article View - форматування відповідей з реальними даними
 */
export class ArticleView {
  // Список статей
  static renderArticlesList(articles = []) {
    return {
      message: 'Список статей',
      count: articles.length,
      articles: articles.map(article => ({
        id: article._id,
        title: article.title,
        authorName: article.authorName,
        category: article.category,
        tags: article.tags,
        views: article.views,
        likes: article.likes,
        isPublished: article.isPublished,
        createdAt: article.createdAt,
        content: article.content ? article.content.substring(0, 150) + '...' : ''
      }))
    };
  }

  // Стаття за ID
  static renderArticleById(article) {
    if (!article) {
      return { error: 'Стаття не знайдена' };
    }
    
    return {
      message: `Стаття: ${article.title}`,
      article: {
        id: article._id,
        title: article.title,
        content: article.content,
        authorId: article.authorId,
        authorName: article.authorName,
        category: article.category,
        tags: article.tags,
        views: article.views,
        likes: article.likes,
        isPublished: article.isPublished,
        createdAt: article.createdAt,
        updatedAt: article.updatedAt
      }
    };
  }

  // Створення статті
  static renderCreated() {
    return {
      message: 'Стаття успішно створена',
      status: 'created'
    };
  }

  // Оновлення статті
  static renderUpdated(articleId) {
    return {
      message: `Стаття ${articleId} успішно оновлена`,
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