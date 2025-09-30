import express from 'express';
import {
  getNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
} from '../controllers/notesController.js';

const router = express.Router();

//  отримати всі нотатки
router.get('/', getNotes);

// отримати одну нотатку
router.get('/:noteId', getNoteById);

// створити нову нотатку
router.post('/', createNote);

// оновити нотатку
router.patch('/:noteId', updateNote);

//  видалити нотатку
router.delete('/:noteId', deleteNote);

export default router;
