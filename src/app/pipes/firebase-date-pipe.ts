import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'firebaseDate'
})
export class FirebaseDatePipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
