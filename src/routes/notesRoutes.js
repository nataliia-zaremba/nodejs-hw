import express from 'express';
import { celebrate } from 'celebrate';
import * as notesController from '../controllers/notesController.js';
import { authenticate } from '../middleware/authenticate.js';
import { notesValidationSchema } from '../validations/notesValidation.js';

const router = express.Router();

// Застосовуємо authenticate до всіх маршрутів нотаток
router.use(authenticate);

// Отримати всі нотатки
router.get('/api/notes', notesController.getAllNotes);

// Отримати одну нотатку
router.get('/api/notes/:noteId', notesController.getNoteById);

// Створити нову
router.post(
  '/api/notes',
  celebrate(notesValidationSchema),
  notesController.createNote,
);

//  Оновити нотатку
router.patch(
  '/api/notes/:noteId',
  celebrate(notesValidationSchema),
  notesController.updateNote,
);

// Видалити нотатку
router.delete('/api/notes/:noteId', notesController.deleteNote);

export default router;
