import createError from 'http-errors';
import { Session } from '../models/session.js';
import { User } from '../models/user.js';

/**
 * Middleware для перевірки аутентифікації користувача
 */
export const authenticate = async (req, res, next) => {
  try {
    const { accessToken } = req.cookies;

    // Перевіряємо наявність accessToken
    if (!accessToken) {
      return next(createError(401, 'Missing access token'));
    }

    // Шукаємо сесію за accessToken
    const session = await Session.findOne({ accessToken });

    if (!session) {
      return next(createError(401, 'Session not found'));
    }

    // Перевіряємо, чи не прострочений access-токен
    if (new Date() > session.accessTokenValidUntil) {
      return next(createError(401, 'Access token expired'));
    }

    // Шукаємо користувача, пов'язаного з цією сесією
    const user = await User.findById(session.userId);

    if (!user) {
      return next(createError(401));
    }

    // Додаємо користувача до req і продовжуємо
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
