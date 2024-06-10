import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerificationListComponent } from './verification-list.component';

describe('VerificationListComponent', () => {
  let component: VerificationListComponent;
  let fixture: ComponentFixture<VerificationListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VerificationListComponent]
    });
    fixture = TestBed.createComponent(VerificationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
