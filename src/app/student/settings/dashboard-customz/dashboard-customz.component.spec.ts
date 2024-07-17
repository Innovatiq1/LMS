import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardCustomzComponent } from './dashboard-customz.component';

describe('DashboardCustomzComponent', () => {
  let component: DashboardCustomzComponent;
  let fixture: ComponentFixture<DashboardCustomzComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardCustomzComponent]
    });
    fixture = TestBed.createComponent(DashboardCustomzComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
