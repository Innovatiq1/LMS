import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagersPieChartComponent } from './managers-pie-chart.component';

describe('ManagersPieChartComponent', () => {
  let component: ManagersPieChartComponent;
  let fixture: ComponentFixture<ManagersPieChartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManagersPieChartComponent]
    });
    fixture = TestBed.createComponent(ManagersPieChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
