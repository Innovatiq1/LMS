import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomizationExamTimerComponent } from './customization-exam-timer.component';

describe('CustomizationExamTimerComponent', () => {
  let component: CustomizationExamTimerComponent;
  let fixture: ComponentFixture<CustomizationExamTimerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomizationExamTimerComponent]
    });
    fixture = TestBed.createComponent(CustomizationExamTimerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
