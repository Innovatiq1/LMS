import { Component } from '@angular/core';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SettingsService } from '@core/service/settings.service';
import { UtilsService } from '@core/service/utils.service';
import Swal from 'sweetalert2';
import { Location } from '@angular/common';
import { AuthenService } from '@core/service/authen.service';

@Component({
  selector: 'app-update-file-size',
  templateUrl: './update-file-size.component.html',
  styleUrls: ['./update-file-size.component.scss']
})
export class UpdateFileSizeComponent {

  savingAlgorithmForm!: UntypedFormGroup;
  breadscrums = [
    {
      title: 'Update FileSize Algorithm',
      items: ['Configuration'],
      active: 'FileSize Algorithm',
    },
  ];
  
  fund!: string;
  id!: string;
  isDelete = false;
  constructor(private fb: FormBuilder,private router:Router,
    private activatedRoute:ActivatedRoute,private SettingsService:SettingsService,public utils:UtilsService, private location: Location,
    private authenService: AuthenService) {
      this.savingAlgorithmForm = this.fb.group({
        fileSize: ['', [Validators.required,...this.utils.validators.noLeadingSpace]],

      });

    
  }

  ngOnInit() {
    const roleDetails =this.authenService.getRoleDetails()[0].settingsMenuItems
      let urlPath = this.router.url.split('/');
      const parentId = `${urlPath[1]}/${urlPath[2]}/${urlPath [3]}`;
      const childId =  urlPath[urlPath.length - 2];
      console.log("childId",childId)
      let parentData = roleDetails.filter((item: any) => item.id == parentId);
      console.log("parentData",parentData)
      
      let childData = parentData[0].children.filter((item: any) => item.id == childId);
      let actions = childData[0].actions
      let deleteAction = actions.filter((item:any) => item.title == 'Delete')
    console.log("actions",actions)
    console.log("deleteAction",deleteAction)
      if(deleteAction.length >0){
        this.isDelete = true;
      }
    this.activatedRoute.queryParams.subscribe(params => {
      this.fund = params['funding'];
      this.id = params['id'];
      console.log("this.id",this.id)
      this.savingAlgorithmForm.patchValue({
        fileSize: this.fund,
      });
    });
  }

  onUpdate(): void {
    if(this.savingAlgorithmForm.valid) {
      
      const scoresValue = this.savingAlgorithmForm.value.fileSize;
    const payload = {
      fileSize: scoresValue,
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
        this.SettingsService.updateFileSizeAlgorithm(this.id,payload).subscribe((data:any) => {

          if(data){
            Swal.fire({
              title: 'Success',
              text: 'FileSize Algorithm updated successfully.',
              icon: 'success',
            });
            this.savingAlgorithmForm.reset();
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
    this.savingAlgorithmForm.markAllAsTouched(); 
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
    this.SettingsService.deleteFileSizeAlgorithm(id).subscribe(result => { 
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
