import { Component, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CoursePaginationModel } from '@core/models/course.model';
import { Users } from '@core/models/user.model';
import { DeptService } from '@core/service/dept.service';
import { UserService } from '@core/service/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-department',
  templateUrl: './add-department.component.html',
  styleUrls: ['./add-department.component.scss'],
})
export class AddDepartmentComponent  implements OnInit {
  departmentForm: UntypedFormGroup;
  breadscrums = [
    {
      title: ' Add Department',
      items: ['Department'],
      active: 'Add',
    },
  ];
  editUrl: boolean;
  users!: Users[];
  subscribeParams: any;
  departmentId: any;
  hod: any;
  hodName: any;
  depts: any;
  departmentPaginationModel!: Partial<CoursePaginationModel>;
  deptName: any;

  constructor(private fb: UntypedFormBuilder,private deptService: DeptService,private router:Router,private userService: UserService,
    private activatedRoute:ActivatedRoute) {
    let urlPath = this.router.url.split('/')
    this.editUrl = urlPath.includes('edit-department'); 
    if(this.editUrl===true){
      this.breadscrums = [
        {
          title:'Edit Department',
          items: ['Department'],
          active: 'Edit',
        },
      ];
    }

    this.departmentForm = this.fb.group({
      department: ['', [Validators.required]],
      hod: ['', [Validators.required]],
      mobile: ['', [Validators.required]],
      departmentStartDate: [''],
      studentCapacity: ['', [Validators.required]],
      details: [''],
    });
    this.subscribeParams = this.activatedRoute.params.subscribe((params:any) => {
      this.departmentId = params.id;
    });
   
    this.departmentPaginationModel = {};
  }
  ngOnInit(): void {
  this.userList();
  this.getAllDepartments()
  }
  getAllDepartments(){
    this.deptService.getAllDepartments({ ...this.departmentPaginationModel, status: 'active' }).subscribe((response: { data: { docs: any; totalDocs: any; page: any; limit: any; }; }) =>{
     this.depts = response.data.docs;
     if(this.editUrl){
      this.getDepartmentById();
    }
    })
    
  }
  onSelectChange1(event: any) {
    const selectedValue = event.value;
    
    let userfindEmail:Users[]=this.users.filter(event=>event.id===selectedValue)
    console.log(userfindEmail)
    this.hod=selectedValue
    this.hodName=userfindEmail[0].name + " "+ (userfindEmail[0].last_name?userfindEmail[0].last_name:'')
    
  }
  
  userList(){
  this.userService.getUserList1().subscribe((response: any) => {
    this.users=response.data
  }, error => {
  });
  }
  getDepartmentById(){
    this.deptService.getDepartmentById(this.departmentId).subscribe((response:any)=>{
      this.deptName = this.depts.find((department: any) => department.department === response.department).department;
      this.departmentForm.patchValue({
        department:this.deptName,
        hod:response?.hodId,
        mobile:response?.mobile,
        departmentStartDate:response?.departmentStartDate,
        studentCapacity:response?.studentCapacity,
        details:response?.details
      })

    })
  }

  onSubmit() {
    if(this.editUrl){
    const department= this.departmentForm.value
    department['hod']= this.hodName
    department['hodId']= this.hod

    
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to update department profile!',
      icon: 'warning',
      confirmButtonText: 'Yes',
      showCancelButton: true,
      cancelButtonColor: '#d33',
    }).then((result) => {
      if (result.isConfirmed){
        this.deptService.updateDepartment(this.departmentId,this.departmentForm.value).subscribe((response:any) => {
          Swal.fire({
            title: 'Successful',
            text: 'Department Profile updated successfully',
            icon: 'success',
          });
          this.router.navigate(['/student/settings/all-departments'])
        });
      }
    });
      
    } else {
    const department= this.departmentForm.value
    department['hod']= this.hodName
    department['hodId']= this.hod
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
          this.router.navigate(['/student/settings/all-departments'])
        });
      }
    });
     
    }
 
  }
  cancel() {
  
    window.history.back();
  }
}
