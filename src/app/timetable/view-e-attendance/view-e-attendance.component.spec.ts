import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewEAttendanceComponent } from './view-e-attendance.component';

describe('ViewEAttendanceComponent', () => {
  let component: ViewEAttendanceComponent;
  let fixture: ComponentFixture<ViewEAttendanceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewEAttendanceComponent]
    });
    fixture = TestBed.createComponent(ViewEAttendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
