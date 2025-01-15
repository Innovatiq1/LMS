import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZoomDeleteComponent } from './zoom-delete.component';

describe('ZoomDeleteComponent', () => {
  let component: ZoomDeleteComponent;
  let fixture: ComponentFixture<ZoomDeleteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ZoomDeleteComponent]
    });
    fixture = TestBed.createComponent(ZoomDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
