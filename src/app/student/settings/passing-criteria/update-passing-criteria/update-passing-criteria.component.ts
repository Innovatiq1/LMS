import { Component } from '@angular/core';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
//import { CourseService } from '@core/service/course.service';
import { SettingsService } from '@core/service/settings.service';
import { UtilsService } from '@core/service/utils.service';
import Swal from 'sweetalert2';
import { Location } from '@angular/common';
import { AuthenService } from '@core/service/authen.service';
@Component({
  selector: 'app-update-passing-criteria',
  templateUrl: './update-passing-criteria.component.html',
  styleUrls: ['./update-passing-criteria.component.scss']
})
export class UpdatePassingCriteriaComponent {
  passingCriteriaForm!: UntypedFormGroup;
  breadscrums = [
    {
      title: 'Passing Criteria',
      items: ['Configuration'],
      active: 'Passing Criteria',
    },
  ];
  
  fund!: string;
  id!: string;
  isDelete = false;
  constructor(private fb: FormBuilder,private router:Router,
    private activatedRoute:ActivatedRoute,private SettingsService:SettingsService,public utils:UtilsService, private location: Location,
    private authenService: AuthenService) {
      this.passingCriteriaForm = this.fb.group({
        value: ['', [Validators.required,...this.utils.validators.name]],
       // description: ['', [Validators.required,...this.utils.validators.name]]

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
      this.id = params['id'];
      this.passingCriteriaForm.patchValue({
        value: this.fund,
       // description: this.description
      });
    });
  }

  onUpdate(): void {
    if(this.passingCriteriaForm.valid) {
    const payload = {
      value: this.passingCriteriaForm.value.value,
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
        this.SettingsService.updatePassingCriteria(this.id,payload).subscribe((data:any) => {

          if(data){
            Swal.fire({
              title: 'Success',
              text: 'Passing Criteriya updated successfully.',
              icon: 'success',
              // confirmButtonColor: '#d33',
            });
            this.passingCriteriaForm.reset();
            () => {
              Swal.fire({
                title: 'Error',
                text: 'Failed to update. Please try again.',
                icon: 'error',
                // confirmButtonColor: '#d33',
              });
            };
          }
        })
        window.history.back();
      }
    });
  }else{
    this.passingCriteriaForm.markAllAsTouched(); 
  }
    
  }

  deletePassingCriteria(id:string){
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
    this.SettingsService.deletePassingCriteria(id).subscribe(result => { 
      Swal.fire({
        title: 'Success',
        text: 'Record Deleted Successfully...!!!',
        icon: 'success',
        // confirmButtonColor: '#526D82',
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
