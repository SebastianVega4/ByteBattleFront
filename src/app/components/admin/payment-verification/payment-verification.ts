import { Component } from '@angular/core';
import { ParticipationService } from '../../../services/participation';
import { Participation } from '../../../models';

@Component({
  selector: 'app-payment-verification',
  templateUrl: './payment-verification.html',
  styleUrls: ['./payment-verification.scss']
})
export class PaymentVerificationComponent {
  pendingPayments: Participation[] = [];
  isLoading = true;

  constructor(private participationService: ParticipationService) {}

  ngOnInit() {
    this.loadPendingPayments();
  }

  loadPendingPayments() {
    this.isLoading = true;
    // In a real app, this would come from the admin service
    // This is a mock implementation
    this.participationService.getParticipationsByChallenge('1').subscribe({
      next: (participations) => {
        this.pendingPayments = participations.filter(p => p.paymentStatus === 'pending');
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading pending payments', err);
        this.isLoading = false;
      }
    });
  }

  confirmPayment(participationId: string) {
    this.participationService.confirmPayment(participationId).subscribe({
      next: () => {
        this.pendingPayments = this.pendingPayments.filter(p => p.id !== participationId);
      },
      error: (err) => {
        console.error('Error confirming payment', err);
      }
    });
  }
}