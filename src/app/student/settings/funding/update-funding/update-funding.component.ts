import { Component } from '@angular/core';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from '@core/service/course.service';
import { UtilsService } from '@core/service/utils.service';
import Swal from 'sweetalert2';
import { Location } from '@angular/common';
import { AuthenService } from '@core/service/authen.service';

@Component({
  selector: 'app-update-funding',
  templateUrl: './update-funding.component.html',
  styleUrls: ['./update-funding.component.scss']
})
export class UpdateFundingComponent {
  fundingForm!: UntypedFormGroup;
  breadscrums = [
    {
      title: 'Funding/Grant',
      items: ['Configuration'],
      active: 'Funding/Grant',
    },
  ];
  
  fund!: string;
  description!: string;
  id!: string;
  isDelete = false;
  constructor(private fb: FormBuilder,private router:Router,
    private activatedRoute:ActivatedRoute,private courseService:CourseService,public utils:UtilsService, private location: Location,
    private authenService: AuthenService) {
      this.fundingForm = this.fb.group({
        grant_type: ['', [Validators.required,...this.utils.validators.name]],
        description: ['', [Validators.required,...this.utils.validators.name]]

      });

    
  }

  ngOnInit() {
    const roleDetails =this.authenService.getRoleDetails()[0].settingsMenuItems
      let urlPath = this.router.url.split('/');
      const parentId = `${urlPath[1]}/${urlPath[2]}/${urlPath [3]}`;
      const childId =  urlPath[urlPath.length - 2];
      let parentData = roleDetails.filter((item: any) => item.id == parentId);
      let childData = parentData[0].children.filter((item: any) => item.id == childId);
      let actions = childData[0].actions
      let deleteAction = actions.filter((item:any) => item.title == 'Delete')
    
      if(deleteAction.length >0){
        this.isDelete = true;
      }
    this.activatedRoute.queryParams.subscribe(params => {
      this.fund = params['funding'];
      this.description = params['description'];
      this.id = params['id'];
      this.fundingForm.patchValue({
        grant_type: this.fund,
        description: this.description
      });
    });
  }

  onUpdate(): void {
    if(this.fundingForm.valid) {
    const payload = {
      grant_type: this.fundingForm.value.grant_type,
      description: this.fundingForm.value.description
    }
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to update this!',
      icon: 'warning',
      confirmButtonText: 'Yes',
      showCancelButton: true,
      cancelButtonColor: '#d33',
    }).then((result) => {
      if (result.isConfirmed){
        this.courseService.updateFundingGrant(this.id,payload).subscribe(data => {

          if(data){
            Swal.fire({
              title: 'Success',
              text: 'Funding Grant updated successfully.',
              icon: 'success',
            });
            this.fundingForm.reset();
            () => {
              Swal.fire({
                title: 'Error',
                text: 'Failed to update. Please try again.',
                icon: 'error',
              });
            };
          }
        })
        window.history.back();
      }
    });
  }else{
    this.fundingForm.markAllAsTouched(); 
  }
    
  }

  deleteFunding(id:string){
    Swal.fire({
  title: "Confirm Deletion",
  text: "Are you sure you want to delete this?",
  icon: "warning",
  showCancelButton: true,
  confirmButtonColor: "#d33",
  cancelButtonColor: "#3085d6",
  confirmButtonText: "Delete",
  cancelButtonText: "Cancel",
}).then((result) => {
  if (result.isConfirmed){
    this.courseService.deleteFundingGrant(id).subscribe(result => { 
      Swal.fire({
        title: 'Success',
        text: 'Record Deleted Successfully...!!!',
        icon: 'success',
      });
      window.history.back();
    });
  }
});
}

goBack(): void {
  this.location.back();
}
}
