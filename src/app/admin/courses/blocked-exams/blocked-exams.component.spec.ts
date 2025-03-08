import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockedExamsComponent } from './blocked-exams.component';

describe('BlockedExamsComponent', () => {
  let component: BlockedExamsComponent;
  let fixture: ComponentFixture<BlockedExamsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BlockedExamsComponent]
    });
    fixture = TestBed.createComponent(BlockedExamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
