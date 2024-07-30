import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TraineesDashboardComponent } from './trainees-dashboard.component';

describe('TraineesDashboardComponent', () => {
  let component: TraineesDashboardComponent;
  let fixture: ComponentFixture<TraineesDashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TraineesDashboardComponent]
    });
    fixture = TestBed.createComponent(TraineesDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
