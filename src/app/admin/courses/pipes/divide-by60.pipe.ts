import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'divideBy60'
})
export class DivideBy60Pipe implements PipeTransform {

  transform(value: string): string {
    // Check if value is not empty and is in the "HH:mm" format
    if (value && value.includes(':')) {
      const timeParts = value.split(':');
      if (timeParts.length === 2) {
        const hours = parseInt(timeParts[0], 10);
        const minutes = parseInt(timeParts[1], 10);

        let result = '';
        
        if (hours > 0) {
          result += `${hours} hour${hours > 1 ? 's' : ''}`;
        }

        if (minutes > 0) {
          if (result.length > 0) {
            result += ' ';
          }
          result += `${minutes} minute${minutes > 1 ? 's' : ''}`;
        }

        return result;
      }
    }

    return value; // Return the original value if not in "HH:mm" format
  }

}
