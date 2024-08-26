import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllStaffComponent } from './all-staff.component';

describe('AllStaffComponent', () => {
  let component: AllStaffComponent;
  let fixture: ComponentFixture<AllStaffComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AllStaffComponent]
    });
    fixture = TestBed.createComponent(AllStaffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
