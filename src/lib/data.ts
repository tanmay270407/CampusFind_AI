import type { User, Item, Claim, Notification } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const getImage = (id: string) => {
    const img = PlaceHolderImages.find(img => img.id === id);
    if (!img) {
        // Fallback or error
        const fallback = PlaceHolderImages[0];
        return { imageUrl: fallback.imageUrl, imageHint: fallback.imageHint };
    }
    return { imageUrl: img.imageUrl, imageHint: img.imageHint };
};

export const users: User[] = [
  { id: 'user-1', name: 'Alex Johnson', email: 'student@campus.edu', role: 'student', avatarUrl: getImage('user-avatar-1').imageUrl, avatarHint: getImage('user-avatar-1').imageHint },
  { id: 'user-2', name: 'Ben Carter', email: 'staff@campus.edu', role: 'staff', avatarUrl: getImage('user-avatar-2').imageUrl, avatarHint: getImage('user-avatar-2').imageHint },
  { id: 'user-3', name: 'Chris Davis', email: 'admin@campus.edu', role: 'admin', avatarUrl: getImage('user-avatar-3').imageUrl, avatarHint: getImage('user-avatar-3').imageHint },
];

export const items: Item[] = [
  {
    id: 'item-1',
    name: 'Blue Hydro Flask',
    type: 'found',
    itemType: 'Water Bottle',
    description: 'A blue Hydro Flask water bottle with a small dent on the side. Found near the library entrance.',
    imageUrl: getImage('water-bottle-1').imageUrl,
    imageHint: getImage('water-bottle-1').imageHint,
    location: 'Library Entrance',
    reportedAt: '2024-07-28T10:00:00Z',
    reportedBy: 'user-2',
    status: 'open',
  },
  {
    id: 'item-2',
    name: 'Student ID Card',
    type: 'found',
    itemType: 'ID Card',
    description: 'Found a student ID card for a student named "Jessica Smith".',
    imageUrl: getImage('id-card-1').imageUrl,
    imageHint: getImage('id-card-1').imageHint,
    location: 'Cafeteria',
    reportedAt: '2024-07-28T12:30:00Z',
    reportedBy: 'user-2',
    status: 'open',
  },
  {
    id: 'item-3',
    name: 'Black Jansport Backpack',
    type: 'lost',
    itemType: 'Bag',
    description: 'Lost my black Jansport backpack, probably in the main auditorium. It contains a laptop and some textbooks.',
    imageUrl: getImage('backpack-1').imageUrl,
    imageHint: getImage('backpack-1').imageHint,
    location: 'Main Auditorium',
    reportedAt: '2024-07-27T18:00:00Z',
    reportedBy: 'user-2',
    status: 'open',
  },
  {
    id: 'item-4',
    name: 'Introduction to Physics Textbook',
    type: 'found',
    itemType: 'Book',
    description: 'A copy of "Introduction to Physics" was left in lecture hall 3B.',
    imageUrl: getImage('book-1').imageUrl,
    imageHint: getImage('book-1').imageHint,
    location: 'Lecture Hall 3B',
    reportedAt: '2024-07-29T09:00:00Z',
    reportedBy: 'user-2',
    status: 'open',
  },
  {
    id: 'item-5',
    name: 'MacBook Pro 14"',
    type: 'found',
    itemType: 'Gadget',
    description: 'A 14-inch MacBook Pro in a grey case. Found at a charging station in the student union.',
    imageUrl: getImage('laptop-1').imageUrl,
    imageHint: getImage('laptop-1').imageHint,
    location: 'Student Union',
    reportedAt: '2024-07-29T11:45:00Z',
    reportedBy: 'user-2',
    status: 'claimed',
  },
  {
    id: 'item-6',
    name: 'Sony WH-1000XM4 Headphones',
    type: 'lost',
    itemType: 'Gadget',
    description: 'Lost my black Sony headphones, they were in a black case. I think I left them at the gym.',
    imageUrl: getImage('headphones-1').imageUrl,
    imageHint: getImage('headphones-1').imageHint,
    location: 'Gym',
    reportedAt: '2024-07-29T14:00:00Z',
    reportedBy: 'user-2',
    status: 'open',
  },
];

export const claims: Claim[] = [];

export const notifications: Notification[] = [];
