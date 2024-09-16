import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CeoDashboardComponent } from './ceo-dashboard.component';

describe('CeoDashboardComponent', () => {
  let component: CeoDashboardComponent;
  let fixture: ComponentFixture<CeoDashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CeoDashboardComponent]
    });
    fixture = TestBed.createComponent(CeoDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
