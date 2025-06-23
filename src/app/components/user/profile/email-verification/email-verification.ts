import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../../../../services/profile';
import { AuthService } from '../../../../services/auth';
import { Router } from '@angular/router';
import { User } from '../../../../models/user.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-email-verification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './email-verification.html',
  styleUrls: ['./email-verification.scss']
})
export class EmailVerificationComponent implements OnInit {
  isLoading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  email: string | null = null;
  isVerified = false;

  constructor(
    private profileService: ProfileService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    this.email = user?.email || null;
    this.isVerified = user?.emailVerified || false;
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

  checkVerificationStatus(): void {
    this.authService.reloadUser().then((user: User | null) => {
      if (user?.emailVerified) {
        this.isVerified = true;
        this.successMessage = '¡Email verificado correctamente!';
      }
    });
  }

  onBack(): void {
    this.router.navigate(['/profile']);
  }
}