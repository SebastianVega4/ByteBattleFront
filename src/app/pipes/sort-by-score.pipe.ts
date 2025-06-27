import { Pipe, PipeTransform } from '@angular/core';
import { Participation } from '../models/participation.model';

@Pipe({
  name: 'sortByScore',
  standalone: true
})
export class SortByScorePipe implements PipeTransform {
  transform(participations: Participation[]): Participation[] {
    if (!participations) return [];
    return [...participations].sort((a, b) => {
      const scoreA = a.score || Infinity;  // Infinity para que null/undefined vayan al final
      const scoreB = b.score || Infinity;
      return scoreA - scoreB;  //(menor score primero)
    });
  }
}