import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartCourseViewComponent } from './chart-course-view.component';

describe('ChartCourseViewComponent', () => {
  let component: ChartCourseViewComponent;
  let fixture: ComponentFixture<ChartCourseViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChartCourseViewComponent]
    });
    fixture = TestBed.createComponent(ChartCourseViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
