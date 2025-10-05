import { Joi, Segments, celebrate } from 'celebrate';
import { isValidObjectId } from 'mongoose';
import { TAGS } from '../constants/tags.js';

// Кастомна валідація для MongoDB ObjectId
const objectIdValidator = (value, helpers) => {
  if (!isValidObjectId(value)) {
    return helpers.error('any.invalid');
  }
  return value;
};

// Валідація noteId параметра
export const noteIdSchema = celebrate({
  [Segments.PARAMS]: Joi.object({
    noteId: Joi.string().custom(objectIdValidator).required().messages({
      'any.invalid': 'Invalid note ID',
      'any.required': 'Note ID is required',
    }),
  }),
});

// Валідація query параметрів для GET /notes
export const getAllNotesSchema = celebrate({
  [Segments.QUERY]: Joi.object({
    page: Joi.number().integer().min(1).default(1).messages({
      'number.base': 'Page must be a number',
      'number.min': 'Page must be at least 1',
    }),
    perPage: Joi.number().integer().min(5).max(20).default(10).messages({
      'number.base': 'perPage must be a number',
      'number.min': 'perPage must be at least 5',
      'number.max': 'perPage must not exceed 20',
    }),
    tag: Joi.string()
      .valid(...TAGS)
      .messages({
        'any.only': `Tag must be one of: ${TAGS.join(', ')}`,
      }),
    search: Joi.string().allow('').messages({
      'string.base': 'Search must be a string',
    }),
  }),
});

// Валідація для створення нотатки (POST /notes)
export const createNoteSchema = celebrate({
  [Segments.BODY]: Joi.object({
    title: Joi.string().min(1).required().messages({
      'string.empty': 'Title cannot be empty',
      'any.required': 'Title is required',
      'string.min': 'Title must be at least 1 character',
    }),
    content: Joi.string().allow('').messages({
      'string.base': 'Content must be a string',
    }),
    tag: Joi.string()
      .valid(...TAGS)
      .required()
      .messages({
        'any.only': `Tag must be one of: ${TAGS.join(', ')}`,
        'any.required': 'Tag is required',
      }),
  }),
});

// Валідація для оновлення нотатки (PATCH /notes/:noteId)
export const updateNoteSchema = celebrate({
  [Segments.PARAMS]: Joi.object({
    noteId: Joi.string().custom(objectIdValidator).required().messages({
      'any.invalid': 'Invalid note ID',
      'any.required': 'Note ID is required',
    }),
  }),
  [Segments.BODY]: Joi.object({
    title: Joi.string().min(1).messages({
      'string.empty': 'Title cannot be empty',
      'string.min': 'Title must be at least 1 character',
    }),
    content: Joi.string().allow('').messages({
      'string.base': 'Content must be a string',
    }),
    tag: Joi.string()
      .valid(...TAGS)
      .messages({
        'any.only': `Tag must be one of: ${TAGS.join(', ')}`,
      }),
  }).min(1), // Хоча б одне поле має бути присутнім
});
