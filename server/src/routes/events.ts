import { Router } from 'express';
import { z } from 'zod';
import { InMemoryEventRepository } from '../repositories/InMemoryEventRepository.js';
import { EventService } from '../services/EventService.js';

const repo = new InMemoryEventRepository();
const service = new EventService(repo);

const router = Router();

const createSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  location: z.string().min(1),
  date: z.string().min(1),
  maxParticipants: z.number().int().positive(),
  currentParticipants: z.number().int().nonnegative().optional()
});

router.get('/', async (req, res, next) => {
  try {
    const location = typeof req.query.location === 'string' ? req.query.location : undefined;
    const events = await service.list(location);
    res.json(events);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const evt = await service.getById(req.params.id);
    if (!evt) return res.status(404).json({ error: 'Not Found' });
    res.json(evt);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const parsed = createSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'ValidationError', details: parsed.error.flatten() });
    }
    const created = await service.create(parsed.data);
    res.status(201).json(created);
  } catch (err: any) {
    if (err instanceof Error) {
      return res.status(400).json({ error: err.message });
    }
    next(err);
  }
});

export default router;
