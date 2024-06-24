import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PassingCriteriaComponent } from './passing-criteria.component';

describe('PassingCriteriaComponent', () => {
  let component: PassingCriteriaComponent;
  let fixture: ComponentFixture<PassingCriteriaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PassingCriteriaComponent]
    });
    fixture = TestBed.createComponent(PassingCriteriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
