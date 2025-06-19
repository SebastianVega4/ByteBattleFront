import { Component, OnInit } from '@angular/core';
import { ChallengeService } from '../challenge';
import { ActivatedRoute, Router } from '@angular/router';
import { Challenge, Participation } from '../../shared/models/challenge';
import { AuthService } from '../../auth/auth';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-challenge-detail',
  templateUrl: './challenge-detail.html',
  styleUrls: ['./challenge-detail.scss']
})
export class ChallengeDetailComponent implements OnInit {
  challenge!: Challenge;
  isLoading = true;
  error = '';
  leaderboard: Participation[] = [];
  userParticipation: Participation | null = null;

  constructor(
    private challengeService: ChallengeService,
    private route: ActivatedRoute,
    private router: Router,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate(['/challenges']);
      return;
    }

    this.loadChallenge(id);
  }

  loadChallenge(id: string): void {
    this.isLoading = true;
    this.error = '';

    this.challengeService.getChallengeById(id).subscribe({
      next: (challenge) => {
        this.challenge = challenge;
        this.loadLeaderboard(id);
        this.checkUserParticipation(id);
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar el desafío. Intenta nuevamente.';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  loadLeaderboard(challengeId: string): void {
    this.challengeService.getLeaderboard(challengeId).subscribe({
      next: (leaderboard) => {
        this.leaderboard = leaderboard;
      },
      error: (err) => {
        console.error('Error loading leaderboard:', err);
      }
    });
  }

  checkUserParticipation(challengeId: string): void {
    if (!this.authService.isAuthenticated) return;

    this.challengeService.getLeaderboard(challengeId).subscribe({
      next: (participations) => {
        const userId = this.authService.getCurrentUser()?.uid;
        this.userParticipation = participations.find(p => p.userId === userId) || null;
      },
      error: (err) => {
        console.error('Error checking user participation:', err);
      }
    });
  }

  participate(): void {
    if (!this.authService.isAuthenticated) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
      return;
    }
    this.router.navigate(['/challenges', this.challenge.id, 'participate']);
  }

  viewCode(participationId: string): void {
    this.challengeService.getParticipantCode(participationId).subscribe({
      next: (response) => {
        // Mostrar el código en un modal o nueva página
        console.log('Código:', response.code);
      },
      error: (err) => {
        console.error('Error getting participant code:', err);
      }
    });
  }
}