import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from '@core/service/course.service';
import { UtilsService } from '@core/service/utils.service';
import Swal from 'sweetalert2';
import { Location } from '@angular/common';

@Component({
  selector: 'app-update-vendor',
  templateUrl: './update-vendor.component.html',
  styleUrls: ['./update-vendor.component.scss']
})
export class UpdateVendorComponent {
  vendorForm!: FormGroup;
  breadscrums = [
    {
      title: 'Vendor',
      items: ['Configuration'],
      active: 'Vendor',
    },
  ];
  dataSource :any;
  id: any;

  
  constructor(private fb: FormBuilder,private router:Router,
    private activatedRoute:ActivatedRoute,private courseService:CourseService,public utils:UtilsService,  private location: Location) {
      this.vendorForm = this.fb.group({
        vendor: ['', [Validators.required,...this.utils.validators.name]],
        description: ['', [Validators.required,...this.utils.validators.name]]

      });
      this.activatedRoute.queryParams.subscribe(params => {
        this.id = params['id'];
        // this.getVendorById(this.id)
        this.getVendorById(this.id);
      })
  }

  onUpdate(){
    if(this.vendorForm.valid){
    const userData = this.vendorForm.value;
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to update this!',
      icon: 'warning',
      confirmButtonText: 'Yes',
      showCancelButton: true,
      cancelButtonColor: '#d33',
    }).then((result) => {
      if (result.isConfirmed){
        this.courseService.updateVendor(this.id, userData).subscribe((response: any) => {

          if(response){
            Swal.fire({
              title: 'Success',
              text: 'Vendor updated successfully.',
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
    this.vendorForm.markAllAsTouched();
  }
  }
  getVendorById(id:string) {
    this.courseService.getVendorById(id).subscribe(res => {
      this.vendorForm.patchValue({
        vendor: res.vendor,
        description: res.description
      })
    })
  }

  deleteVendor(id:string){
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
        this.courseService.deleteVendor(id).subscribe(result => { 
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
