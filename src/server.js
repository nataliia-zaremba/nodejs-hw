import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import { connectMongoDB } from './db/connectMongoDB.js';
import studentsRouter from './routes/notesRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT ?? 3030;

/* Middleware */
app.use(cors()); // дозволяємо CORS
app.use(express.json()); // парсимо JSON у body

/* Маршрути */
app.use('/api/students', studentsRouter);

/* Обробка помилок (останнім) */
app.use(errorHandler);

// підключення до MongoDB
await connectMongoDB();

// запуск сервера
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
