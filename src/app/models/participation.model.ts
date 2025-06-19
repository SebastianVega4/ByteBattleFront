export interface Participation {
  id: string;
  userId: string;
  challengeId: string;
  status: string;
  score?: number;
  code?: string;
  submissionDate?: Date;
  isPaid: boolean;
  paymentStatus: 'pending' | 'confirmed' | 'rejected';
  createdAt: Date;
  paymentConfirmationDate?: Date;
  totalPot?: number;
  winnerUserId?: string; 
}