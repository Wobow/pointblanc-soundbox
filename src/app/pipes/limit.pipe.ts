import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'limit'
})

export class LimitPipe implements PipeTransform {
  transform(value: Array<any>, limit: number, offset: number): any {
    if (!value) {
      return;
    }
    return value.slice(offset || 0, limit);
  }
}
