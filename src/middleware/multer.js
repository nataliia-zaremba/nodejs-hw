import multer from 'multer';
import createError from 'http-errors';

// Налаштування зберігання в пам'яті
const storage = multer.memoryStorage();

// Фільтр файлів - дозволяємо тільки зображення
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(createError(400, 'Only images allowed'), false);
  }
};

// Налаштування multer
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB
  },
});
