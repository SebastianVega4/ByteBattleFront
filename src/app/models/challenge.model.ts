export interface Challenge {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  participationCost: number;
  linkChallenge?: string;
  status: 'próximo' | 'activo' | 'pasado';
  isPaidToWinner: boolean;
  winnerUserId?: string;
  totalPot: number;
  createdAt: Date;
  createdBy: string;
}
