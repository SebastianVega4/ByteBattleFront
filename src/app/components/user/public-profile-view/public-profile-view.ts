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
          // Actualiza emailVerified si está disponible en la respuesta
          if (profile.emailVerified !== undefined) {
            this.emailVerified = profile.emailVerified;
          }
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error loading profile', err);
          this.isLoading = false;
        }
      });
    }
  }
}
