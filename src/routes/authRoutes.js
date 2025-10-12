import express from 'express';
import { celebrate } from 'celebrate';
import {
  registerUser,
  loginUser,
  refreshUserSession,
  logoutUser,
} from '../controllers/authController.js';
import {
  registerUserSchema,
  loginUserSchema,
} from '../validations/authValidation.js';

const router = express.Router();

// POST /auth/register - Реєстрація нового користувача
router.post('/auth/register', celebrate(registerUserSchema), registerUser);

// POST /auth/login - Логін користувача
router.post('/auth/login', celebrate(loginUserSchema), loginUser);

// POST /auth/refresh - Оновлення сесії користувача
router.post('/auth/refresh', refreshUserSession);

// POST /auth/logout - Вихід користувача
router.post('/auth/logout', logoutUser);

export default router;
