import { Component, Inject } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EmpRequest } from '@core/models/emp-request.model';
import { EtmsService } from '@core/service/etms.service';
import Swal from 'sweetalert2';

export interface DialogData {
  id: number;
  action: string;
  empRequest: EmpRequest;
  employeeEmail:string;
}
@Component({
  selector: 'app-edit-budget-request',
  templateUrl: './edit-budget-request.component.html',
  styleUrls: ['./edit-budget-request.component.scss'],
})
export class EditBudgetRequestComponent {
  action: string;
  dialogTitle: string;
  empRequestForm!: UntypedFormGroup;
  empRequest: EmpRequest;
  _id: any;
  ro = false;
  payload = {};
  director = false;
  trainingAdmin = false;
  dataSource: any;

  constructor(
    public dialogRef: MatDialogRef<EditBudgetRequestComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public etmsService: EtmsService,
    private fb: UntypedFormBuilder
  ) {
    this.action = data.action;
    if (this.action === 'reject' || this.action === 'approve') {
      this.dialogTitle = 'Edit Budget Request';
      this.empRequest = data.empRequest;
      this._id = data.empRequest.id;
    } else {
      this.dialogTitle = 'New Budget Request';
      const blankObject = {} as EmpRequest;
      this.empRequest = new EmpRequest(blankObject);
    }
    this.empRequestForm = this.createContactForm();

    let user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (user.user.type == 'RO') {
      this.ro = true;
    } else if (user.user.type == 'Director') {
      this.director = true;
    } else if (user.user.type == 'Training Administrator') {
      this.trainingAdmin = true;
    }
  }
  formControl = new UntypedFormControl('', [Validators.required]);
  getErrorMessage() {
    return this.formControl.hasError('required')
      ? 'Required field'
      : this.formControl.hasError('email')
      ? 'Not a valid email'
      : '';
  }

  ngOnInit(): void {
    if (this.director) {
      this.getAllRequestsByDirector();
    }
  }
  createContactForm(): UntypedFormGroup {
    return this.fb.group({
      id: [this.empRequest.id],
      reason: [this.empRequest.reason, [Validators.required]],
    });
  }
  submit() {
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  getAllRequestsByDirector() {
    let directorId = localStorage.getItem('id');
    this.etmsService.getBudgetRequestsByDirector({ directorId }).subscribe(
      (response) => {
        this.dataSource = response.docs;
      },
      () => {}
    );
  }

  public confirmAdd(): void {
    if (this.director) {
      this.payload = {
        approval: 'Rejected',
        reason: this.empRequestForm.value.reason,
        employeeEmail:this.data.empRequest.employeeEmail,
        employeeName:this.data.empRequest.employeeName
      };
    }

    if (this.empRequestForm.valid) {
      this.etmsService
        .updateBudgetStatus(this.payload, this._id)
        .subscribe((response: any) => {
          if (this.director) {
            Swal.fire({
              title: 'Success',
              text: 'Rejected by Director',
              icon: 'success',
            });
            this.getAllRequestsByDirector();
          }
        });
    }
  }
  approveRequest() {
    if (this.director) {
      this.payload = {
        approval: 'Approved',
        reason: this.empRequestForm.value.reason,
        employeeEmail:this.data.empRequest.employeeEmail,
        employeeName:this.data.empRequest.employeeName
      };
    }

    if (this.empRequestForm.valid) {
          this.etmsService
          .updateBudgetStatus(this.payload, this._id)
          .subscribe((response: any) => {
            if (this.director) {
              Swal.fire({
                title: 'Success',
                text: 'Approved Successfully',
                icon: 'success',
              });
              this.getAllRequestsByDirector();
              
            }
          });
          this.empRequestForm.reset();
        }
    
  }
}
