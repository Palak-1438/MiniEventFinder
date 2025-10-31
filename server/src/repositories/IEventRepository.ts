import { Event, EventCreateInput } from '../types.js';

export interface IEventRepository {
  list(filters?: { location?: string; category?: string; title?: string; date?: string }): Promise<Event[]>;
  getById(id: string): Promise<Event | null>;
  create(input: EventCreateInput & { createdBy?: string }): Promise<Event>;
  incrementParticipants(id: string): Promise<Event | null>;
}
