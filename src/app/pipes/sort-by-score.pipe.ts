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
      const scoreA = a.score || 0;
      const scoreB = b.score || 0;
      return scoreB - scoreA; // Orden descendente
    });
  }
}