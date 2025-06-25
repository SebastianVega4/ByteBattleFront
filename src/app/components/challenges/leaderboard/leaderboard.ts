import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Participation } from '../../../models/participation.model';
import { SortByScorePipe } from '../../../pipes/sort-by-score.pipe';
import { AuthService } from '../../../services/auth';
import { Router } from '@angular/router';
import { ProfileService } from '../../../services/profile';
import { MatDialog } from '@angular/material/dialog';
import { CodeDisplayComponent } from '../code-display/code-display';
import { ParticipationService } from '../../../services/participation';

@Component({
  selector: 'app-leaderboard',
  standalone: true,
  imports: [CommonModule, SortByScorePipe],
  templateUrl: './leaderboard.html',
  styleUrls: ['./leaderboard.scss']
})
export class LeaderboardComponent {
  @Input() participations: Participation[] = [];
  @Input() isChallengeEnded: boolean = false;
  @Input() showScores: boolean = false;
  @Input() challengeId: string = '';

  constructor(
    public authService: AuthService,
    private router: Router,
    private profileService: ProfileService,
    private dialog: MatDialog,
    private participationService: ParticipationService
  ) {}

  viewCode(participationId: string) {
    this.participationService.getParticipantCode(participationId).subscribe({
      next: (response) => {
        this.dialog.open(CodeDisplayComponent, {
          width: '80%',
          maxWidth: '800px',
          data: {
            code: response.code,
            language: 'JAVA', // Puedes ajustar esto según el lenguaje usado
            username: response.username
          }
        });
      },
      error: (err) => {
        console.error('Error al obtener el código:', err);
      }
    });
  }

  viewProfile(userId: string) {
    if (userId) {
      if (this.authService.getCurrentUser()?.uid !== userId) {
        this.profileService.incrementProfileViews(userId).subscribe();
      }
      this.router.navigate(['/profile/view', userId]);
    }
  }
}