import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateDropDownComponent } from './update-drop-down.component';

describe('UpdateDropDownComponent', () => {
  let component: UpdateDropDownComponent;
  let fixture: ComponentFixture<UpdateDropDownComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateDropDownComponent]
    });
    fixture = TestBed.createComponent(UpdateDropDownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
