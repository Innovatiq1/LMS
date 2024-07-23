import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuItemModel } from '@core/models/user.model';
import { AdminService } from '@core/service/admin.service';
import { AuthenService } from '@core/service/authen.service';
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
  isCreate: boolean = false;

  constructor(private fb: FormBuilder, private adminService: AdminService,private router:Router, public utils: UtilsService,
    private authenService: AuthenService){

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
    const roleDetails =this.authenService.getRoleDetails()[0].settingsMenuItems
    let urlPath = this.router.url.split('/');
    const parentId = `${urlPath[1]}/${urlPath[2]}`;
    const childId =  urlPath[urlPath.length - 1];
    let parentData = roleDetails.filter((item: any) => item.id == parentId);
    let childData = parentData[0].children.filter((item: any) => item.id == childId);
    let actions = childData[0].actions
    let createAction = actions.filter((item:any) => item.title == 'Create')
    let editAction = actions.filter((item:any) => item.title == 'Edit')

    if(createAction.length >0){
      this.isCreate = true;
    }
    if(editAction.length >0){
      this.isEdit = true;
    }
    this.getAllUserTypes();
  }

  edit(id:any){
    this.router.navigate(['/student/settings/create-user-type'],{queryParams:{id:id}});
  // this.router.navigate(['/Users/Type/edit'],{queryParams:{id:id}});
  }
  getAllUserTypes(filters?: any) {
    let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
        this.adminService.getUserTypeList({ 'allRows':true },userId).subscribe(
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
      let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
            let formData = this.userTypeFormGroup.getRawValue();
      let selectedMenuItems = []
      selectedMenuItems = this.getCheckedItems(this.dataSourceArray).filter((v: any) => v);
      formData.menuItems = selectedMenuItems;
  
      return new Promise((resolve, reject) => {
        formData.companyId=userId;
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
