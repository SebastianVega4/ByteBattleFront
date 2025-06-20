import { Component, OnInit } from '@angular/core';
import { ParticipationService } from '../../../services/participation';
import { Participation } from '../../../models';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-payment-verification',
  templateUrl: './payment-verification.html',
  styleUrls: ['./payment-verification.scss']
})
export class PaymentVerificationComponent implements OnInit {
  pendingPayments: Participation[] = [];
  isLoading = true;
  displayedColumns: string[] = ['user', 'challenge', 'date', 'amount', 'actions'];

  constructor(
    private participationService: ParticipationService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadPendingPayments();
  }

  loadPendingPayments() {
    this.isLoading = true;
    this.participationService.getParticipationsByChallenge('').subscribe({
      next: (participations) => {
        this.pendingPayments = participations.filter(p => p.paymentStatus === 'pending');
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading pending payments', err);
        this.isLoading = false;
        this.snackBar.open('Error al cargar pagos pendientes', 'Cerrar', { duration: 3000 });
      }
    });
  }

  confirmPayment(participation: Participation) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmar Pago',
        message: `¿Has verificado el pago de ${participation.user?.username} para el reto "${participation.challenge?.title}"?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.participationService.confirmPayment(participation.id).subscribe({
          next: () => {
            this.pendingPayments = this.pendingPayments.filter(p => p.id !== participation.id);
            this.snackBar.open('Pago confirmado correctamente', 'Cerrar', { duration: 3000 });
          },
          error: (err) => {
            console.error('Error confirming payment', err);
            this.snackBar.open('Error al confirmar pago', 'Cerrar', { duration: 3000 });
          }
        });
      }
    });
  }

  rejectPayment(participation: Participation) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Rechazar Pago',
        message: `¿Estás seguro que deseas rechazar el pago de ${participation.user?.username} para el reto "${participation.challenge?.title}"?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.participationService.rejectPayment(participation.id).subscribe({
          next: () => {
            this.pendingPayments = this.pendingPayments.filter(p => p.id !== participation.id);
            this.snackBar.open('Pago rechazado correctamente', 'Cerrar', { duration: 3000 });
          },
          error: (err) => {
            console.error('Error rejecting payment', err);
            this.snackBar.open('Error al rechazar pago', 'Cerrar', { duration: 3000 });
          }
        });
      }
    });
  }
}