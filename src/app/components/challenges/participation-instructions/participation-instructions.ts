import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Challenge } from '../../../models/challenge.model';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-participation-instructions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './participation-instructions.html',
  styleUrls: ['./participation-instructions.scss']
})
export class ParticipationInstructions {
  @Input() challenge!: Challenge;
  nequiNumber: string = '3233890068';

  constructor(public authService: AuthService) {}

  confirmPayment() {
    // Implementa la lógica para confirmar el pago
    console.log('Payment confirmation initiated');
  }
}