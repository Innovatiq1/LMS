import { Component } from '@angular/core';
import { FormBuilder, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenService } from '@core/service/authen.service';
import { SettingsService } from '@core/service/settings.service';
import { UtilsService } from '@core/service/utils.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-file-size',
  templateUrl: './file-size.component.html',
  styleUrls: ['./file-size.component.scss']
})
export class FileSizeComponent {
  scoreAlgorithmForm!: UntypedFormGroup;
  breadscrums = [
    {
      title: 'FileSize Limit',
      items: ['Configuration'],
      active: 'FileSize Limit',
    },
  ];
  dataSource :any;
  isCreate = false;
  isEdit = false;

  constructor(private fb: FormBuilder,private router:Router,
    private activatedRoute:ActivatedRoute,private SettingsService:SettingsService,public utils:UtilsService,
    private authenService: AuthenService) {
      this.scoreAlgorithmForm = this.fb.group({
        // fileSize: ['', [Validators.required,...this.utils.validators.noLeadingSpace,...this.utils.validators.value]],
        fileSize: ['', [Validators.required,...this.utils.validators.noLeadingSpace,...this.utils.validators.value]],
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
    this.getAllFileSizeAlgorithm();
  }

  onSubmit() {
    if(this.scoreAlgorithmForm.valid){
      let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
            this.scoreAlgorithmForm.value.companyId=userId;
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to create FileSize Limit',
      icon: 'warning',
      confirmButtonText: 'Yes',
      showCancelButton: true,
      cancelButtonColor: '#d33',
    }).then((result) => {
      if (result.isConfirmed){
        this.SettingsService.saveFileSizeAlgorithm(this.scoreAlgorithmForm.value).subscribe((response: any) => {
          Swal.fire({
            title: 'Successful',
            text: 'FileSize Limit created successfully',
            icon: 'success',
          });
          this.getAllFileSizeAlgorithm();
          this.scoreAlgorithmForm.reset();
        },
        (error) => {
          Swal.fire({
            title: 'Error',
            text: 'FileSize Limit already exists',
            icon: 'error',
          });

        });
      }
    });
  } else {
    this.scoreAlgorithmForm.markAllAsTouched();
  }
}
getAllFileSizeAlgorithm(){
  this.SettingsService.getFileSizeAlgorithm().subscribe((response:any) =>{
    this.dataSource=response.data.docs;
  })
}
update(data: any) {
  this.router.navigate(['/student/settings/configuration/fileSize-algorithm/update-filesize-algorithm'], {
    queryParams: {
      funding: data.fileSize,
      id: data.id
    }
  });
}
}
