import { Component, Inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { v4 as uuidv4 } from 'uuid';
import { Router } from '@angular/router';
import { MenuItemModel, UserType, Users } from '@core/models/user.model';
import { AdminService } from '@core/service/admin.service';
import { UserService } from '@core/service/user.service';
import { UtilsService } from '@core/service/utils.service';
import { DepartmentModalComponent } from 'app/admin/departments/department-modal/department-modal.component';
import { StudentsService } from 'app/admin/students/students.service';
import { CreateRoleTypeComponent } from 'app/admin/users/create-role-type/create-role-type.component';
import { LogoService } from 'app/student/settings/logo.service';
import Swal from 'sweetalert2';
import { MENU_LIST } from '@shared/userType-item';
import { SIDEMENU_LIST } from '@shared/sidemenu-item';
import { LOGOMENU_LIST } from '@shared/logo-item';
import { DASHBOARDMENU_LIST } from '@shared/dashboard-item';


@Component({
  selector: 'app-create-super-admin',
  templateUrl: './create-super-admin.component.html',
  styleUrls: ['./create-super-admin.component.scss'],
})
export class CreateSuperAdminComponent {
  breadscrums = [
    {
      title: 'Blank',
      items: ['Super Admin'],
      active: 'Create Company',
    },
  ];
  userForm!: FormGroup;
  hide = true;
  dept: any;
  avatar: any;
  userTypes: UserType[] | undefined;
  isSubmitted: boolean = false;
  status = true;
  constructor(
    public _fb: FormBuilder,
    public dialog: MatDialog,
    private router: Router,
    private StudentService: StudentsService,
    private logoService: LogoService,
    private adminService: AdminService,
    public utils: UtilsService,
    private userService: UserService
  ) {}
  ngOnInit() {
    this.userForm = this._fb.group({
      name: new FormControl('', [
        Validators.required,
        Validators.pattern(/[a-zA-Z0-9]+/),
        ...this.utils.validators.noLeadingSpace,
      ]),
      website: new FormControl('', []),
      mobile: new FormControl('', [
        Validators.required,
        ...this.utils.validators.mobile,
      ]),
      company: new FormControl('', [Validators.required]),
      qualification: new FormControl('', []),
      address: new FormControl('', []),
      email: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/),
      ]),
      domain: new FormControl('', []),
      users: new FormControl('', []),
      courses: new FormControl('', []),
      learner: new FormControl('',[Validators.required]),
      trainer: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      re_passwords: new FormControl('', []),
      type: new FormControl('admin', [Validators.required]),
      joiningDate: new FormControl('', [Validators.required]),
    });
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
    } else {
      this.userForm.markAllAsTouched();
      this.isSubmitted = true;
    }
  }

  addBlog(formObj: any) {

    let user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (!formObj.invalid) {
      const uniqueId = uuidv4();
      formObj['Active'] = this.status;
      formObj['type'] = formObj.type;
      formObj['role'] = 'Admin';
      formObj['isLogin'] = true;
      formObj['adminId'] = user.user.id;
      formObj['adminEmail'] = user.user.email;
      formObj['adminName'] = user.user.name;
      formObj['companyId'] = uniqueId;
      formObj['superAdmin'] = true;


      const userData: Users = formObj;
      userData.avatar = this.avatar;

      this.createUser(userData);
    }
  }
  private createUser(userData: Users): void {    
    this.userService.saveUsers(userData).subscribe(
      (response:any) => {
            let payload = {
              company:this.userForm.value.company,
              companyId:response.companyId,
              createdBy:localStorage.getItem('id'),
              identifier:this.userForm.value.domain,
              learner:this.userForm.value.learner,
              trainer:this.userForm.value.trainer,
              users:this.userForm.value.users,
              courses:this.userForm.value.courses,
            }
            this.userService.createCompany(payload).subscribe(() =>{
              Swal.fire({
                title: 'Successful',
                text: 'Company created successfully',
                icon: 'success',
              });


              
            //   const payload =MENU_LIST[0]
            //   MENU_LIST[0].companyId = response.companyId
            //   console.log('pay',payload)

            //   this.userService.createCompany(payload).subscribe(() =>{
            //   })  ///////usertype -role api
            //   const body =SIDEMENU_LIST[0]
            //   SIDEMENU_LIST[0].companyId = response.companyId
            //   console.log('BODY',body)


            //   this.userService.createCompany(body).subscribe(() =>{
            //   })  //////sidemenu api

            //   const logobody =LOGOMENU_LIST[0]
            //   LOGOMENU_LIST[0].companyId = response.companyId
            //   LOGOMENU_LIST[0].title = response.company

            //   console.log('BODY',logobody)


            //   this.userService.createCompany(logobody).subscribe(() =>{
            //   }) ////////logo api



            //  for(let data of DASHBOARDMENU_LIST ){
            //   data.companyId = response.companyId
            //   this.userService.createCompany(logobody).subscribe(() =>{
            //   }) ////////dashboard api
              

            //  }
            


          
               
             

         

          })
            this.userForm.reset();
        window.history.back();
      },
      (error) =>               {
        Swal.fire(
          'Failed to create user',
          error.message || error.error,
          'error'
        );
      }
    );
  }
  onNoClick() {
    window.history.back();
  }
}
