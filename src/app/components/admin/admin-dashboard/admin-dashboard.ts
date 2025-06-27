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
    completedChallenges: 0,
    upcomingChallenges: 0,
    pendingPayments: 0,
    totalPayments: 0,
    pendingResults: 0,
    totalRevenue: 0
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
      const [usersRes, activeChallenges, upcomingChallenges, completedChallenges, participationsRes] = await Promise.all([
        this.adminService.getUsers(0, 1).toPromise(), // Solo necesitamos el total
        this.challengeService.getChallenges('activo').toPromise(),
        this.challengeService.getChallenges('próximo').toPromise(), // Nuevo: obtener retos próximos
        this.challengeService.getChallenges('pasado').toPromise(),
        this.participationService.getParticipationsByStatus('pending').toPromise()
      ]);

      // Calcular ingresos totales
      const allChallenges = [...(activeChallenges || []), ...(completedChallenges || [])];
      const totalRevenue = allChallenges.reduce((sum, challenge) => {
        return sum + (challenge.participationCost * (challenge.totalPot / challenge.participationCost || 0));
      }, 0);

      this.stats = {
        users: usersRes?.total || 0,
        activeChallenges: activeChallenges?.length || 0,
        upcomingChallenges: upcomingChallenges?.length || 0, // Nuevo: contar retos próximos
        completedChallenges: completedChallenges?.length || 0,
        pendingPayments: participationsRes?.length || 0,
        totalPayments: participationsRes?.filter(p => p.paymentStatus === 'confirmed').length || 0,
        pendingResults: participationsRes?.filter(p =>
          p.paymentStatus === 'confirmed' && p.score && !p.challenge?.winnerUserId
        ).length || 0,
        totalRevenue: totalRevenue
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