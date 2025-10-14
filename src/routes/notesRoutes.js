import express from 'express';
import { celebrate } from 'celebrate';
import * as notesController from '../controllers/notesController.js';
import { authenticate } from '../middleware/authenticate.js';
import { notesValidationSchema } from '../validations/notesValidation.js';

const router = express.Router();

// Застосовуємо authenticate до всіх маршрутів нотаток
router.use(authenticate);

// GET /api/notes - Отримати всі нотатки користувача
router.get('/api/notes', notesController.getAllNotes);

// GET /api/notes/:noteId - Отримати одну нотатку користувача
router.get('/api/notes/:noteId', notesController.getNoteById);

// POST /api/notes - Створити нову нотатку
router.post(
  '/api/notes',
  celebrate(notesValidationSchema),
  notesController.createNote,
);

// PATCH /api/notes/:noteId - Оновити нотатку користувача
router.patch(
  '/api/notes/:noteId',
  celebrate(notesValidationSchema),
  notesController.updateNote,
);

// DELETE /api/notes/:noteId - Видалити нотатку користувача
router.delete('/api/notes/:noteId', notesController.deleteNote);

export default router;
