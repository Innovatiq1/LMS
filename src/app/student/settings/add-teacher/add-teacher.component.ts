import { Component } from '@angular/core';
import {
  FormGroup,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { InstructorService } from '@core/service/instructor.service';
//import { Users } from ""
import { Users } from '@core/models/user.model';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { ConfirmedValidator } from '@shared/password.validator';
import { CourseService } from '@core/service/course.service';
import { StudentsService } from 'app/admin/students/students.service';
import { UtilsService } from '@core/service/utils.service';
import { FormService } from '@core/service/customization.service';
import { AppConstants } from '@shared/constants/app.constants';

@Component({
  selector: 'app-add-teacher',
  templateUrl: './add-teacher.component.html',
  styleUrls: ['./add-teacher.component.scss'],
})
export class AddTeacherComponent {
  proForm: UntypedFormGroup;
  dept: any;
  uploaded: any;
  thumbnail: any;
  avatar: any;
  submitClicked: boolean = false;
  breadscrums = [
    {
      title: 'Add Instructor',
      items: [`${AppConstants.INSTRUCTOR_ROLE}s`],
      active: `Create ${AppConstants.INSTRUCTOR_ROLE}`,
    },
  ];
  files: any;
  fileName: any;
  forms!: any[];
  commonRoles: any;

  constructor(private fb: UntypedFormBuilder,
    private instructor: InstructorService,
    private StudentService: StudentsService,
    private courseService: CourseService,
    public utils: UtilsService,
    private router:Router,
    private formService: FormService,

   ) {
    this.proForm = this.fb.group({
      name: ['', [Validators.required,Validators.pattern(/[a-zA-Z0-9]+/),...this.utils.validators.noLeadingSpace]],
      last_name: [''],
      gender: ['', [Validators.required]],
      mobile: ['', [Validators.required,...this.utils.validators.noLeadingSpace,...this.utils.validators.mobile]],
      password: ['', [Validators.required]],
      // conformPassword: ['', [Validators.required]],
      department: [''],
      address: [''],
      email: [
        '',
        [Validators.required, Validators.email, Validators.minLength(5),...this.utils.validators.noLeadingSpace,...this.utils.validators.email],
      ],
      dob: ['', [Validators.required]],
      joiningDate:['', [Validators.required]],
      education: ['', [Validators.required,...this.utils.validators.designation]],
      avatar: ['',],
    },{
      // validator: ConfirmedValidator('password', 'conformPassword')
    });
  }


  onFileUpload(event:any) {
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
    this.thumbnail = file
    const formData = new FormData();
    formData.append('files', this.thumbnail);
   this.courseService.uploadCourseThumbnail(formData).subscribe((data: any) =>{
    this.avatar = data.data.thumbnail;
    this.uploaded=this.avatar.split('/')
    let image  = this.uploaded.pop();
    this.uploaded= image.split('\\');
    this.fileName = this.uploaded.pop();
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
  getDepartment(){
    this.StudentService.getAllDepartments().subscribe((response: any) =>{
      this.dept = response.data.docs;
      console.log("dept",this.dept)
     })

  }
  // onSubmit() {
  //   console.log('Form Value', this.proForm.value);
  //   if(!this.proForm.invalid){
  //   this.instructor.uploadVideo(this.files).subscribe(
  //     (response: any) => {
  //       const inputUrl = response.inputUrl;

  //       const userData: Users = this.proForm.value;
  //       //this.commonService.setVideoId(videoId)

  //       userData.avatar = inputUrl;
  //       userData.filename= response.filename
  //       userData.type = "Instructor";
  //       userData.role = "Instructor";
  //       userData.isLogin = true;

  //       //this.currentVideoIds = [...this.currentVideoIds, ...videoId]
  //       // this.currentVideoIds.push(videoId);
  //       this.createInstructor(userData);

  //       Swal.close();
  //     },
  //     (error) => {
  //       Swal.fire({
  //         icon: 'error',
  //         title: 'Upload Failed',
  //         text: 'An error occurred while uploading the video',
  //       });
  //       Swal.close();
  //     }
  //   );
  //   }
  // }
  onSubmit() {
    console.log('Form Value', this.proForm.value);
    let user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (!this.proForm.invalid) {
        const userData: Users = this.proForm.value;
        
        // Set the avatar path to the URL received during file upload
        userData.avatar = this.avatar;
        
        userData.type = AppConstants.INSTRUCTOR_ROLE;
        userData.role = AppConstants.INSTRUCTOR_ROLE;
        userData.isLogin = true;
        userData.adminId = user.user.id;
        userData.adminEmail = user.user.email;
        userData.adminName = user.user.name;

        this.createInstructor(userData);
    }else{
      this.proForm.markAllAsTouched(); 
      this.submitClicked = true;
    }
}

  ngOnInit(){
    this.getDepartment();
    this.getForms();
    this.commonRoles = AppConstants
  }

  getForms(): void {
    let userId = localStorage.getItem('id');    
    this.formService
      .getAllForms(userId,'Instructor Creation Form')
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

  
  private createInstructor(userData: Users): void {


    Swal.fire({
      title: 'Are you sure?',
      text: 'Do You want to create a Trainer!',
      icon: 'warning',
      confirmButtonText: 'Yes',
      showCancelButton: true,
      cancelButtonColor: '#d33',
    }).then((result) => {
      if (result.isConfirmed){
        this.instructor.CreateUser(userData).subscribe(
          () => {
            Swal.fire({
              title: "Successful",
              text: "Trainer created successfully",
              icon: "success",
            });
            //this.fileDropEl.nativeElement.value = "";
          this.proForm.reset();
          //this.toggleList()
          this.router.navigateByUrl('/student/settings/all-instructors');
          },
          (error) => {
            Swal.fire(
              "Failed to create Trainer",
              error.message || error.error,
              "error"
            );
          }
        );
      }
    });
   
  }
  cancel(){
    // this.router.navigateByUrl('/admin/users/all-instructors');
window.history.back();
  }
}
