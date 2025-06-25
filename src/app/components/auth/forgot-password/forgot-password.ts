import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './forgot-password.html',
  styleUrls: ['./forgot-password.scss']
})
export class ForgotPasswordComponent {
  resetForm: FormGroup;
  emailForm: FormGroup; // Nuevo formulario para solicitar correo
  errorMessage: string | null = null;
  successMessage: string | null = null;
  isLoading = false;
  oobCode: string | null = null;
  isResetMode: boolean = false; // true = formulario de cambio de contraseña

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Formulario para cambio de contraseña (si hay oobCode)
    this.resetForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator });

    // Formulario para solicitar correo (si no hay oobCode)
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });

    this.route.queryParams.subscribe(params => {
      this.oobCode = params['oobCode'] || null;
      this.isResetMode = !!this.oobCode; // true si hay oobCode
    });
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('newPassword')?.value === form.get('confirmPassword')?.value 
      ? null : { mismatch: true };
  }

  // Método para solicitar correo de recuperación
  onRequestReset() {
    if (this.emailForm.valid) {
      this.isLoading = true;
      this.errorMessage = null;
      
      const email = this.emailForm.get('email')?.value;
      
      this.authService.sendPasswordResetEmail(email).subscribe({
        next: () => {
          this.successMessage = 'Se ha enviado un correo con instrucciones para restablecer tu contraseña.';
          this.isLoading = false;
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Error al enviar el correo de recuperación';
          this.isLoading = false;
        }
      });
    }
  }

  // Método para confirmar cambio de contraseña (si hay oobCode)
  onSubmit() {
    if (this.resetForm.valid && this.oobCode) {
      this.isLoading = true;
      this.errorMessage = null;
      
      const { newPassword } = this.resetForm.value;
      
      this.authService.confirmPasswordReset(this.oobCode, newPassword).subscribe({
        next: () => {
          this.successMessage = 'Tu contraseña ha sido restablecida correctamente. Ahora puedes iniciar sesión.';
          this.isLoading = false;
          setTimeout(() => this.router.navigate(['/login']), 3000);
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Error al restablecer la contraseña';
          this.isLoading = false;
        }
      });
    }
  }
}