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
  
  // Nuevos campos según el modelo
  description?: string; // Descripción del usuario
  institution?: string; // Institución/Universidad
  professionalTitle?: string; // Título profesional
  universityCareer?: string; // Carrera universitaria
  age?: number; // Edad
  challengeWins?: number; // Número de victorias en retos
  totalParticipations?: number; // Total de retos participados
  totalEarnings?: number; // Dinero ganado en retos
  profilePictureUrl?: string; // URL de la foto de perfil
  emailVerified?: boolean; // Si el email está verificado
  verified?: boolean; // Verificado (general)
}