import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import { User } from '../models/user.js';
import { Session } from '../models/session.js';
import { createSession, setSessionCookies } from '../services/auth.js';

/**
 * POST /auth/register - Реєстрація нового користувача
 */
export const registerUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Перевіряємо, чи користувач із таким email вже існує
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(createHttpError(400, 'Email in use'));
    }

    // Хешуємо пароль
    const hashedPassword = await bcrypt.hash(password, 10);

    // Створюємо нового користувача
    const newUser = await User.create({
      email,
      password: hashedPassword,
    });

    // Створюємо сесію для користувача
    const session = await createSession(newUser._id);

    // Додаємо кукі до відповіді
    setSessionCookies(res, session);

    // Повертаємо відповідь зі створеним користувачем (без пароля завдяки toJSON)
    res.status(201).json({
      status: 201,
      message: 'Successfully registered a user!',
      data: newUser,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /auth/login - Логін користувача
 */
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Перевіряємо, чи користувач існує
    const user = await User.findOne({ email });
    if (!user) {
      return next(createHttpError(401, 'User not found'));
    }

    // Перевіряємо чи вірний пароль
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return next(createHttpError(401, 'Invalid credentials'));
    }

    // Видаляємо стару сесію користувача
    await Session.deleteOne({ userId: user._id });

    // Створюємо нову сесію
    const session = await createSession(user._id);

    // Додаємо кукі до відповіді
    setSessionCookies(res, session);

    // Повертаємо відповідь із залогіненим користувачем (без пароля завдяки toJSON)
    res.status(200).json({
      status: 200,
      message: 'Successfully logged in a user!',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /auth/refresh - Оновлення сесії користувача
 */
export const refreshUserSession = async (req, res, next) => {
  try {
    const { sessionId, refreshToken } = req.cookies;

    // Шукаємо сесію за sessionId та refreshToken
    const session = await Session.findOne({
      _id: sessionId,
      refreshToken,
    });

    // Якщо сесія не знайдена
    if (!session) {
      return next(createHttpError(401, 'Session not found'));
    }

    // Перевіряємо, чи не прострочений refresh-токен
    if (new Date() > session.refreshTokenValidUntil) {
      return next(createHttpError(401, 'Session token expired'));
    }

    // Видаляємо стару сесію
    await Session.deleteOne({ _id: sessionId });

    // Створюємо нову сесію
    const newSession = await createSession(session.userId);

    // Додаємо нові кукі до відповіді
    setSessionCookies(res, newSession);

    // Повертаємо успішну відповідь
    res.status(200).json({
      status: 200,
      message: 'Session refreshed',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /auth/logout - Вихід користувача із системи
 */
export const logoutUser = async (req, res, next) => {
  try {
    const { sessionId } = req.cookies;

    // Якщо є sessionId - видаляємо сесію з бази даних
    if (sessionId) {
      await Session.deleteOne({ _id: sessionId });
    }

    // Очищаємо всі cookies
    res.clearCookie('sessionId');
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    // Повертаємо відповідь зі статусом 204 (без тіла)
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
