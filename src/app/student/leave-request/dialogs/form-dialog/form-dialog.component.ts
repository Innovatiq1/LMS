import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject, ViewChild } from '@angular/core';
import { LeaveRequestService } from '../../leave-request.service';
import {
  UntypedFormControl,
  Validators,
  UntypedFormGroup,
  UntypedFormBuilder,
} from '@angular/forms';
import { LeaveRequest } from '../../leave-request.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { ClassService } from 'app/admin/schedule-class/class.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

export interface DialogData {
  id: number;
  action: string;
  leaveRequest: LeaveRequest;
}

@Component({
  selector: 'app-form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.scss'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],
})
export class FormDialogComponent {
  action: string;
  dialogTitle: string;
  leaveRequestForm: UntypedFormGroup;
  leaveRequest: LeaveRequest;
  studentApprovedClasses: any;
  id!: number;
  isEdit = false;
  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public leaveRequestService: LeaveRequestService,
    private fb: UntypedFormBuilder,
    private classService: ClassService,
    public router: Router
  ) {
    this.getApprovedCourse();
    // Set the defaults
    this.action = data.action;
    if (this.action === 'edit') {
      this.isEdit = true;
      this.dialogTitle = 'Edit Reschedule Request';
      this.leaveRequest = data.leaveRequest;
      this.id = data.leaveRequest.id;
    } else {
      this.dialogTitle = 'New Reschedule Request';
      const blankObject = {} as LeaveRequest;
      this.leaveRequest = new LeaveRequest(blankObject);
    }
    this.leaveRequestForm = this.createContactForm();
  }
  formControl = new UntypedFormControl('', [
    Validators.required,
    // Validators.email,
  ]);
  getErrorMessage() {
    return this.formControl.hasError('required')
      ? 'Required field'
      : this.formControl.hasError('email')
      ? 'Not a valid email'
      : '';
  }
  getApprovedCourse() {
    let studentId = localStorage.getItem('id');
    const payload = { studentId: studentId, status: 'approved' };
    this.classService
      .getStudentRegisteredClasses(payload)
      .subscribe((response) => {
        this.studentApprovedClasses = response.data.docs;
      });
  }

  createContactForm(): UntypedFormGroup {
    return this.fb.group({
      id: [this.leaveRequest.id],
      className: [this.leaveRequest.className, [Validators.required]],
      applyDate: [this.leaveRequest.applyDate, [Validators.required]],
      // fromDate: [this.leaveRequest.fromDate, [Validators.required]],
      toDate: [this.leaveRequest.toDate, [Validators.required]],
      reason: [this.leaveRequest.reason, [Validators.required]],
    });
  }
  submit() {
    // emppty stuff
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  public confirmAdd(): void {
    if(this.leaveRequestForm.valid){
    let payload = {
      className: this.isEdit
        ? this.leaveRequestForm.value?.className
        : this.leaveRequestForm.value?.className?.classId?.courseId?.title,
      applyDate: this.leaveRequestForm.value?.applyDate,
      // fromDate: this.leaveRequestForm.value?.fromDate,
      toDate: this.leaveRequestForm.value?.toDate,
      reason: this.leaveRequestForm.value?.reason,
      instructorId:
        this.leaveRequestForm.value?.className?.classId?.sessions[0]
          ?.instructorId,
      classId: this.leaveRequestForm.value?.className?.classId?.id,
      studentId: this.leaveRequestForm.value?.className?.studentId?.id,
      status: 'applied',
    };
    if (this.action === 'edit') {
      // Swal.fire({
      //   title: 'Are you sure?',
      //   text: 'Do you want to update Reschedule request!',
      //   icon: 'warning',
      //   confirmButtonText: 'Yes',
      //   showCancelButton: true,
      //   cancelButtonColor: '#d33',
      // }).then((result) => {
      //   if (result.isConfirmed) {
          this.leaveRequestService.updateLeaveRequest(payload, this.id);
          Swal.fire({
            title: 'Successful',
            text: 'Reschedule request edited successfully',
            icon: 'success',
          });
      //   }
      // });
    } else {
      this.leaveRequestService.addLeaveRequest(payload);
      Swal.fire({
        title: 'Successful',
        text: 'Reschedule requested successfully',
        icon: 'success',
      });
      this.router.navigate(['reschedule/programs']);
    }
  }else{
    this.leaveRequestForm.markAllAsTouched(); 
  }
}
}
