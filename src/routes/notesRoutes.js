import express from 'express';
import * as notesController from '../controllers/notesController.js';
import { authenticate } from '../middleware/authenticate.js';
import {
  getAllNotesSchema,
  createNoteSchema,
  updateNoteSchema,
  noteIdSchema,
} from '../validations/notesValidation.js';

const router = express.Router();

// Застосовуємо authenticate до всіх маршрутів нотаток
router.use(authenticate);

// GET /api/notes - Отримати всі нотатки користувача (з валідацією query параметрів)
router.get('/api/notes', getAllNotesSchema, notesController.getAllNotes);

// GET /api/notes/:noteId - Отримати одну нотатку користувача (з валідацією noteId)
router.get('/api/notes/:noteId', noteIdSchema, notesController.getNoteById);

// POST /api/notes - Створити нову нотатку (з валідацією body)
router.post('/api/notes', createNoteSchema, notesController.createNote);

// PATCH /api/notes/:noteId - Оновити нотатку користувача (з валідацією params і body)
router.patch(
  '/api/notes/:noteId',
  updateNoteSchema,
  notesController.updateNote,
);

// DELETE /api/notes/:noteId - Видалити нотатку користувача (з валідацією noteId)
router.delete('/api/notes/:noteId', noteIdSchema, notesController.deleteNote);

export default router;
