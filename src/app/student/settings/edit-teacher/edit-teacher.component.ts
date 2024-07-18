import { Component, ElementRef, ViewChild } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { forkJoin } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { InstructorService } from '@core/service/instructor.service';
import { Users } from '@core/models/user.model';
import Swal from 'sweetalert2';
import { CourseService } from '@core/service/course.service';
import { StudentsService } from 'app/admin/students/students.service';
import { TeachersService } from 'app/admin/teachers/teachers.service';
import { UtilsService } from '@core/service/utils.service';
import { AppConstants } from '@shared/constants/app.constants';

@Component({
  selector: 'app-edit-teacher',
  templateUrl: './edit-teacher.component.html',
  styleUrls: ['./edit-teacher.component.scss'],
})
export class EditTeacherComponent {
  @ViewChild('fileInput') fileInput: ElementRef | undefined;
  proForm: UntypedFormGroup;

  breadscrums = [
    {
      title: 'Edit Instructor',
      items: [`${AppConstants.INSTRUCTOR_ROLE}`],
      active: ` Edit ${AppConstants.INSTRUCTOR_ROLE}`,
    },
  ];
  userId: any;
  subscribeParams: any;
  user: any;
  fileName: any;
  files: any;
  dept: any;
  avatar: any;
  uploaded: any;
  thumbnail: any;
  commonRoles: any;
  constructor(
    private fb: UntypedFormBuilder,
    private courseService: CourseService,
    public teachersService: TeachersService,
    private activatedRoute: ActivatedRoute,
    private StudentService: StudentsService,
    public utils: UtilsService,
    private instructor: InstructorService,
    private router: Router
  ) {
    //this.proForm = this.createContactForm();
    this.subscribeParams = this.activatedRoute.params.subscribe(
      (params: any) => {
        this.userId = params.id;
      }
    );
    this.proForm = this.fb.group({
      name: [
        '', 
        [Validators.required, Validators.pattern(/[a-zA-Z0-9]+/),...this.utils.validators.noLeadingSpace]
      ],
      last_name: [''],
      gender: ['', [Validators.required]],
      mobile: ['', [Validators.required]],
      password: ['', [Validators.required]],
      // conformPassword: ['', [Validators.required]],
      department: [''],
      address: [''],
      email: [
        '',
        [Validators.required, Validators.email, Validators.minLength(5), ...this.utils.validators.email],
      ],
      dob: ['', [Validators.required]],
      education: [''],
      joiningDate: ['', [Validators.required]],

      avatar: [''],
      attemptBlock: [''],
    });
  }
  // onSubmit() {
  //   console.log('Form Value', this.proForm.value);
  //   if(this.proForm.valid){
  //     this.instructor.uploadVideo(this.files).subscribe(
  //       (response: any) => {
  //         const inputUrl = response.inputUrl;

  //         const userData: Users = this.proForm.value;
  //         //this.commonService.setVideoId(videoId)

  //         userData.avatar = inputUrl;
  //         userData.filename= this.fileName
  //         userData.type = "Instructor";
  //         userData.role = "Instructor";

  //         //this.currentVideoIds = [...this.currentVideoIds, ...videoId]
  //         // this.currentVideoIds.push(videoId);
  //         this.updateInstructor(userData);

  //         Swal.close();
  //      },
  //      );
  //     }
  // }
  // onSubmit() {
  //   console.log('Form Value', this.proForm.value);

  //   // Check if the form is valid
  //   if (this.proForm.valid) {
  //     if (this.files) {
  //       // If files are present, upload the video
  //       this.instructor.uploadVideo(this.files).subscribe(
  //         (response: any) => {
  //           const inputUrl = response.inputUrl;

  //           const userData: Users = this.proForm.value;
  //           userData.avatar = inputUrl;
  //           userData.filename = this.fileName;
  //           userData.type = "Instructor";
  //           userData.role = "Instructor";

  //           this.updateInstructor(userData);

