import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TutorialQuestionsComponent } from './tutorial-questions.component';

describe('TutorialQuestionsComponent', () => {
  let component: TutorialQuestionsComponent;
  let fixture: ComponentFixture<TutorialQuestionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TutorialQuestionsComponent]
    });
    fixture = TestBed.createComponent(TutorialQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
