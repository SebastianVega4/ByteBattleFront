import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChallengeService } from '../../../services/challenge';
import { Challenge } from '../../../models';
import { AuthService } from '../../../services/auth';
import { ParticipationService } from '../../../services/participation';

@Component({
  selector: 'app-challenge-detail',
  templateUrl: './challenge-detail.html',
  styleUrls: ['./challenge-detail.scss']
})
export class ChallengeDetailComponent {
  challenge: Challenge | null = null;
  isLoading = true;
  hasParticipated = false;
  participationId: string | null = null;
  isAdmin = false;

  constructor(
    private route: ActivatedRoute,
    private challengeService: ChallengeService,
    private participationService: ParticipationService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.isAdmin = this.authService.isAdmin();
    const challengeId = this.route.snapshot.paramMap.get('id');
    
    if (challengeId) {
      this.loadChallenge(challengeId);
    }
  }

  loadChallenge(id: string) {
    this.isLoading = true;
    this.challengeService.getChallenge(id).subscribe({
      next: (challenge) => {
        this.challenge = challenge;
        this.checkParticipation();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading challenge', err);
        this.isLoading = false;
      }
    });
  }

  checkParticipation() {
    if (!this.challenge || !this.authService.getCurrentUser()) return;
    
    this.participationService.getParticipationsByChallenge(this.challenge.id).subscribe({
      next: (participations) => {
        const userParticipation = participations.find(
          p => p.userId === this.authService.getCurrentUser()?.uid
        );
        
        if (userParticipation) {
          this.hasParticipated = true;
          this.participationId = userParticipation.id;
        }
      }
    });
  }

  participate() {
    if (!this.challenge) return;
    
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