import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleDailogComponent } from './role-dailog.component';

describe('RoleDailogComponent', () => {
  let component: RoleDailogComponent;
  let fixture: ComponentFixture<RoleDailogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RoleDailogComponent]
    });
    fixture = TestBed.createComponent(RoleDailogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
