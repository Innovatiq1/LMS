import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateFileSizeComponent } from './update-file-size.component';

describe('UpdateFileSizeComponent', () => {
  let component: UpdateFileSizeComponent;
  let fixture: ComponentFixture<UpdateFileSizeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateFileSizeComponent]
    });
    fixture = TestBed.createComponent(UpdateFileSizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
