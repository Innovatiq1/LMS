import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleCustomizeComponent } from './role-customize.component';

describe('RoleCustomizeComponent', () => {
  let component: RoleCustomizeComponent;
  let fixture: ComponentFixture<RoleCustomizeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RoleCustomizeComponent]
    });
    fixture = TestBed.createComponent(RoleCustomizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
