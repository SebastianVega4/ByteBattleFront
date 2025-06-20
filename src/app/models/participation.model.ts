export interface Participation {
  id: string;
  userId: string;
  user?: {
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
  };
  score?: number;
  code?: string;
  submissionDate?: Date;
  isPaid: boolean;
  paymentStatus: 'pending' | 'confirmed' | 'rejected';
  createdAt: Date;
  paymentConfirmationDate?: Date;
}