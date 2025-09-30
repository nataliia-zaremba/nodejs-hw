import createError from 'http-errors';
import { Note } from '../models/note.js';

// Отримати список усіх нотаток
export const getNotes = async (req, res, next) => {
  try {
    const notes = await Note.find();
    res.status(200).json(notes);
  } catch (error) {
    next(createError(500, error.message));
  }
};

// Отримати одну нотатку за id
export const getNoteById = async (req, res, next) => {
  try {
    const { noteId } = req.params;
    const note = await Note.findById(noteId);

    if (!note) {
      return next(createError(404, 'Note not found'));
    }

    res.status(200).json(note);
  } catch (error) {
    if (error.name === 'CastError') {
      return next(createError(400, 'Invalid note ID'));
    }

    next(createError(500, error.message));
  }
};
