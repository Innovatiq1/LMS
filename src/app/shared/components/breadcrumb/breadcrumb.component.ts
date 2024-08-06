import { Component, Input } from '@angular/core';
import { AuthService, Role } from '@core';
import { AuthenService } from '@core/service/authen.service';
import { Location } from '@angular/common';
import { AppConstants } from '@shared/constants/app.constants';
@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss'],
})
export class BreadcrumbComponent {
  // @Input()
  // title!: string;
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
