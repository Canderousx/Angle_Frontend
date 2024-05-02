import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'base64Image',
  standalone: true
})
export class Base64ImagePipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): unknown {
    if(!value){
      return 'assets/images/defaultAvatar.png';
    }
    const matches = value.match(/^data:(.*?);base64,/);
    if (matches) {
      return value;
    } else {

      return `data:image/png;base64,${value}`;
    }
  }

}
