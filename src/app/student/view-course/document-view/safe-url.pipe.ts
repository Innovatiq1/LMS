import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
@Pipe({
  name: 'safeUrl'
})
export class SafeUrlPipe implements PipeTransform {
//implements PipeTransform
  // transform(value: unknown, ...args: unknown[]): unknown {
  //   return null;
  // }
  constructor(private sanitizer: DomSanitizer) {}

  transform(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

}
