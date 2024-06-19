import { Component } from '@angular/core';
import { FormBuilder, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from '@core/service/course.service';
import { UtilsService } from '@core/service/utils.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-funding',
  templateUrl: './funding.component.html',
  styleUrls: ['./funding.component.scss']
})
export class FundingComponent {
  fundingForm!: UntypedFormGroup;
  breadscrums = [
    {
      title: 'Funding/Grant',
      items: ['Configuration'],
      active: 'Funding/Grant',
    },
  ];
  dataSource :any;

  constructor(private fb: FormBuilder,private router:Router,
    private activatedRoute:ActivatedRoute,private courseService:CourseService,public utils:UtilsService) {
      this.fundingForm = this.fb.group({
        grant_type: ['', [Validators.required,...this.utils.validators.name,...this.utils.validators.noLeadingSpace]],
        description: ['', [Validators.required,...this.utils.validators.name, ...this.utils.validators.noLeadingSpace]]

      })
  }

  ngOnInit() {
    this.getAllFundingGrants();
  }

  onSubmit() {
    if(this.fundingForm.valid){
      let userId = localStorage.getItem('id');
      this.fundingForm.value.adminId=userId;
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
          // this.router.navigate(['/student/settings/create-department'])
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
  
  this.router.navigate(['/student/settings/update-funding'], {
    queryParams: {
      funding: data.grant_type,
      description: data.description,
      id: data.id
    }
  });
}
}