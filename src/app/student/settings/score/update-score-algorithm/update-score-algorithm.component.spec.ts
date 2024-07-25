import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateScoreAlgorithmComponent } from './update-score-algorithm.component';

describe('UpdateScoreAlgorithmComponent', () => {
  let component: UpdateScoreAlgorithmComponent;
  let fixture: ComponentFixture<UpdateScoreAlgorithmComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateScoreAlgorithmComponent]
    });
    fixture = TestBed.createComponent(UpdateScoreAlgorithmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
