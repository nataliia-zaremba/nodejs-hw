import createError from 'http-errors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import fs from 'fs/promises';
import path from 'path';
import handlebars from 'handlebars';
import { User } from '../models/user.js';
import { Session } from '../models/session.js';
import { createSession, setSessionCookies } from '../services/auth.js';
import { sendEmail } from '../utils/sendMail.js';

/* -------------------------------------------
   POST /auth/register - Реєстрація користувача
------------------------------------------- */
export const registerUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(createError(400, 'Email in use'));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      email,
      password: hashedPassword,
    });

    const session = await createSession(newUser._id);
    setSessionCookies(res, session);

    res.status(201).json({
      status: 201,
      message: 'Successfully registered a user!',
      data: newUser,
    });
  } catch (error) {
    next(createError(500, error.message));
  }
};

/* -------------------------------------------
   POST /auth/login - Логін користувача
------------------------------------------- */
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return next(createError(401, 'User not found'));
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return next(createError(401, 'Invalid credentials'));
    }

    await Session.deleteOne({ userId: user._id });
    const session = await createSession(user._id);
    setSessionCookies(res, session);

    res.status(200).json({
      status: 200,
      message: 'Successfully logged in a user!',
      data: user,
    });
  } catch (error) {
    next(createError(500, error.message));
  }
};

/* -------------------------------------------
   POST /auth/refresh - Оновлення сесії
------------------------------------------- */
export const refreshUserSession = async (req, res, next) => {
  try {
    const { sessionId, refreshToken } = req.cookies;

    const session = await Session.findOne({ _id: sessionId, refreshToken });
    if (!session) {
      return next(createError(401, 'Session not found'));
    }

    if (new Date() > session.refreshTokenValidUntil) {
      return next(createError(401, 'Session token expired'));
    }

    await Session.deleteOne({ _id: sessionId });
    const newSession = await createSession(session.userId);
    setSessionCookies(res, newSession);

    res.status(200).json({
      status: 200,
      message: 'Session refreshed',
    });
  } catch (error) {
    next(createError(500, error.message));
  }
};

/* -------------------------------------------
   POST /auth/logout - Вихід користувача
------------------------------------------- */
export const logoutUser = async (req, res, next) => {
  try {
    const { sessionId } = req.cookies;

    if (sessionId) {
      await Session.deleteOne({ _id: sessionId });
    }

    res.clearCookie('sessionId');
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    res.status(204).send();
  } catch (error) {
    next(createError(500, error.message));
  }
};

/* -------------------------------------------
   POST /auth/request-reset-email - Запит на скидання пароля
------------------------------------------- */
export const requestResetEmail = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return next(createError(404, 'User not found'));
    }

    const resetToken = jwt.sign(
      {
        sub: user._id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: '15m' },
    );

    const resetLink = `${process.env.FRONTEND_DOMAIN}/reset-password?token=${resetToken}`;

    const templatePath = path.join(
      process.cwd(),
      'src',
      'templates',
      'reset-password-email.html',
    );

    const templateSource = await fs.readFile(templatePath, 'utf-8');
    const template = handlebars.compile(templateSource);
    const html = template({
      resetLink,
      username: user.username || user.email,
    });

    const emailSent = await sendEmail({
      to: email,
      subject: 'Скидання паролю',
      html,
    });

    if (!emailSent) {
      return next(createError(500, 'Failed to send the email'));
    }

    res.status(200).json({
      message: 'Password reset email sent successfully',
    });
  } catch (error) {
    next(createError(500, error.message));
  }
};

/* -------------------------------------------
   POST /auth/reset-password - Скидання пароля
------------------------------------------- */
export const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return next(createError(401, 'Invalid or expired token'));
    }

    const user = await User.findOne({
      _id: decoded.sub,
      email: decoded.email,
    });

    if (!user) {
      return next(createError(404, 'User not found'));
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
      message: 'Password reset successfully',
    });
  } catch (error) {
    next(createError(500, error.message));
  }
};
