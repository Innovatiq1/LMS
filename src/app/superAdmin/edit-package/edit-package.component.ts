import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItemModel, UserType, Users } from '@core/models/user.model';
import { AdminService } from '@core/service/admin.service';
import { UserService } from '@core/service/user.service';
import { UtilsService } from '@core/service/utils.service';
import { DepartmentModalComponent } from 'app/admin/departments/department-modal/department-modal.component';
import { StudentsService } from 'app/admin/students/students.service';
import { CreateRoleTypeComponent } from 'app/admin/users/create-role-type/create-role-type.component';
import { LogoService } from 'app/student/settings/logo.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-package',
  templateUrl: './edit-package.component.html',
  styleUrls: ['./edit-package.component.scss']
})
export class EditPackageComponent {
  breadscrums = [
    {
      title: 'Blank',
      items: ['Super Admin'],
      active: 'Edit Package',
    },
  ];
  userForm!: FormGroup;
  hide = true;
  dept: any;
  avatar: any;
  userTypes: UserType[] | undefined;
  isSubmitted: boolean = false;
  status = true;
  isLoading: boolean = true;
  data: any;
  uploaded: any;
  fileName: any;
  currentId:any;
  constructor(
    public _fb: FormBuilder,
    public dialog: MatDialog, private router: Router,public activeRoute: ActivatedRoute,
    private StudentService: StudentsService,private logoService: LogoService,private adminService: AdminService,public utils: UtilsService, private userService: UserService,
  ) {
    this.activeRoute.queryParams.subscribe(params => {
      this.currentId = params['id'];
    })

  }
  ngOnInit() {
    this.userForm = this._fb.group({
      users: new FormControl('', [Validators.required]),
      company: new FormControl('', [Validators.required]),
      courses: new FormControl('', [Validators.required]),
      expiryDate: new FormControl('', [Validators.required]),
      password: new FormControl(''),
    });
    this.getBlogsList();
  }
 
 
  convertToMenuV2(obj: any[], value: any): MenuItemModel[] {
    return obj.map((v) => {
      const menu_item = this.checkChecked(value, v?.id);
      const children =
        v?.children && v?.children.length
          ? this.convertToMenuV2(v.children, menu_item?.children)
          : [];
      const defaultCheck = this.checkChecked(value, v.id);
      let res: any = {
        title: v?.title,
        id: v?.id,
        children: [],
        checked: false,
        indeterminate: defaultCheck?.indeterminate || false,
        icon: v?.iconsrc,
      };
      if (children && children.length) {
        res = {
          ...res,
          children,
        };
        res.children = res.children.map((c: any) => ({
          ...c,
          isLeaf: true,
        }));
      }
      if (v?.actions && v?.actions?.length) {
        const actionChild = v?.actions.map((action: any) => {
          const actionChecked = this.checkChecked(
            menu_item?.children,
            `${v.id}__${action}`
          );
          return {
            title: action,
            id: `${v.id}__${action}`,
            isAction: true,
            _id: action,
            isLeaf: true,
            checked: actionChecked?.checked || false,
            indeterminate: actionChecked?.indeterminate || false,
            icon: actionChecked?.iconsrc,
          };
        });
        res = {
          ...res,
          children: actionChild,
        };
      }
      return res;
    });
  }
  
  checkChecked(items: any[], id: string) {
    return items?.find((v) => v.id === id);
  }
  update() {
    if (this.userForm.valid) {
    
        Swal.fire({
          title: 'Are you sure?',
          text: 'Do you want to update package!',
          icon: 'warning',
          confirmButtonText: 'Yes',
          showCancelButton: true,
          cancelButtonColor: '#d33',
        }).then((result) => {
          if (result.isConfirmed) {
            this.updateBlog(this.userForm.value);
          }
        });
        
    } else {
      this.userForm.markAllAsTouched(); 
      this.isSubmitted = true;
    }
  }

  updateBlog(formObj: any) {
    console.log('Form Value', formObj);
    let user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (!formObj.invalid) {
      // Prepare user data for update
      formObj['Active'] = this.status;
      formObj['isLogin'] = true;
      formObj['adminId'] = user.user.id;
      formObj['adminEmail'] = user.user.email;
      formObj['adminName'] = user.user.name;

      const userData: Users = formObj;
     
          this.updateUser(userData);
          
        window.history.back();
        }
      // this.updateUser(userData);
      // Swal.close();
      }
  updateUser(obj: any) {
    return new Promise((resolve, reject) => {
      obj['Active'] = this.status;
      this.userService.updateUsers(obj, this.currentId).subscribe(
        (response) => {
          this.isLoading = false;
          Swal.fire({
            title: 'Successful',
            text: 'Package updated succesfully',
            icon: 'success',
          }).then(() => {
            resolve(response);
          });
          window.history.back();
        },
        (error) => {
          this.isLoading = false;
          Swal.fire(
            'Failed to update package',
            error.message || error.error,
            'error'
          );
          reject(error);
        }
      );
    });
  }


  getBlogsList(filters?: any) {

    this.userService.getUserById(this.currentId).subscribe(
      (response: any) => {
        console.log('listing user', response);
        this.data = response.data.data;
        if (this.data) {
          this.userForm.patchValue({
            users: this.data?.users,
            courses: this.data?.courses,
            company:this.data?.company,
            expiryDate: this.data?.expiryDate,
            password: this.data?.password
          });
        }
      },
      (error) => {}
    );
  }

  onNoClick(){
    window.history.back();
  }
 
}
