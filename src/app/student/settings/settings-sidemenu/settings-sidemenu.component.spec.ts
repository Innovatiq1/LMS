import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsSidemenuComponent } from './settings-sidemenu.component';

describe('SettingsSidemenuComponent', () => {
  let component: SettingsSidemenuComponent;
  let fixture: ComponentFixture<SettingsSidemenuComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SettingsSidemenuComponent]
    });
    fixture = TestBed.createComponent(SettingsSidemenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
