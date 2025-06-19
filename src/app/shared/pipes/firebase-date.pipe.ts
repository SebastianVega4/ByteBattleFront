import { Pipe, PipeTransform } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'firebaseDate'
})
export class FirebaseDatePipe implements PipeTransform {
  constructor(private datePipe: DatePipe) {}

  transform(value: Date | Timestamp | null | undefined, format?: string): string | null {
    if (!value) return null;
    
    const date = value instanceof Timestamp ? value.toDate() : value;
    return this.datePipe.transform(date, format);
  }
}