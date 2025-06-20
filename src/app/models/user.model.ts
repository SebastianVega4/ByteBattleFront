import { Timestamp } from '@angular/fire/firestore';

export interface User {
  uid: string;
  email: string;
  username: string;
  role: 'user' | 'admin';
  isBanned: boolean;
  aceptaelretoUsername?: string;
  createdAt: Date | Timestamp | any; // Añadir flexibilidad para el tipo de fecha
  updatedAt: Date | Timestamp | any;
}