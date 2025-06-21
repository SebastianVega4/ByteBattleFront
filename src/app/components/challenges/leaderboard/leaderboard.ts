import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Participation } from '../../../models/participation.model';
import { SortByScorePipe } from '../../../pipes/sort-by-score.pipe';

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

  viewCode(code: string) {
    // Implementa la lógica para mostrar el código
    console.log('Viewing code:', code);
    // Puedes usar un modal o un servicio para mostrar el código
  }
}