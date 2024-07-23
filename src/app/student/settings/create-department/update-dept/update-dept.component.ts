import { Component } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DeptService } from '@core/service/dept.service';
import { UserService } from '@core/service/user.service';
import Swal from 'sweetalert2';
import { Location } from '@angular/common';
import { UtilsService } from '@core/service/utils.service';
import { AuthenService } from '@core/service/authen.service';

@Component({
  selector: 'app-update-dept',
  templateUrl: './update-dept.component.html',
  styleUrls: ['./update-dept.component.scss'],
})
export class UpdateDeptComponent {
  departmentForm!: UntypedFormGroup;
  breadscrums = [
    {
      title: 'Department',
      items: ['Manage Users'],
      active: 'Department',
    },
  ];
  id: any;
  isDelete = false;

  constructor(
    private fb: UntypedFormBuilder,
    private deptService: DeptService,
    private router: Router,
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    public utils: UtilsService,
    private authenService: AuthenService
  ) {
    this.departmentForm = this.fb.group({
      department: ['', [Validators.required,...this.utils.validators.noLeadingSpace,...this.utils.validators.dname]],
      description: ['', [Validators.required,...this.utils.validators.noLeadingSpace,...this.utils.validators.name]],
    });
  }

  ngOnInit() {
    const roleDetails =this.authenService.getRoleDetails()[0].settingsMenuItems
    let urlPath = this.router.url.split('/');
    const parentId = `${urlPath[1]}/${urlPath[2]}`;
    const childId =  urlPath[urlPath.length - 2];
    let parentData = roleDetails.filter((item: any) => item.id == parentId);
    let childData = parentData[0].children.filter((item: any) => item.id == childId);
    let actions = childData[0].actions
    let deleteAction = actions.filter((item:any) => item.title == 'Delete')

   
    if(deleteAction.length >0){
      this.isDelete = true;
    }
    this.activatedRoute.queryParams.subscribe((params) => {
      this.id = params['id'];
      this.getDepartmentById(this.id);
    });
  }

  getDepartmentById(id: string) {
    this.deptService.getDepartmentById(id).subscribe((data) => {
      this.departmentForm.patchValue({
        department: data.department,
        description: data.description,
      });
    });
  }
  onUpdate() {
    if(this.departmentForm.valid) {
      Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to update this!',
        icon: 'warning',
        confirmButtonText: 'Yes',
        showCancelButton: true,
        cancelButtonColor: '#d33',
      }).then((result) => {
        if (result.isConfirmed) {
          this.deptService
            .updateDepartment(this.id, this.departmentForm.value)
            .subscribe((res) => {
              Swal.fire({
                title: 'Success',
                text: 'Department updated successfully.',
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
            });
          this.router.navigate(['/student/settings/create-department']);
        }
      });
    }else{
      this.departmentForm.markAllAsTouched
    }
   
  }

  deleteDept(id: string) {
    Swal.fire({
      title: 'Confirm Deletion',
      text: 'Are you sure you want to delete this course kit?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.deptService.deleteDepartment(id).subscribe((result) => {
          Swal.fire({
            title: 'Success',
            text: 'Record Deleted Successfully...!!!',
            icon: 'success',
            // confirmButtonColor: '#526D82',
          });
          this.router.navigate(['/student/settings/create-department']);
        });
      }
    });
  }

  goBack(): void {
    this.location.back();
  }
}
