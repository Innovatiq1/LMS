import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InstructorLeaveRequestComponent } from './leave-request.component';



describe('LeaveRequestComponent', () => {
  let component: InstructorLeaveRequestComponent;
  let fixture: ComponentFixture<InstructorLeaveRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InstructorLeaveRequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InstructorLeaveRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
