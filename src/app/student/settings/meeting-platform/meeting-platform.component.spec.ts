import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingPlatformComponent } from './meeting-platform.component';

describe('DropDownComponent', () => {
  let component: MeetingPlatformComponent;
  let fixture: ComponentFixture<MeetingPlatformComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MeetingPlatformComponent]
    });
    fixture = TestBed.createComponent(MeetingPlatformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
