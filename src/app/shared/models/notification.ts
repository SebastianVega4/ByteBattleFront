import { firestore } from 'firebase/app';

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'participation' | 'payment' | 'admin' | 'general';
  isRead: boolean;
  createdAt: firestore.Timestamp | Date;
  link?: string;
}