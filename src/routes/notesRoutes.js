import express from 'express';
import { celebrate } from 'celebrate';
import {
  noteIdSchema,
  getAllNotesSchema,
  createNoteSchema,
  updateNoteSchema,
} from '../validations/notesValidation.js';
import {
  getAllNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
} from '../controllers/notesController.js';
import { authenticate } from '../middleware/authenticate.js';

const router = express.Router();

/* ---- Routes ---- */

// Отримати всі нотатки
router.get('/', authenticate, celebrate(getAllNotesSchema), getAllNotes);

// Отримати одну нотатку за ID
router.get('/:noteId', authenticate, celebrate(noteIdSchema), getNoteById);

// Створити нову нотатку
router.post('/', authenticate, celebrate(createNoteSchema), createNote);

// Оновити нотатку
router.patch('/:noteId', authenticate, celebrate(updateNoteSchema), updateNote);

// Видалити нотатку
router.delete('/:noteId', authenticate, celebrate(noteIdSchema), deleteNote);

export default router;
