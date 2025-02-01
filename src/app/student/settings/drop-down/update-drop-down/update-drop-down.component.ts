import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from '@core/service/course.service';
import { UtilsService } from '@core/service/utils.service';
import Swal from 'sweetalert2';
import { Location } from '@angular/common';
import { AuthenService } from '@core/service/authen.service';
import { SettingsService } from '@core/service/settings.service';

@Component({
  selector: 'app-update-drop-down',
  templateUrl: './update-drop-down.component.html',
  styleUrls: ['./update-drop-down.component.scss']
})
export class UpdateDropDownComponent {
  dropDownForm!: FormGroup;
  breadscrums = [
    {
      title: 'Drop Down',
      items: ['Configuration'],
      active: 'Drop Down',
    },
  ];
  dataSource :any;
  id: any;
  field:any;
  isDelete:boolean= false;
  
  constructor(private fb: FormBuilder,private router:Router,
    private activatedRoute:ActivatedRoute,private settingService:SettingsService,public utils:UtilsService,  private location: Location,
    private authenService: AuthenService) {
      this.dropDownForm = this.fb.group({
        name: ['', [Validators.required,...this.utils.validators.name]],
        code: ['', [Validators.required,...this.utils.validators.value]]
      });

      const roleDetails =this.authenService.getRoleDetails()[0].settingsMenuItems
      let urlPath = this.router.url.split('/');
      const parentId = `${urlPath[1]}/${urlPath[2]}/${urlPath [3]}`;
      const childId =  urlPath[urlPath.length - 2];
      let parentData = roleDetails.filter((item: any) => item.id == parentId);
      let childData = parentData[0].children.filter((item: any) => item.id == childId);
      let actions = childData[0].actions
      let deleteAction = actions.filter((item:any) => item.title == 'Delete')

      console.log(roleDetails, parentId, childId, actions)
    
      if(deleteAction.length >0){
        this.isDelete = true;
      }
     
      this.activatedRoute.queryParams.subscribe(params => {
        this.id = params['id'];
        this.field = params['field'];
        this.getDropDownOptionById(this.id, this.field);
      })
  }

  onUpdate(){
    if(this.dropDownForm.valid){
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to update this!',
      icon: 'warning',
      confirmButtonText: 'Yes',
      showCancelButton: true,
      cancelButtonColor: '#d33',
    }).then((result) => {
      if (result.isConfirmed){
    let companyId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
    const data = this.dropDownForm.value;
    const payload = {
      companyId,
      field: this.field,
      optionId: this.id,
      data
        }
        this.settingService.updateDropDownOption(payload).subscribe((response: any) => {
          setTimeout(() => {            
            if(response){
              Swal.fire({
                title: 'Success',
                text: 'Dropdown Option updated successfully.',
                icon: 'success',
              });
              () => {
                Swal.fire({
                  title: 'Error',
                  text: 'Failed to update. Please try again.',
                  icon: 'error',
                });
              };
            }
          }, 500);
        })
        window.history.back();
      }
    });
  }
  else{
    this.dropDownForm.markAllAsTouched();
  }
  }
  getDropDownOptionById(optionId:string, field:string) {
    let companyId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
    const query = {
      companyId,
      field,
      optionId
    }
    this.settingService.getDropDownOptionById(query).subscribe(res => {
      const data = res?.data;
      this.dropDownForm.patchValue({
        name: data?.name,
        code: data?.code,
      })
    })
  }

  deleteDiscount(id:string){
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
        let companyId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
        const payload = {
          companyId,
          field: this.field,
          optionId: this.id,
            }
        this.settingService.deleteOption(payload).subscribe(result => { 
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
