import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorpManagerListComponent } from './corp-manager-list.component';

describe('CorpManagerListComponent', () => {
  let component: CorpManagerListComponent;
  let fixture: ComponentFixture<CorpManagerListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CorpManagerListComponent]
    });
    fixture = TestBed.createComponent(CorpManagerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
