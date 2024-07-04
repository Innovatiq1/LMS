import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingpassLoginPageComponent } from './singpass-login-page.component';

describe('SingpassLoginPageComponent', () => {
  let component: SingpassLoginPageComponent;
  let fixture: ComponentFixture<SingpassLoginPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SingpassLoginPageComponent]
    });
    fixture = TestBed.createComponent(SingpassLoginPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
