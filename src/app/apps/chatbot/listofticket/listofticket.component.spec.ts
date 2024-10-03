import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListofticketComponent } from './listofticket.component';

describe('ListofticketComponent', () => {
  let component: ListofticketComponent;
  let fixture: ComponentFixture<ListofticketComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListofticketComponent]
    });
    fixture = TestBed.createComponent(ListofticketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
