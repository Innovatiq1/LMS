import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSuperAdminComponent } from './edit-super-admin.component';

describe('EditSuperAdminComponent', () => {
  let component: EditSuperAdminComponent;
  let fixture: ComponentFixture<EditSuperAdminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditSuperAdminComponent]
    });
    fixture = TestBed.createComponent(EditSuperAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
