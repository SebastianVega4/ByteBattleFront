import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.html',
  styleUrls: ['./register.scss']
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage: string | null = null;
  isLoading = false;
  showSuccessMessage = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.errorMessage = null;
      this.showSuccessMessage = false;

      const { username, email, password } = this.registerForm.value;
      console.log("Attempting to register:", { email, username });

      this.authService.register(email, password, username).subscribe({
        next: () => {
          console.log("Registration successful");
          this.showSuccessMessage = true; // Activar mensaje de éxito
          this.isLoading = false;

          // Redirigir después de 3 segundos
          setTimeout(() => {
            this.router.navigate(['/login'], {
              state: { registered: true }
            });
          }, 3000);
        },
        error: (err) => {
          console.error("Registration error:", err);
          this.errorMessage = err.error?.message || 'Error al registrarse';
          if (err.error) {
            console.log("Error details:", err.error);
          }
          this.isLoading = false;
        }
      });
    }
  }
}