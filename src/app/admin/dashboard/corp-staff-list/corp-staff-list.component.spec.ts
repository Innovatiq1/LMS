import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorpStaffListComponent } from './corp-staff-list.component';

describe('CorpStaffListComponent', () => {
  let component: CorpStaffListComponent;
  let fixture: ComponentFixture<CorpStaffListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CorpStaffListComponent]
    });
    fixture = TestBed.createComponent(CorpStaffListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
