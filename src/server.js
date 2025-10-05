import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import { errors } from 'celebrate';
import { connectMongoDB } from './db/connectMongoDB.js';
import notesRouter from './routes/notesRoutes.js';
import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT ?? 3030;

/* Middleware */
app.use(logger); // логування запитів
app.use(cors()); // дозволяємо CORS
app.use(express.json()); // парсимо JSON у body

/* Маршрути */
app.use('/api/notes', notesRouter);

/* Обробка помилок */
app.use(errors()); // обробка помилок celebrate - ДОДАНО ЦЕЙ РЯДОК!
app.use(notFoundHandler); // обробка 404
app.use(errorHandler); // обробка інших помилок

// підключення до MongoDB
await connectMongoDB();

// запуск сервера
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
