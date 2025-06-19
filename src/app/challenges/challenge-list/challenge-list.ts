import { ChallengeService } from '../challenge';
import { Challenge } from '../../shared/models/challenge';
import { AuthService } from '../../auth/auth';
import { Router } from '@angular/router';
import { CommonModule, DatePipe, TitleCasePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-challenge-list',
  templateUrl: './challenge-list.html',
  styleUrls: ['./challenge-list.scss'],
  standalone: true, // Si estás usando componentes standalone
  imports: [CommonModule, DatePipe, TitleCasePipe] // Para standalone components
})
export class ChallengeListComponent implements OnInit {
  challenges: Challenge[] = [];
  filteredChallenges: Challenge[] = [];
  isLoading = true;
  error = '';
  activeTab: 'upcoming' | 'active' | 'past' = 'active';

  constructor(
    private challengeService: ChallengeService,
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadChallenges();
  }

  loadChallenges(): void {
    this.isLoading = true;
    this.error = '';
    
    this.challengeService.getChallenges().subscribe({
      next: (challenges) => {
        this.challenges = challenges;
        this.filterChallenges();
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar los desafíos. Intenta nuevamente.';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  filterChallenges(): void {
    switch (this.activeTab) {
      case 'upcoming':
        this.filteredChallenges = this.challenges.filter(c => c.status === 'upcoming');
        break;
      case 'active':
        this.filteredChallenges = this.challenges.filter(c => c.status === 'active');
        break;
      case 'past':
        this.filteredChallenges = this.challenges.filter(c => c.status === 'past');
        break;
    }
  }

  changeTab(tab: 'upcoming' | 'active' | 'past'): void {
    this.activeTab = tab;
    this.filterChallenges();
  }

  viewChallenge(id: string): void {
    this.router.navigate(['/challenges', id]);
  }

  participate(challenge: Challenge): void {
    if (!this.authService.isAuthenticated) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
      return;
    }
    this.router.navigate(['/challenges', challenge.id, 'participate']);
  }
}