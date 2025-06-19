import { Pipe, PipeTransform } from '@angular/core';
import { formatDate } from '../utils/date.utils';

@Pipe({
  name: 'firebaseDate'
})
export class FirebaseDatePipe implements PipeTransform {
  transform(value: any): string {
    if (value && value.seconds) {
      return formatDate(new Date(value.seconds * 1000));
    }
    return formatDate(value);
  }
}