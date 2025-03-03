import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamTrianeesComponent } from './exam-trianees.component';

describe('ExamTrianeesComponent', () => {
  let component: ExamTrianeesComponent;
  let fixture: ComponentFixture<ExamTrianeesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExamTrianeesComponent]
    });
    fixture = TestBed.createComponent(ExamTrianeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
