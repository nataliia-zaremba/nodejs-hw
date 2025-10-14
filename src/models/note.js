import mongoose from 'mongoose';
import { TAGS } from '../constants/tags.js';

const { Schema, model } = mongoose;

const noteSchema = new Schema(
  {
    title: {
      type: String,
      required: true, // обов'язкове поле
      trim: true,
    },
    content: {
      type: String,
      required: false, // явно позначено як необов'язкове
      default: '', // за замовчуванням порожній рядок
      trim: true,
    },
    tag: {
      type: String,
      enum: TAGS,
      default: 'Todo', // за замовчуванням Todo
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true, // обов'язкове поле
      ref: 'User',
    },
  },
  {
    timestamps: true, // автоматично додає createdAt і updatedAt
  },
);

// Текстовий індекс для полів title та content (для пошуку)
noteSchema.index({ title: 'text', content: 'text' });

export const Note = model('Note', noteSchema);
