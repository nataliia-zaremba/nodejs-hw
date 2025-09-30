import createError from 'http-errors';

export const errorHandler = (error, req, res, next) => {
  // якщо помилка без статусу — перетворюємо в 500
  if (!error.status) {
    error = createError(500, error.message || 'Internal Server Error');
  }

  res.status(error.status).json({
    message: error.message,
  });
};
