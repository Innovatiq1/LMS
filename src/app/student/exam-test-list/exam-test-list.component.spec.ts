import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamTestListComponent } from './exam-test-list.component';

describe('ExamTestListComponent', () => {
  let component: ExamTestListComponent;
  let fixture: ComponentFixture<ExamTestListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExamTestListComponent]
    });
    fixture = TestBed.createComponent(ExamTestListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
