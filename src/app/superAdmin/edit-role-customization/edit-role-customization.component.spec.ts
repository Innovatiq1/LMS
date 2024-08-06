import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditRoleCustomizationComponent } from './edit-role-customization.component';

describe('EditRoleCustomizationComponent', () => {
  let component: EditRoleCustomizationComponent;
  let fixture: ComponentFixture<EditRoleCustomizationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditRoleCustomizationComponent]
    });
    fixture = TestBed.createComponent(EditRoleCustomizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
