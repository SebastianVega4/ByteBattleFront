// leaderboard.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Participation } from '../../../models/participation.model';
import { SortByScorePipe } from '../../../pipes/sort-by-score.pipe';
import { AuthService } from '../../../services/auth';

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
  @Input() showScores: boolean = false; // Nueva propiedad de entrada

  constructor(public authService: AuthService) {}

  viewCode(code: string) {
    console.log('Viewing code:', code);
    // Implementa la lógica para mostrar el código
  }
}