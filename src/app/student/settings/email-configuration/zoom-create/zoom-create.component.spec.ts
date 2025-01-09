import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZoomCreateComponent } from './zoom-create.component';

describe('ZoomCreateComponent', () => {
  let component: ZoomCreateComponent;
  let fixture: ComponentFixture<ZoomCreateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ZoomCreateComponent]
    });
    fixture = TestBed.createComponent(ZoomCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
