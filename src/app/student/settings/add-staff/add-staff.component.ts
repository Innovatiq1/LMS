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
import { StaffService } from 'app/admin/staff/staff.service';
import { UtilsService } from '@core/service/utils.service';
import { FormService } from '@core/service/customization.service';
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
      items: ['Staff'],
      active: 'Create Staff',
    },
  ];
  userTypes: any;
  paramId: any;
  uploadedImage: any;
  uploaded: any;
  avatar: any;
  forms!: any[];

  constructor(
    private fb: FormBuilder,
    private courseService: CourseService,
    public staffService: StaffService,
    private adminService: AdminService,
    private userService: UserService,
    public active: ActivatedRoute,
    public router: Router,public utils: UtilsService,
    private studentService: StudentService,
    private certificateService: CertificateService,
    private formService: FormService,

  ) {
    this.staffForm = this.fb.group(
      {
        name: ['', [Validators.required, Validators.pattern(/[a-zA-Z0-9]+/),...this.utils.validators.noLeadingSpace,...this.utils.validators.fname]],
        last_name: [''],
        gender: ['', [Validators.required,...this.utils.validators.noLeadingSpace,...this.utils.validators.gender]],
        mobile: ['', [Validators.required,...this.utils.validators.noLeadingSpace,...this.utils.validators.mobile]],
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

  ngOnInit() {
    this.getForms();
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
  addBlog(formObj: any) {
    let user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (!formObj.invalid) {
      formObj['Active'] = this.status;
      formObj['role'] = formObj.type;
      formObj['isLogin'] = true;
      formObj['companyId'] = user.user.companyId;

      const userData: Users = formObj;
      userData.avatar = this.avatar;
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
    if(this.staffForm.valid){
      this.addBlog(this.staffForm.value);
    }else{this.staffForm.markAllAsTouched();}
    
  }
  update() {
    if(this.staffForm.valid){
      this.updateBlog(this.staffForm.value);
    }else{
      this.staffForm.markAllAsTouched();
    }
   
  }
  cancel() {
    window.history.back();
  }

  getForms(): void {
    let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
        this.formService
      .getAllForms(userId,'Staff Creation Form')
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
}
