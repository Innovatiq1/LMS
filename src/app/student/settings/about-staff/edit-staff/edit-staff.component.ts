import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '@core/service/admin.service';
import { CertificateService } from '@core/service/certificate.service';
import { CourseService } from '@core/service/course.service';
import { StudentService } from '@core/service/student.service';
import { UserService } from '@core/service/user.service';
import { ConfirmedValidator } from '@shared/password.validator';
import { StaffService } from 'app/admin/staff/staff.service';
import Swal from 'sweetalert2';

import { Users } from '@core/models/user.model';
import { UtilsService } from '@core/service/utils.service';
@Component({
  selector: 'app-edit-staff',
  templateUrl: './edit-staff.component.html',
  styleUrls: ['./edit-staff.component.scss']
})
export class EditStaffComponent {
  breadscrums = [
    {
      title: 'Add Staff',
      items: ['Staff'],
      active: 'Edit Staff',
    },
  ];
  staffForm: FormGroup;
  editData: any;
  isLoading = false;
  files: any;
  fileName: any;
  status = true;
  updateBtn: boolean = false;
  thumbnail: any; 
  userTypes: any;
  paramId: any;
  uploadedImage: any;
  uploaded: any;
  avatar: any;
  aboutDataId: any;
  aboutData: any;
  constructor(
    private fb: FormBuilder,
    private courseService: CourseService,
    public staffService: StaffService,
    private adminService: AdminService,
    private userService: UserService,
    public active: ActivatedRoute,
    public router: Router,
    private studentService: StudentService,
    private certificateService: CertificateService,public utils: UtilsService
  ) {
    this.staffForm = this.fb.group(
      {
        name: ['',  [Validators.required, Validators.pattern(/[a-zA-Z0-9]+/),...this.utils.validators.noLeadingSpace,...this.utils.validators.fname]],
        last_name: [''],
        gender: ['',  [Validators.required,...this.utils.validators.noLeadingSpace,...this.utils.validators.gender]],
        mobile: ['', [Validators.required,...this.utils.validators.mobile]],
        type: ['', [Validators.required]],
        joiningDate: ['', [Validators.required]],
        address: [''],
        email: [
          '',
          [Validators.required, Validators.email, Validators.minLength(5),...this.utils.validators.noLeadingSpace,...this.utils.validators.email],
        ],
        dob: ['', [Validators.required]],
        qualification: ['',[Validators.required,...this.utils.validators.noLeadingSpace,...this.utils.validators.edu]],
        avatar: [''],
        salary: ['', [Validators.required,...this.utils.validators.noLeadingSpace,...this.utils.validators.fee]],
        password: ['', [Validators.required,...this.utils.validators.password]],
      },
      {
      }
    );

    this.active.queryParams.subscribe(params => {
      this.aboutDataId = params['id'];
      this.loadData(this.aboutDataId);
    })
  }
  loadData(id:string) {
    this.courseService.getUserById(id).subscribe(res => {
      this.aboutData = res;
      this.staffForm.patchValue({
        name: this.aboutData?.name,
        last_name: this.aboutData?.last_name,
        gender: this.aboutData?.gender,
        mobile: this.aboutData?.mobile,
        type: this.aboutData?.type,
        joiningDate: this.aboutData?.joiningDate,
        address: this.aboutData?.address,
        email: this.aboutData?.email,
        dob: this.aboutData?.dob,
        qualification: this.aboutData?.qualification,
        avatar: this.aboutData?.avatar,
        salary: this.aboutData?.salary,
        password: this.aboutData?.password,
        conformPassword: this.aboutData?.conformPassword

  
    })

    });
  }
  updateBlog(formObj: any) {
    if (!formObj.invalid) {
      formObj['Active'] = this.status;
      formObj['role'] = formObj.type;
      formObj['isLogin'] = true;

      const userData: Users = formObj;
      userData.avatar = this.avatar;
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
ngOnInit(){
  this.getUserTypeList();
}
  updateUser(obj: any): any {
    return new Promise((resolve, reject) => {
      obj['Active'] = this.status;
      this.userService.updateUsers(obj, this.aboutDataId).subscribe(
        (response) => {
          this.isLoading = false;
          Swal.fire({
            title: 'Successful',
            text: 'User updated succesfully',
            icon: 'success',
          }).then(() => {
            resolve(response);
          });
          this.router.navigate(['student/settings/all-staff']);
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
  update(){
    if(this.staffForm.valid){
      this.updateBlog(this.staffForm.value);
    }else{
      this.staffForm.markAllAsTouched();
    }
    
  }
  cancel(){
    this.router.navigate(['student/settings/all-staff']);
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
    this.courseService
      .uploadCourseThumbnail(formData)
      .subscribe((data: any) => {
        this.avatar = data.data.thumbnail;
        this.uploaded = this.avatar?.split('/');
        let image = this.uploaded?.pop();
        this.uploaded = image?.split('\\');
        this.fileName = this.uploaded?.pop();
      });
  }
}
