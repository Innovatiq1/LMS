import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { StudentService } from '@core/service/student.service';
import { Users } from '@core/models/user.model';
import { UserService } from '@core/service/user.service';
import { AdminService } from '@core/service/admin.service';
import { ConfirmedValidator } from '@shared/password.validator';
import { CertificateService } from '@core/service/certificate.service';
import { CourseService } from '@core/service/course.service';
import { StaffService } from '../staff.service';
@Component({
  selector: 'app-add-staff',
  templateUrl: './add-staff.component.html',
  styleUrls: ['./add-staff.component.scss'],
})
export class AddStaffComponent {
  staffForm: FormGroup;
  editData: any;
  isLoading = false;
  files: any;
  fileName: any;
  status = true;
  updateBtn: boolean = false;
  thumbnail: any;
  breadscrums = [
    {
      title: 'Add Staff',
      items: ['Users'],
      active: 'Add Staff',
    },
  ];
  userTypes: any;
  paramId: any;
  uploadedImage: any;
  uploaded: any;
  avatar: any;
  constructor(
    private fb: FormBuilder,
    private courseService: CourseService,
    public staffService: StaffService,
    private adminService: AdminService,
    private userService: UserService,
    public active: ActivatedRoute,
    public router: Router,
    private studentService: StudentService,
    private certificateService: CertificateService
  ) {
    this.staffForm = this.fb.group(
      {
        name: ['', [Validators.required, Validators.pattern('[a-zA-Z]+')]],
        last_name: [''],
        gender: ['', [Validators.required]],
        mobile: ['', [Validators.required]],
        type: [''],
        joiningDate: [''],
        address: [''],
        email: [
          '',
          [Validators.required, Validators.email, Validators.minLength(5)],
        ],
        dob: ['', [Validators.required]],
        qualification: [''],
        avatar: [''],
        salary: [''],
        password: ['', [Validators.required]],
        conformPassword: ['', [Validators.required]],
      },
      {
        validator: ConfirmedValidator('password', 'conformPassword'),
      }
    );

    this.active.queryParams.subscribe((param) => {
      this.paramId = param['id'];
      if (this.paramId != undefined) {
        this.updateBtn = true;
        this.editData = param;
        this.patchData(this.editData);
      }
    });

    this.getUserTypeList();
  }

  patchData(_data: any) {
    this.fileName = _data.filename;
    this.avatar = this.editData.avatar;
    this.uploaded = this.avatar?.split('/');
    let image = this.uploaded.pop();
    this.uploaded = image.split('\\');
    this.fileName = this.uploaded.pop();
    this.staffForm.patchValue({
      name: _data.name,
      last_name: _data.last_name,
      gender: _data.gender,
      mobile: _data.mobile,
      password: _data.password,
      conformPassword: _data.password,
      type: _data.type,
      joiningDate: _data.joiningDate,
      address: _data.address,
      email: _data.email,
      dob: _data.dob,
      qualification: _data.qualification,
      fileName: this.fileName,
      salary: _data.salary,
    });
  }
  // get passwordMatchError() {
  //   return (
  //     this.staffForm.getError('mismatch') &&
  //     this.staffForm.get('confirmPassword')?.touched
  //   );
  // }
  // addBlog(formObj:any) {
  //   console.log('Form Value', formObj.value);
  //    if (!formObj.invalid) {
  //      this.studentService.uploadVideo(this.files).subscribe(
  //        (response: any) => {
  //          console.log("======",formObj.type)
  //          const inputUrl = response.inputUrl;

  //          formObj['Active']= this.status
  //          formObj['role']=formObj.type
  //          formObj['isLogin']=true

  //          const userData: Users = formObj;
  //          //this.commonService.setVideoId(videoId)

  //          userData.avatar = inputUrl;
  //          userData.filename = response.filename;

  //          //this.currentVideoIds = [...this.currentVideoIds, ...videoId]
  //          // this.currentVideoIds.push(videoId);
  //          this.createUser(userData);

  //          Swal.close();
  //        },
  //        (error) => {
  //          Swal.fire({
  //            icon: 'error',
  //            title: 'Upload Failed',
  //            text: 'An error occurred while uploading the video',
  //          });
  //          Swal.close();
  //        }
  //      );
  //    }
  //   }
  addBlog(formObj: any) {
    if (!formObj.invalid) {
      formObj['Active'] = this.status;
      formObj['role'] = formObj.type;
      formObj['isLogin'] = true;

      const userData: Users = formObj;
      userData.avatar = this.avatar;
      // You may want to set avatar and filename if needed
      // userData.avatar = 'your_avatar_url';
      // userData.filename = 'your_filename';
      Swal.fire({
        title: 'Are you sure?',
        text: 'Do You want to create a staff profile!',
        icon: 'warning',
        confirmButtonText: 'Yes',
        showCancelButton: true,
        cancelButtonColor: '#d33',
      }).then((result) => {
        if (result.isConfirmed) {
          this.createUser(userData);
          Swal.close();
        }
      });
    }
  }

  createUser(userData: Users) {
    this.userService.saveUsers(userData).subscribe(
      (response: any) => {
        this.isLoading = false;
        Swal.fire({
          title: 'Successful',
          text: 'User created succesfully',
          icon: 'success',
        });
        this.router.navigate(['/student/settings/all-staff']);
      },
      (error: any) => {
        this.isLoading = false;
        Swal.fire(
          'Failed to create user',
          error.message || error.error,
          'error'
        );
      }
    );
  }
  getUserTypeList(filters?: any) {
    let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
    this.adminService.getUserTypeList({ allRows: true },userId).subscribe(
      (response: any) => {
        this.userTypes = response;
        
      },
      (error) => {}
    );
  }

  onFileUpload(event: any) {
    const file = event.target.files[0];

    this.thumbnail = file;
    const formData = new FormData();
    formData.append('files', this.thumbnail);
    this.courseService
      .uploadCourseThumbnail(formData)
      .subscribe((data: any) => {
        this.avatar = data.data.thumbnail;
        this.uploaded = this.avatar?.split('/');
        let image = this.uploaded?.pop();
        this.uploaded = image?.split('\\');
        this.fileName = this.uploaded?.pop();
      });
    // this.fileName = event.target.files[0].name;
    // this.files=event.target.files[0];
    // this.uploadedImage =event.target.files[0].name;

    // // const file = event.target.files[0];
    // const formData = new FormData();
    // // formData.append('files', file);
    // this.certificateService.uploadCourseThumbnail(formData).subscribe((response:any) => {
    // this.avatar = response.fileName;
    //   this.uploaded=this.avatar.split('/')
    //   this.uploadedImage = this.uploaded.pop();
    // });
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
        text: 'Do You want to update this staff profile!',
        icon: 'warning',
        confirmButtonText: 'Yes',
        showCancelButton: true,
        cancelButtonColor: '#d33',
      }).then((result) => {
        if (result.isConfirmed) {
          this.updateUser(userData);
          Swal.close();
        }
      });
    }
  }

  updateUser(obj: any): any {
    return new Promise((resolve, reject) => {
      obj['Active'] = this.status;
      this.userService.updateUsers(obj, this.paramId).subscribe(
        (response) => {
          this.isLoading = false;
          Swal.fire({
            title: 'Successful',
            text: 'User updated succesfully',
            icon: 'success',
          }).then(() => {
            resolve(response);
          });
          window.history.back();
          // this.router.navigate(['/admin/users/all-staff']);
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
  submit() {
    this.addBlog(this.staffForm.value);
  }
  update() {
    this.updateBlog(this.staffForm.value);
  }
  cancel() {
    window.history.back();
  }
}
