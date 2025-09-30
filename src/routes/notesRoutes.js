import { Router } from 'express';
import { getNotes, getNoteById } from '../controllers/notesController.js';

const router = Router();

// Отримати всі нотатки
router.get('/notes', getNotes);

// Отримати одну нотатку за id
router.get('/notes/:noteId', getNoteById);

export default router;
