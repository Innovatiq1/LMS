import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainerAnalyticsDashboardComponent } from './trainer-analytics-dashboard.component';

describe('TrainerAnalyticsDashboardComponent', () => {
  let component: TrainerAnalyticsDashboardComponent;
  let fixture: ComponentFixture<TrainerAnalyticsDashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TrainerAnalyticsDashboardComponent]
    });
    fixture = TestBed.createComponent(TrainerAnalyticsDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
