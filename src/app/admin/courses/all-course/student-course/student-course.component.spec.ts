import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentCourseComponent } from './student-course.component';

describe('StudentCourseComponent', () => {
  let component: StudentCourseComponent;
  let fixture: ComponentFixture<StudentCourseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StudentCourseComponent]
    });
    fixture = TestBed.createComponent(StudentCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
