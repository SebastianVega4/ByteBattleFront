import { Timestamp } from '@angular/fire/firestore';

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'participation' | 'payment' | 'admin' | 'general';
  isRead: boolean;
  createdAt: Date | Timestamp; // Acepta ambos tipos
  link?: string;
}