import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterName'
})

export class FilterNamePipe implements PipeTransform {
  transform(array: Array<{name: string, url: string}>, filter: string): any {
    if (!array || !filter || !filter.length) {
      return array;
    }
    return array.filter((e) => e.name.toLowerCase().indexOf(filter.toLowerCase()) > -1);
  }
}
