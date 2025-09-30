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

//  Створити нову нотатку
export const createNote = async (req, res, next) => {
  try {
    const { title, content, tag } = req.body;

    if (!title) {
      return next(createError(400, 'Title is required'));
    }

    const newNote = await Note.create({ title, content, tag });
    res.status(201).json(newNote);
  } catch (error) {
    next(createError(500, error.message));
  }
};

//  Оновити нотатку
export const updateNote = async (req, res, next) => {
  try {
    const { noteId } = req.params;
    const { title, content, tag } = req.body;

    const updatedNote = await Note.findByIdAndUpdate(
      noteId,
      { title, content, tag },
      { new: true, runValidators: true },
    );

    if (!updatedNote) {
      return next(createError(404, 'Note not found'));
    }

    res.status(200).json(updatedNote);
  } catch (error) {
    if (error.name === 'CastError') {
      return next(createError(400, 'Invalid note ID'));
    }

    next(createError(500, error.message));
  }
};

// Видалити нотатку
export const deleteNote = async (req, res, next) => {
  try {
    const { noteId } = req.params;

    const deletedNote = await Note.findByIdAndDelete(noteId);

    if (!deletedNote) {
      return next(createError(404, 'Note not found'));
    }

    res.status(204).send();
  } catch (error) {
    if (error.name === 'CastError') {
      return next(createError(400, 'Invalid note ID'));
    }

    next(createError(500, error.message));
  }
};
