import { Injectable } from '@angular/core';
import { NotificationService } from './notification';
import { AuthService } from './auth';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminNotificationService {

  constructor(
    private notificationService: NotificationService,
    private authService: AuthService
  ) { }

  notifyNewPayment(participation: any) {
    const adminIds = ['IZiPfokbW6XAUS0BpHTmCz95aVo1'];

    adminIds.forEach(adminId => {
      this.notificationService.sendNotification(
        adminId,
        'Nuevo pago pendiente',
        `El usuario ${participation.user?.username} ha realizado un pago para el reto "${participation.challenge?.title}"`,
        'admin_payment'
      ).subscribe({
        next: (response) => {
          console.log('Notificación de pago enviada al admin', response);
        },
        error: (err) => {
          console.error('Error al enviar notificación al admin', err);
        }
      });
    });
  }

  // Método adicional para notificar cuando se confirma un pago
  notifyPaymentConfirmation(participation: any) {
    this.notificationService.sendNotification(
      participation.userId,
      'Pago confirmado',
      `Tu pago para el reto "${participation.challenge?.title}" ha sido confirmado`,
      'payment'
    ).subscribe({
      next: () => {
        console.log('Notificación de confirmación enviada al usuario');
      },
      error: (err) => {
        console.error('Error al enviar notificación de confirmación', err);
      }
    });
  }
}