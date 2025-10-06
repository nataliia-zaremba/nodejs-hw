import createError from 'http-errors';
import { Note } from '../models/note.js';

// GET /notes - Отримати список усіх нотаток з пагінацією, фільтрацією та пошуком
export const getAllNotes = async (req, res, next) => {
  try {
    const { tag, search, page = 1, perPage = 10 } = req.query;

    // Будуємо запит через ланцюжок методів Mongoose
    let query = Note.find();

    // Фільтрація по тегу
    if (tag) {
      query = query.where('tag').equals(tag);
    }

    // Пошук по title та content
    if (search) {
      query = query.or([
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ]);
    }

    // Пагінація
    const skip = (page - 1) * perPage;

    // Паралельне виконання запитів
    const [notes, totalNotes] = await Promise.all([
      query.clone().skip(skip).limit(perPage).sort({ createdAt: -1 }), // Сортування за датою створення (новіші спочатку)
      Note.countDocuments(query.getFilter()),
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

// GET /notes/:noteId - Отримати одну нотатку за id
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

// POST /notes - Створити нову нотатку
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

// PATCH /notes/:noteId - Оновити нотатку
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

// DELETE /notes/:noteId - Видалити нотатку
export const deleteNote = async (req, res, next) => {
  try {
    const { noteId } = req.params;

    const deletedNote = await Note.findByIdAndDelete(noteId);

    if (!deletedNote) {
      return next(createError(404, 'Note not found'));
    }

    res.status(200).json(deletedNote);
  } catch (error) {
    if (error.name === 'CastError') {
      return next(createError(400, 'Invalid note ID'));
    }

    next(createError(500, error.message));
  }
};
