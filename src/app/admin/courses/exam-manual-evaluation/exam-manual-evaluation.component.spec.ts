import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamManualEvaluationComponent } from './exam-manual-evaluation.component';

describe('ExamManualEvaluationComponent', () => {
  let component: ExamManualEvaluationComponent;
  let fixture: ComponentFixture<ExamManualEvaluationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExamManualEvaluationComponent]
    });
    fixture = TestBed.createComponent(ExamManualEvaluationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
