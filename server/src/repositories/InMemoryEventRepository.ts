import { IEventRepository } from './IEventRepository.js';
import { Event, EventCreateInput } from '../types.js';
import { randomUUID } from 'crypto';

export class InMemoryEventRepository implements IEventRepository {
  private events: Event[] = [];

  async list(filter?: { location?: string }): Promise<Event[]> {
    let result = this.events;
    if (filter?.location) {
      const q = filter.location.toLowerCase();
      result = result.filter(e => e.location.toLowerCase().includes(q));
    }
    // Sort by date ascending
    return [...result].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  async getById(id: string): Promise<Event | null> {
    return this.events.find(e => e.id === id) ?? null;
  }

  async create(input: EventCreateInput): Promise<Event> {
    const currentParticipants = input.currentParticipants ?? 0;
    const event: Event = {
      id: randomUUID(),
      title: input.title,
      description: input.description,
      location: input.location,
      date: new Date(input.date).toISOString(),
      maxParticipants: input.maxParticipants,
      currentParticipants
    };
    this.events.push(event);
    return event;
  }
}
