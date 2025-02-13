import { Component,Optional,Inject } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CoursePaginationModel } from '@core/models/course.model';
import { AuthenService } from '@core/service/authen.service';
import { DeptService } from '@core/service/dept.service';
import { UserService } from '@core/service/user.service';
import { UtilsService } from '@core/service/utils.service';
import Swal from 'sweetalert2';
import { MatDialog,MAT_DIALOG_DATA,MatDialogRef } from '@angular/material/dialog';
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
  isCreate = false;
  isEdit = false;
  isDelete = false;
  isView=false;
  dialogStatus:boolean=false;
  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data11: any,
    private fb: UntypedFormBuilder,
    private deptService: DeptService,
    private router:Router,
    private userService: UserService,
   public utils: UtilsService,
   private authenService: AuthenService,
   @Optional() private dialogRef: MatDialogRef<CreateDepartmentComponent>
  
  ) {
    if (data11) {
      this.dialogStatus=true;
      //  console.log("Received variable:", data11.variable);
    }

    this.departmentForm = this.fb.group({
      department: ['', [Validators.required, ...this.utils.validators.noLeadingSpace,...this.utils.validators.dname]],
      description: ['', [Validators.required,...this.utils.validators.noLeadingSpace,...this.utils.validators.name]],
     
    });
  
    this.departmentPaginationModel = {};
  }

  ngOnInit() {
    const roleDetails =this.authenService.getRoleDetails()[0].settingsMenuItems
    let urlPath = this.router.url.split('/');
    const parentId = `${urlPath[1]}/${urlPath[2]}`;
    const childId =  urlPath[urlPath.length - 1];
    let parentData = roleDetails.filter((item: any) => item.id == parentId);
    let childData = parentData[0].children.filter((item: any) => item.id == childId);
    let actions = childData[0].actions
    let createAction = actions.filter((item:any) => item.title == 'Create')
    let editAction = actions.filter((item:any) => item.title == 'Edit')
    let viewAction = actions.filter((item:any) => item.title == 'View')
    
  
    if(viewAction.length >0){
      this.isView = true;
    }

    if(createAction.length >0){
      this.isCreate = true;
    }
    if(editAction.length >0){
      this.isEdit = true;
    }
    this.getAllDepartments()
  }

  onSubmit() {
    if (this.departmentForm.valid) {
      let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
            this.departmentForm.value.companyId=userId;
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
            if (this.dialogRef) {
              this.dialogRef.close();  
            }
            else{
              this.router.navigate(['/student/settings/create-department'])

            }
            
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
 
  }

  
  getAllDepartments(){
    this.deptService.getAllDepartments({ ...this.departmentPaginationModel, status: 'active' }).subscribe((response: { data: { docs: any; totalDocs: any; page: any; limit: any; }; }) =>{
     this.dataSource = response.data.docs;
    })
  }


  update(id: string) {
    this.router.navigate(['/student/settings/create-department/update-department'], {
      queryParams: {
        id: id
      }
    });
  }
  closeDialog(): void {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }
}
