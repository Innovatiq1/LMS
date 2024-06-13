import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';

@Component({
  selector: 'app-create-super-admin',
  templateUrl: './create-super-admin.component.html',
  styleUrls: ['./create-super-admin.component.scss'],
})
export class CreateSuperAdminComponent {
  superAdminForm!: FormGroup;
  hide = true;

  constructor(
    public _fb: FormBuilder,
    public dialogRef: MatDialogRef<CreateSuperAdminComponent>
  ) {}
  ngOnInit() {
    this.superAdminForm = this._fb.group({
      name: [''],
      roll: [''],
      gender: [''],
      email: [''],
      mobile: [''],
      registeredDate: [''],
      password: [''],
    });
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  createAdmin() {
    console.log('createAdmin',this.superAdminForm)
  }
}
