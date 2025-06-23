import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProfileService } from '../../../../services/profile';
import { AuthService } from '../../../../services/auth';
import { Router } from '@angular/router';
import { User } from '../../../../models/user.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile-edit.html',
  styleUrls: ['./profile-edit.scss']
})
export class ProfileEditComponent implements OnInit {
  editForm: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService,
    private authService: AuthService,
    private router: Router
  ) {
    this.editForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      description: [''], 
      institution: [''], 
      professionalTitle: [''], 
      universityCareer: [''], 
      age: [null, [Validators.min(13), Validators.max(120)]], 
      profilePictureUrl: [''], 
      aceptaelretoUsername: [''] 
    });
  }

  ngOnInit(): void {
    this.loadProfileData();
  }

  loadProfileData(): void {
    const userId = this.authService.getCurrentUser()?.uid;
    if (userId) {
      this.profileService.getProfile(userId).subscribe({
        next: (profile) => {
          this.editForm.patchValue({
            username: profile.username,
            description: profile.description || '',
            institution: profile.institution || '',
            professionalTitle: profile.professionalTitle || '',
            universityCareer: profile.universityCareer || '',
            age: profile.age || null,
            profilePictureUrl: profile.profilePictureUrl || '',
            aceptaelretoUsername: profile.aceptaelretoUsername || ''
          });
        },
        error: (err) => {
          console.error('Error loading profile data', err);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.editForm.valid) {
      this.isLoading = true;
      this.errorMessage = null;
      this.successMessage = null;
      
      const userId = this.authService.getCurrentUser()?.uid;
      if (userId) {
        this.profileService.updateProfile(userId, this.editForm.value).subscribe({
          next: () => {
            this.successMessage = 'Perfil actualizado correctamente';
            this.isLoading = false;
            setTimeout(() => {
              this.router.navigate(['/profile']);
            }, 2000);
          },
          error: (err) => {
            this.errorMessage = err.error?.message || 'Error al actualizar el perfil';
            this.isLoading = false;
          }
        });
      }
    }
  }

  onCancel(): void {
    this.router.navigate(['/profile']);
  }
}