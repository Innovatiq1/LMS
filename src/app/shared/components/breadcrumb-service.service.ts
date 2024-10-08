import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BreadcrumbServiceService {

  constructor() { }

  private itemsSource = new BehaviorSubject<string[]>([]);
  private activeItemSource = new BehaviorSubject<string>('');

  items$ = this.itemsSource.asObservable();
  activeItem$ = this.activeItemSource.asObservable();

  setItems(items: string[]) {
    this.itemsSource.next(items);
    localStorage.setItem('breadcrumbs', JSON.stringify(items)); // Store in localStorage
  }
  
  setActiveItem(activeItem: string) {
    this.activeItemSource.next(activeItem);
    localStorage.setItem('activeBreadcrumb', JSON.stringify(activeItem)); // Store in localStorage
  }
}
