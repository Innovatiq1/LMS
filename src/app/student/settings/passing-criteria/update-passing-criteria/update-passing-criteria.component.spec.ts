import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatePassingCriteriaComponent } from './update-passing-criteria.component';

describe('UpdatePassingCriteriaComponent', () => {
  let component: UpdatePassingCriteriaComponent;
  let fixture: ComponentFixture<UpdatePassingCriteriaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdatePassingCriteriaComponent]
    });
    fixture = TestBed.createComponent(UpdatePassingCriteriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
