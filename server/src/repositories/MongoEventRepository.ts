import { EventModel } from '../models/Event.js';
import { IEventRepository } from './IEventRepository.js';
import type { Event, EventCreateInput } from '../types.js';

export class MongoEventRepository implements IEventRepository {
  async list(filters?: { location?: string; category?: string; title?: string; date?: string }): Promise<Event[]> {
    const query: any = {};
    if (filters?.location) {
      query.location = { $regex: filters.location, $options: 'i' };
    }
    if (filters?.category) {
      query.category = filters.category;
    }
    if (filters?.title) {
      query.title = { $regex: filters.title, $options: 'i' };
    }
    if (filters?.date) {
      const dateStart = new Date(filters.date);
      const dateEnd = new Date(filters.date);
      dateEnd.setDate(dateEnd.getDate() + 1);
      query.date = { $gte: dateStart.toISOString(), $lt: dateEnd.toISOString() };
    }
    
    const docs = await EventModel.find(query).sort({ date: 1 });
    return docs.map(doc => ({
      id: doc._id.toString(),
      title: doc.title,
      description: doc.description,
      location: doc.location,
      date: doc.date,
      category: doc.category,
      maxParticipants: doc.maxParticipants,
      currentParticipants: doc.currentParticipants,
      createdBy: doc.createdBy?.toString(),
      coordinates: doc.coordinates
    }));
  }

  async getById(id: string): Promise<Event | null> {
    const doc = await EventModel.findById(id);
    if (!doc) return null;
    return {
      id: doc._id.toString(),
      title: doc.title,
      description: doc.description,
      location: doc.location,
      date: doc.date,
      category: doc.category,
      maxParticipants: doc.maxParticipants,
      currentParticipants: doc.currentParticipants,
      createdBy: doc.createdBy?.toString(),
      coordinates: doc.coordinates
    };
  }

  async create(input: EventCreateInput & { createdBy?: string }): Promise<Event> {
    const doc = await EventModel.create(input);
    return {
      id: doc._id.toString(),
      title: doc.title,
      description: doc.description,
      location: doc.location,
      date: doc.date,
      category: doc.category,
      maxParticipants: doc.maxParticipants,
      currentParticipants: doc.currentParticipants,
      createdBy: doc.createdBy?.toString(),
      coordinates: doc.coordinates
    };
  }

  async incrementParticipants(id: string): Promise<Event | null> {
    const doc = await EventModel.findByIdAndUpdate(
      id,
      { $inc: { currentParticipants: 1 } },
      { new: true }
    );
    if (!doc) return null;
    return {
      id: doc._id.toString(),
      title: doc.title,
      description: doc.description,
      location: doc.location,
      date: doc.date,
      category: doc.category,
      maxParticipants: doc.maxParticipants,
      currentParticipants: doc.currentParticipants,
      createdBy: doc.createdBy?.toString(),
      coordinates: doc.coordinates
    };
  }
}
