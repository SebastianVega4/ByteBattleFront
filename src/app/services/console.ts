import { Injectable } from '@angular/core';
import { ConsoleMessage } from '../models/console-message.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConsoleService {
  private messagesSubject = new BehaviorSubject<ConsoleMessage[]>([]);
  messages$ = this.messagesSubject.asObservable();
  private maxMessages = 50; // Límite de mensajes en historial

  constructor() {
    // Mensaje inicial
    this.addMessage('Sistema inicializado', 'system');
  }

  addMessage(message: string, type: 'system' | 'success' | 'error' | 'warning' | 'info' = 'info', action?: string) {
    const newMessage: ConsoleMessage = {
      id: Date.now().toString(),
      timestamp: new Date(),
      message,
      type,
      action
    };

    const currentMessages = this.messagesSubject.value;
    const updatedMessages = [...currentMessages, newMessage].slice(-this.maxMessages);
    this.messagesSubject.next(updatedMessages);
  }

  clearConsole() {
    this.messagesSubject.next([]);
    this.addMessage('Consola limpiada', 'system');
  }
}