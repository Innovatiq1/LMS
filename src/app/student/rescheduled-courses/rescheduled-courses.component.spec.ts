import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RescheduledCoursesComponent } from './rescheduled-courses.component';

describe('RescheduledCoursesComponent', () => {
  let component: RescheduledCoursesComponent;
  let fixture: ComponentFixture<RescheduledCoursesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RescheduledCoursesComponent]
    });
    fixture = TestBed.createComponent(RescheduledCoursesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
