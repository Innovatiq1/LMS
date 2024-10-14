import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZoomKeysComponent } from './zoom-keys.component';

describe('ZoomKeysComponent', () => {
  let component: ZoomKeysComponent;
  let fixture: ComponentFixture<ZoomKeysComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ZoomKeysComponent]
    });
    fixture = TestBed.createComponent(ZoomKeysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
