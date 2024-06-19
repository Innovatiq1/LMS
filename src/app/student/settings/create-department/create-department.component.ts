import { Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CoursePaginationModel } from '@core/models/course.model';
import { DeptService } from '@core/service/dept.service';
import { UserService } from '@core/service/user.service';
import { UtilsService } from '@core/service/utils.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-department',
  templateUrl: './create-department.component.html',
  styleUrls: ['./create-department.component.scss']
})
export class CreateDepartmentComponent {
  departmentForm!: UntypedFormGroup;
  breadscrums = [
    {
      title: 'Department',
      items: ['Manage Users'],
      active: 'Department',
    },
  ];
  hod: any;
  hodName: any;
  dataSource: any;
  departmentPaginationModel!: Partial<CoursePaginationModel>;
  
  constructor(private fb: UntypedFormBuilder,private deptService: DeptService,private router:Router,private userService: UserService,
   public utils: UtilsService) {
    

    this.departmentForm = this.fb.group({
      department: ['', [Validators.required, ...this.utils.validators.noLeadingSpace,...this.utils.validators.dname]],
      description: ['', [Validators.required,...this.utils.validators.noLeadingSpace,...this.utils.validators.name]],
      // hod: ['', [Validators.required]],
      // mobile: ['', [Validators.required]],
      // email: [
      //   '',
      //   [Validators.required, Validators.email, Validators.minLength(5)],
      // ],
      // departmentStartDate: [''],
      // studentCapacity: ['', [Validators.required]],
      // details: [''],
    });
  
    this.departmentPaginationModel = {};
  }

  ngOnInit() {
    this.getAllDepartments()
  }

  onSubmit() {
    if (this.departmentForm.valid) {
      let userId = localStorage.getItem('id');
      this.departmentForm.value.adminId=userId;
      Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to create department!',
        icon: 'warning',
        confirmButtonText: 'Yes',
        showCancelButton: true,
        cancelButtonColor: '#d33',
      }).then((result) => {
        if (result.isConfirmed){
          this.deptService.saveDepartment(this.departmentForm.value).subscribe((response: any) => {
            Swal.fire({
              title: 'Successful',
              text: 'Department created successfully',
              icon: 'success',
            });
            this.getAllDepartments();
            this.router.navigate(['/student/settings/create-department'])
          },(error) => {
            Swal.fire({
              title: 'Error',
              text: 'Department already exists',
              icon: 'error',
            });
  
          });
        }
      });
    }else{
      this.departmentForm.markAllAsTouched(); 
    }
   
     
    // }
 
  }

  
  getAllDepartments(){
    this.deptService.getAllDepartments({ ...this.departmentPaginationModel, status: 'active' }).subscribe((response: { data: { docs: any; totalDocs: any; page: any; limit: any; }; }) =>{
     this.dataSource = response.data.docs;
    })
  }


  update(id: string) {
    this.router.navigate(['/student/settings/update-department'], {
      queryParams: {
        id: id
      }
    });
  }
}
