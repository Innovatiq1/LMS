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
import { CreateRoleTypeComponent } from '../create-role-type/create-role-type.component';
import { LogoService } from 'app/student/settings/logo.service';
import { MatTableDataSource } from '@angular/material/table';
import { DepartmentModalComponent } from '../../../admin/departments/department-modal/department-modal.component';

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

  breadscrums = [
    {
      title: 'Create All Users',
      items: ['All Users'],
      active: 'Create User',
    },
  ];
  data: any;

  update() {
    if (this.userForm.valid) {
      if (this.editUrl) {
        this.updateBlog(this.userForm.value);
      } else {
        this.addBlog(this.userForm.value);
      }
    } else {
      this.isSubmitted = true;
    }
  }
  // onSubmit() {
  //   console.log('Form Value', this.stdForm.value);
  //   if (!this.stdForm.invalid) {
  //     this.StudentService.uploadVideo(this.files).subscribe(
  //       (response: any) => {
  //         const inputUrl = response.inputUrl;

  //         const userData: Student = this.stdForm.value;
  //         //this.commonService.setVideoId(videoId)

  //         userData.avatar = inputUrl;
  //         userData.filename = response.filename;
  //         userData.type = 'Student';
  //         userData.role = 'Student';
  //         userData.isLogin = true;

  //         //this.currentVideoIds = [...this.currentVideoIds, ...videoId]
  //         // this.currentVideoIds.push(videoId);
  //         this.createInstructor(userData);

  //         Swal.close();
  //       },
  //       (error) => {
  //         Swal.fire({
  //           icon: 'error',
  //           title: 'Upload Failed',
  //           text: 'An error occurred while uploading the video',
  //         });
  //         Swal.close();
  //       }
  //     );
  //   }
  // }

  // addBlog(formObj:any) {
  //  // console.log('Form Value', formObj.value);
  //   if (!formObj.invalid) {
  //     this.studentService.uploadVideo(this.files).subscribe(
  //       (response: any) => {
  //         console.log("======",formObj.type)
  //         const inputUrl = response.inputUrl;

  //         formObj['Active']= this.status
  //         formObj['role']=formObj.type
  //         formObj['isLogin']=true

  //         const userData: Users = formObj;
  //         //this.commonService.setVideoId(videoId)

  //         userData.avatar = inputUrl;
  //         userData.filename = response.filename;

  //         //this.currentVideoIds = [...this.currentVideoIds, ...videoId]
  //         // this.currentVideoIds.push(videoId);
  //         this.createUser(userData);

  //         Swal.close();
  //       },
  //       (error) => {
  //         Swal.fire({
  //           icon: 'error',
  //           title: 'Upload Failed',
  //           text: 'An error occurred while uploading the video',
  //         });
  //         Swal.close();
  //       }
  //     );
  //   }

  // }
  addBlog(formObj: any) {
    if (!formObj.invalid) {
      // Process form data without uploading anything
      // Additional logic can be added here as needed
      formObj['Active'] = this.status;
      formObj['role'] = formObj.type;
      formObj['isLogin'] = true;

      const userData: Users = formObj;
      userData.avatar = this.avatar;
      // You may want to set avatar and filename if needed
      // userData.avatar = 'your_avatar_url';
      // userData.filename = 'your_filename';

      // this.createUser(userData);
      this.createUser(userData);
      //   Swal.fire({
      //     title: 'Are you sure?',
      //     text: 'Do You want to create a student profile!',
      //     icon: 'warning',
      //     confirmButtonText: 'Yes',
      //     showCancelButton: true,
      //     cancelButtonColor: '#d33',
      //   }).then((result) => {
      //     if (result.isConfirmed){
      //       this.createUser(userData);
      //       Swal.close();
      //     }
      //   });
      //   Swal.close();
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
        //this.fileDropEl.nativeElement.value = "";
        this.userForm.reset();
        //this.toggleList()
        this.router.navigateByUrl('/student/settings/all-users');
      },
      (error) => {
        Swal.fire(
          'Failed to create user',
          error.message || error.error,
          'error'
        );
      }
    );
  }
  //   createUser(userData:Users){
  // console.log("user", userData)
  //     Swal.fire({
  //       title: 'Are you sure?',
  //       text: 'Do You want to create a user!',
  //       icon: 'warning',
  //       confirmButtonText: 'Yes',
  //       showCancelButton: true,
  //       cancelButtonColor: '#d33',
  //     }).then((result) => {
  //       if (result.isConfirmed){
  //         this.userService.saveUsers(userData).subscribe(
  //           (response:any) => {
  //             this.isLoading = false;
  //             Swal.fire({
  //               title: 'Successful',
  //               text: 'User created succesfully',
  //               icon: 'success',
  //             });
  //             this.router.navigate(['/admin/users/all-users'])

  //           },
  //           (error:any) => {
  //             this.isLoading = false;
  //             Swal.fire(
  //               'Failed to create user',
  //               error.message || error.error,
  //               'error'
  //             );
  //           }
  //         );
  //       }
  //     });

  //   }
  onFileUpload(event: any) {
    const file = event.target.files[0];

    this.thumbnail = file;
    const formData = new FormData();
    formData.append('files', this.thumbnail);
    this.courseService
      .uploadCourseThumbnail(formData)
      .subscribe((data: any) => {
        this.avatar = data.data?.thumbnail;
        this.uploaded = this.avatar?.split('/');
        let image = this.uploaded?.pop();
        this.uploaded = image?.split('\\');
        this.fileName = this.uploaded?.pop();
      });
    // this.fileName = event.target.files[0].name;
    // this.files=event.target.files[0]
    // this.authenticationService.uploadVideo(event.target.files[0]).subscribe(
    //   (response: any) => {
    //             //Swal.close();
    //             
    //   },
    //   (error:any) => {

    //   }
    // );
  }

  //   updateBlog(formObj:any) {
  //     console.log('Form Value', formObj.value);
  //       if (!formObj.invalid) {
  //     if (this.files) {
  //       // If files are present, upload the video
  //       this.studentService.uploadVideo(this.files).subscribe(
  //         (response: any) => {
  //           console.log("======", formObj.type);

  //           formObj['Active'] = this.status;
  //           formObj['role'] = formObj.type;
  //           formObj['isLogin'] = true;

  //           const userData: Users = formObj;

  //           // Process response if needed
  //           // const inputUrl = response.inputUrl;
  //           // userData.avatar = inputUrl;
  //           // userData.filename = response.filename;

  //           this.updateUser(userData);

  //           Swal.close();
  //         },
  //         (error) => {
  //           Swal.fire({
  //             icon: 'error',
  //             title: 'Upload Failed',
  //             text: 'An error occurred while uploading the video',
  //           });
  //           Swal.close();
  //         }
  //       );
  //     } else {
  //       // If no files are present, update the user directly
  //       formObj['Active'] = this.status;
  //       formObj['role'] = formObj.type;
  //       formObj['isLogin'] = true;

  //       const userData: Users = formObj;
  //       this.updateUser(userData);
  //       Swal.close();
  //     }
  //   }
  // }
  updateBlog(formObj: any) {
    if (!formObj.invalid) {
      // Prepare user data for update
      formObj['Active'] = this.status;
      formObj['role'] = formObj.type;
      formObj['isLogin'] = true;

      const userData: Users = formObj;

      // Ensure that the avatar property contains the correct URL
      userData.avatar = this.avatar; // Replace 'your_existing_avatar_url' with the actual avatar URL
      Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to update this user!',
        icon: 'warning',
        confirmButtonText: 'Yes',
        showCancelButton: true,
        cancelButtonColor: '#d33',
      }).then((result) => {
        if (result.isConfirmed) {
          this.updateUser(userData);
          Swal.close();
        window.history.back();
        }
      });
      // this.updateUser(userData);
      // Swal.close();
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
          this.router.navigate(['/student/settings/all-users']);
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
    private logoService: LogoService
  ) {
    let urlPath = this.router.url.split('/');
    this.editUrl = urlPath.includes('edit-all-users');
    this.currentId = urlPath[urlPath.length - 1];
    this.getUserTypeList();

    if (this.editUrl === true) {
      this.breadscrums = [
        {
          title: 'Edit All Users',
          items: ['All Users'],
          active: 'Edit User',
        },
      ];
    }

    if (this.editUrl) {
      this.getBlogsList();
    }

    this.userForm = this.fb.group({
      name: new FormControl('', [Validators.required]),
      last_name: new FormControl('', []),
      rollNo: new FormControl('', [Validators.required]),
      gender: new FormControl('', [Validators.required]),
      mobile: new FormControl('', [Validators.required]),
      qualification: new FormControl('', []),
      department: new FormControl('', []),
      address: new FormControl('', []),
      email: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/),
      ]),
      password: new FormControl('', [Validators.required]),
      education: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
      ]),
      type: new FormControl('', [Validators.required]),
      parentsName: new FormControl('', []),
      parentsPhone: new FormControl('', []),
      dob: new FormControl('', []),
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
    // this.userService.getUserList().subscribe((response: any) => {
    //   console.log('res',response);
    //   this.blogsList = response.data.data;
    //   let data=this.blogsList.find((id:any)=>id._id === this.currentId);
    //   console.log('data',data)
    //   this.fileName = data.filename
    //   if(data){
    //     this.userForm.patchValue({
    //       name: data?.name,
    //       email:data?.email,
    //       password: data?.password,
    //       qualification: data?.qualification,
    //       type:data?.type,
    //       avatar:data?.avatar,
    //     });
    //   }
    // }, error => {
    // });

    this.userService.getUserById(this.currentId).subscribe(
      (response: any) => {
        this.data = response.data.data;
        // this.fileName = this.data.filename
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
            education: this.data?.education,
            type: this.data?.type,
            fileName: this.data?.avatar,
            last_name: this.data?.last_name,
            rollNo: this.data?.rollNo,
            gender: this.data?.gender,
            mobile: this.data?.mobile,
            qualification: this.data?.qualification,
            department: this.data?.department,
            parentsName: this.data?.parentsName,
            parentsPhone: this.data?.parentsPhone,
            dob: this.data?.dob,
            joiningDate: this.data?.joiningDate,
            blood_group: this.data?.blood_group,
            address: this.data?.address,
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
    let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
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
