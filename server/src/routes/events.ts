import { Router } from 'express';
import { z } from 'zod';
import { InMemoryEventRepository } from '../repositories/InMemoryEventRepository.js';
import { EventService } from '../services/EventService.js';
import { optionalAuthMiddleware, authMiddleware, type AuthRequest } from '../middleware/auth.js';

const repo = new InMemoryEventRepository();
const service = new EventService(repo);

const router = Router();

const createSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  location: z.string().min(1),
  date: z.string().min(1),
  category: z.string().min(1),
  maxParticipants: z.number().int().positive(),
  currentParticipants: z.number().int().nonnegative().optional(),
  coordinates: z.object({
    lat: z.number(),
    lng: z.number()
  }).optional()
});

router.get('/', async (req, res, next) => {
  try {
    const filters = {
      location: typeof req.query.location === 'string' ? req.query.location : undefined,
      category: typeof req.query.category === 'string' ? req.query.category : undefined,
      title: typeof req.query.title === 'string' ? req.query.title : undefined,
      date: typeof req.query.date === 'string' ? req.query.date : undefined
    };
    const events = await service.list(filters);
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

router.post('/', optionalAuthMiddleware, async (req: AuthRequest, res, next) => {
  try {
    const parsed = createSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'ValidationError', details: parsed.error.flatten() });
    }
    const created = await service.create(parsed.data, req.userId);
    res.status(201).json(created);
  } catch (err: any) {
    if (err instanceof Error) {
      return res.status(400).json({ error: err.message });
    }
    next(err);
  }
});

router.post('/:id/join', async (req, res, next) => {
  try {
    const updated = await service.joinEvent(req.params.id);
    if (!updated) return res.status(404).json({ error: 'Not Found' });
    res.json(updated);
  } catch (err: any) {
    if (err instanceof Error) {
      return res.status(400).json({ error: err.message });
    }
    next(err);
  }
});

export default router;
