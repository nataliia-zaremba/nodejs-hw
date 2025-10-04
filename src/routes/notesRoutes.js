import { Router } from 'express';
import {
  getAllNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
} from '../controllers/notesController.js';

const router = Router();

// отримати всі нотатки
router.get('/', getAllNotes);

// отримати одну нотатку
router.get('/:noteId', getNoteById);

//  створити нову нотатку
router.post('/', createNote);

// оновити нотатку
router.patch('/:noteId', updateNote);

//  видалити нотатку
router.delete('/:noteId', deleteNote);

export default router;
