import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomizationExamAssessmentAlgorithmComponent } from './customization-exam-assessment-algorithm.component';

describe('CustomizationExamAssessmentAlgorithmComponent', () => {
  let component: CustomizationExamAssessmentAlgorithmComponent;
  let fixture: ComponentFixture<CustomizationExamAssessmentAlgorithmComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomizationExamAssessmentAlgorithmComponent]
    });
    fixture = TestBed.createComponent(CustomizationExamAssessmentAlgorithmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
