import { Component } from '@angular/core';
import { FormBuilder, FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenService } from '@core/service/authen.service';
import { CourseService } from '@core/service/course.service';
import { UtilsService } from '@core/service/utils.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-vendor',
  templateUrl: './vendor.component.html',
  styleUrls: ['./vendor.component.scss']
})
export class VendorComponent {
  vendorForm!: FormGroup;
  breadscrums = [
    {
      title: 'Vendor',
      items: ['Configuration'],
      active: 'Vendor',
    },
  ];
  dataSource :any;
  isCreate = false;
  isEdit = false;

  constructor(private fb: FormBuilder,private router:Router,
    private activatedRoute:ActivatedRoute,private courseService:CourseService,public utils:UtilsService,
    private authenService: AuthenService) {
      this.vendorForm = this.fb.group({
        vendor: ['', [Validators.required,...this.utils.validators.noLeadingSpace,...this.utils.validators.name]],
        description: ['', [Validators.required,...this.utils.validators.noLeadingSpace,...this.utils.validators.name]]

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
    this.getAllVendors();
  }

  onSubmit() {
    if(this.vendorForm.valid){
      let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
            this.vendorForm.value.companyId=userId;
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to create Vendor!',
      icon: 'warning',
      confirmButtonText: 'Yes',
      showCancelButton: true,
      cancelButtonColor: '#d33',
    }).then((result) => {
      if (result.isConfirmed){
        this.courseService.createVendor(this.vendorForm.value).subscribe((response: any) => {
          Swal.fire({
            title: 'Successful',
            text: 'Vendor created successfully',
            icon: 'success',
          },);
          this.getAllVendors();
          this.vendorForm.reset();
          // this.router.navigate(['/student/settings/create-department'])
        },
        (error) => {
          Swal.fire({
            title: 'Error',
            text: 'Vendor already exists',
            icon: 'error',
          });

        });
      }
    });
  } else {
    this.vendorForm.markAllAsTouched();
  }
}
getAllVendors(){
  this.courseService.getVendor().subscribe((response:any) =>{
   this.dataSource = response.reverse();
  })
}
update(id: string){
  this.router.navigate(['/student/settings/configuration/vendor/update-vendor'], {
    queryParams: {
      id: id
    }
  });
}
}
