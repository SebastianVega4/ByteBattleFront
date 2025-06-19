import { Component } from '@angular/core';
import { ChallengeService } from '../../../services/challenge';
import { Challenge } from '../../../models';
import { Router } from '@angular/router';
import { CommonModule, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FirebaseDatePipe } from '../../../pipes/firebase-date-pipe';

@Component({
  selector: 'app-challenge-list',
  templateUrl: './challenge-list.html',
  imports: [
    FormsModule, 
    NgClass, 
    CommonModule,
    FirebaseDatePipe // Add this
  ],
  styleUrls: ['./challenge-list.scss']
})
export class ChallengeListComponent {
  challenges: Challenge[] = [];
  filteredChallenges: Challenge[] = [];
  isLoading = true;
  selectedStatus: string = 'all';
  statusOptions = [
    { value: 'all', label: 'Todos' },
    { value: 'próximo', label: 'Próximos' },
    { value: 'activo', label: 'Activos' },
    { value: 'pasado', label: 'Pasados' }
  ];

  constructor(
    private challengeService: ChallengeService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadChallenges();
  }

  loadChallenges() {
    this.isLoading = true;
    this.challengeService.getChallenges().subscribe({
      next: (challenges) => {
        this.challenges = challenges;
        this.filterChallenges();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading challenges', err);
        this.isLoading = false;
      }
    });
  }

  filterChallenges() {
    if (this.selectedStatus === 'all') {
      this.filteredChallenges = [...this.challenges];
    } else {
      this.filteredChallenges = this.challenges.filter(
        c => c.status === this.selectedStatus
      );
    }
  }

  onStatusChange() {
    this.filterChallenges();
  }

  viewChallenge(id: string) {
    this.router.navigate(['/challenges', id]);
  }
}
