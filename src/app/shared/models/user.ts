export interface User {
  uid: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  isBanned: boolean;
  aceptaelretoUsername?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}