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
      default: '', // необов'язкове, за замовчуванням порожній рядок
      trim: true,
    },
    tag: {
      type: String,
      enum: TAGS,
      default: 'Todo', // необов'язкове, за замовчуванням Todo
    },
  },
  {
    timestamps: true, // автоматично додає createdAt і updatedAt
  },
);

export const Note = model('Note', noteSchema, 'notes');
