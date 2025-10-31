import { Router } from 'express';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/User.js';
import { JWT_SECRET } from '../middleware/auth.js';

const router = Router();

const USE_MONGODB = process.env.USE_MONGODB === 'true';

type InMemoryUser = { id: string; email: string; username: string; passwordHash: string };
const usersByEmail = new Map<string, InMemoryUser>();
const usersByUsername = new Map<string, InMemoryUser>();
let nextId = 1;

const registerSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3),
  password: z.string().min(6)
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

router.post('/register', async (req, res, next) => {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'ValidationError', details: parsed.error.flatten() });
    }

    const { email, username, password } = parsed.data;

    if (USE_MONGODB) {
      const existing = await UserModel.findOne({ $or: [{ email }, { username }] });
      if (existing) {
        return res.status(400).json({ error: 'User already exists' });
      }
      const passwordHash = await bcrypt.hash(password, 10);
      const user = await UserModel.create({ email, username, passwordHash });
      const token = jwt.sign({ userId: user._id.toString() }, JWT_SECRET, { expiresIn: '7d' });
      return res.status(201).json({
        token,
        user: { id: user._id.toString(), email: user.email, username: user.username }
      });
    }

    // In-memory fallback
    if (usersByEmail.has(email) || usersByUsername.has(username)) {
      return res.status(400).json({ error: 'User already exists' });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const id = String(nextId++);
    const user: InMemoryUser = { id, email, username, passwordHash };
    usersByEmail.set(email, user);
    usersByUsername.set(username, user);
    const token = jwt.sign({ userId: id }, JWT_SECRET, { expiresIn: '7d' });
    return res.status(201).json({ token, user: { id, email, username } });
  } catch (err) {
    next(err);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'ValidationError', details: parsed.error.flatten() });
    }

    const { email, password } = parsed.data;

    if (USE_MONGODB) {
      const user = await UserModel.findOne({ email });
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      const valid = await bcrypt.compare(password, user.passwordHash);
      if (!valid) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      const token = jwt.sign({ userId: user._id.toString() }, JWT_SECRET, { expiresIn: '7d' });
      return res.json({ token, user: { id: user._id.toString(), email: user.email, username: user.username } });
    }

    // In-memory fallback
    const user = usersByEmail.get(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
    return res.json({ token, user: { id: user.id, email: user.email, username: user.username } });
  } catch (err) {
    next(err);
  }
});

export default router;
