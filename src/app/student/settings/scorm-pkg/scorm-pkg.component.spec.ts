import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScormPkgComponent } from './scorm-pkg.component';

describe('ScormPkgComponent', () => {
  let component: ScormPkgComponent;
  let fixture: ComponentFixture<ScormPkgComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ScormPkgComponent]
    });
    fixture = TestBed.createComponent(ScormPkgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
