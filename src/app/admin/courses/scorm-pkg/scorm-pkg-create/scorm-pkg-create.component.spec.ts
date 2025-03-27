import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScormPkgCreateComponent } from './scorm-pkg-create.component';

describe('ScormPkgCreateComponent', () => {
  let component: ScormPkgCreateComponent;
  let fixture: ComponentFixture<ScormPkgCreateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ScormPkgCreateComponent]
    });
    fixture = TestBed.createComponent(ScormPkgCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
