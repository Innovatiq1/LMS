import { Component, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Users } from '@core/models/user.model';
import { DeptService } from '@core/service/dept.service';
import { UserService } from '@core/service/user.service';
import Swal from 'sweetalert2';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-department-modal',
  templateUrl: './department-modal.component.html',
  styleUrls: ['./department-modal.component.scss']
})
export class DepartmentModalComponent {
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
  constructor(private fb: UntypedFormBuilder,private deptService: DeptService,private router:Router,private userService: UserService,
    private activatedRoute:ActivatedRoute, public dialogRef: MatDialogRef<DepartmentModalComponent>) {
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
      email: [
        '',
        [Validators.required, Validators.email, Validators.minLength(5)],
      ],
      departmentStartDate: ['',[Validators.required]],
      studentCapacity: ['', [Validators.required]],
      details: [''],
    });
    this.subscribeParams = this.activatedRoute.params.subscribe((params:any) => {
      this.departmentId = params.id;
    });
    if(this.editUrl){
      this.getDepartmentById();
    }
  }
  ngOnInit(): void {
  this.userList()
  }
  onSelectChange1(event: any) {
    const selectedValue = event.value;
    
    let userfindEmail:Users[]=this.users.filter(event=>event.id===selectedValue)
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
      let details = response;
      this.departmentForm.patchValue({
        department:response?.department,
        hod:response?.hodId,
        mobile:response?.mobile,
        email:response?.email,
        departmentStartDate:response?.departmentStartDate,
        studentCapacity:response?.studentCapacity,
        details:response?.details
      })

    })
  }

  onSubmit() {
  if(this.departmentForm.valid){
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
          this.dialogRef.close();
        });
      }
    });
  }else{
    this.departmentForm.markAllAsTouched();
  }
     
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
