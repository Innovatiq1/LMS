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
  selector: 'app-create-dept-budget-request',
  templateUrl: './create-dept-budget-request.component.html',
  styleUrls: ['./create-dept-budget-request.component.scss']
})
export class CreateDeptBudgetRequestComponent {
  breadscrums = [
    {
      title: 'Over All Budget',
      items: ['Allocation'],
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
           items: ['Allocation'],
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
  getUserId() {
    let userId = localStorage.getItem('id');

    this.etmsService.getUserId(userId).subscribe((response: any) => {
      
      this.directorId = response.director,
        this.employeName = response?.name +
        ' ' +
        (response.last_name ? response.last_name : ''),
        this.etmsService.getUserId(this.directorId).subscribe((res: any) => {


          this.directorName = response?.directorName,

            this.departmentForm.patchValue({
              name: this.directorName,
              approvedEmail: res?.email,

            });
        });

    });
  }




  onSubmit() {
    let userName = JSON.parse(localStorage.getItem('user_data')!).user.name;
    let email = JSON.parse(localStorage.getItem('user_data')!).user.email;
    let dirID = JSON.parse(localStorage.getItem('user_data')!).user.director;
    let payload = {
      departmentName: this.departmentForm.value.department,
      hod: this.departmentForm.value.hod,
      year: this.departmentForm.value.year,
      trainingBudget: this.departmentForm.value.trainingBudget,
      name: this.departmentForm.value.name,
      email: this.departmentForm.value.approvedEmail,
      director: dirID,
      approval: "Pending",
      employeeName: userName,
      employeeEmail:email


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
            this.router.navigate(['/admin/budgets/allocation']);
    
          }
        }) 
      }
    });
  }
cancel(){
  window.history.back()
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
  employeeName: this.employeName
 }

 
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to update this department!',
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
            this.router.navigate(['/admin/budgets/allocation']);
          }
        }) 
      }
    });
}
}
