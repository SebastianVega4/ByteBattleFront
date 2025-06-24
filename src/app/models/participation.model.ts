export interface Participation {
  id: string;
  userId: string;
  user?: {
    uid: string;
    username: string;
    email: string;
    aceptaelretoUsername?: string;
  };
  challengeId: string;
  challenge?: {
    title: string;
    participationCost: number;
    status: 'próximo' | 'activo' | 'pasado';
    winnerUserId?: string;
    totalPot?: number;
  };
  status?: string;
  score?: number;
  code?: string;
  submissionDate?: Date;
  isPaid: boolean;
  paymentStatus: 'pending' | 'confirmed' | 'rejected';
  createdAt: Date;
  paymentConfirmationDate?: Date;
  winnerUserId?: string;
  totalPot?: number;
  aceptaelretoUsername?: string;
}
