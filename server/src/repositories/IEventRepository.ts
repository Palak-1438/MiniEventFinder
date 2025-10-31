import { Event, EventCreateInput } from '../types.js';

export interface IEventRepository {
  list(filter?: { location?: string }): Promise<Event[]>;
  getById(id: string): Promise<Event | null>;
  create(input: EventCreateInput): Promise<Event>;
}
