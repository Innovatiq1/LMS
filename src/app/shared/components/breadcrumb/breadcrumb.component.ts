import { Component, Input } from '@angular/core';
import { AuthService, Role } from '@core';
import { AuthenService } from '@core/service/authen.service';
import { Location } from '@angular/common';
import { AppConstants } from '@shared/constants/app.constants';
import { BreadcrumbServiceService } from '../breadcrumb-service.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
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
    private authService: AuthService,public router: Router,public activatedRoute: ActivatedRoute,
    private authenticationService: AuthenService,private breadcrumbService: BreadcrumbServiceService,
    private _location: Location
  ) {
    this.url = this.homeURL();
  }

  updateBreadcrumbs() {
    this.items = JSON.parse(localStorage.getItem('breadcrumbs') || '[]');
    this.active_item = JSON.parse(localStorage.getItem('activeBreadcrumb') || 'Create Trainee');
  
    this.breadcrumbService.setItems(this.items);
    this.breadcrumbService.setActiveItem(this.active_item);
  }  


  ngOnInit(): void {
    this.updateBreadcrumbs(); // Ensure breadcrumbs are updated immediately
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
      this.updateBreadcrumbs(); // Update on every route change
    });
  }

  homeURL():string {
    let url = '/dashboard/dashboard';
    return url;
  }

  backClicked() {
    this._location.back();
  }


  ngAfterViewInit(): void {
    const storedItems = localStorage.getItem('breadcrumbs');
    const storedActiveItem = localStorage.getItem('activeBreadcrumb');

    if (storedItems) {
      const items = JSON.parse(storedItems);
      this.breadcrumbService.setItems(items);
    } else {
      this.setDefaultBreadcrumbs();
    }

    if (storedActiveItem) {
      const activeItem = JSON.parse(storedActiveItem);
      this.breadcrumbService.setActiveItem(activeItem);
    }

    this.breadcrumbService.items$.subscribe(items => {
      this.items = items.map(item => this.removeLeadingSlash(item));
    });
    
    this.breadcrumbService.activeItem$.subscribe(activeItem => {
      this.active_item = this.removeLeadingSlash(activeItem);
    });
  }

 setDefaultBreadcrumbs() {
  const currentRoute = this.activatedRoute.snapshot; 
  const urlSegments = currentRoute.url.map(segment => segment.path);
  
  if (urlSegments.length > 0) {
    const defaultBreadcrumb = urlSegments.join(' / '); 

    this.breadcrumbService.setItems([defaultBreadcrumb]);
    this.breadcrumbService.setActiveItem(urlSegments[urlSegments.length - 1]);
  }
}

  removeLeadingSlash(url: string): string {
    const parts = url.split('/');
    return parts.length > 1 ? parts.slice(1).join('/') : url;
  }
}
