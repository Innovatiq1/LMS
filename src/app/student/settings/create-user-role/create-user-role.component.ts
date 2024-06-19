import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuItemModel } from '@core/models/user.model';
import { AdminService } from '@core/service/admin.service';
import { UtilsService } from '@core/service/utils.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-user-role',
  templateUrl: './create-user-role.component.html',
  styleUrls: ['./create-user-role.component.scss']
})
export class CreateUserRoleComponent {
  userTypeFormGroup!: FormGroup;
  dataSourceArray: MenuItemModel[] = [];
  isLoading = false;
  userTypeNames: any;
  isEdit: boolean = false;

  constructor(private fb: FormBuilder, private adminService: AdminService,private router:Router, public utils: UtilsService,){

    this.userTypeFormGroup = this.fb.group({
      typeName: ['', [Validators.required, ...this.utils.validators.noLeadingSpace,...this.utils.validators.name]],
      description: ['', [Validators.required, ...this.utils.validators.noLeadingSpace, ...this.utils.validators.name]],

    });
  }

  breadscrums = [
    {
      title: 'Admin',
      items: ['Manage Users'],
      active: 'Role ',
    },
  ];
  ngOnInit() {
    this.getAllUserTypes();
  }

  edit(id:any){
    this.router.navigate(['/student/settings/create-user-type'],{queryParams:{id:id}});
  // this.router.navigate(['/Users/Type/edit'],{queryParams:{id:id}});
  }
  getAllUserTypes(filters?: any) {
    this.adminService.getUserTypeList({ 'allRows':true }).subscribe(
      (response: any) => {
        this.userTypeNames = response;
        console.log("types", this.userTypeNames)
      },
      (error) => {
      }
    );
  }

  createUserType(): any {
    console.log("createUserType", this.userTypeFormGroup);
    if(this.userTypeFormGroup.valid){
      let userId = localStorage.getItem('id');
      let formData = this.userTypeFormGroup.getRawValue();
      let selectedMenuItems = []
      selectedMenuItems = this.getCheckedItems(this.dataSourceArray).filter((v: any) => v);
      formData.menuItems = selectedMenuItems;
  
      return new Promise((resolve, reject) => {
        formData.adminId=userId;
        this.adminService.createUserType(formData).subscribe(
          (response: unknown) => {
            this.isLoading = false;
            Swal.fire({
              title: 'Successful',
              text: 'Role created succesfully.Add modules by selecting the role from existing roles',
              icon: 'success',
            }).then((result) => {
              // this.router.navigate(['student/settings/create-user-type'])
            }
            );
            this.userTypeFormGroup.reset();
            this.getAllUserTypes()
            resolve(response)
          },
          (error: { message: any; error: any; }) => {
            this.isLoading = false;
            Swal.fire(
              'Role Exists Already',
              error.message || error.error,
              'error'
            );
            reject(error)
          }
        );
      })
    }else{
      this.userTypeFormGroup.markAllAsTouched(); 
    }
   
  }

  getCheckedItems(obj: any) {
    return obj.map((item: { checked: any; children: string | any[]; }) => {
      if (item.checked)
        return item
      if (item?.children?.length) {
        const children = this.getCheckedItems(item.children).filter((v: any) => v);
        if (children.length)
          return {
            ...item,
            children
          }
      }
      return null;
    })
  }

}
