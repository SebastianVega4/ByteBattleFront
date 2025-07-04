import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ChallengeService } from '../../../services/challenge';
import { Challenge } from '../../../models';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatNativeDateModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-challenge-form-dialog',
  templateUrl: './challenge-form-dialog.html',
  styleUrls: ['./challenge-form-dialog.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDialogModule
  ],
  providers: [provideNativeDateAdapter()] // Añade este provider
})
export class ChallengeFormDialogComponent implements OnInit {
  challengeForm: FormGroup;
  isEditMode = false;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ChallengeFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { challenge?: Challenge },
    private challengeService: ChallengeService,
    private snackBar: MatSnackBar
  ) {
    this.isEditMode = !!data?.challenge;
    this.challengeForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
      participationCost: [1000, [Validators.required, Validators.min(1000)]],
      linkChallenge: ['']
    });
  }

  ngOnInit() {
    if (this.isEditMode && this.data.challenge) {
      const challenge = this.data.challenge;
      this.challengeForm.patchValue({
        title: challenge.title,
        description: challenge.description,
        startDate: this.convertFirebaseDate(challenge.startDate),
        endDate: this.convertFirebaseDate(challenge.endDate),
        participationCost: challenge.participationCost,
        linkChallenge: challenge.linkChallenge
      });
    }
  }

  private convertFirebaseDate(date: any): Date | null {
    if (!date) return null;
    if (date?.toDate) return date.toDate();
    if (date?.seconds) return new Date(date.seconds * 1000);
    return new Date(date);
  }

  onSubmit() {
    if (this.challengeForm.invalid) return;

    this.isLoading = true;
    const formValue = this.challengeForm.value;
    
    // Asegurarnos de que las fechas están en formato correcto
    const challengeData = {
      ...formValue,
      startDate: formValue.startDate?.toISOString(),
      endDate: formValue.endDate?.toISOString()
    };

    if (this.isEditMode && this.data.challenge?.id) {
      this.challengeService.updateChallenge(this.data.challenge.id, challengeData).subscribe({
        next: () => {
          this.snackBar.open('Reto actualizado correctamente', 'Cerrar', { duration: 3000 });
          this.dialogRef.close(true);
        },
        error: (err) => {
          console.error('Error updating challenge', err);
          this.snackBar.open('Error al actualizar reto: ' + (err.error?.message || err.message), 'Cerrar', { duration: 5000 });
          this.isLoading = false;
        }
      });
    } else {
      this.challengeService.createChallenge(challengeData).subscribe({
        next: () => {
          this.snackBar.open('Reto creado correctamente', 'Cerrar', { duration: 3000 });
          this.dialogRef.close(true);
        },
        error: (err) => {
          console.error('Error creating challenge', err);
          this.snackBar.open('Error al crear reto: ' + (err.error?.message || err.message), 'Cerrar', { duration: 5000 });
          this.isLoading = false;
        }
      });
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}