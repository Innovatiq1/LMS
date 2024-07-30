import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditUpdateDashboardComponent } from './edit-update-dashboard.component';

describe('EditUpdateDashboardComponent', () => {
  let component: EditUpdateDashboardComponent;
  let fixture: ComponentFixture<EditUpdateDashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditUpdateDashboardComponent]
    });
    fixture = TestBed.createComponent(EditUpdateDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
