import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-page404',
  templateUrl: './page404.component.html',
  styleUrls: ['./page404.component.scss'],
})
export class Page404Component {
  tmsUrl: boolean;
  lmsUrl: boolean;
  constructor(private router: Router) {
    let urlPath = this.router.url.split('/')
    this.tmsUrl = urlPath.includes('TMS');
    this.lmsUrl = urlPath.includes('LMS');

    // constructor
  }
}
