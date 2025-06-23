import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProfileService } from '../../../../services/profile';
import { AuthService } from '../../../../services/auth';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-password-change',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './password-change.html',
  styleUrls: ['./password-change.scss']
})
export class PasswordChangeComponent {
  passwordForm: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService,
    private authService: AuthService,
    private router: Router
  ) {
    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('newPassword')?.value === form.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  onSubmit(): void {
    if (this.passwordForm.valid) {
      this.isLoading = true;
      this.errorMessage = null;
      this.successMessage = null;

      const userId = this.authService.getCurrentUser()?.uid;
      if (userId) {
        const currentPassword = this.passwordForm.get('currentPassword')?.value;
        const newPassword = this.passwordForm.get('newPassword')?.value;

        this.profileService.changePassword(userId, currentPassword, newPassword).subscribe({
          next: () => {
            this.successMessage = 'Contraseña cambiada correctamente';
            this.isLoading = false;
            setTimeout(() => {
              this.router.navigate(['/profile']);
            }, 2000);
          },
          error: (err) => {
            this.errorMessage = err.error?.error || 'Error al cambiar la contraseña';
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