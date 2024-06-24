import { Component, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '@core/models/user';
import { AuthService } from '@core/service/auth.service';
import { CourseService } from '@core/service/course.service';
import { DeptService } from '@core/service/dept.service';
import { EtmsService } from '@core/service/etms.service';
import { UtilsService } from '@core/service/utils.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-department-budget',
  templateUrl: './create-department-budget.component.html',
  styleUrls: ['./create-department-budget.component.scss'],
})
export class CreateDepartmentBudgetComponent implements OnInit {
  breadscrums = [
    {
      title: 'Over All Budget',
      // items: ['Extra'],
      active: 'Allocate Department Budget',
    },
  ];
  authForm!: UntypedFormGroup;
  departmentForm: UntypedFormGroup;
  editUrl: boolean;
  subscribeParams: any;
  departmentId: any;
  users!: User[];
  department: any;
  hodVal: any;
  directorId: any;
  employeName!: string;
  directorName: any;
  private _id: any;
  action: any;
  constructor(
    private fb: UntypedFormBuilder,
    private courseService: CourseService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private deptService: DeptService,
    private authService: AuthService,
    public utils: UtilsService,
    private etmsService: EtmsService
  ) {
    this.activatedRoute.queryParams.subscribe((params) => {
      this._id = params['id'];
      this.action = params['action'];
      
    });

    let urlPath = this.router.url.split('/');
    this.editUrl = urlPath.includes('edit-department-budget');
    if (this.action === "edit") {
      this.breadscrums = [
        {
          title: 'Overall Budget',
          // items: ['Department'],
          active: 'Allocate Department Budget',
        },
      ];
    }

    this.departmentForm = this.fb.group({
      department: [
        '',
        [
          Validators.required,
          ...this.utils.validators.dname,
          this.utils.noLeadingSpace,
        ],
      ],
      hod: ['', [Validators.required]],
      year: [
        '',
        [],
      ],
      name: [
        '',
        [
          Validators.required,
          this.utils.noLeadingSpace,
        ],
      ],
      trainingBudget: [
        '',
        [
          Validators.required,
          ...this.utils.validators.budget,
          this.utils.noLeadingSpace,
        ],
      ],
      approvedEmail: [
        '',
        [
          Validators.required,
        ],
      ],
    });
    this.subscribeParams = this.activatedRoute.params.subscribe(
      (params: any) => {
        this.departmentId = params.id;
      }
    );
    
    if (this.action === 'edit') {
      this.editRequest();
    }
  }
  ngOnInit(): void {
    // this.loadUsers();
    this.editRequest();
    this.getAllDepartment();

    this.getUserId();
  }

  getAllDepartment() {
    this.deptService
      .getAllDepartments({ status: 'active' })
      .subscribe((data: any) => {
        this.department = data.data.docs;
        
      });
  }

  onSelectDept(event: any) {
    console.log('onSelectDept', event.target.innerText);
    const data = event.target.innerText;

    this.department
      .filter((res: { department: any }) => res.department === data)
      .map((data: any) => {
        this.departmentForm.patchValue({
          hod: data.hod
        })
      }

      );

  }
  // private loadUsers() {
  //   this.authService.getDirectorHeads().subscribe(
  //     (response: any) => {
  //       this.users = response.data;
  //     },
  //     (error) => {
  //     }
  //   );
  // }

  // getDepartmentById(){
  //   this.courseService.getDepartmentById(this.departmentId).subscribe((response:any)=>{
  //     let details = response;
  //     this.departmentForm.patchValue({
  //       department:response?.department,
  //       hod:response?.hod,
  //       trainingBudget:response?.trainingBudget,
  //       percentage:response?.percentage,
  //       value:response?.value,
  //       budget:response?.budget,
  //     })

  //   })
  // }
  getUserId() {
    let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
    
    this.etmsService.getUserId(userId).subscribe((response: any) => {
      
      this.directorId = response.director,
        this.employeName = response?.name +
        ' ' +
        (response.last_name ? response.last_name : ''),
        this.etmsService.getUserId(this.directorId).subscribe((res: any) => {


          this.directorName = response?.directorName,

            this.departmentForm.patchValue({
              // trainingBudget: "",
              // year: "",
              name: this.directorName,
              approvedEmail: res?.email,

            });
        });

    });
  }




  onSubmit() {
    let userName = JSON.parse(localStorage.getItem('user_data')!).user.name;
    let dirID = JSON.parse(localStorage.getItem('user_data')!).user.director;
    console.log("userName: " + dirID);
    let payload = {
      departmentName: this.departmentForm.value.department,
      hod: this.departmentForm.value.hod,
      year: this.departmentForm.value.year,
      trainingBudget: this.departmentForm.value.trainingBudget,
      name: this.departmentForm.value.name,
      email: this.departmentForm.value.approvedEmail,
      director: dirID,
      approval: "Pending",
      employeeName: userName


    }
    
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to create department!',
      icon: 'warning',
      confirmButtonText: 'Yes',
      showCancelButton: true,
      cancelButtonColor: '#d33',
    }).then((result) => {
      if (result.isConfirmed){


        this.etmsService.createDept(payload).subscribe(data => {
          
          if (data) {
            Swal.fire({
              icon: 'success',
              title: 'Department Created Successfully',
              showConfirmButton: false,
              timer: 1500,
            });
            this.router.navigate(['/admin/e-tms/department-budget-allocation']);
    
          }
        })
      }
    });
    // if (this.departmentForm.valid) {
    //   if (this.editUrl) {
    //     this.courseService.updateDepartment(this.departmentForm.value, this.departmentId).subscribe((response: any) => {
    //       Swal.fire({
    //         title: 'Successful',
    //         text: 'Department updated successfully',
    //         icon: 'success',
    //       });
    //       this.router.navigate(['/admin/budget/dept-budget'])
    //     });
    //   } else {
    //     this.courseService.saveDepartment(this.departmentForm.value).subscribe((response: any) => {
    //       Swal.fire({
    //         title: 'Successful',
    //         text: 'Department created successfully',
    //         icon: 'success',
    //       });
    //       this.router.navigate(['/admin/e-tms/department-budget-allocation'])
    //     });
    //   }
    // } else {
    // }
  }

  
  editRequest() {
    this.etmsService.getDeptBudgetById(this._id).subscribe((res: any) => {
      
  
      this.departmentForm.patchValue({
        department: res.departmentName,
        hod: res.hod,
        trainingBudget: res.trainingBudget,
        year: res.year,
      });
    });
  }

updateRequest(){
 const payload = {
  departmentName: this.departmentForm.value.department,
  hod: this.departmentForm.value.hod,
  year: this.departmentForm.value.year,
  trainingBudget: this.departmentForm.value.trainingBudget,
  name: this.departmentForm.value.name,
  email: this.departmentForm.value.approvedEmail,
  // director: this.directorId,
  // approval: "Pending",
  employeeName: this.employeName
 }
 Swal.fire({
    title: 'Are you sure?',
    text: 'Do you want to update!',
    icon: 'warning',
    confirmButtonText: 'Yes',
    showCancelButton: true,
    cancelButtonColor: '#d33',
  }).then((result) => {
    if (result.isConfirmed){
      this.etmsService.updateBudget(this._id,payload).subscribe(data =>{
        
        if(data){
          Swal.fire({
            icon:'success',
            title: 'Department Budget Updated Successfully',
            showConfirmButton: false,
            timer: 1500,
          });
          this.router.navigate(['/admin/e-tms/department-budget-allocation']);
        }
      })
    }
  });
 

  // this.router.navigate(['/admin/e-tms/edit-department-budget/']);
}

}
