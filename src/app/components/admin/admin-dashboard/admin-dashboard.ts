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
  ) { }

  ngOnInit() {
    this.loadStats();
  }

  async loadStats() {
    this.isLoading = true;

    try {
      const [usersRes, challengesRes, participationsRes] = await Promise.all([
        this.adminService.getUsers(0, 10).toPromise(),
        this.challengeService.getChallenges('activo').toPromise(),
        this.participationService.getParticipationsByChallenge('').toPromise()
      ]);

      this.stats = {
        users: usersRes?.total || 0,
        activeChallenges: challengesRes?.length || 0,
        pendingPayments: participationsRes?.filter(p => p.paymentStatus === 'pending').length || 0,
        pendingResults: participationsRes?.filter(p =>
          p.paymentStatus === 'confirmed' && p.score && !p.challenge?.winnerUserId
        ).length || 0
      };
    } catch (err) {
      console.error('Error loading stats:', err);
      this.snackBar.open('Error al cargar estadísticas', 'Cerrar', { duration: 3000 });
    } finally {
      this.isLoading = false;
    }
  }

  private handleError(message: string, error: any) {
    console.error(`${message}:`, error);
    this.snackBar.open(message, 'Cerrar', { duration: 3000 });
  }
}