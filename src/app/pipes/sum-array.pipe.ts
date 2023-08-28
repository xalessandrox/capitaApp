import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sumArray'
})
export class SumArrayPipe implements PipeTransform {

  transform(value: Array<any>, ...args: unknown[]): number | any {
    if (value instanceof Array) {
      let total = 0;
      value.forEach((invoice) => {
        total += invoice.total;
      })
      return total;
    }

  }

}
