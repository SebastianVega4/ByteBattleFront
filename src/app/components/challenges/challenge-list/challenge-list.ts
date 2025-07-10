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
  styleUrls: ['./challenge-list.scss'],
  standalone: true,
  imports: [
    FormsModule,
    NgClass,
    CommonModule,
    FirebaseDatePipe
  ]
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
  ) { }

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

  isChallengeActive(challenge: Challenge): boolean {
    if (!challenge.startDate || !challenge.endDate) return false;

    const now = new Date();
    const startDate = new Date(challenge.startDate);
    const endDate = new Date(challenge.endDate);

    // Considere también el estado del reto para mayor precisión
    return challenge.status === 'activo' && now >= startDate && now <= endDate;
  }

  getDaysRemaining(challenge: Challenge): string {
    if (!challenge.startDate || !challenge.endDate) return '';

    const now = new Date();
    const startDate = new Date(challenge.startDate);
    const endDate = new Date(challenge.endDate);

    if (now < startDate) {
      // Reto aún no ha comenzado
      const diffDays = Math.ceil((startDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return `Comienza en ${diffDays} días`;
    } else if (now > endDate) {
      // Reto ya finalizó
      return 'Finalizado';
    } else {
      // Reto en progreso
      const diffDays = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return `${diffDays} días restantes`;
    }
  }

  filterChallenges() {
    if (this.selectedStatus === 'all') {
      // Orden personalizado: activos -> próximos -> pasados
      this.filteredChallenges = [...this.challenges].sort((a, b) => {
        // Definimos el orden de prioridad de los estados
        const statusOrder = { 'activo': 1, 'pasado': 2, 'próximo': 3 };

        // Obtenemos el orden numérico para cada reto
        const orderA = statusOrder[a.status] || 4;
        const orderB = statusOrder[b.status] || 4;

        // Primero ordenamos por estado
        if (orderA !== orderB) {
          return orderA - orderB;
        }

        // Si tienen el mismo estado, ordenamos según las reglas específicas
        if (a.status === 'activo') {
          return new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
        } else if (a.status === 'pasado') {
          return new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
        } else {
          return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
        }
      });
    } else {
      // Si hay un filtro específico aplicado, solo mostramos esos retos con su orden específico
      this.filteredChallenges = this.challenges.filter(
        c => c.status === this.selectedStatus
      ).sort((a, b) => {
        if (this.selectedStatus === 'activo') {
          return new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
        } else if (this.selectedStatus === 'pasado') {
          return  new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
        } else {
          return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
        }
      });
    }
  }

  onStatusChange() {
    this.filterChallenges();
  }

  viewChallenge(id: string) {
    this.router.navigate(['/challenges', id]);
  }
}
