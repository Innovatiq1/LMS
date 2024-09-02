import { Component } from '@angular/core';
import { FormBuilder, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenService } from '@core/service/authen.service';
import { SettingsService } from '@core/service/settings.service';
import { UtilsService } from '@core/service/utils.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-passing-criteria',
  templateUrl: './passing-criteria.component.html',
  styleUrls: ['./passing-criteria.component.scss']
})
export class PassingCriteriaComponent {
  passingCriteriaForm!: UntypedFormGroup;
  breadscrums = [
    {
      title: 'Passing Criteria',
      items: ['Configuration'],
      active: 'Passing Criteria',
    },
  ];
  dataSource :any;
  isCreate = false;
  isEdit = false;

  constructor(private fb: FormBuilder,private router:Router,
    private activatedRoute:ActivatedRoute,private SettingsService:SettingsService,public utils:UtilsService,
    private authenService: AuthenService) {
      this.passingCriteriaForm = this.fb.group({
        value: ['', [Validators.required,...this.utils.validators.noLeadingSpace]],

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
    if(this.passingCriteriaForm.valid){
      let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
            this.passingCriteriaForm.value.companyId=userId;
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to create passing Criteria',
      icon: 'warning',
      confirmButtonText: 'Yes',
      showCancelButton: true,
      cancelButtonColor: '#d33',
    }).then((result) => {
      if (result.isConfirmed){
        this.SettingsService.savePassingCriteriya(this.passingCriteriaForm.value).subscribe((response: any) => {
          Swal.fire({
            title: 'Successful',
            text: 'Passing Criteria created successfully',
            icon: 'success',
          });
          this.getAllPassingCriteria();
          this.passingCriteriaForm.reset();
        },
        (error) => {
          Swal.fire({
            title: 'Error',
            text: 'Passing Criteria already exists',
            icon: 'error',
          });

        });
      }
    });
  } else {
    this.passingCriteriaForm.markAllAsTouched();
  }
}
getAllPassingCriteria(){
  this.SettingsService.getPassingCriteria().subscribe((response:any) =>{
    this.dataSource=response.data.docs;
  })
}
update(data: any) {
  
  this.router.navigate(['/student/settings/configuration/passing-criteria/update-passing-criteria'], {
    queryParams: {
      funding: data.value,
      id: data.id
    }
  });
}

}
