import { Timestamp } from '@angular/fire/firestore';

export interface User {
  id?: string;
  uid: string;
  email: string;
  username: string;
  aceptaelretoUsername?: string | null;
  role: 'user' | 'admin';
  isBanned: boolean;
  createdAt: Date | Timestamp | any;
  updatedAt: Date | Timestamp | any;
}