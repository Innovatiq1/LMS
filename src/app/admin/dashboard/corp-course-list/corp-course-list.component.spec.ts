import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorpCourseListComponent } from './corp-course-list.component';

describe('CorpCourseListComponent', () => {
  let component: CorpCourseListComponent;
  let fixture: ComponentFixture<CorpCourseListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CorpCourseListComponent]
    });
    fixture = TestBed.createComponent(CorpCourseListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
