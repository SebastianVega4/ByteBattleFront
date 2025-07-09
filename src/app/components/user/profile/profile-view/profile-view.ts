import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../../../../services/profile';
import { AuthService } from '../../../../services/auth';
import { User } from '../../../../models/user.model';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile-view.html',
  styleUrls: ['./profile-view.scss']
})
export class ProfileViewComponent implements OnInit {
  userProfile: User | null = null;
  isLoading = true;
  emailVerified: boolean = false;

  constructor(
    private profileService: ProfileService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    const userId = this.authService.getCurrentUser()?.uid;
    if (userId) {
      this.profileService.getProfile(userId).subscribe({
        next: (profile) => {
          this.userProfile = profile;
          this.emailVerified = profile.emailVerified;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error loading profile', err);
          this.isLoading = false;
        }
      });
    }
  }

  navigateToEdit(): void {
    this.router.navigate(['/profile/edit']);
  }

  navigateToChangePassword(): void {
    this.router.navigate(['/profile/change-password']);
  }

  navigateToVerifyEmail(): void {
    this.router.navigate(['/profile/verify-email']);
  }
}