  //           Swal.close();
  //         },
  //         (error: any) => {
  //           // Handle the error during file upload
  //           console.error('File upload failed:', error);
  //         }
  //       );
  //     } else {
  //       // If no files are present, update the instructor directly
  //       const userData: Users = this.proForm.value;
  //       userData.type = "Instructor";
  //       userData.role = "Instructor";

  //       this.updateInstructor(userData);
  //     }
  //   }
  // }
  onSubmit() {
    let user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    // Check if the form is valid
    if (this.proForm.valid) {
      // Create userData object with form values
      const userData: Users = this.proForm.value;

      // Set the avatar path to the existing avatar URL
      userData.avatar = this.avatar;
      userData.type = AppConstants.INSTRUCTOR_ROLE;
      userData.role = AppConstants.INSTRUCTOR_ROLE;
      userData.adminId = user.user.id;
      userData.adminEmail = user.user.email;
      userData.adminName = user.user.name;
      userData.companyId = user.user.companyId; 
      userData.attemptCalculation = 1;


      // Call the updateInstructor function with userData
      Swal.fire({
        title: 'Are you sure?',
        text: 'Do You want to update this Trainer',
        icon: 'warning',
        confirmButtonText: 'Yes',
        showCancelButton: true,
        cancelButtonColor: '#d33',
      }).then((result) => {
        if (result.isConfirmed) {
          this.updateInstructor(userData);
          Swal.close();
        }
      });
    }
  }
  private updateInstructor(userData: Users): void {
    this.teachersService.updateUser(this.userId, userData).subscribe(
      () => {
        Swal.fire({
          title: 'Successful',
          text: 'Trainer updated successfully',
          icon: 'success',
        });
        //this.fileDropEl.nativeElement.value = "";
        this.proForm.reset();
        //this.toggleList()
        this.router.navigateByUrl('/student/settings/all-user/all-instructors');
      },
      (error: { message: any; error: any }) => {
        Swal.fire(
          'Failed to update Trainer',
          error.message || error.error,
          'error'
        );
      }
    );
  }
  ngOnInit(): void {
    //this.setup()
    this.getData();
    this.getDepartment();
    this.commonRoles = AppConstants
  }
  getData() {
    forkJoin({
      course: this.teachersService.getUserById(this.userId),
    }).subscribe((response: any) => {
      if (response) {
        console.log('response?.course?.education', response?.course?.education);
        console.log('====REsponnse===Gopal==', response);
        //this.user = response.course;

        console.log('response?.course?.education', response?.course?.education);
        // this.fileName =response?.course?.filename
        this.avatar = response.course?.avatar;
        this.uploaded = this.avatar?.split('/');
        let image = this.uploaded?.pop();
        this.uploaded = image?.split('\\');
        this.fileName = this.uploaded?.pop();

        // this.fileName=response?.course?.videoLink?response?.course?.videoLink[0].filename:null
        // let startingDate=response?.course?.startDate;
        // let endingDate=response?.course?.endDate;
        // let startTime=response?.course?.startDate.split("T")[1];
        // let startingTime=startTime?.split(".")[0];
        // let endTime=response?.course?.endDate.split("T")[1];
        // let endingTime=endTime?.split(".")[0];

        this.proForm.patchValue({
          education: response?.course?.education,
          name: response?.course?.name,
          last_name: response?.course?.last_name,
          gender: response?.course?.gender,
          mobile: response?.course?.mobile,
          password: response?.course?.password,
          conformPassword: response?.course?.password,
          email: response?.course?.email,
          qualification: response?.course?.education,
          dob: response?.course?.dob,
          address: response?.course?.address,
          department: response?.course?.department,
          joiningDate: response?.course?.joiningDate,
          fileName: this.fileName,
          attemptBlock: response?.course?.attemptBlock 
        });
      }
    });
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
  cancel() {
    window.history.back();
  }

  getDepartment() {
    this.StudentService.getAllDepartments().subscribe((response: any) => {
      this.dept = response.data.docs;
      console.log('dept', this.dept);
    });
  }
}
