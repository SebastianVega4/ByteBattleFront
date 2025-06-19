import { Timestamp } from '@angular/fire/firestore';

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'participation' | 'payment' | 'admin' | 'general';
  isRead: boolean;
  createdAt: Timestamp | Date;
  link?: string;
}