import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogModule, MatDialogTitle } from '@angular/material/dialog';
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
import { MatSpinner } from '@angular/material/progress-spinner';


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
    MatDialogModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatSpinner
  ]
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
      participationCost: [1000, [Validators.required, Validators.min(1000)]]
    });
  }

  ngOnInit() {
    if (this.isEditMode && this.data.challenge) {
      this.challengeForm.patchValue({
        title: this.data.challenge.title,
        description: this.data.challenge.description,
        startDate: new Date(this.data.challenge.startDate),
        endDate: new Date(this.data.challenge.endDate),
        participationCost: this.data.challenge.participationCost
      });
    }
  }

  onSubmit() {
  if (this.challengeForm.invalid) return;

  this.isLoading = true;
  const formValue = this.challengeForm.value;
  const challengeData = {
    ...formValue,
    startDate: formValue.startDate.toISOString(),
    endDate: formValue.endDate.toISOString()
  };

    if (this.isEditMode && this.data.challenge) {
      // Actualizar reto existente
      this.challengeService.updateChallenge(this.data.challenge.id, challengeData).subscribe({
        next: () => {
          this.snackBar.open('Reto actualizado correctamente', 'Cerrar', { duration: 3000 });
          this.dialogRef.close(true);
        },
        error: (err) => {
          console.error('Error updating challenge', err);
          this.snackBar.open('Error al actualizar reto', 'Cerrar', { duration: 3000 });
          this.isLoading = false;
        }
      });
    } else {
      // Crear nuevo reto
      this.challengeService.createChallenge(challengeData).subscribe({
        next: () => {
          this.snackBar.open('Reto creado correctamente', 'Cerrar', { duration: 3000 });
          this.dialogRef.close(true);
        },
        error: (err) => {
          console.error('Error creating challenge', err);
          this.snackBar.open('Error al crear reto', 'Cerrar', { duration: 3000 });
          this.isLoading = false;
        }
      });
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}