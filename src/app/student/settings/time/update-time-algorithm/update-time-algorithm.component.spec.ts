import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateTimeAlgorithmComponent } from './update-time-algorithm.component';

describe('UpdateTimeAlgorithmComponent', () => {
  let component: UpdateTimeAlgorithmComponent;
  let fixture: ComponentFixture<UpdateTimeAlgorithmComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateTimeAlgorithmComponent]
    });
    fixture = TestBed.createComponent(UpdateTimeAlgorithmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
