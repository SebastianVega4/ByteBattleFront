import { Component } from '@angular/core';
import { AdminService } from '../../../services/admin';

@Component({
  selector: 'app-admin-dashboard',
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

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.loadStats();
  }

  loadStats() {
    this.isLoading = true;
    
    this.adminService.getUsers().subscribe(users => {
      this.stats.users = users.length;
    });
    
    // Other stats would be loaded similarly
    // This is a simplified version
    
    setTimeout(() => {
      this.stats.activeChallenges = 5;
      this.stats.pendingPayments = 12;
      this.stats.pendingResults = 8;
      this.isLoading = false;
    }, 1000);
  }
}