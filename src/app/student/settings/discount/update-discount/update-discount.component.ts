import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from '@core/service/course.service';
import { UtilsService } from '@core/service/utils.service';
import Swal from 'sweetalert2';
import { Location } from '@angular/common';

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

  
  constructor(private fb: FormBuilder,private router:Router,
    private activatedRoute:ActivatedRoute,private courseService:CourseService,public utils:UtilsService,  private location: Location) {
      this.discountForm = this.fb.group({
        discountTitle: ['', [Validators.required,...this.utils.validators.name]],
        discountType: ['', [Validators.required]],
        value: ['', [Validators.required,...this.utils.validators.value]],
        description: ['', [Validators.required,...this.utils.validators.noLeadingSpace,...this.utils.validators.name]]


      });
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
        this.router.navigate(['/student/settings/discount']);
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
          this.router.navigate(['/student/settings/discount']);
        });
      }
    });
  }
  goBack(): void {
    this.location.back();
  }
}
