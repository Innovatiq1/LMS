import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThridPartyFormComponent } from './thrid-party-form.component';

describe('ThridPartyFormComponent', () => {
  let component: ThridPartyFormComponent;
  let fixture: ComponentFixture<ThridPartyFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ThridPartyFormComponent]
    });
    fixture = TestBed.createComponent(ThridPartyFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
