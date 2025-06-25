import { Pipe, PipeTransform } from '@angular/core';
import { formatDate } from '../utils/date.utils';

@Pipe({
  name: 'firebaseDate',
  standalone: true
})
export class FirebaseDatePipe implements PipeTransform {
  transform(value: any): string {
    if (!value) return '';

    let date: Date;

    // Maneja Timestamp de Firebase
    if (typeof value.toDate === 'function') {
      date = value.toDate();
    }
    // Maneja objetos Date estándar
    else if (value instanceof Date) {
      date = value;
    }
    // Maneja números (timestamp)
    else if (typeof value === 'number') {
      date = new Date(value);
    }
    // Maneja strings ISO
    else if (typeof value === 'string') {
      date = new Date(value);
    }
    // Valor no reconocido
    else {
      console.warn('Tipo de fecha no reconocido:', value);
      return '';
    }

    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
