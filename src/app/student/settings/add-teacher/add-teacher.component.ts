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
import { UserService } from '@core/service/user.service';

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
    private userService: UserService

   ) {
    this.proForm = this.fb.group({
      name: ['', [Validators.required,Validators.pattern(/[a-zA-Z0-9]+/),...this.utils.validators.noLeadingSpace]],
      last_name: [''],
      gender: ['', [Validators.required]],
      mobile: ['', [Validators.required,...this.utils.validators.noLeadingSpace,...this.utils.validators.mobile]],
      password: ['', [Validators.required]],
      department: [''],
      address: [''],
      email: [
        '',
        [Validators.required, Validators.email, Validators.minLength(5),...this.utils.validators.noLeadingSpace,...this.utils.validators.email],
      ],
      dob: ['', [Validators.required]],
      joiningDate:['', [Validators.required]],
      qualifications: ['', [Validators.required,...this.utils.validators.designation]],
      avatar: ['',],
      domainAreaOfPractice: ['', [Validators.required]],
      idType: ['', [Validators.required]],
      idNumber: ['', [Validators.required]],
      code: ['', [Validators.required]],
      linkedInURL: ['',],
      experience: ['',],
    },{
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
  }
  getDepartment(){
    this.StudentService.getAllDepartments().subscribe((response: any) =>{
      this.dept = response.data.docs;
     })

  }
  onSubmit() {
    let user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    let subdomain =localStorage.getItem('subdomain') || '';
    this.userService.getCompanyByIdentifierWithoutToken(subdomain).subscribe(
      (res: any) => {

    if (!this.proForm.invalid) {
      let idType = {
        code: this.proForm.value.code,
        description: this.proForm.value.idType,
      }
      let roles = [
        {
          role: {
            id: 1,
            description: "Trainer",
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
         last_name:this.proForm.value.last_name,
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
         courses: res[0]?.courses,
         department: this.proForm.value.department,
         dob: this.proForm.value.dob,
         domain: user.user.domain,
         type: AppConstants.INSTRUCTOR_ROLE,
         role: AppConstants.INSTRUCTOR_ROLE,
         avatar: this.avatar,
         users: res[0]?.users
      };
        this.createInstructor(payload);
    }else{
      this.proForm.markAllAsTouched(); 
      this.submitClicked = true;
    }
  })
}

  ngOnInit(){
    this.getDepartment();
    this.getForms();
    this.commonRoles = AppConstants
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
          (res:any) => {
            if(res.status === 'success' && !res.data.status ){

            Swal.fire({
              title: "Successful",
              text: "Trainer created successfully",
              icon: "success",
            });
          this.proForm.reset();
          this.router.navigateByUrl('/student/settings/all-user/all-instructors');
            } else {
              Swal.fire({
                title: 'Error',
                text: "You have exceeded your limit, please contact Admin to upgrade",
                icon: 'error',
              });
            }
          },
          (error) => {
            Swal.fire(
              error,
              error.message || error.error,
              "error"
            );
          }
        );
      }
    });
   
  }
  cancel(){
window.history.back();
  }
}
