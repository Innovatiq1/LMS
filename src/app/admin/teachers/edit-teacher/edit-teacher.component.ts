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
import { TeachersService } from '../teachers.service';

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
      items: ['Instructors'],
      active: 'Edit Instructor',
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
  constructor(
    private fb: UntypedFormBuilder,
    private courseService: CourseService,
    public teachersService: TeachersService,
    private activatedRoute: ActivatedRoute,
    private StudentService: StudentsService,

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
      name: ['', [Validators.required, Validators.pattern('[a-zA-Z]+')]],
      last_name: [''],
      gender: ['', [Validators.required]],
      mobile: ['', [Validators.required]],
      password: ['', [Validators.required]],
      conformPassword: ['', [Validators.required]],
      qualification: [''],
      department: [''],
      address: [''],
      email: [
        '',
        [Validators.required, Validators.email, Validators.minLength(5)],
      ],
      dob: ['', [Validators.required]],
      education: [''],
      joiningDate: ['', [Validators.required]],

      avatar: [''],
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

    // Check if the form is valid
    if (this.proForm.valid) {
      // Create userData object with form values
      const userData: Users = this.proForm.value;

      // Set the avatar path to the existing avatar URL
      userData.avatar = this.avatar;

      userData.type = 'Instructor';
      userData.role = 'Instructor';

      // Call the updateInstructor function with userData
      Swal.fire({
        title: 'Are you sure?',
        text: 'Do You want to update this user!',
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
          text: 'Instructor updated successfully',
          icon: 'success',
        });
        //this.fileDropEl.nativeElement.value = "";
        this.proForm.reset();
        //this.toggleList()
        this.router.navigateByUrl('/student/settings/all-instructors');
      },
      (error: { message: any; error: any }) => {
        Swal.fire(
          'Failed to update instructor',
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
  }
  getData() {
    forkJoin({
      course: this.teachersService.getUserById(this.userId),
    }).subscribe((response: any) => {
      if (response) {
        //this.user = response.course;
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
          qualification: response?.course?.qualification,
          dob: response?.course?.dob,
          address: response?.course?.address,
          department: response?.course?.department,
          joiningDate: response?.course?.joiningDate,
          fileName: this.fileName,
        });
      }
    });
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
    });
  }
}
