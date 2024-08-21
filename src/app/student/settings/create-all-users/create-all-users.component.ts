import { Component, TemplateRef, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  MenuItemModel,
  Student,
  UserType,
  Users,
} from '@core/models/user.model';
import { AdminService } from '@core/service/admin.service';
import { UserService } from '@core/service/user.service';
import { UtilsService } from '@core/service/utils.service';
import { StudentService } from '@core/service/student.service';
import Swal from 'sweetalert2';
import { CourseService } from '@core/service/course.service';
import { StudentsService } from 'app/admin/students/students.service';
import { MatDialog } from '@angular/material/dialog';
import { CreateRoleTypeComponent } from 'app/admin/users/create-role-type/create-role-type.component';
import { LogoService } from 'app/student/settings/logo.service';
import { MatTableDataSource } from '@angular/material/table';
import { DepartmentModalComponent } from '../../../admin/departments/department-modal/department-modal.component';
import { FormService } from '@core/service/customization.service';

@Component({
  selector: 'app-create-all-users',
  templateUrl: './create-all-users.component.html',
  styleUrls: ['./create-all-users.component.scss'],
})
export class CreateAllUsersComponent {
  isLoading = false;
  files: any;
  fileName: any;
  create = true;
  status = true;
  edit = true;
  editUrl: any;
  userForm!: FormGroup;
  isSubmitted = false;
  uploaded: any;
  uploadedImage: any;
  user: Users | undefined;
  userTypes: UserType[] | undefined;
  blogsList: any;
  currentId: string;
  hide = true;
  thumbnail: any;
  avatar: any;
  dept: any;
  forms!: any[];


  breadscrums = [
    {
      title: 'Create All Users',
      items: ['Users'],
      active: 'Create User',
    },
  ];
  data: any;

