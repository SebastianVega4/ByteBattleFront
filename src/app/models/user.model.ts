export interface User {
  uid: string;
  email: string;
  username: string;
  role: 'user' | 'admin';
  isBanned: boolean;
  aceptaelretoUsername?: string;
  createdAt: Date;
  updatedAt: Date;
}