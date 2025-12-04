import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseProgressComponent } from './course-progress.component';

describe('CourseProgressComponent', () => {
  let component: CourseProgressComponent;
  let fixture: ComponentFixture<CourseProgressComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CourseProgressComponent]
    });
    fixture = TestBed.createComponent(CourseProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
