import { Timestamp } from '@angular/fire/firestore';

export interface User {
  id?: string;
  uid: string;
  email: string;
  username: string;
  aceptaelretoUsername?: string;
  role: 'user' | 'admin';
  isBanned: boolean;
  createdAt: Date | Timestamp | any; // Añadir flexibilidad para el tipo de fecha
  updatedAt: Date | Timestamp | any;
}