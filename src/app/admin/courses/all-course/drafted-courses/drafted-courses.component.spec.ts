import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DraftedCoursesComponent } from './drafted-courses.component';

describe('DraftedCoursesComponent', () => {
  let component: DraftedCoursesComponent;
  let fixture: ComponentFixture<DraftedCoursesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DraftedCoursesComponent]
    });
    fixture = TestBed.createComponent(DraftedCoursesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
