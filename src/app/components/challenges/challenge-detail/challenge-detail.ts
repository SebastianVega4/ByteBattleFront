import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChallengeService } from '../../../services/challenge';
import { Challenge, Participation } from '../../../models';
import { AuthService } from '../../../services/auth';
import { ParticipationService } from '../../../services/participation';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Leaderboard } from '../leaderboard/leaderboard';
import { ScoreSubmission } from '../score-submission/score-submission';
import { ParticipationInstructions } from '../participation-instructions/participation-instructions';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-challenge-detail',
  templateUrl: './challenge-detail.html',
  styleUrls: ['./challenge-detail.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    Leaderboard,
    ScoreSubmission,
    ParticipationInstructions
  ]
})
export class ChallengeDetailComponent {
  challenge: Challenge | null = null;
  isLoading = true;
  hasParticipated = false;
  showPayment = false;
  hasPaymentConfirmed = false;
  participationId: string = '';
  isAdmin = false;
  participations: Participation[] = [];
  showScores = false;

  constructor(
    private route: ActivatedRoute,
    private challengeService: ChallengeService,
    private participationService: ParticipationService,
    public authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.isAdmin = this.authService.isAdmin();
    const challengeId = this.route.snapshot.paramMap.get('id');

    if (challengeId) {
      this.loadChallenge(challengeId);
      this.loadParticipations(challengeId);

      if (this.authService.isLoggedIn()) {
        this.checkParticipation(challengeId);
      } else {
        this.showScores = false;
      }
    }
  }

  loadChallenge(id: string) {
    this.isLoading = true;
    this.challengeService.getChallenge(id).subscribe({
      next: (challenge) => {
        // Asegurarse que el challenge tiene el ID
        this.challenge = { ...challenge, id: id };
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading challenge', err);
        this.isLoading = false;
        this.snackBar.open('Error al cargar el reto', 'Cerrar', { duration: 3000 });
      }
    });
  }

  loadParticipations(challengeId: string) {
    this.challengeService.getParticipationsByChallenge(challengeId).subscribe({
      next: (participations) => {
        this.participations = participations;
      },
      error: (err) => {
        console.error('Error loading participations', err);
      }
    });
  }

  checkParticipation(challengeId: string) {
    const userId = this.authService.getCurrentUser()?.uid;
    if (!userId) {
      this.showScores = false;
      return;
    }

    this.participationService.getParticipationsByUser(userId).subscribe({
      next: (participations) => {
        const userParticipation = participations.find(
          p => p.challengeId === challengeId
        );

        this.showScores = !!userParticipation || this.isAdmin;
        
        if (userParticipation) {
          this.hasParticipated = true;
          this.participationId = userParticipation.id;
          this.hasPaymentConfirmed = userParticipation.paymentStatus === 'confirmed';
        }
      },
      error: (err) => {
        console.error('Error checking participation', err);
        this.showScores = false;
      }
    });
  }

  participate() {
    this.showPayment = true;
  }
}