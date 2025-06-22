import { Injectable } from '@angular/core';
import { NotificationService } from './notification';
import { AuthService } from './auth';

@Injectable({
  providedIn: 'root'
})
export class AdminNotificationService {

  constructor(
    private notificationService: NotificationService,
    private authService: AuthService
  ) {}

  notifyNewPayment(participation: any) {
    // Obtener todos los admins y notificarles
    // Esto es un ejemplo, deberías implementar la lógica para obtener admins
    const adminIds = ['IZiPfokbW6XAUS0BpHTmCz95aVo1'];
    
    adminIds.forEach(adminId => {
      this.notificationService.sendNotification(
        adminId,
        'Nuevo pago pendiente',
        `El usuario ${participation.user?.username} ha realizado un pago para el reto "${participation.challenge?.title}"`,
        'admin_payment'
      );
    });
  }
}