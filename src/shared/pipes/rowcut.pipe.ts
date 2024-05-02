import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'rowcut',
  standalone: true
})
export class RowcutPipe implements PipeTransform {

  transform(value: string,limit: number): unknown {
    if(value.length <= limit){
      return value
    }
    return value.substring(0,limit - 3)+"...";
  }

}
