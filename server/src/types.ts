export interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string; // ISO string
  category: string;
  maxParticipants: number;
  currentParticipants: number;
  createdBy?: string; // user ID
  coordinates?: { lat: number; lng: number };
}

export interface EventCreateInput {
  title: string;
  description: string;
  location: string;
  date: string; // ISO string
  category: string;
  maxParticipants: number;
  currentParticipants?: number;
  coordinates?: { lat: number; lng: number };
}

export interface User {
  id: string;
  email: string;
  username: string;
  passwordHash: string;
}
