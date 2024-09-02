import { Component, Inject } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EmpRequest } from '@core/models/emp-request.model';
import { EtmsService } from '@core/service/etms.service';
import Swal from 'sweetalert2';


export interface DialogData {
  id: number;
  action: string;
  empRequest: EmpRequest;
}

@Component({
  selector: 'app-edit-request',
  templateUrl: './edit-request.component.html',
  styleUrls: ['./edit-request.component.scss']
})
export class EditRequestComponent {

  action: string;
  dialogTitle: string;
  empRequestForm!: UntypedFormGroup;
  empRequest: EmpRequest;
  _id:any;
  ro = false;
  payload = {}
  director = false;
  trainingAdmin = false;
  dataSource: any;

  constructor(
    public dialogRef: MatDialogRef<EditRequestComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public etmsService: EtmsService,
    private fb: UntypedFormBuilder,
  ) {
    
    this.action = data.action;
    if (this.action === "edit" || this.action === "approve") {
      
      this.dialogTitle = "Edit Employee Request";
      this.empRequest = data.empRequest;
      this._id=data.empRequest.id
    } else {
      this.dialogTitle = "New Employee Request";
      const blankObject = {} as EmpRequest;
      this.empRequest = new EmpRequest(blankObject);
    }
    this.empRequestForm = this.createContactForm();

    let user = JSON.parse(localStorage.getItem('currentUser') || '{}')
    if (user.user.type == 'RO') {
      this.ro = true;
    } else if (user.user.type == 'Director') {
      this.director = true;
    } else if (user.user.type == 'Training Administrator') {
      this.trainingAdmin = true;
    }

  }
  formControl = new UntypedFormControl("", [
    Validators.required,
   
  ]);
  getErrorMessage() {
    return this.formControl.hasError("required")
      ? "Required field"
      : this.formControl.hasError("email")
      ? "Not a valid email"
      : "";
  }
 
  ngOnInit(): void {
    if (this.ro) {
      this.getAllRequestsByRo();
    } else if (this.director) {
      this.getAllRequestsByDirector();
    }else if (this.trainingAdmin) {
      this.getAllRequestsByTrainingAdmin();
    }
  }
  createContactForm(): UntypedFormGroup {
    return this.fb.group({
      id: [this.empRequest.id],
      reason: [this.empRequest.reason, [Validators.required]],
    });
  }
  submit() {
    // emppty stuff
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  getAllRequestsByRo() {
    let roId = localStorage.getItem('id')
    this.etmsService.getAllRequestsByRo(roId).subscribe(response => {
      this.dataSource = response.data.docs;
    }, () => {
    });
  }

  getAllRequestsByDirector() {
    let directorId = localStorage.getItem('id')
    this.etmsService.getAllRequestsByDirector(directorId).subscribe(response => {
      this.dataSource = response.data.docs;
    }, () => {
    });
  }

  getAllRequestsByTrainingAdmin() {
    let trainingAdminId = localStorage.getItem('id')
    this.etmsService.getAllRequestsByTrainingAdmin(trainingAdminId).subscribe(response => {
      this.dataSource = response.data.docs;
    }, () => {
    });
  }

  public confirmAdd(): void {

    if (this.ro) {
      this.payload = {
        roApproval: "Rejected",
        roReason: this.empRequestForm.value.reason,
      }
    } else if (this.director) {
      this.payload = {
        directorApproval: "Rejected",
        directorReason: this.empRequestForm.value.reason,
      }
    } else if (this.trainingAdmin) {
      this.payload = {
        trainingAdminApproval: "Rejected",
        trainingAdminReason: this.empRequestForm.value.reason,
      }
    }
    if (this.empRequestForm.valid) {
    this.etmsService.updateStatus(this.payload, this._id).subscribe((response: any) => {
      if (this.ro) {
        Swal.fire({
          title: 'Success',
          text: 'Rejected by RO',
          icon: 'success',
        });
        this.getAllRequestsByRo();
      } else if (this.director) {
        Swal.fire({
          title: 'Success',
          text: 'Rejected by Director',
          icon: 'success',
        });
        this.getAllRequestsByDirector();
      } else if (this.trainingAdmin) {
        Swal.fire({
          title: 'Success',
          text: 'Rejected by Training Admin',
          icon: 'success',
        });
        this.getAllRequestsByTrainingAdmin();
       
      }
    });
  }
  }
  approveRequest(){
    if (this.ro) {
      this.payload = {
        roApproval: "Approved",
        roReason: this.empRequestForm.value.reason,
      }
    } else if (this.director) {
      this.payload = {
        directorApproval: "Approved",
        directorReason: this.empRequestForm.value.reason,
      }
    } else if (this.trainingAdmin) {
      this.payload = {
        trainingAdminApproval: "Approved",
        trainingAdminReason: this.empRequestForm.value.reason,
      }
    }
    if (this.empRequestForm.valid) {
    this.etmsService
      .updateStatus(this.payload, this._id)
      .subscribe((response: any) => {
        if (this.ro) {
          Swal.fire({
            title: 'Approved Sucessfully',
            text: 'Sent Course Approval Request to Director',
            icon: 'success',
          });
          this.getAllRequestsByRo();
        } else if (this.director) {
          Swal.fire({
            title: 'Approved Sucessfully',
            text: 'Sent Course Approval Request to Training Admin',
            icon: 'success',
          });
          this.getAllRequestsByDirector();
        } else if (this.trainingAdmin) {
          Swal.fire({
            title: 'Successful',
            text: 'Approved Sucessfully',
            icon: 'success',
          });
          this.getAllRequestsByTrainingAdmin();
        }
      });
    }
  }
}
