import express from 'express';
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

const router = express.Router();

/* ---- Routes ---- */

// Отримати всі нотатки
router.get('/', getAllNotesSchema, getAllNotes);

// Отримати одну нотатку за ID
router.get('/:noteId', noteIdSchema, getNoteById);

// Створити нову нотатку
router.post('/', createNoteSchema, createNote);

// Оновити нотатку
router.patch('/:noteId', updateNoteSchema, updateNote);

// Видалити нотатку
router.delete('/:noteId', noteIdSchema, deleteNote);

export default router;
