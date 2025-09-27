import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import pinoHttp from 'pino-http';

const app = express();
const PORT = process.env.PORT || 3030;

// middleware
app.use(cors());
app.use(express.json());
app.use(pinoHttp());

// маршрути
app.get('/notes', (req, res) => {
  res.status(200).json({ message: 'Retrieved all notes' });
});

app.get('/notes/:noteId', (req, res) => {
  const { noteId } = req.params;
  res.status(200).json({ message: `Retrieved note with ID: ${noteId}` });
});

// тестовий маршрут для помилок
app.get('/test-error', (req, res) => {
  throw new Error('Simulated server error');
});

// обробка 404
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// обробка помилок
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).json({ message: err.message || 'Internal server error' });
});

// запуск сервера
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
