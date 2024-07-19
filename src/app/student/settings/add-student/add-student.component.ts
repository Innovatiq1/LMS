// import { StudentId } from './../../schedule-class/class.model';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Student, Users } from '@core/models/user.model';
import Swal from 'sweetalert2';
import { ConfirmedValidator } from '@shared/password.validator';
import { CourseService } from '@core/service/course.service';
import { StudentsService } from 'app/admin/students/students.service';
import { UtilsService } from '@core/service/utils.service';
import { FormService } from '@core/service/customization.service';
import { AppConstants } from '@shared/constants/app.constants';
@Component({
  selector: 'app-add-student',
  templateUrl: './add-student.component.html',
  styleUrls: ['./add-student.component.scss'],
})
export class AddStudentComponent {
  stdForm: UntypedFormGroup;
  files: any;
  fileName: any;
  avatar: any;
  breadscrums = [
    {
      title: 'Add Student',
      items: [`${AppConstants.STUDENT_ROLE}s`],
      active: `Create ${AppConstants.STUDENT_ROLE}`,
    },
  ];
  editData: any;
  StudentId: any;
  edit: boolean = false;
  viewUrl: boolean = false;
  uploaded: any;
  dept: any;
  thumbnail: any;
  forms!: any[];
  commonRoles: any;

