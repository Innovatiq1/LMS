import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPackageComponent } from './edit-package.component';

describe('EditPackageComponent', () => {
  let component: EditPackageComponent;
  let fixture: ComponentFixture<EditPackageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditPackageComponent]
    });
    fixture = TestBed.createComponent(EditPackageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
