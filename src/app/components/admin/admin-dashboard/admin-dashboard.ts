import { Component } from '@angular/core';
import { AdminService } from '../../../services/admin';
import { ChallengeService } from '../../../services/challenge';
import { ParticipationService } from '../../../services/participation';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatProgressSpinnerModule],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.scss']
})
export class AdminDashboardComponent {
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
    private participationService: ParticipationService
  ) {}

  ngOnInit() {
    this.loadStats();
  }

  loadStats() {
    this.isLoading = true;
    
    this.adminService.getUsers().subscribe(users => {
      this.stats.users = users.length;
    });

    this.challengeService.getChallenges('activo').subscribe(challenges => {
      this.stats.activeChallenges = challenges.length;
    });

    this.participationService.getParticipationsByChallenge('').subscribe(participations => {
      this.stats.pendingPayments = participations.filter(p => p.paymentStatus === 'pending').length;
      this.stats.pendingResults = participations.filter(p => p.paymentStatus === 'confirmed' && !p.score).length;
      this.isLoading = false;
    });
  }
}