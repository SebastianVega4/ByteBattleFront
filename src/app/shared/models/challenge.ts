export interface Challenge {
  id: string;
  title: string;
  description: string;
  startDate: Date | string;
  endDate: Date | string;
  participationCost: number;
  status: 'upcoming' | 'active' | 'past';
  isPaidToWinner: boolean;
  winnerUserId?: string;
  totalPot?: number;
  createdAt: Date | string;
  createdByUserId: string;
}

export interface Participation {
  id: string;
  userId: string;
  challengeId: string;
  score?: number;
  code?: string;
  submissionDate?: Date | string;
  isPaid: boolean;
  paymentStatus: 'pending' | 'confirmed' | 'rejected';
  createdAt: Date | string;
  paymentConfirmationDate?: Date | string;
  user?: {
    name: string;
    email: string;
    aceptaelretoUsername?: string;
  };
}