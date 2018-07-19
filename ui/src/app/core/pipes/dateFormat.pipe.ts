import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
  name: 'dateFormatPipe'
})
export class DateFormatPipe implements PipeTransform {
  transform(value: any, args: string[]): any {
    if (value) {
      var date = value instanceof Date ? value : new Date(value);
      return this.getMonthString(date.getMonth()) + ' ' + date.getFullYear();
    }
  }

  getMonthString(number: number): string {
    switch(number){
      case 1: return "Enero";
      case 2: return "Febrero";
      case 3: return "Marzo";
      case 4: return "Abril";
      case 5: return "Mayo";
      case 6: return "Junio";
      case 7: return "Julio";
      case 8: return "Agosto";
      case 9: return "Septiembre";
      case 10: return "Octubre";
      case 11: return "Noviembre";
      case 12: return "Diciembre";
    }
  }
}
