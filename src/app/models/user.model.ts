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
  
  profileViews: number;

  description?: string;
  institution?: string; 
  professionalTitle?: string;
  universityCareer?: string; 
  age?: number; 
  challengeWins: number; 
  totalParticipations: number;
  totalEarnings: number;
  profilePictureUrl?: string;
  emailVerified: boolean;
  verified?: boolean;
}