import { Component } from '@angular/core';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SettingsService } from '@core/service/settings.service';
import { UtilsService } from '@core/service/utils.service';
import Swal from 'sweetalert2';
import { Location } from '@angular/common';
import { AuthenService } from '@core/service/authen.service';
@Component({
  selector: 'app-update-time-algorithm',
  templateUrl: './update-time-algorithm.component.html',
  styleUrls: ['./update-time-algorithm.component.scss']
})
export class UpdateTimeAlgorithmComponent {
  timeAlgorithmForm!: UntypedFormGroup;
  breadscrums = [
    {
      title: 'Time Algorithm',
      items: ['Configuration'],
      active: 'Time Algorithm',
    },
  ];
  
  fund!: string;
  id!: string;
  isDelete = false;
  constructor(private fb: FormBuilder,private router:Router,
    private activatedRoute:ActivatedRoute,private SettingsService:SettingsService,public utils:UtilsService, private location: Location,
    private authenService: AuthenService) {
      this.timeAlgorithmForm = this.fb.group({
        times: ['', [Validators.required,...this.utils.validators.noLeadingSpace]],

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
      this.timeAlgorithmForm.patchValue({
        times: this.fund,
      });
    });
  }

  onUpdate(): void {
    if(this.timeAlgorithmForm.valid) {
      
      const timesValue = this.timeAlgorithmForm.value.times;
    const payload = {
      times: timesValue,
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
        this.SettingsService.updateTimeAlgorithm(this.id,payload).subscribe((data:any) => {

          if(data){
            Swal.fire({
              title: 'Success',
              text: 'Time Algorithm updated successfully.',
              icon: 'success',
            });
            this.timeAlgorithmForm.reset();
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
    this.timeAlgorithmForm.markAllAsTouched(); 
  }
    
  }

  deleteTimeAlgorithm(id:string){
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
    this.SettingsService.deleteTimeAlgorithm(id).subscribe(result => { 
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
