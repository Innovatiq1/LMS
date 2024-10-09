import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaticBreadcrumbComponent } from './static-breadcrumb.component';

describe('StaticBreadcrumbComponent', () => {
  let component: StaticBreadcrumbComponent;
  let fixture: ComponentFixture<StaticBreadcrumbComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StaticBreadcrumbComponent]
    });
    fixture = TestBed.createComponent(StaticBreadcrumbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
