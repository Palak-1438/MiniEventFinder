import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import eventsRouter from './routes/events.js';
import authRouter from './routes/auth.js';

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mini-event-finder';

// Connect to MongoDB (optional - falls back to in-memory if not configured)
if (process.env.USE_MONGODB === 'true' && MONGO_URI) {
  mongoose.connect(MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));
} else {
  console.log('Using in-memory storage (set USE_MONGODB=true to use MongoDB)');
}

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRouter);
app.use('/api/events', eventsRouter);

app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
