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
  selector: 'app-edit-super-admin',
  templateUrl: './edit-super-admin.component.html',
  styleUrls: ['./edit-super-admin.component.scss']
})
export class EditSuperAdminComponent {
  breadscrums = [
    {
      title: 'Blank',
      items: ['Super Admin'],
      active: 'Edit Company',
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
      name: new FormControl('', [Validators.required, Validators.pattern(/[a-zA-Z0-9]+/),...this.utils.validators.noLeadingSpace]),
      website:new FormControl('', []),
      Active: new FormControl('true', [Validators.required]),
      company: new FormControl('', [Validators.required]),
      mobile: new FormControl('', [Validators.required,...this.utils.validators.mobile]),
      address: new FormControl('', []),
      email: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/),
      ]),
      password: new FormControl('', [Validators.required]),
      re_passwords: new FormControl('', []),
      type: new FormControl('admin', [Validators.required]),
      joiningDate: new FormControl('', [Validators.required]),
     
    });
    this.getBlogsList();
    this.getDepartment();
    this.getUserTypeList();
  }
  
  openDialog(): void {
    const dialogRef = this.dialog.open(DepartmentModalComponent, {
      width: '50%',
      height: '80%',
      maxHeight: '95vh',
      autoFocus: false,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getDepartment();
    });
  }

  getDepartment() {
    this.StudentService.getDepartmentsForSuperAdmin().subscribe((response: any) => {
      this.dept = response.data.docs;
    });
  }

  openRoleModal() {
    this.logoService.getSuperAdminSidemenu().subscribe((response: any) => {
      let MENU_LIST = response.data.docs[0].MENU_LIST;
      const items = this.convertToMenuV2(MENU_LIST, null);
      const dataSourceArray: MenuItemModel[] = [];
      items?.forEach((item, index) => {
        if (!dataSourceArray.some((v) => v.id === item.id))
          dataSourceArray.push(item);
      });

      const dialogRef = this.dialog.open(CreateRoleTypeComponent, {
        data: dataSourceArray,
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result?.typeName) {
          this.getUserTypeList(null, result?.typeName);
        }
      });
    });
  }
  getUserTypeList(filters?: any, typeName?: any) {
    this.adminService.getUserTypeList({ allRows: true }).subscribe(
      (response: any) => {
        this.userTypes = response;
        if (typeName) {
          this.userForm.patchValue({
            type: typeName,
          });
        }
      },
      (error) => {}
    );
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
          text: 'Do you want to update user!',
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
    let user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (!formObj.invalid) {
      formObj['type'] = formObj.type;
      formObj['role'] = formObj.role;
      formObj['isLogin'] = true;
      formObj['adminId'] = user.user.id;
      formObj['adminEmail'] = user.user.email;
      formObj['adminName'] = user.user.name;

      const userData: Users = formObj;
      userData.avatar = this.avatar; 
     
          this.updateUser(userData);
          
        window.history.back();
        }
      }
  updateUser(obj: any) {
    return new Promise((resolve, reject) => {
      this.userService.updateUsers(obj, this.currentId).subscribe(
        (response) => {
          this.isLoading = false;
          Swal.fire({
            title: 'Successful',
            text: 'User updated succesfully',
            icon: 'success',
          }).then(() => {
            resolve(response);
          });
          this.router.navigate(['/super-admin/view-admin']);
        },
        (error) => {
          this.isLoading = false;
          Swal.fire(
            'Failed to update user',
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
        this.data = response.data.data;
        this.avatar = this.data?.avatar;
        this.uploaded = this.avatar?.split('/');
        let image = this.uploaded?.pop();
        this.uploaded = image?.split('\\');
        this.fileName = this.uploaded?.pop();
        if (this.data) {
          this.userForm.patchValue({
            name: this.data?.name,
            email: this.data?.email,
            password: this.data?.password,
            re_passwords: this.data.conformPassword,
            Active:this.data.Active.toString(),
            type: this.data?.type,
            fileName: this.data?.avatar,
            website:this.data.website,
            mobile: this.data?.mobile,
            joiningDate: this.data?.joiningDate,
            address: this.data?.address,
            company:this.data?.company
          });
        }
      },
      (error) => {}
    );
  }

  onNoClick(){
    this.router.navigateByUrl('/super-admin/view-admin');
  }
}
