import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from '@core/service/course.service';
import { UtilsService } from '@core/service/utils.service';
import Swal from 'sweetalert2';
import { Location } from '@angular/common';
import { AuthenService } from '@core/service/authen.service';

@Component({
  selector: 'app-update-discount',
  templateUrl: './update-discount.component.html',
  styleUrls: ['./update-discount.component.scss']
})
export class UpdateDiscountComponent {
  discountForm!: FormGroup;
  breadscrums = [
    {
      title: 'Discount',
      items: ['Configuration'],
      active: 'Discount',
    },
  ];
  dataSource :any;
  id: any;
  isDelete = false;

  
  constructor(private fb: FormBuilder,private router:Router,
    private activatedRoute:ActivatedRoute,private courseService:CourseService,public utils:UtilsService,  private location: Location,
    private authenService: AuthenService) {
      this.discountForm = this.fb.group({
        discountTitle: ['', [Validators.required,...this.utils.validators.name]],
        discountType: ['', [Validators.required]],
        value: ['', [Validators.required,...this.utils.validators.value]],
        description: ['', [Validators.required,...this.utils.validators.noLeadingSpace,...this.utils.validators.name]]


      });
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
        this.id = params['id'];
        // this.getDiscountById(this.id)
        this.getDiscountById(this.id);
      })
  }

  onUpdate(){
    if(this.discountForm.valid){
    const userData = this.discountForm.value;
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to update this!',
      icon: 'warning',
      confirmButtonText: 'Yes',
      showCancelButton: true,
      cancelButtonColor: '#d33',
    }).then((result) => {
      if (result.isConfirmed){
        this.courseService.updateDiscount(this.id, userData).subscribe((response: any) => {

          if(response){
            Swal.fire({
              title: 'Success',
              text: 'Discount updated successfully.',
              icon: 'success',
              // confirmButtonColor: '#d33',
            });
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
  }
  else{
    this.discountForm.markAllAsTouched();
  }
  }
  getDiscountById(id:string) {
    this.courseService.getDiscountById(id).subscribe(res => {
      this.discountForm.patchValue({
        discountTitle: res?.discountTitle,
        discountType: res?.discountType,
        value:res?.value,
        description:res?.description
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
        this.courseService.deleteDiscount(id).subscribe(result => { 
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
