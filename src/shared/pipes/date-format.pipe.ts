import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateFormat',
  standalone: true
})
export class DateFormatPipe implements PipeTransform {

  checkIfPlural(value: number){
    if(value != 1){
      return true;
    }
    return false;
  }

  transform(value: any): string {
    if(value){
      const now = new Date();
      const date = new Date(value);
      const secondsBetween = Math.floor((now.getTime() - date.getTime()) / 1000);

      if(secondsBetween < 60){
        return `${secondsBetween} seconds ago`;
      }
      if(secondsBetween < 3600){
        return `${Math.floor(secondsBetween / 60)} minutes ago`;
      }
      if(secondsBetween < 86400){

        return `${Math.floor(secondsBetween / 3600)} hours ago`;
      }
      if(secondsBetween < 2592000){
        return `${Math.floor(secondsBetween / 86400)} days ago`;
      }
      if(secondsBetween < 31104000){
        return `${Math.floor(secondsBetween / 2592000)} months ago`;
      }else{
        return `${Math.floor(secondsBetween / 31104000)} years ago`;
      }

    }
    return "pipe-error//null value";
  }

}