  constructor(
    private fb: UntypedFormBuilder,
    private activatedRoute: ActivatedRoute,
    private StudentService: StudentsService,
    private router: Router,
    private courseService: CourseService,
    public utils: UtilsService,
    private formService: FormService,

  ) {
    this.activatedRoute.queryParams.subscribe((params: any) => {
      console.log('id', params);
      this.StudentId = params.id;
      this.patchValues(this.StudentId);
    });
    this.stdForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern(/[a-zA-Z0-9]+/),...this.utils.validators.noLeadingSpace]],
      last_name: [''],
      rollNo: ['', [Validators.required, ...this.utils.validators.noLeadingSpace,...this.utils.validators.roll_no]],
      gender: ['', [Validators.required]],
      mobile: ['', [Validators.required,...this.utils.validators.mobile]],
      password: [''],
      qualification: [''],
      department: [''],
      address: [''],
      email: [
        '',
        [Validators.required, Validators.email, Validators.minLength(5),...this.utils.validators.noLeadingSpace,...this.utils.validators.email],
      ],
      parentsName: [''],
      parentsPhone: [''],
      dob: ['', [Validators.required,...this.utils.validators.dob]],
      joiningDate: ['', [Validators.required]],
      education: ['',[Validators.required, ...this.utils.validators.noLeadingSpace,...this.utils.validators.edu]],
      avatar: [''],
      blood_group: [''],
      conformPassword: ['', []],
      attemptBlock: ['', []],

    },{
      // validator: ConfirmedValidator('password', 'conformPassword')
    });
  }

  ngOnInit(){
    this.commonRoles = AppConstants
    this.getDepartment();
    this.getForms();

  }

  getForms(): void {
    let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
        this.formService
      .getAllForms(userId,'Student Creation Form')
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
  onSubmit() {
    let user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (!this.stdForm.invalid) {
        const userData: any = this.stdForm.value;
        
        // Set the avatar path to the URL received during file upload
        userData.avatar = this.avatar;
        
        userData.type = AppConstants.STUDENT_ROLE;
        userData.role = AppConstants.STUDENT_ROLE;
        userData.isLogin = true;
        userData.adminId = user.user.id;
        userData.adminEmail = user.user.email;
        userData.adminName = user.user.name;
        userData.companyId = user.user.companyId;
        userData.users = user.user.users;
        userData.courses = user.user.courses;
        userData.attemptBlock = false;


        Swal.fire({
          title: 'Are you sure?',
          text: 'Do You want to create a trainee profile!',
          icon: 'warning',
          confirmButtonText: 'Yes',
          showCancelButton: true,
          cancelButtonColor: '#d33',
        }).then((result) => {
          if (result.isConfirmed){
            this.createInstructor(userData);
            // this.router.navigate(['/student/settings/all-students'])
            // Swal.close();
          }
        });
       
    }else{
      this.stdForm.markAllAsTouched();
    }
}


  private createInstructor(userData: Student): void {
    console.log("usdfs", userData)
    this.StudentService.CreateStudent(userData).subscribe(
      () => {
        Swal.fire({
          title: 'Successful',
          text: 'Trainee created successfully',
          icon: 'success',
        });
        //this.fileDropEl.nativeElement.value = "";
        this.stdForm.reset();
        //this.toggleList()
        this.router.navigateByUrl('/student/settings/all-user/all-students');
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

getDepartment(){
  this.StudentService.getAllDepartments().subscribe((response: any) =>{
    this.dept = response.data.docs;
   })

}
// onSelectChange(event :any) {
//   console.log("ibstList",this.dept)
//   const filteredData = this.dept.filter((item: { id: string; }) => item.id === event.value);
//   console.log(filteredData,"filter")
//   let dept = filteredData[0].department;
//   this.stdForm.get('department')?.setValue(dept);

// }


  patchValues(id: string) {
    if (id != undefined) {
      this.viewUrl = true;
      this.edit = true;
      this.StudentService.getStudentById(id).subscribe((res) => {
        // this.fileName =res.avatar
        this.editData = res;
        this.avatar = this.editData?.avatar;
      this.uploaded=this.avatar?.split('/')
      let image  = this.uploaded?.pop();
      this.uploaded= image?.split('\\');
      this.fileName = this.uploaded?.pop();
        // this.stdForm.get('department')?.setValue(this.editData.department);
        this.stdForm.patchValue({
          name: this.editData.name,
          last_name: this.editData.last_name,
          rollNo: this.editData.rollNo,
          gender: this.editData.gender,
          mobile: this.editData.mobile,
          joiningDate: this.editData.joiningDate,
          email: this.editData.email,
          department: this.editData.department,
          parentsName: this.editData.parentsName,
          parentsPhone: this.editData.parentsPhone,
          dob: this.editData.dob,
          password: this.editData.password,
          conformPassword: this.editData.password,
          education: this.editData.education,
          blood_group: this.editData.blood_group,
          address: this.editData.address,
          fileName: this.fileName,
          attemptBlock: this.editData?.attemptBlock 
        },
        );
      });
    }
  }
  cancel() {

    window.history.back();
  }

  // update() {
  //   console.log('Form Value', this.stdForm);
  //   if (this.stdForm.valid) {
  //     this.StudentService.uploadVideo(this.files).subscribe((response: any) => {
  //       const inputUrl = response.inputUrl;

  //       const userData: Student = this.stdForm.value;
  //       //this.commonService.setVideoId(videoId)

  //       userData.avatar = inputUrl;
  //       userData.filename = this.fileName;
  //       userData.type = 'Student';
  //       userData.role = 'Student';

  //       //this.currentVideoIds = [...this.currentVideoIds, ...videoId]
  //       // this.currentVideoIds.push(videoId);
  //       this.updateInstructor(userData);

  //       Swal.close();
  //     });
  //   }
  // }

  // update() {
  //   console.log('Form Value', this.stdForm);
  //   if (this.stdForm.valid) {
  //     this.StudentService.uploadVideo(this.files).subscribe((response: any) => {
  //       const inputUrl = response.inputUrl;

  //       const userData: Student = this.stdForm.value;
  //       //this.commonService.setVideoId(videoId)

  //       userData.avatar = inputUrl;
  //       userData.filename = this.fileName;
  //       userData.type = 'Student';
  //       userData.role = 'Student';

  //       //this.currentVideoIds = [...this.currentVideoIds, ...videoId]
  //       // this.currentVideoIds.push(videoId);
  //       this.updateInstructor(userData);

  //       Swal.close();
  //     });
  //   }
  // }

  // update() {
  //   console.log('Form Value', this.stdForm.value);
  
  //   // Check if the form is valid
  //   if (this.stdForm.valid) {
  //     if (this.files) {
  //       // If files are present, upload the video
  //       this.StudentService.uploadVideo(this.files).subscribe(
  //         (response: any) => {
  //           const inputUrl = response.inputUrl;
  
  //           const userData: Student = this.stdForm.value;
  //           userData.avatar = inputUrl;
  //           userData.filename = this.fileName;
  //           userData.type = "Student";
  //           userData.role = "Student";
  
  //           this.updateInstructor(userData);
  
  //           Swal.close();
  //         },
  //         (error: any) => {
  //           // Handle the error during file upload
  //           console.error('File upload failed:', error);
  //         }
  //       );
  //     } else {
  //       // If no files are present, update the user directly
  //       const userData: Student = this.stdForm.value;
  //       userData.type = "Student";
  //       userData.role = "Student";
  
  //       this.updateInstructor(userData);
  //     }
  //   }
  // }
  update() {
    let user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    // Check if the form is valid
    if (this.stdForm.valid) {
      // Create userData object with form values
      const userData: Student = this.stdForm.value;

      // Set the avatar path to the existing avatar URL
      userData.avatar = this.avatar;

      userData.type = AppConstants.STUDENT_ROLE;
      userData.role = AppConstants.STUDENT_ROLE;
      userData.adminId = user.user.id;
        userData.adminEmail = user.user.email;
        userData.adminName = user.user.name;
        userData.companyId = user.user.companyId;
        userData.attemptCalculation = 1;

      // Call the updateInstructor function with userData

      Swal.fire({
        title: 'Are you sure?',
        text: 'Do You want to update this trainee profile!',
        icon: 'warning',
        confirmButtonText: 'Yes',
        showCancelButton: true,
        cancelButtonColor: '#d33',
      }).then((result) => {
        if (result.isConfirmed){
          this.updateInstructor(userData);
          Swal.close();
          // window.history.back();
        }
      });
     
    }
}

  private updateInstructor(userData: Student): void {
    this.StudentService.updateStudent(this.StudentId, userData).subscribe(
      () => {
        Swal.fire({
          title: 'Successful',
          text: 'Trainee details update successfully',
          icon: 'success',
        });
        //this.fileDropEl.nativeElement.value = "";
        // this.stdForm.reset();
        window.history.back();
        //this.toggleList()
        // this.router.navigateByUrl('/admin/students/all-students');
      },
      (error: { message: any; error: any }) => {
        Swal.fire(
          'Failed to update trainee',
          error.message || error.error,
          'error'
        );
      }
    );
  }
}
