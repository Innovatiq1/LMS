import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'truncate'
})
export class TruncatePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string, limit: number): string {
    // Convert the HTML to a plain string
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = value;
    const text = tempDiv.textContent || tempDiv.innerText || '';

    // Truncate the text
    if (text.length <= limit) {
      return text;
    }

    return text.substring(0, limit) + '...';
  }
  // transform(value: string, limit: number): string {
  //   if (value?.length <= limit) {
  //     return value;
  //   }

   
  //   return value?.substring(0, limit) + '...';
  // }
}
