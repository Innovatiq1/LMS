import { Component } from '@angular/core';
import { FormBuilder, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenService } from '@core/service/authen.service';
//import { CourseService } from '@core/service/course.service';
import { SettingsService } from '@core/service/settings.service';
import { UtilsService } from '@core/service/utils.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-time',
  templateUrl: './time.component.html',
  styleUrls: ['./time.component.scss']
})
export class TimeComponent {
  timeAlgorithmForm!: UntypedFormGroup;
  breadscrums = [
    {
      title: 'Time Algorithm',
      items: ['Configuration'],
      active: 'Time Algorithm',
    },
  ];
  dataSource :any;
  isCreate = false;
  isEdit = false;

  constructor(private fb: FormBuilder,private router:Router,
    private activatedRoute:ActivatedRoute,private SettingsService:SettingsService,public utils:UtilsService,
    private authenService: AuthenService) {
      this.timeAlgorithmForm = this.fb.group({
        times: ['', [Validators.required,...this.utils.validators.noLeadingSpace]],
        // description: ['', [Validators.required,...this.utils.validators.name, ...this.utils.validators.noLeadingSpace]]

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
    this.getAllPassingCriteria();
  }

  onSubmit() {
    if(this.timeAlgorithmForm.valid){
      // let userId = localStorage.getItem('id');
      // this.passingCriteriaForm.value.adminId=userId;
      let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
            this.timeAlgorithmForm.value.companyId=userId;
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to create Time Algorithm',
      icon: 'warning',
      confirmButtonText: 'Yes',
      showCancelButton: true,
      cancelButtonColor: '#d33',
    }).then((result) => {
      if (result.isConfirmed){
        this.SettingsService.saveTimeAlgorithm(this.timeAlgorithmForm.value).subscribe((response: any) => {
          Swal.fire({
            title: 'Successful',
            text: 'Time Algorithm created successfully',
            icon: 'success',
          });
          this.getAllPassingCriteria();
          this.timeAlgorithmForm.reset();
          // this.router.navigate(['/student/settings/create-department'])
        },
        (error) => {
          Swal.fire({
            title: 'Error',
            text: 'Time  already exists',
            icon: 'error',
          });

        });
      }
    });
  } else {
    this.timeAlgorithmForm.markAllAsTouched();
  }
}
getAllPassingCriteria(){
  this.SettingsService.getTimeAlgorithm().subscribe((response:any) =>{
    this.dataSource=response.data.docs;
   //this.dataSource = response.reverse();
  })
}
update(data: any) {
  console.log("data score ==",data)
  this.router.navigate(['/student/settings/configuration/time-algorithm/update-time-algorithm'], {
    queryParams: {
      funding: data.times,
      id: data.id
    }
  });
}

}
