import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateMeetingPlatformComponent } from './update-meeting-platform.component';

describe('UpdateDropDownComponent', () => {
  let component: UpdateMeetingPlatformComponent;
  let fixture: ComponentFixture<UpdateMeetingPlatformComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateMeetingPlatformComponent]
    });
    fixture = TestBed.createComponent(UpdateMeetingPlatformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
