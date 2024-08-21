import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Component, Inject } from "@angular/core";
import { LecturesService } from "../../lectures.service";
import {
  UntypedFormControl,
  Validators,
  UntypedFormGroup,
  UntypedFormBuilder,
} from "@angular/forms";
import { Lectures } from "../../lectures.model";
import { MAT_DATE_LOCALE } from "@angular/material/core";

export interface DialogData {
  program: string;
  id: number;
  action: string;
  lectures: Lectures;
}

@Component({
  selector: "app-form-dialog",
  templateUrl: "./form-dialog.component.html",
  styleUrls: ["./form-dialog.component.scss"],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: "en-GB" }],
})
export class FormDialogComponent {
  statusOptions: string[] = ['Confirm', 'Cancelled', 'Pending'];
  action: string;
  dialogTitle: string;
  lecturesForm: UntypedFormGroup;
  lectures: Lectures;
  classId:any
  _id:any
  program: string;
  
  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public lecturesService: LecturesService,
    private fb: UntypedFormBuilder
  ) {
    // Set the defaults
    this.action = data.action;
    this.program = data.program
    if (this.action === "edit") {
      this.dialogTitle = data.lectures.sName;
      this.lectures = data.lectures;
      this.classId=data.lectures.sessions[0]._id;
      this._id=data.lectures._id
    } else {
      this.dialogTitle = "New Lectures";
      const blankObject = {} as Lectures;
      this.lectures = new Lectures(blankObject);
    }
    this.lecturesForm = this.createContactForm();
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
      courseName: [this.lectures.sessions[0].courseName, [Validators.required]],
      sessionStartDate: [this.lectures.sessions[0].sessionStartDate, [Validators.required]],
      sessionStartTime: [this.lectures.sessions[0].sessionStartTime, [Validators.required]],
      status: [this.lectures.sessions[0].status, [Validators.required]],
    });
  }
  submit() {
    // emppty stuff
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  public confirmAdd(): void {
    
    let data=this.lecturesForm.value
    data['classId']=this.classId
    data['_id']=this._id
    if(this.program){
      this.lecturesService.updateProgramLectures(data);
    }else {
      this.lecturesService.updateLectures(data);

    }
  }
}
