import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../../../../services/profile';
import { AuthService } from '../../../../services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-email-verification',
  templateUrl: './email-verification.html',
  styleUrls: ['./email-verification.scss']
})
export class EmailVerificationComponent implements OnInit {
  isLoading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  email: string | null = null;

  constructor(
    private profileService: ProfileService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    this.email = user?.email || null;
  }

  sendVerificationEmail(): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;
    
    this.profileService.sendEmailVerification().subscribe({
      next: () => {
        this.successMessage = 'Email de verificación enviado. Por favor revisa tu bandeja de entrada.';
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Error al enviar el email de verificación';
        this.isLoading = false;
      }
    });
  }

  onBack(): void {
    this.router.navigate(['/profile']);
  }
}