import { Component, OnInit } from '@angular/core';
import { ChallengeService } from '../services/challenge';
import { ParticipationService } from '../services/participation';
import { AuthService } from '../services/auth';
import { CommonModule } from '@angular/common';
import { TruncatePipe } from '../pipes/truncate.pipe';
import { Participation } from '../models/participation.model';
import { User } from '../models/user.model';
import { finalize, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

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
  userData: User | null = null;
  stats = {
    totalChallenges: 0,
    activeParticipations: 0,
    wins: 0,
    earnings: 0,
    totalParticipations: 0
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

    // Obtener datos del usuario usando el nuevo método Observable
    this.authService.getCurrentUserObservable().subscribe((user: User | null) => {
      this.userData = user;
      if (user) {
        this.updateUserStats(user);
      }
    });

    // Cargar retos activos
    this.challengeService.getChallenges('activo').pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (challenges) => {
        this.activeChallenges = challenges;
        this.stats.totalChallenges = challenges.length;
      },
      error: (err) => console.error('Error loading active challenges', err)
    });

    // Cargar retos próximos
    this.challengeService.getChallenges('próximo').subscribe({
      next: (challenges) => {
        this.upcomingChallenges = challenges;
        this.stats.totalChallenges += challenges.length;
      },
      error: (err) => console.error('Error loading upcoming challenges', err)
    });

    // Cargar participaciones activas del usuario
    this.participationService.getParticipationsByUser(userId).subscribe({
      next: (participations: Participation[]) => {
        this.stats.activeParticipations = participations.filter(p => 
          p.challenge?.status === 'activo' && p.paymentStatus === 'confirmed').length;
      },
      error: (err) => console.error('Error loading user participations', err)
    });
  }

  private updateUserStats(user: User) {
    this.stats = {
      ...this.stats,
      wins: user.challengeWins || 0,
      earnings: user.totalEarnings || 0,
      totalParticipations: user.totalParticipations || 0
    };
  }

  joinChallenge(challengeId: string) {
    this.participationService.initiateParticipation(challengeId).pipe(
      switchMap(participation => {
        // Actualizar estadísticas después de unirse a un reto
        if (this.userData) {
          this.userData.totalParticipations = (this.userData.totalParticipations || 0) + 1;
          this.updateUserStats(this.userData);
          this.stats.activeParticipations++;
        }
        return of(participation);
      })
    ).subscribe({
      error: (err) => console.error('Error joining challenge', err)
    });
  }
}