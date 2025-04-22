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
import { FormService } from '@core/service/customization.service';

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
  trainerId:any;
  breadcrumbs:any[] = [];
  storedItems: string | null;
  forms!: any[];
  constructor(
    private fb: UntypedFormBuilder,
    private courseService: CourseService,
    public teachersService: TeachersService,
    private activatedRoute: ActivatedRoute,
    private StudentService: StudentsService,
    public utils: UtilsService,
    private instructor: InstructorService,
    private formService: FormService,
    private router: Router
  ) {

    this.storedItems = localStorage.getItem('activeBreadcrumb');
    if (this.storedItems) {
      this.storedItems = this.storedItems.replace(/^"(.*)"$/, '$1');
      this.breadcrumbs = [
        {
          title: '', 
          items: [this.storedItems],  
          active: `Edit ${AppConstants.INSTRUCTOR_ROLE}`,  
        },
      ];
    } 
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
      department: [''],
      address: [''],
      email: [
        '',
        [Validators.required, Validators.email, Validators.minLength(5), ...this.utils.validators.email],
      ],
      dob: ['', [Validators.required]],
      joiningDate: ['', [Validators.required]],
      avatar: [''],
      attemptBlock: [''],
      qualifications: ['',[Validators.required]],
      domainAreaOfPractice: ['', [Validators.required]],
      idType: ['', []],
      idNumber: ['', []],
      code: ['', []],
      linkedInURL: ['',],
      experience: ['',],
    });
  }
  onSubmit() {
    let user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    let uen =localStorage.getItem('uen') || '';
    if (this.proForm.valid) {
      let idType = {
        code: this.proForm.value.code,
        description: this.proForm.value.idType,
      }
      let roles = [
        {
          role: {
            id: 1,
            description: `${AppConstants.INSTRUCTOR_ROLE}`,
          },
        },
      ]
      let qualifications = [{
        description: this.proForm.value.qualifications,
        level: {
          code: "21",
        }
      }]
      const payload: any = {
         name: this.proForm.value.name,
         gender: this.proForm.value.gender,
         domainAreaOfPractice: this.proForm.value.domainAreaOfPractice,
         email: this.proForm.value.email,
         experience: this.proForm.value.experience,
         idNumber: this.proForm.value.idNumber,
         idType: idType,
         isLogin : true,
         joiningDate: this.proForm.value.joiningDate,
         linkedInURL: this.proForm.value.linkedInURL,
         mobile: this.proForm.value.mobile,
         password: this.proForm.value.password,
         salutationId: 1,
         qualifications: qualifications,
         roles: roles,
         address: this.proForm.value.address,
         adminEmail: this.proForm.value.adminEmail,
         adminId: this.proForm.value.adminId,
         adminName: this.proForm.value.adminName,
         attemptBlock: false,
         company: user.user.company,
         companyId: user.user.companyId,
         department: this.proForm.value.department,
         dob: this.proForm.value.dob,
         domain: user.user.domain,
         type: AppConstants.INSTRUCTOR_ROLE,
         role: AppConstants.INSTRUCTOR_ROLE,
         avatar: this.avatar,
         attemptCalculation: 1,
         action: "update",
         trainerId:this.trainerId,
         uen: uen,
      };
      // console.log("payLoad",payload)
      Swal.fire({
        title: 'Are you sure?',
        text: `Do You want to update this ${AppConstants.INSTRUCTOR_ROLE}`,
        icon: 'warning',
        confirmButtonText: 'Yes',
        showCancelButton: true,
        cancelButtonColor: '#d33',
      }).then((result) => {
        if (result.isConfirmed) {
          this.updateInstructor(payload);
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
          text: `${AppConstants.INSTRUCTOR_ROLE} updated successfully`,
          icon: 'success',
        });
        this.proForm.reset();
        this.router.navigateByUrl('/student/settings/all-user/all-instructors');
      },
      (error: { message: any; error: any }) => {
        Swal.fire(
          `Failed to update ${AppConstants.INSTRUCTOR_ROLE}`,
          error.message || error.error,
          'error'
        );
      }
    );
  }
  ngOnInit(): void {
    this.getData();
    this.getForms();
    this.getDepartment();
    this.commonRoles = AppConstants
  }
  getData() {
    forkJoin({
      course: this.teachersService.getUserById(this.userId),
    }).subscribe((response: any) => {
      if (response) {

        // console.log("helo res",response.course)
        this.trainerId=response.course.trainerId;
        this.avatar = response.course?.avatar;
        this.uploaded = this.avatar?.split('/');
        let image = this.uploaded?.pop();
        this.uploaded = image?.split('\\');
        this.fileName = this.uploaded?.pop();
        this.proForm.patchValue({
          education: response?.course?.education,
          name: response?.course?.name,
          last_name: response?.course?.last_name,
          gender: response?.course?.gender,
          mobile: response?.course?.mobile,
          password: response?.course?.password,
          conformPassword: response?.course?.password,
          email: response?.course?.email,
          qualifications: response?.course?.qualifications[0]?.description,
          dob: response?.course?.dob,
          address: response?.course?.address,
          department: response?.course?.department,
          joiningDate: response?.course?.joiningDate,
          fileName: this.fileName,
          attemptBlock: response?.course?.attemptBlock,
          domainAreaOfPractice: response?.course?.domainAreaOfPractice,
          experience: response?.course?.experience,
          idNumber: response?.course?.idNumber,
          idType: response?.course?.idType?.description,
          code: response?.course?.idType?.code,
          linkedInURL: response?.course?.linkedInURL,

        });
      }
    });
  }
  getForms(): void {
    let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
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
  cancel() {
    window.history.back();
  }

  getDepartment() {
    this.StudentService.getAllDepartments().subscribe((response: any) => {
      this.dept = response.data.docs;
    });
  }
}
