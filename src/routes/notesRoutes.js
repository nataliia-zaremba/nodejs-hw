import { Router } from 'express';
import {
  getAllNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
} from '../controllers/notesController.js';
import {
  getAllNotesSchema,
  noteIdSchema,
  createNoteSchema,
  updateNoteSchema,
} from '../validations/notesValidation.js';

const router = Router();

// GET /notes - отримати всі нотатки з валідацією query параметрів
router.get('/', getAllNotesSchema, getAllNotes);

// GET /notes/:noteId - отримати одну нотатку з валідацією noteId
router.get('/:noteId', noteIdSchema, getNoteById);

// POST /notes - створити нову нотатку з валідацією body
router.post('/', createNoteSchema, createNote);

// PATCH /notes/:noteId - оновити нотатку з валідацією noteId та body
router.patch('/:noteId', updateNoteSchema, updateNote);

// DELETE /notes/:noteId - видалити нотатку з валідацією noteId
router.delete('/:noteId', noteIdSchema, deleteNote);

export default router;
