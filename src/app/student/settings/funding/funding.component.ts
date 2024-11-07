import { Component,Input, OnDestroy, OnInit,Inject,Optional } from '@angular/core';
import { FormBuilder, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenService } from '@core/service/authen.service';
import { CourseService } from '@core/service/course.service';
import { UtilsService } from '@core/service/utils.service';
import { MatDialog,MAT_DIALOG_DATA,MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-funding',
  templateUrl: './funding.component.html',
  styleUrls: ['./funding.component.scss']
})
export class FundingComponent implements OnInit {
  fundingForm!: UntypedFormGroup;
  breadscrums = [
    {
      title: 'Funding/Grant',
      items: ['Configuration'],
      active: 'Funding/Grant',
    },
  ];
  dataSource :any;
  isCreate = false;
  isEdit = false;
  dialogStatus:boolean=false;

  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data11: any,
    private fb: FormBuilder,private router:Router,
    private activatedRoute:ActivatedRoute,private courseService:CourseService,public utils:UtilsService,
    private authenService: AuthenService,@Optional() private dialogRef: MatDialogRef<FundingComponent> 
  ) {
      if (data11) {
        this.dialogStatus=true;
        console.log("Received variable:", data11.variable);
      }
      this.fundingForm = this.fb.group({
        grant_type: ['', [Validators.required,...this.utils.validators.name,...this.utils.validators.noLeadingSpace]],
        description: ['', [Validators.required,...this.utils.validators.name, ...this.utils.validators.noLeadingSpace]]

      })
  }

  ngOnInit() {
    const roleDetails =this.authenService.getRoleDetails()[0].settingsMenuItems
    let urlPath = this.router.url.split('/');
    const parentId = `${urlPath[1]}/${urlPath[2]}/${urlPath [3]}`;
    const childId =  urlPath[urlPath.length - 1];
    let parentData = roleDetails.filter((item: any) => item.id == parentId);
    let childData = parentData[0].children.filter((item: any) => item.id == childId);
    let actions = childData[0].actions
    let createAction = actions.filter((item:any) => item.title == 'Create')
    let editAction = actions.filter((item:any) => item.title == 'Edit')

    if(createAction.length >0){
      this.isCreate = true;
    }
    if(editAction.length >0){
      this.isEdit = true;
    }
    this.getAllFundingGrants();
  }

  onSubmit() {
    if(this.fundingForm.valid){
      let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
            this.fundingForm.value.companyId=userId;
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to create funding grant!',
      icon: 'warning',
      confirmButtonText: 'Yes',
      showCancelButton: true,
      cancelButtonColor: '#d33',
    }).then((result) => {
      if (result.isConfirmed){
        this.courseService.createFundingGrant(this.fundingForm.value).subscribe((response: any) => {
          Swal.fire({
            title: 'Successful',
            text: 'Funding Grant created successfully',
            icon: 'success',
          });
          this.getAllFundingGrants();
          this.fundingForm.reset();
        },
        (error) => {
          Swal.fire({
            title: 'Error',
            text: 'Funding/Grant already exists',
            icon: 'error',
          });

        });
      }
    });
  } else {
    this.fundingForm.markAllAsTouched();
  }
}
getAllFundingGrants(){
  this.courseService.getFundingGrant().subscribe((response:any) =>{
   this.dataSource = response.reverse();
  })
}
update(data: any) {
  
  this.router.navigate(['/student/settings/configuration/funding-grant/update-funding'], {
    queryParams: {
      funding: data.grant_type,
      description: data.description,
      id: data.id
    }
  });
}

closeDialog(): void {
  if (this.dialogRef) {
    this.dialogRef.close();
  }
}
}