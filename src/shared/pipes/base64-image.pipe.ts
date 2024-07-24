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
    const mimeType = this.detectMimeType(value);
    if(mimeType){
      return "data:"+mimeType+";base64,"+value;
    }
      return value;

  }

  private detectMimeType(base64: string): string | null {
    if (base64.startsWith('/9j/')) {
      return 'image/jpeg';
    } else if (base64.startsWith('UklGR')) {
      return 'image/webp';
    } else if (base64.startsWith('iVBORw0KGgo')) {
      return 'image/png';
    } else {
      return null;
    }
  }

}
