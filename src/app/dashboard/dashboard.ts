import { Component, OnInit } from '@angular/core';
import { ChallengeService } from '../services/challenge';
import { ParticipationService } from '../services/participation';
import { AuthService } from '../services/auth';
import { CommonModule } from '@angular/common';
import { TruncatePipe } from '../pipes/truncate.pipe';
import { Participation } from '../models/participation.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, TruncatePipe],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class Dashboard implements OnInit {
  activeChallenges: any[] = [];
  upcomingChallenges: any[] = [];
  userParticipations: Participation[] = []; // Usar interfaz del modelo
  stats = {
    totalChallenges: 0,
    activeParticipations: 0,
    wins: 0,
    earnings: 0
  };
  isLoading = true;

  constructor(
    private challengeService: ChallengeService,
    private participationService: ParticipationService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    const userId = this.authService.getCurrentUser()?.uid;
    if (!userId) return;

    this.challengeService.getChallenges('activo').subscribe(challenges => {
      this.activeChallenges = challenges;
      this.stats.totalChallenges += challenges.length;
    });

    this.challengeService.getChallenges('próximo').subscribe(challenges => {
      this.upcomingChallenges = challenges;
      this.stats.totalChallenges += challenges.length;
    });

    this.participationService.getParticipationsByUser(userId).subscribe(
      (participations: Participation[]) => {
        this.userParticipations = participations;
        this.stats.activeParticipations = participations.filter(p => 
          p.status === 'activo' || p.status === 'próximo').length;

        this.stats.wins = participations.filter(p => 
          p.winnerUserId === userId).length;

        this.stats.earnings = participations
          .filter(p => p.winnerUserId === userId)
          .reduce((sum, p) => sum + (p.totalPot || 0), 0);

        this.isLoading = false;
      }
    );
  }

  joinChallenge(challengeId: string) {
    this.participationService.initiateParticipation(challengeId).subscribe({
      next: (participation) => {
        this.userParticipations.push(participation);
        this.stats.activeParticipations++;
      },
      error: (err) => console.error('Error joining challenge', err)
    });
  }
}