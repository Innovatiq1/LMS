import { Component, Input } from '@angular/core';
import { AuthService, Role } from '@core';
import { AuthenService } from '@core/service/authen.service';
import { Location } from '@angular/common';
import { AppConstants } from '@shared/constants/app.constants';

@Component({
  selector: 'app-static-breadcrumb',
  templateUrl: './static-breadcrumb.component.html',
  styleUrls: ['./static-breadcrumb.component.scss']
})
export class StaticBreadcrumbComponent {

  @Input()
  items!: string[];
  @Input()
  active_item!: string;
  url: string = '/dashboard/dashboard';


  constructor(
    private authService: AuthService,
    private authenticationService: AuthenService,
    private _location: Location
  ) {
    this.url = this.homeURL();
  }

  homeURL():string {
    let url = '/dashboard/dashboard';
    return url;
  }

  backClicked() {
    this._location.back();
  }
}
