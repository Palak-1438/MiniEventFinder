import { IEventRepository } from './IEventRepository.js';
import { Event, EventCreateInput } from '../types.js';
import { randomUUID } from 'crypto';

export class InMemoryEventRepository implements IEventRepository {
  private events: Event[] = [];

  async list(filters?: { location?: string; category?: string; title?: string; date?: string }): Promise<Event[]> {
    let result = this.events;
    if (filters?.location) {
      const q = filters.location.toLowerCase();
      result = result.filter(e => e.location.toLowerCase().includes(q));
    }
    if (filters?.category) {
      result = result.filter(e => e.category === filters.category);
    }
    if (filters?.title) {
      const q = filters.title.toLowerCase();
      result = result.filter(e => e.title.toLowerCase().includes(q));
    }
    if (filters?.date) {
      const targetDate = new Date(filters.date).toDateString();
      result = result.filter(e => new Date(e.date).toDateString() === targetDate);
    }
    // Sort by date ascending
    return [...result].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  async getById(id: string): Promise<Event | null> {
    return this.events.find(e => e.id === id) ?? null;
  }

  async create(input: EventCreateInput & { createdBy?: string }): Promise<Event> {
    const currentParticipants = input.currentParticipants ?? 0;
    const event: Event = {
      id: randomUUID(),
      title: input.title,
      description: input.description,
      location: input.location,
      date: new Date(input.date).toISOString(),
      category: input.category,
      maxParticipants: input.maxParticipants,
      currentParticipants,
      createdBy: input.createdBy,
      coordinates: input.coordinates
    };
    this.events.push(event);
    return event;
  }

  async incrementParticipants(id: string): Promise<Event | null> {
    const event = this.events.find(e => e.id === id);
    if (!event) return null;
    event.currentParticipants++;
    return event;
  }
}
