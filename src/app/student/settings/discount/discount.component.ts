import { Component } from '@angular/core';
import { FormBuilder, FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenService } from '@core/service/authen.service';
import { CourseService } from '@core/service/course.service';
import { UtilsService } from '@core/service/utils.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-discount',
  templateUrl: './discount.component.html',
  styleUrls: ['./discount.component.scss']
})
export class DiscountComponent {
  discountForm!: FormGroup;
  breadscrums = [
    {
      title: 'Discount',
      items: ['Configuration'],
      active: 'Discount',
    },
  ];
  dataSource :any;
  isCreate = false;
  isEdit = false;

  constructor(private fb: FormBuilder,private router:Router,
    private activatedRoute:ActivatedRoute,private courseService:CourseService,public utils:UtilsService,
    private authenService: AuthenService) {
      this.discountForm = this.fb.group({
        discountTitle: ['', [Validators.required,...this.utils.validators.noLeadingSpace,...this.utils.validators.name]],
        discountType: ['', [Validators.required]],
        value: ['', [Validators.required,...this.utils.validators.noLeadingSpace,...this.utils.validators.value]],
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
    this.getAllDiscounts();
  }

  onSubmit() {
    if(this.discountForm.valid){
      let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
            this.discountForm.value.companyId=userId
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to create Discount!',
      icon: 'warning',
      confirmButtonText: 'Yes',
      showCancelButton: true,
      cancelButtonColor: '#d33',
    }).then((result) => {
      if (result.isConfirmed){
        this.courseService.createDiscount(this.discountForm.value).subscribe((response: any) => {
          Swal.fire({
            title: 'Successful',
            text: 'Discount created successfully',
            icon: 'success',
          },);
          this.getAllDiscounts();
          this.discountForm.reset();
          // this.router.navigate(['/student/settings/create-department'])
        },
        (error) => {
          Swal.fire({
            title: 'Error',
            text: 'Discount already exists',
            icon: 'error',
          });

        });
      }
    });
  } else {
    this.discountForm.markAllAsTouched();
  }
}
getAllDiscounts(){
  let companyId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
  this.courseService.getDiscount(companyId).subscribe((response:any) =>{
   this.dataSource = response.reverse();
  })
}
update(id: string){
  this.router.navigate(['/student/settings/configuration/discount/update-discount'], {
    queryParams: {
      id: id
    }
  });
}
}
