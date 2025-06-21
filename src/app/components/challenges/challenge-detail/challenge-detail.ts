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
  participationId: string | null = null;
  isAdmin = false;
  participations: Participation[] = [];

  constructor(
    private route: ActivatedRoute,
    private challengeService: ChallengeService,
    private participationService: ParticipationService,
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.isAdmin = this.authService.isAdmin();
    const challengeId = this.route.snapshot.paramMap.get('id');
    
    if (challengeId) {
      this.loadChallenge(challengeId);
      this.loadParticipations(challengeId);
      
      if (this.authService.isLoggedIn()) {
        this.checkParticipation(challengeId);
      }
    }
  }

  loadChallenge(id: string) {
    this.isLoading = true;
    this.challengeService.getChallenge(id).subscribe({
      next: (challenge) => {
        this.challenge = challenge;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading challenge', err);
        this.isLoading = false;
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
    if (!userId) return;
    
    this.participationService.getParticipationsByUser(userId).subscribe({
      next: (participations) => {
        const userParticipation = participations.find(
          p => p.challengeId === challengeId
        );
        
        if (userParticipation) {
          this.hasParticipated = true;
          this.participationId = userParticipation.id;
        }
      },
      error: (err) => {
        console.error('Error checking participation', err);
      }
    });
  }

  participate() {
    if (!this.challenge || !this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    
    this.participationService.initiateParticipation(this.challenge.id).subscribe({
      next: (participation) => {
        this.hasParticipated = true;
        this.participationId = participation.id;
      },
      error: (err) => {
        console.error('Error initiating participation', err);
      }
    });
  }
}