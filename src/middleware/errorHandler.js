import createError from 'http-errors';

export const errorHandler = (error, req, res, next) => {
  // Перевіряємо, чи є помилка екземпляром HttpError
  const isHttpError = createError.isHttpError(error);

  let statusCode;
  let message;

  if (isHttpError) {
    // Якщо це HttpError, використовуємо його статус і повідомлення
    statusCode = error.status || error.statusCode;
    message = error.message || error.name;
  } else {
    // Для всіх інших помилок завжди використовуємо 500
    statusCode = 500;
    message = error.message || 'Internal Server Error';
  }

  res.status(statusCode).json({
    message: message,
  });
};
