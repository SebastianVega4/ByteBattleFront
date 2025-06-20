import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../services/admin';
import { ChallengeService } from '../../../services/challenge';
import { ParticipationService } from '../../../services/participation';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    MatCardModule, 
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    RouterModule
  ],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.scss']
})
export class AdminDashboardComponent implements OnInit {
  stats = {
    users: 0,
    activeChallenges: 0,
    pendingPayments: 0,
    pendingResults: 0
  };
  isLoading = true;

  constructor(
    private adminService: AdminService,
    private challengeService: ChallengeService,
    private participationService: ParticipationService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadStats();
  }

  loadStats() {
    this.isLoading = true;
    
    // Reset stats while loading
    this.stats = {
      users: 0,
      activeChallenges: 0,
      pendingPayments: 0,
      pendingResults: 0
    };

    const requests = [
      this.adminService.getUsers().subscribe({
        next: (response) => {
          this.stats.users = response.total; // Usamos response.total en lugar de users.length
        },
        error: (err) => this.handleError('Error al obtener usuarios', err)
      }),
      
      this.challengeService.getChallenges('activo').subscribe({
        next: (challenges) => {
          this.stats.activeChallenges = challenges.length;
        },
        error: (err) => this.handleError('Error al obtener retos', err)
      }),
      
      this.participationService.getParticipationsByChallenge('').subscribe({
        next: (participations) => {
          this.stats.pendingPayments = participations.filter(p => p.paymentStatus === 'pending').length;
          this.stats.pendingResults = participations.filter(p => 
            p.paymentStatus === 'confirmed' && p.score && !p.challenge?.winnerUserId
          ).length;
          this.isLoading = false;
        },
        error: (err) => {
          this.handleError('Error al obtener participaciones', err);
          this.isLoading = false;
        }
      })
    ];
  }

  private handleError(message: string, error: any) {
    console.error(`${message}:`, error);
    this.snackBar.open(message, 'Cerrar', { duration: 3000 });
  }
}