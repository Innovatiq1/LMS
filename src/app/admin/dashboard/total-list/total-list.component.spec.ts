import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalListComponent } from './total-list.component';

describe('TotalListComponent', () => {
  let component: TotalListComponent;
  let fixture: ComponentFixture<TotalListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TotalListComponent]
    });
    fixture = TestBed.createComponent(TotalListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
