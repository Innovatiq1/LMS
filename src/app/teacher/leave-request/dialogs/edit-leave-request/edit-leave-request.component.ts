import { Component,Inject } from '@angular/core';
import { LeaveRequest } from '../../leave-request.model';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { InstructorLeaveRequestService } from '../../leave-request.service';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { CourseService } from '@core/service/course.service';
import Swal from 'sweetalert2';
import { ClassService } from 'app/admin/schedule-class/class.service';


export interface DialogData {
  id: number;
  action: string;
  leaveRequest: LeaveRequest;
}
@Component({
  selector: 'app-edit-leave-request',
  templateUrl: './edit-leave-request.component.html',
  styleUrls: ['./edit-leave-request.component.scss'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: "en-GB" }],
})
export class EditLeaveRequestComponent {
  statusOptions: string[] = ['applied', 'approved', 'cancelled'];

  action: string;
  dialogTitle: string;
  leaveRequestForm: UntypedFormGroup;
  leaveRequest: LeaveRequest;
  studentApprovedClasses: any;
  _id:any;
  
  constructor(
    public dialogRef: MatDialogRef<EditLeaveRequestComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public leaveRequestService: InstructorLeaveRequestService,
    private fb: UntypedFormBuilder,
   private courseService: CourseService,
   private classService: ClassService,
  ) {
    this.action = data.action;
    if (this.action === "edit") {
      
      this.dialogTitle = "Rescheduled Request";
      this.leaveRequest = data.leaveRequest;
      this._id=data.leaveRequest.id
    } else {
      this.dialogTitle = "New Leave Request";
      const blankObject = {} as LeaveRequest;
      this.leaveRequest = new LeaveRequest(blankObject);
    }
    this.leaveRequestForm = this.createContactForm();
  }
  formControl = new UntypedFormControl("", [
    Validators.required,
    // Validators.email,
  ]);
  getErrorMessage() {
    return this.formControl.hasError("required")
      ? "Required field"
      : this.formControl.hasError("email")
      ? "Not a valid email"
      : "";
  }
  
  createContactForm(): UntypedFormGroup {
    return this.fb.group({
      id: [this.leaveRequest.id],
      className: [this.leaveRequest.className, [Validators.required]],
      applyDate: [this.leaveRequest.applyDate, [Validators.required]],
      toDate: [this.leaveRequest.toDate, [Validators.required]],
      reason: [this.leaveRequest.reason, [Validators.required]],
      status: [this.leaveRequest.status, [Validators.required]],
    });
  }
  submit() {
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  confirmAdd(){
    let learnerId = this.leaveRequest.learnerId._id;
    let classId = this.leaveRequest.classId;

    this.courseService
      .getStudentClass(learnerId, classId)
      .subscribe((response) => {
        let element = response.data.docs[0];
        const item = {
          classId: element?.classId.id,
          studentId: element.studentId.id,
          courseId : element.courseId.id,
          rescheduledDate: this.leaveRequestForm.value.toDate
        };
        this.classService
        .saveApprovedClasses(element._id, item)
        .subscribe((_response: any) => {
          let data=this.leaveRequestForm.value
          this.leaveRequestService.updateLeaveRequest(data,this._id)
        }, );
      })
  }
}
