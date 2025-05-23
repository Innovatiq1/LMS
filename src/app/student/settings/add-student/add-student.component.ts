import { Component } from '@angular/core';
import {
  AbstractControl,
  UntypedFormBuilder,
  UntypedFormGroup,
  ValidationErrors,
  ValidatorFn,
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
import { UserService } from '@core/service/user.service';
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
  breadcrumbs:any[] = [];
  storedItems: string | null;

  constructor(
    private fb: UntypedFormBuilder,
    private activatedRoute: ActivatedRoute,
    private StudentService: StudentsService,
    private router: Router,
    private courseService: CourseService,
    public utils: UtilsService,
    private formService: FormService,
    private userService: UserService

  ) {
    this.storedItems = localStorage.getItem('activeBreadcrumb');
    if (this.storedItems) {
      this.storedItems = this.storedItems.replace(/^"(.*)"$/, '$1');
      this.breadcrumbs = [
        {
          title: '', 
          items: [this.storedItems],  
          active: 'Create Trainee',  
        },
      ];
    }
    
      
    this.activatedRoute.queryParams.subscribe((params: any) => {
      this.StudentId = params.id;
      this.patchValues(this.StudentId);
      if(this.edit){
        if (this.storedItems) {
          this.storedItems = this.storedItems.replace(/^"(.*)"$/, '$1');
          this.breadcrumbs = [
            {
              title: '', 
              items: [this.storedItems],  
              active: 'Edit Trainee',  
            },
          ];
        }
      }
    });
    this.stdForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern(/[a-zA-Z0-9]+/),...this.utils.validators.noLeadingSpace]],
      last_name: [''],
      rollNo: ['', [Validators.required, ...this.utils.validators.noLeadingSpace,...this.utils.validators.roll_no]],
      gender: ['', [Validators.required]],
      mobile: ['', [Validators.required,...this.utils.validators.mobile]],
      password: ['',[Validators.required]],
      department: [''],
      address: [''],
      email: [
        '',
        [Validators.required, Validators.email, Validators.minLength(5),...this.utils.validators.noLeadingSpace,...this.utils.validators.email],
      ],
      parentsName: [''],
      parentsPhone: [''],
      // dob: ['', [Validators.required,...this.utils.validators.dob]],
      // dob: ['', [Validators.required, this.minAgeValidator(18)]],
      above18: [false],
      dob: ['', [Validators.required, this.dynamicAgeValidator()]],
      joiningDate: ['', [Validators.required]],
      avatar: [''],
      blood_group: [''],
      conformPassword: ['', [Validators.required]],
      attemptBlock: ['', []],
      qualifications: ['', [Validators.required]],
      domainAreaOfPractice: ['', [Validators.required]],
      idType: ['', []],
      // idNumber: ['', [Validators.required]],
      idNumber: ['', []],
      code: ['', []],
      linkedInURL: ['',],
      experience: ['',],

    },{
      validators: this.passwordMatchValidator,
    });
    this.stdForm.get('above18')?.valueChanges.subscribe(() => {
      this.stdForm.get('dob')?.updateValueAndValidity();
    });
  }

  // ngOnInit(){
  //   this.commonRoles = AppConstants
  //   this.getDepartment();
  //   this.getForms();

  // }
  // passwordMatchValidator(formGroup: UntypedFormGroup) {
  //   const password = formGroup.get('password')?.value;
  //   const confirmPassword = formGroup.get('conformPassword')?.value;
  //   console.log("password",password,"confirmPassword",confirmPassword)
  //   console.log(password === confirmPassword ? null : { mismatch: true })
  //   return password === confirmPassword ? null : { mismatch: true };
  // }
  passwordMatchValidator(formGroup: UntypedFormGroup) {
    const passwordControl = formGroup.get('password');
    const confirmPasswordControl = formGroup.get('conformPassword');
  
    if (!passwordControl || !confirmPasswordControl) return null;
    if (confirmPasswordControl.pristine) {
      return null;
    }
  
    if (passwordControl.value !== confirmPasswordControl.value) {
      confirmPasswordControl.setErrors({ mismatch: true });
      return { mismatch: true };
    } else {
      confirmPasswordControl.setErrors(null);
      return null;
    }
  }
  
  ngOnInit() {
    this.breadscrums = [
      {
        title: 'Trainees',
        items: [],
        active: 'Create Trainee'
      }
    ];
  
    localStorage.setItem('breadcrumbs', JSON.stringify(['Trainees']));
    localStorage.setItem('activeBreadcrumb', JSON.stringify('Create Trainee'));
  
    this.commonRoles = AppConstants;
    this.getDepartment();
    this.getForms();
  }

  // minAgeValidator(minAge: number) {
  //   return (control: AbstractControl): ValidationErrors | null => {
  //     if (!control.value) {
  //       return null; 
  //     }
  //     const birthDate = new Date(control.value);
  //     const today = new Date();
  //     const age = today.getFullYear() - birthDate.getFullYear();

  //     if (age < minAge || (age === minAge && today < new Date(birthDate.setFullYear(birthDate.getFullYear() + minAge)))) {
  //       return { minimumAge: true };
  //     }
  //     return null;
  //   };
  // }
  dynamicAgeValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const birthDate = new Date(control.value);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();

      if (
        today < new Date(birthDate.setFullYear(birthDate.getFullYear() + age))
      ) {
        age--; 
      }

      const isAbove18Checked = this.stdForm?.get('above18')?.value;

      if (isAbove18Checked) {
        if (age < 18) {
          return { ageTooLow18: true };
        }
      } else {
        if (age < 5) {
          return { ageTooLow: true };
        }
        if (age > 18) {
          return { ageTooHigh: true };
        }
      }

      return null;
    };
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
  onSubmit() {
    let user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    let subdomain =localStorage.getItem('subdomain') || '';
    let uen =localStorage.getItem('uen') || '';
    this.userService.getCompanyByIdentifierWithoutToken(subdomain).subscribe(
      (res: any) => {

    if (!this.stdForm.invalid) {
        // const userData: any = this.stdForm.value;
        // userData.avatar = this.avatar;
        
        // userData.type = AppConstants.STUDENT_ROLE;
        // userData.role = AppConstants.STUDENT_ROLE;
        // userData.isLogin = true;
        // userData.adminId = user.user.id;
        // userData.adminEmail = user.user.email;
        // userData.adminName = user.user.name;
        // userData.companyId = user.user.companyId;
        // userData.users = res[0]?.users;
        // userData.courses = res[0]?.courses;
        // userData.attemptBlock = false;
        // userData.company = user.user.company;
        // userData.domain = user.user.domain;
        let idType = {
          code: this.stdForm.value.code,
          description: this.stdForm.value.idType,
        }
        // let roles = [
        //   {
        //     role: {
        //       id: 1,
        //       description: "Trainee",
        //     },
        //   },
        // ]
        let qualifications = [{
          description: this.stdForm.value.qualifications,
          level: {
            code: "21",
          }
        }]
        const payload: any = {
           name: this.stdForm.value.name,
           last_name:this.stdForm.value.last_name,
           gender: this.stdForm.value.gender,
           domainAreaOfPractice: this.stdForm.value.domainAreaOfPractice,
           email: this.stdForm.value.email,
           experience: this.stdForm.value.experience,
           idNumber: this.stdForm.value.idNumber,
           idType: idType,
           isLogin : true,
           joiningDate: this.stdForm.value.joiningDate,
           linkedInURL: this.stdForm.value.linkedInURL,
           mobile: this.stdForm.value.mobile,
           password: this.stdForm.value.password,
           salutationId: 1,
           qualifications: qualifications,
           address: this.stdForm.value.address,
           adminEmail: user.user.email,
           adminId:  user.user.id,
           adminName:  user.user.name,
           attemptBlock: false,
           company: user.user.company,
           companyId: user.user.companyId,
           courses: res[0]?.courses,
           department: this.stdForm.value.department,
           dob: this.stdForm.value.dob,
           domain: user.user.domain,
           type: AppConstants.STUDENT_ROLE,
           role: AppConstants.STUDENT_ROLE,
           avatar: this.avatar,
           users: res[0]?.users,
           uen: uen,
        rollNo: this.stdForm.value.rollNo,
        };
        Swal.fire({
          title: 'Are you sure?',
          text: 'Do You want to create a trainee profile!',
          icon: 'warning',
          confirmButtonText: 'Yes',
          showCancelButton: true,
          cancelButtonColor: '#d33',
        }).then((result) => {
          if (result.isConfirmed){
            this.createInstructor(payload);
          }
        });
        
       
    }else{
      this.stdForm.markAllAsTouched();
    }
  })
}


  private createInstructor(userData: Users): void {
    this.userService.saveUsers(userData).subscribe(
      (res:any) => {
        // console.log('res',res)
        // if(res.status === 'success' && !res.data.status ){

        Swal.fire({
          title: 'Successful',
          text: 'Trainee created successfully',
          icon: 'success',
        });
        this.stdForm.reset();
        this.router.navigateByUrl('/student/settings/all-user/all-students');
      // } 
      // else {
        // Swal.fire({
        //   title: 'Error',
        //   text: "You have exceeded your limit, please contact Admin to upgrade",
        //   icon: 'error',
        // });
      // }
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
  patchValues(id: string) {
    if (id != undefined) {
      this.viewUrl = true;
      this.edit = true;
      this.StudentService.getStudentById(id).subscribe((res) => {
        this.editData = res;
        this.avatar = this.editData?.avatar;
      this.uploaded=this.avatar?.split('/')
      let image  = this.uploaded?.pop();
      this.uploaded= image?.split('\\');
      this.fileName = this.uploaded?.pop();
        this.stdForm.patchValue({
          name: this.editData.name,
          last_name: this.editData.last_name,
          rollNo: this.editData.rollNo,
          gender: this.editData.gender.toLowerCase(),
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
          attemptBlock: this.editData?.attemptBlock ,
          domainAreaOfPractice: this.editData?.domainAreaOfPractice,
          experience: this.editData?.experience,
          idNumber: this.editData?.idNumber,
          idType: this.editData?.idType?.description,
          code: this.editData?.idType?.code,
          linkedInURL: this.editData?.linkedInURL,
          qualifications: this.editData?.qualifications[0]?.description,
        },
        );
      });
    }
  }
  cancel() {

    window.history.back();
  }
  update() {
    let user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    let uen =localStorage.getItem('uen') || '';
    if (this.stdForm.valid) {
      // const userData: Student = this.stdForm.value;
      // userData.avatar = this.avatar;

      // userData.type = AppConstants.STUDENT_ROLE;
      // userData.role = AppConstants.STUDENT_ROLE;
      // userData.adminId = user.user.id;
      //   userData.adminEmail = user.user.email;
      //   userData.adminName = user.user.name;
      //   userData.companyId = user.user.companyId;
      //   userData.attemptCalculation = 1;
      let idType = {
        code: this.stdForm.value.code,
        description: this.stdForm.value.idType,
      }
      // let roles = [
      //   {
      //     role: {
      //       id: 1,
      //       description: "Trainee",
      //     },
      //   },
      // ]
      let qualifications = [{
        description: this.stdForm.value.qualifications,
        level: {
          code: "21",
        }
      }]
      const payload: any = {
         name: this.stdForm.value.name,
         gender: this.stdForm.value.gender,
         domainAreaOfPractice: this.stdForm.value.domainAreaOfPractice,
         email: this.stdForm.value.email,
         experience: this.stdForm.value.experience,
         idNumber: this.stdForm.value.idNumber,
         idType: idType,
         isLogin : true,
         joiningDate: this.stdForm.value.joiningDate,
         linkedInURL: this.stdForm.value.linkedInURL,
         mobile: this.stdForm.value.mobile,
         password: this.stdForm.value.password,
         salutationId: 1,
         qualifications: qualifications,
        //  roles: roles,
         address: this.stdForm.value.address,
         adminEmail: user.user.email,
         adminId:  user.user.id,
         adminName:  user.user.name,
         attemptBlock: false,
         company: user.user.company,
         companyId: user.user.companyId,
         department: this.stdForm.value.department,
         dob: this.stdForm.value.dob,
         domain: user.user.domain,
         type: AppConstants.STUDENT_ROLE,
         role: AppConstants.STUDENT_ROLE,
         avatar: this.avatar,
         attemptCalculation: 1,
         action: "update",
         rollNo: this.stdForm.value.rollNo,
         uen: uen,
      };

      Swal.fire({
        title: 'Are you sure?',
        text: 'Do You want to update this trainee profile!',
        icon: 'warning',
        confirmButtonText: 'Yes',
        showCancelButton: true,
        cancelButtonColor: '#d33',
      }).then((result) => {
        if (result.isConfirmed){
          this.updateInstructor(payload);
          Swal.close();
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
        window.history.back();
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

    getMinDOB(): string {
    const today = new Date();
    const minDate = new Date(today.getFullYear() - 20, today.getMonth(), today.getDate());
    return minDate.toISOString().split('T')[0]; // Format YYYY-MM-DD
  }

//   passwordMatchValidator(group: UntypedFormGroup): { [key: string]: boolean } | null {
//   const password = group.get('password')?.value;
//   const confirmPassword = group.get('conformPassword')?.value;
//   return password === confirmPassword ? null : { mismatch: true };
// }


  // minAgeValidator(minAge: number) {
  //   return (control: any) => {
  //     if (!control.value) {
  //       return null;
  //     }
  //     const birthDate = new Date(control.value);
  //     const today = new Date();
  //     const age = today.getFullYear() - birthDate.getFullYear();
  //     const hasBirthdayPassed = (today.getMonth() > birthDate.getMonth()) ||
  //                               (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());
  //     return (age > minAge || (age === minAge && hasBirthdayPassed)) ? null : { minAge: true };
  //   };
  // }
}
