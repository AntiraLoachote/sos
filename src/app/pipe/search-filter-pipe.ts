import { Injectable, Pipe, PipeTransform } from '@angular/core';

@Pipe({
 name: 'searchfilter'
})

@Injectable()
export class SearchFilterPipe implements PipeTransform {

 transform(items: any[], value: string): any {
  if(!value) Object.assign([], items); //when nothing has typed
  return Object.assign([], items).filter(
     item => item.name.toLowerCase().indexOf(value.toLowerCase()) > -1
  )
}

}