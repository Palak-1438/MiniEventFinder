import { IEventRepository } from '../repositories/IEventRepository.js';
import { Event, EventCreateInput } from '../types.js';

export class EventService {
  constructor(private repo: IEventRepository) {}

  list(filters?: { location?: string; category?: string; title?: string; date?: string }): Promise<Event[]> {
    return this.repo.list(filters);
  }

  getById(id: string): Promise<Event | null> {
    return this.repo.getById(id);
  }

  async create(input: EventCreateInput, createdBy?: string): Promise<Event> {
    if (input.maxParticipants <= 0) {
      throw new Error('maxParticipants must be > 0');
    }
    if (input.currentParticipants && input.currentParticipants > input.maxParticipants) {
      throw new Error('currentParticipants cannot exceed maxParticipants');
    }
    // Ensure date is valid
    const d = new Date(input.date);
    if (isNaN(d.getTime())) {
      throw new Error('Invalid date');
    }
    return this.repo.create({ ...input, createdBy });
  }

  async joinEvent(id: string): Promise<Event | null> {
    const event = await this.repo.getById(id);
    if (!event) {
      throw new Error('Event not found');
    }
    if (event.currentParticipants >= event.maxParticipants) {
      throw new Error('Event is full');
    }
    return this.repo.incrementParticipants(id);
  }
}
