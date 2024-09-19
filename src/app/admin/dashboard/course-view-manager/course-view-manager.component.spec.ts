import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseViewManagerComponent } from './course-view-manager.component';

describe('CourseViewManagerComponent', () => {
  let component: CourseViewManagerComponent;
  let fixture: ComponentFixture<CourseViewManagerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CourseViewManagerComponent]
    });
    fixture = TestBed.createComponent(CourseViewManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