  update() {
  
   


    if (this.userForm.valid) {
      if (this.editUrl) {
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
        Swal.fire({
          title: 'Are you sure?',
          text: 'Do you want to create user!',
          icon: 'warning',
          confirmButtonText: 'Yes',
          showCancelButton: true,
          cancelButtonColor: '#d33',
        }).then((result) => {
          if (result.isConfirmed) {
            this.addBlog(this.userForm.value);
          }
        });
        
      }
    } else {
      this.userForm.markAllAsTouched(); 
      this.isSubmitted = true;
    }
  }
  addBlog(formObj: any) {
   
    let user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (!formObj.invalid) {
      formObj['Active'] = this.status;
      formObj['type'] = formObj.type;
      formObj['role'] = formObj.type;
      formObj['isLogin'] = true;
      formObj['adminId'] = user.user.id;
      formObj['adminEmail'] = user.user.email;
      formObj['adminName'] = user.user.name;
      formObj['companyId'] = user.user.companyId;
      formObj['users'] = user.user.users;
      formObj['courses'] = user.user.courses;
      formObj['attemptBlock'] = false;

      const userData: Users = formObj;
      userData.avatar = this.avatar;
      this.createUser(userData);
    }
  }
  private createUser(userData: Users): void {
    this.userService.saveUsers(userData).subscribe(
      () => {
        Swal.fire({
          title: 'Successful',
          text: 'Users created successfully',
          icon: 'success',
        });
        this.userForm.reset();
        this.router.navigateByUrl('/student/settings/all-user/all-users');
      },
      (error) => {
        Swal.fire(
          error,
          error.message || error.error,
          'error'
        );
      }
    );
  }
  onFileUpload(event: any) {
    const file = event.target.files[0];
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/jfif'];
    if (!allowedTypes.includes(file.type)) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: `Selected format doesn't support. Only JPEG, PNG, JPG, and JFIF formats are allowed.!`,
      });
      return;
    }
  
    this.thumbnail = file;
    const formData = new FormData();
    formData.append('files', this.thumbnail);
  
    this.courseService.uploadCourseThumbnail(formData).subscribe((data: any) => {
      this.avatar = data.data?.thumbnail;
      this.uploaded = this.avatar?.split('/');
      let image = this.uploaded?.pop();
      this.uploaded = image?.split('\\');
      this.fileName = this.uploaded?.pop();
    });
  }
  updateBlog(formObj: any) {
    let user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (!formObj.invalid) {
      formObj['Active'] = this.status;
      formObj['type'] = formObj.type;
      formObj['isLogin'] = true;
      formObj['adminId'] = user.user.id;
      formObj['adminEmail'] = user.user.email;
      formObj['adminName'] = user.user.name;
      formObj['attemptCalculation'] = 1;
      const userData: Users = formObj;
      userData.avatar = this.avatar; 
     
          this.updateUser(userData);
          
        window.history.back();
        }
      }
  updateUser(obj: any) {
    return new Promise((resolve, reject) => {
      obj['Active'] = this.status;
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
          this.router.navigate(['/student/settings/all-user/all-users']);
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

  constructor(
    private router: Router,
    private fb: FormBuilder,
    public utils: UtilsService,
    private userService: UserService,
    private adminService: AdminService,
    private StudentService: StudentsService,
    private activeRoute: ActivatedRoute,
    private courseService: CourseService,
    public dialog: MatDialog,
    private logoService: LogoService,
    private formService: FormService,
    
  ) {
    let urlPath = this.router.url.split('/');
    this.editUrl = urlPath.includes('edit-all-users');
    this.currentId = urlPath[urlPath.length - 1];
    this.getUserTypeList();

    if (this.editUrl === true) {
      this.breadscrums = [
        {
          title: 'Edit All Users',
          items: ['Users'],
          active: 'Edit User',
        },
      ];
    }

    if (this.editUrl) {
      this.getBlogsList();
    }

    this.userForm = this.fb.group({
      name: new FormControl('', [Validators.required, Validators.pattern(/[a-zA-Z0-9]+/),...this.utils.validators.noLeadingSpace]),
      last_name: new FormControl('', []),
      rollNo: new FormControl('', [Validators.required, ...this.utils.validators.noLeadingSpace,...this.utils.validators.roll_no]),
      gender: new FormControl('', [Validators.required]),
      mobile: new FormControl('', [Validators.required,...this.utils.validators.mobile]),
      qualification: new FormControl('', []),
      department: new FormControl('', []),
      address: new FormControl('', []),
      attemptBlock: new FormControl('', []),
      email: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/),
      ]),
      password: new FormControl('', [Validators.required]),
      re_passwords: new FormControl('', []),
      education: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
      ]),
      type: new FormControl('', [Validators.required]),
      parentsName: new FormControl('', []),
      parentsPhone: new FormControl('', []),
      dob: new FormControl('', [Validators.required,...this.utils.validators.dob]),
      joiningDate: new FormControl('', [Validators.required]),
      blood_group: new FormControl('', []),
      avatar: new FormControl('', []),
      status: [
        this.user
          ? (this.user.Active = this.user.Active === true ? true : false)
          : null,
      ],
    });

    this.activeRoute.queryParams.subscribe((params) => {
    });
  }

  ngOnInit() {
    this.getDepartment();
    this.getForms();
  }

  getForms(): void {
    let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
        this.formService
      .getAllForms(userId,'User Creation Form')
      .subscribe((forms) => {
        this.forms = forms;
      });
  }

  labelStatusCheck(labelName: string): any {
    if (this.forms && this.forms.length > 0) {
      const status = this.forms[0]?.labels?.filter(
        (v: any) => v?.name === labelName
      );
      if (status && status.length > 0) {
        return status[0]?.checked;
      }
    }
    return false;
  }


  getUserTypeList(filters?: any, typeName?: any) {
    let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
    this.adminService.getUserTypeList({ allRows: true },userId).subscribe(
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

  getDepartment() {
    this.StudentService.getAllDepartments().subscribe((response: any) => {
      this.dept = response.data.docs;
    });
  }

  getBlogsList(filters?: any) {
    this.userService.getUserById(this.currentId).subscribe(
      (response: any) => {
        console.log('listing user', response);
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
            education: this.data?.education,
            type: this.data?.type,
            fileName: this.data?.avatar,
            last_name: this.data?.last_name,
            rollNo: this.data?.rollNo,
            gender: this.data?.gender,
            mobile: this.data?.mobile,
            department: this.data?.department,
            parentsName: this.data?.parentsName,
            parentsPhone: this.data?.parentsPhone,
            dob: this.data?.dob,
            joiningDate: this.data?.joiningDate,
            blood_group: this.data?.blood_group,
            address: this.data?.address,
            attemptBlock: this.data?.attemptBlock 
          });
        }
      },
      (error) => {}
    );
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

  closeDialog(): void {
    this.dialog.closeAll();
  }
back(){
  window.history.back();
}

  openRoleModal() {
    let userId = localStorage.getItem('id');
    this.logoService.getSidemenu(userId).subscribe((response: any) => {
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
}
