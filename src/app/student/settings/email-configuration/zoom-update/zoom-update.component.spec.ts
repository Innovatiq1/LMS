import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZoomUpdateComponent } from './zoom-update.component';

describe('ZoomUpdateComponent', () => {
  let component: ZoomUpdateComponent;
  let fixture: ComponentFixture<ZoomUpdateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ZoomUpdateComponent]
    });
    fixture = TestBed.createComponent(ZoomUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
