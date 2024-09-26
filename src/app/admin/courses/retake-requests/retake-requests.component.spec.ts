import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RetakeRequestsComponent } from './retake-requests.component';

describe('RetakeRequestsComponent', () => {
  let component: RetakeRequestsComponent;
  let fixture: ComponentFixture<RetakeRequestsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RetakeRequestsComponent]
    });
    fixture = TestBed.createComponent(RetakeRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
