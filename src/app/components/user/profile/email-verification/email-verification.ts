import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../../../../services/profile';
import { AuthService } from '../../../../services/auth';
import { Router, ActivatedRoute } from '@angular/router';
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
  verificationChecked = false;

  constructor(
    private profileService: ProfileService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.checkInitialVerification();
    this.checkUrlForVerification();
  }

  private checkInitialVerification(): void {
    const user = this.authService.getCurrentUser();
    this.email = user?.email || null;
    this.isVerified = user?.emailVerified || false;
    this.verificationChecked = true;
  }

  private checkUrlForVerification(): void {
    this.route.queryParams.subscribe(params => {
      if (params['verified'] === 'true') {
        this.handleSuccessfulVerification();
      }
    });
  }

  sendVerificationEmail(): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;

    this.profileService.sendEmailVerification().subscribe({
      next: (response: any) => {
        this.successMessage = 'Email de verificación enviado. Por favor revisa tu bandeja de entrada.';
        if (response.verificationLink) {
          console.log('Enlace de verificación (solo desarrollo):', response.verificationLink);
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Error al enviar el email de verificación';
        this.isLoading = false;
      }
    });
  }

  private handleSuccessfulVerification(): void {
    this.isLoading = true;
    this.authService.reloadCurrentUser().subscribe({
      next: (user) => {
        this.isVerified = user?.emailVerified || false;
        if (this.isVerified) {
          this.successMessage = '¡Email verificado correctamente!';
          this.router.navigate([], {
            relativeTo: this.route,
            queryParams: {},
            replaceUrl: true
          });
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error verifying email:', err);
        this.isLoading = false;
      }
    });
  }

  onBack(): void {
    this.router.navigate(['/profile']);
  }
}