import { IEventRepository } from '../repositories/IEventRepository.js';
import { Event, EventCreateInput } from '../types.js';

export class EventService {
  constructor(private repo: IEventRepository) {}

  list(location?: string): Promise<Event[]> {
    return this.repo.list({ location });
  }

  getById(id: string): Promise<Event | null> {
    return this.repo.getById(id);
  }

  async create(input: EventCreateInput): Promise<Event> {
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
    return this.repo.create(input);
  }
}
