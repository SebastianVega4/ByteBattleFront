import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Participation } from '../../../models/participation.model';
import { SortByScorePipe } from '../../../pipes/sort-by-score.pipe';
import { AuthService } from '../../../services/auth';
import { Router } from '@angular/router';
import { ProfileService } from '../../../services/profile';

@Component({
  selector: 'app-leaderboard',
  standalone: true,
  imports: [CommonModule, SortByScorePipe],
  templateUrl: './leaderboard.html',
  styleUrls: ['./leaderboard.scss']
})
export class Leaderboard {
  @Input() participations: Participation[] = [];
  @Input() isChallengeEnded: boolean = false;
  @Input() showScores: boolean = false; 

  constructor(
    public authService: AuthService,
    private router: Router,
    private profileService: ProfileService
  ) {}

  viewCode(code: string) {
    console.log('Viewing code:', code);
    // Implementa la lógica para mostrar el código
  }
  viewProfile(userId: string) {
    if (userId) {
      // Incrementar el contador de visitas si no es el propio usuario
      if (this.authService.getCurrentUser()?.uid !== userId) {
        this.profileService.incrementProfileViews(userId).subscribe();
      }
      this.router.navigate(['/profile/view', userId]);
    }
  }
}