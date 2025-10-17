import createError from 'http-errors';
import { Note } from '../models/note.js';

// GET /notes - Отримати список нотаток користувача
export const getAllNotes = async (req, res, next) => {
  try {
    const { tag, search, page = 1, perPage = 10 } = req.query;
    const userId = req.user._id;

    // Базовий фільтр для поточного користувача
    const filter = { userId };

    // Фільтрація по тегу
    if (tag) {
      filter.tag = tag;
    }

    // Пошук по тексту (якщо є text-індекс)
    if (search) {
      filter.$text = { $search: search };
    }

    const skip = (page - 1) * perPage;

    // Паралельне виконання запитів
    const [notes, totalNotes] = await Promise.all([
      Note.find(filter).skip(skip).limit(perPage).sort({ createdAt: -1 }),
      Note.countDocuments(filter),
    ]);

    res.status(200).json({
      page,
      perPage,
      totalNotes,
      totalPages: Math.ceil(totalNotes / perPage),
      notes,
    });
  } catch (error) {
    next(createError(500, error.message));
  }
};

// GET /notes/:noteId
export const getNoteById = async (req, res, next) => {
  try {
    const { noteId } = req.params;
    const userId = req.user._id;

    const note = await Note.findOne({ _id: noteId, userId });
    if (!note) return next(createError(404, 'Note not found'));

    res.status(200).json(note);
  } catch (error) {
    if (error.name === 'CastError') {
      return next(createError(400, 'Invalid note ID'));
    }
    next(createError(500, error.message));
  }
};

// POST /notes
export const createNote = async (req, res, next) => {
  try {
    const { title, content, tag } = req.body;
    const userId = req.user._id;

    if (!title) return next(createError(400, 'Title is required'));

    const newNote = await Note.create({ title, content, tag, userId });
    res.status(201).json(newNote);
  } catch (error) {
    next(createError(500, error.message));
  }
};

// PATCH /notes/:noteId
export const updateNote = async (req, res, next) => {
  try {
    const { noteId } = req.params;
    const userId = req.user._id;
    const { title, content, tag } = req.body;

    const updatedNote = await Note.findOneAndUpdate(
      { _id: noteId, userId },
      { title, content, tag },
      { new: true, runValidators: true },
    );

    if (!updatedNote) return next(createError(404, 'Note not found'));

    res.status(200).json(updatedNote);
  } catch (error) {
    if (error.name === 'CastError') {
      return next(createError(400, 'Invalid note ID'));
    }
    next(createError(500, error.message));
  }
};

// DELETE /notes/:noteId
export const deleteNote = async (req, res, next) => {
  try {
    const { noteId } = req.params;
    const userId = req.user._id;

    const deletedNote = await Note.findOneAndDelete({ _id: noteId, userId });

    if (!deletedNote) return next(createError(404, 'Note not found'));

    res.status(200).json(deletedNote);
  } catch (error) {
    if (error.name === 'CastError') {
      return next(createError(400, 'Invalid note ID'));
    }
    next(createError(500, error.message));
  }
};
