import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProfileService } from '../../../services/profile';
import { User } from '../../../models/user.model';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-public-profile-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './public-profile-view.html',
  styleUrls: ['./public-profile-view.scss']
})
export class PublicProfileViewComponent implements OnInit {
  userProfile: User | null = null;
  isLoading = true;
  isOwnProfile = false;
  emailVerified = false;
  private lastViewIncrementTime = 0;
  private readonly VIEW_INCREMENT_COOLDOWN = 3600000; // 1 hora en milisegundos

  constructor(
    private route: ActivatedRoute,
    private profileService: ProfileService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    const userId = this.route.snapshot.paramMap.get('userId');
    const currentUserId = this.authService.getCurrentUser()?.uid;

    if (userId) {
      this.isOwnProfile = currentUserId === userId;

      this.profileService.getPublicProfile(userId).subscribe({
        next: (profile) => {
          this.userProfile = profile;
          this.emailVerified = profile.emailVerified || false;
          this.isLoading = false;

          // Incrementar visitas solo si no es el propio perfil y ha pasado el cooldown
          if (!this.isOwnProfile && this.canIncrementViews()) {
            this.incrementProfileViews(userId);
            this.lastViewIncrementTime = Date.now();
          }
        },
        error: (err) => {
          console.error('Error loading profile', err);
          this.isLoading = false;
        }
      });
    }
  }

  private canIncrementViews(): boolean {
    const now = Date.now();
    return (now - this.lastViewIncrementTime) > this.VIEW_INCREMENT_COOLDOWN;
  }

  private incrementProfileViews(userId: string): void {
    const lastIncrementKey = `lastViewIncrement_${userId}`;
    const lastIncrement = localStorage.getItem(lastIncrementKey);
    const now = Date.now();

    if (!lastIncrement || (now - parseInt(lastIncrement)) > this.VIEW_INCREMENT_COOLDOWN) {
      this.profileService.incrementProfileViews(userId).subscribe({
        next: () => {
          localStorage.setItem(lastIncrementKey, now.toString());
          if (this.userProfile) {
            this.userProfile.profileViews = (this.userProfile.profileViews || 0) + 1;
          }
        },
        error: (err) => console.error('Error incrementing views', err)
      });
    }
  }
}
