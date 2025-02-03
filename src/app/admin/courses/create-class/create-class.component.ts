import { map } from 'rxjs';
import { ChangeDetectorRef, Component, HostListener, ViewChild } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  UntypedFormControl,
  Validators,
} from '@angular/forms';
import { ClassModel, CourseTitleModel, DataSourceModel, InstructorList, LabListModel, Session, Student, StudentApproval, StudentPaginationModel } from 'app/admin/schedule-class/class.model';
import { ClassService } from 'app/admin/schedule-class/class.service';
import { forkJoin } from 'rxjs';
import * as moment from 'moment';
import { DatePipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { CourseService } from '@core/service/course.service';
import { Subscription } from 'rxjs';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { InstructorService } from '@core/service/instructor.service';
import Swal from 'sweetalert2';
import { StudentsService } from 'app/admin/students/students.service';
import { UserService } from '@core/service/user.service';
import { MatOption } from '@angular/material/core';
import { FormService } from '@core/service/customization.service';
import { AppConstants } from '@shared/constants/app.constants';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-create-class',
  templateUrl: './create-class.component.html',
  styleUrls: ['./create-class.component.scss'],
})
export class CreateClassComponent {
  item: any;
  dept: any;
  @ViewChild('allSelected') private allSelected!: MatOption;
  commonRoles: any;
  breadscrums: any;
  trainerId:any;
  idNumber:any;
  @HostListener('document:keypress', ['$event'])
  keyPressNumbers(event: KeyboardEvent) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    }
    return true;
  }

  classForm!: FormGroup;
  InstructorForm!: FormGroup;
  isInstructorFailed: number = 0;
  isStartDateFailed: number = 0;
  isEndDateFailed: number = 0;
  dataSourceArray: DataSourceModel[] = [];
  dataSource: any;
  courseTitle: any;
  user_id: any;
  courseCode: any;
  courseCode1: any;
  expiryDate:any;
  classId!: string;
  forms!: any[];
  title: boolean = false;


  startDate = new Date(1990, 0, 1);
  date = new UntypedFormControl(new Date());
  serializedDate = new UntypedFormControl(new Date().toISOString());
  minDate: Date | undefined;
  maxDate!: Date;
  courseList!: any;
  instructorList: any = [];
  selectedPosition: number = 0;
  selectedLabPosition: number = 0;
  courseNameControl!: FormControl;
  classTypeControl!: FormControl;
  classDeliveryControl!: FormControl;
  roomTypeControl!: FormControl;
  guaranteeControl!: FormControl;
  instructorControl!: FormControl;
  mode!: string;
  sessions: any = [];
  instForm!: FormArray<any>;
  next: boolean = false;
  secondFormGroup!: FormGroup;
  studentId: any;
  configuration: any;
  configurationSubscription!: Subscription;
  defaultCurrency: string = '';
  userGroups!: any[];
  courseTPRunId!:any;
  courseReferenceNumber!:any;  instructorCost:string='';
  codeExists: boolean = false;
  code: string | null = null;
  minDates: Date = new Date();
  zoomSessionCreated: boolean = false;
  isValidDuration: boolean = true;
  totalMinutes: number | null = null;
  meetingPlatforms:any[] = [];
  addNewRow() {
    if (this.isInstructorFailed != 1) {
      this.isInstructorFailed = 0;
      const currentYear = new Date().getFullYear();
      this.dataSourceArray.push({
        start: moment().set({ hour: 8, minute: 0 }).format('YYYY-MM-DD HH:mm'),
        end: moment().set({ hour: 8, minute: 0 }).format('YYYY-MM-DD HH:mm'),
        instructor: 'date',
      });
      this.dataSource = this.dataSourceArray;
    }
  }
  constructor(
    public _fb: FormBuilder,
    private _classService: ClassService,
    private router: Router,
    private _activeRoute: ActivatedRoute,
    private cd: ChangeDetectorRef,
    private snackBar: MatSnackBar,
    private courseService: CourseService,
    private instructorService: InstructorService,
    private studentsService: StudentsService,
    private userService: UserService,
    private formService: FormService,

  ) {
    this._activeRoute.queryParams.subscribe((params) => {
      this.classId = params['id'];
      if (this.classId) {
        this.title = true;
      }
    });
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 5, 0, 1);
    this.maxDate = new Date(currentYear + 1, 11, 31);
    
    this.commonRoles = {

      INSTRUCTOR_ROLE: 'Instructor',

      STUDENT_ROLE: 'Student',

      DURATION_LABEL:'Duration'

    };

    this.loadForm();
  }
  ngOnInit(): void {
    this._activeRoute.queryParams.subscribe(params => {
      this.code = params['code'] || null;
      this.codeExists = !!params['code'];
  });
  const storedZoomSessionCreated = localStorage.getItem('zoomSessionCreated');
  this.zoomSessionCreated = storedZoomSessionCreated === 'true';
  const savedCourseCode = localStorage.getItem('courseCode');
  const savedCourseTitle = localStorage.getItem('courseTitle');
  const savedExpiryDate=localStorage.getItem('expiryDate')
  if (savedCourseCode && savedCourseTitle) {
    this.courseCode = savedCourseCode;
    this.courseTitle = savedCourseTitle;
    this.expiryDate=savedExpiryDate;
  }
    this.loadSavedFormData();

    this.commonRoles = AppConstants
    if (this.classId != undefined) {
      this.loadClassList(this.classId);
    }
    if(this.classId == undefined){
      this.addNewRow();
    }
    let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
        let payload = {
      type: AppConstants.INSTRUCTOR_ROLE,
      companyId:userId

    };

    if(this.classId){
      this.breadscrums = [
        {
          title: 'Edit Course Batch',
          items: ['Course Batch'],
          active: 'Edit Course Batch',
        },
      ];
    }else{
      this.breadscrums = [
        {
          title: 'Create Course Batch',
          items: ['Course Batch'],
          active: 'Create Course Batch',
        },
      ];
    }


    this.instructorService.getInstructorLists(payload).subscribe((res) => {
      this.instructorList = res;
    });

    forkJoin({
      courses: this._classService.getAllCoursesTitle('active'),
      dropDowns: this._classService.getDropDowns(userId, "meetingPlatform")
    }).subscribe((response) => {
      this.courseList = response.courses.reverse();
      this.meetingPlatforms = response.dropDowns?.data?.meetingPlatform;
      console.log(response.dropDowns);
      this.cd.detectChanges();
    });

    this.configurationSubscription = this.studentsService.configuration$.subscribe(configuration => {
      this.configuration = configuration;
      const config = this.configuration.find((v:any)=>v.field === 'currency')
      if (config) {
        this.defaultCurrency = config.value;
        this.classForm.patchValue({
        currency: this.defaultCurrency,
        })
      }
    });
   this.loadData();
   this.getForms();
   this.getDepartments();
   this.getUserGroups()
  }
  
  


  loadSavedFormData() {
    const savedFormData = localStorage.getItem('classFormData');
    if (savedFormData) {
      const parsedFormData = JSON.parse(savedFormData);
      this.classForm.patchValue({
        courseId: parsedFormData?.courseId,
        classType: parsedFormData?.classType, 
        classDeliveryType: parsedFormData?.classDeliveryType,
        instructorCost: parsedFormData?.instructorCost,
        instructorCostCurrency: parsedFormData?.instructorCostCurrency || 'USD',
        department: parsedFormData?.department, 
        currency: parsedFormData?.currency || '',
        isGuaranteedToRun: parsedFormData?.isGuaranteedToRun || false, 
        externalRoom: parsedFormData?.externalRoom || false, 
        minimumEnrollment: parsedFormData?.minimumEnrollment,
        maximumEnrollment: parsedFormData?.maximumEnrollment,
        meetingPlatform: parsedFormData?.meetingPlatform || '', 
        classStartDate: parsedFormData?.classStartDate || '2023-05-20', 
        classEndDate: parsedFormData?.classEndDate || '2023-06-10', 
        userGroupId: parsedFormData?.userGroupId || null, 
        duration: parsedFormData?.duration || null ,
        registrationStartDate: parsedFormData?.registrationStartDate,
        registrationEndDate: parsedFormData?.registrationEndDate
      });      
    }
  }

  getUserGroups() {
    this.userService.getUserGroups().subscribe((response: any) => {
      this.userGroups = response.data.docs;
    });
  }

  getForms(): void {
    let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
        this.formService
      .getAllForms(userId,'Course Class Creation Form')
      .subscribe((forms) => {
        this.forms = forms;
      });
  }

  loadData(){
    this.studentId = localStorage.getItem('id')
    this.studentsService.getStudentById(this.studentId).subscribe(res => {
    })
}

loadForm() {
  this.classForm = this._fb.group({
    courseId: ['', [Validators.required]],
    classType: ['public'],
    classDeliveryType: ['', Validators.required],
    instructorCost: ['', Validators.required],
    instructorCostCurrency: ['USD'],
    department: ['', Validators.required],
    userGroupId: ['', [Validators.required]],
    currency: [''],
    isGuaranteedToRun: [false, Validators.required],
    externalRoom: [false],
    minimumEnrollment: ['', Validators.required],
    maximumEnrollment: ['', Validators.required],
    meetingPlatform: ['', Validators.required], 
    classStartDate: [''],
    classEndDate: [''],
      registrationStartDate: ['', Validators.required], // New field
      registrationEndDate: ['', Validators.required],   // New field
    duration: ['', [Validators.required,Validators.pattern('^[0-9]{1,2}[:][0-9]{1,2}$')]], 
    code: ''
  });

  this.secondFormGroup = this._fb.group({
    sessions: ['', Validators.required],
  });
  this.classForm.get('classDeliveryType')!.valueChanges.subscribe((deliveryType) => {
    const meetingPlatformControl = this.classForm.get('meetingPlatform')!;
    const durationControl = this.classForm.get('duration')!;
    if (deliveryType === 'online') {
      meetingPlatformControl.setValidators([Validators.required]);
      durationControl.setValidators([Validators.required]);
    } else {
      meetingPlatformControl.clearValidators();
      durationControl.clearValidators();
    }
    meetingPlatformControl.updateValueAndValidity();
    durationControl.updateValueAndValidity();
  });
  this.classForm.get('duration')!.valueChanges.subscribe(()=>{
    this.onDurationChange();
  })
}

  getDepartments() {
    this.studentsService.getAllDepartments().subscribe((response: any) => {
      this.dept = response.data.docs;
    });
  }


  loadClassList(id: string) {
    this._classService.getClassById(id).subscribe((response) => {
      const item = response;
      this.courseTPRunId=item?.courseTPRunId;
      this.courseReferenceNumber=item?.courseReferenceNumber;
      this.idNumber=item?.course?.runs[0]?.linkCourseRunTrainer[0]?.trainer?.idNumber;
      this.trainerId=item?.course?.runs[0]?.linkCourseRunTrainer[0]?.trainer?.id;
      this.courseTitle=item?.courseName;
      this.courseCode=item?.courseReferenceNumber;
      // console.log("getrrr",response);
      this.classForm.patchValue({
        courseId: item?.courseId?.id,
        classType: item?.classType,
        classDeliveryType: item?.classDeliveryType,
        instructorCost: item?.instructorCost,
        currency: item?.currency,
        instructorCostCurrency: item?.instructorCostCurrency,
        isGuaranteedToRun: item?.isGuaranteedToRun,
        externalRoom: item?.externalRoom,
        minimumEnrollment: item?.minimumEnrollment,
        maximumEnrollment: item?.maximumEnrollment,
        department:item?.department,
        sessions: item?.sessions,
        userGroupId: item?.userGroupId,
        duration: item?.duration,
        meetingPlatform: item?.meetingPlatform,
        registrationStartDate:item.registrationStartDate,
        registrationEndDate:item.registrationEndDate,
        // courseReferenceNumber:item.courseReferenceNumber,
        // courseTPRunId:item.courseTPRunId
      });
      
      item.sessions.forEach((item: any) => {
        const start = moment(`${moment(item.sessionStartDate).format('YYYY-MM-DD')}T${item.sessionStartTime}`).format();
        const end = moment(`${moment(item.sessionEndDate).format('YYYY-MM-DD')}T${item.sessionEndTime}`).format();
    
        this.dataSourceArray.push({
            start: start,
            end: end,
            instructor: item.instructorId?.id,
        });
    });
    
      this.dataSource = this.dataSourceArray;
      this.cd.detectChanges();
    });
  }
  nextBtn() {
    if (
      this.classForm.get('classDeliveryType')?.valid &&
      this.classForm.get('courseId')?.valid &&
      this.classForm.get('instructorCost')?.valid &&
      this.classForm.get('minimumEnrollment')?.valid &&
      this.classForm.get('maximumEnrollment')?.valid
    ) {
      this.next = true;
    }
  }
  back() {
    this.next = false;
  }

  deleteRecord(index: number) {
    this.dataSourceArray.splice(index, 1);
    this.dataSource = this.dataSourceArray;
  }
  showNotification(
    colorName: string,
    text: string,
    placementFrom: MatSnackBarVerticalPosition,
    placementAlign: MatSnackBarHorizontalPosition
  ) {
    this.snackBar.open(text, '', {
      duration: 6000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName,
    });
  }
  // getSession() {
  //   let sessions: any = [];
  //   this.dataSource.forEach((item: any, index: any) => {
  //     if (
  //       this.isInstructorFailed == 0 &&
  //       item.instructor != '0'
  //     ) {
  //       sessions.push({
  //         sessionNumber: index + 1,
  //         sessionStartDate: moment(item.start).format('YYYY-MM-DD'),
  //         sessionEndDate: moment(item.end).format('YYYY-MM-DD'),
  //         sessionStartTime: moment(item.start).format('HH:mm'),
  //         sessionEndTime: moment(item.end).format('HH:mm'),
  //         instructorId: item.instructor||null,
  //         courseName: this.courseTitle,
  //         courseCode: this.courseCode,
  //         status: 'Pending',
  //         user_id: this.user_id,
  //       });
  //     } else {
  //       sessions = null;
  //     }
  //   });
  //   return sessions;
  // }
  getSession() {
    let sessions: any = [];
    this.dataSource.forEach((item: any, index: any) => {
      if (this.isInstructorFailed === 0) {
        sessions.push({
          sessionNumber: index + 1,
          sessionStartDate: moment(item.start).format('YYYY-MM-DD'),
          sessionEndDate: moment(item.end).format('YYYY-MM-DD'),
          sessionStartTime: moment(item.start).format('HH:mm'),
          sessionEndTime: moment(item.end).format('HH:mm'),
          instructorId: item.instructor ||'', // Allow null if instructor is not selected
          courseName: this.courseTitle,
          courseCode: this.courseCode,
          // courseName:"TestTPnew123",
          // courseCode:"TGS-2020002144",
          status: 'Pending',
          user_id: this.user_id,
        });
      } else {
        sessions = null;
      }
    });
    return sessions;
  }
  
  toggleAllSelection() {
    if (this.allSelected.selected) {
      this.classForm.controls['userGroupId']
        .patchValue([...this.userGroups.map(item => item.id)]);
    } else {
      this.classForm.controls['userGroupId'].patchValue([]);
    }
  }
  onSelectChange(event: any) {
    const filteredData = this.courseList.filter(
      (item: { _id: string }) =>
        item._id === this.classForm.controls['courseId'].value
    );
    this.courseTitle=filteredData[0].title
    this.courseCode=filteredData[0].courseCode
    this.expiryDate=filteredData[0].sessionEndDate

    console.log("this.expiry",this.expiryDate)

  }

  onSelectChange1(event :any,element:any) {
    const filteredData = this.instructorList.filter((item: { id: string; }) => item.id === element.instructor);
     this.user_id = filteredData[0].id;
     this.trainerId=filteredData[0].trainerId;
     this.idNumber=filteredData[0].idNumber;


  }

getTPCourse(classForm:any){
  let uen =localStorage.getItem('uen') || '';
  // console.log("classForm",classForm.value)
  // console.log("classForm",JSON.parse(localStorage.getItem('user_data')!).user.adminEmail)
  // console.log("classForm",classForm.value.registrationEndDate)
  // console.log("classForm this.trainerId",this.trainerId)
  // console.log("classForm this.idNumber",this.idNumber)
  // console.log("classForm ssd",classForm.value.sessions[0].sessionStartDate.replace(/-/g, ''));
  // console.log("moment(date).format('YYYYMMDD')",moment(classForm.value.registrationEndDate).format('YYYYMMDD'))
  let course={
        "courseReferenceNumber": classForm.value.courseReferenceNumber||this.courseReferenceNumber,
        "trainingProvider": {
            "uen": uen
        },
        "runs": [
            {
                "sequenceNumber": 0,
                "registrationDates": {
                    "opening": moment(classForm.value.registrationStartDate).format('YYYYMMDD'),
                    "closing": moment(classForm.value.registrationEndDate).format('YYYYMMDD')
                },
                "courseDates": {
                    "start": classForm.value.sessions[0].sessionStartDate.replace(/-/g, ''),
                    "end": classForm.value.sessions[0].sessionEndDate.replace(/-/g, '')
                },
                "scheduleInfoType": {
                    "code": "01",
                    "description": "Description"
                },
                "scheduleInfo": "Sat / 5 Sats / 9am - 6pm",
               
                "intakeSize": classForm.value.maximumEnrollment,
                "modeOfTraining": "2",
                "courseAdminEmail": JSON.parse(localStorage.getItem('user_data')!).user.email,
                "courseVacancy": {
                    "code": "L",
                    "description": "Limited Vacancy"
                },
               
                "sessions": [
                    {
                        "startDate": classForm.value.sessions[0].sessionStartDate.replace(/-/g, ''),
                        "endDate": classForm.value.sessions[0].sessionEndDate.replace(/-/g, ''),
                        "startTime": classForm.value.sessions[0].sessionStartTime,
                        "endTime": classForm.value.sessions[0].sessionEndTime,
                        "modeOfTraining": "2"
                       
                    }
                ],
                "linkCourseRunTrainer": [
                    {
                        "trainer": {
                            "indexNumber": 0,
                            "id": this.trainerId,
                            "name": "",
                            "inTrainingProviderProfile": true,
                            "domainAreaOfPractice": "",
                            "experience": "",
                            "linkedInURL": "",
                            "salutationId": "",
                            "photo": {
                                "name": "",
                                "content": ""
                            },
                            "email": "",
                            "trainerType": {
                                "code": "1",
                                "description": "Existing"
                            },
                           
                            "idNumber": this.idNumber,
                            "idType": {
                                "code": "",
                                "description": ""
                            },
                            "roles": [
                                {
                                    "role": {
                                        "id": 1,
                                        "description": "Trainer"
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        ]
    }
    return course;
// console.log("course",course)

}

  data() {
  }

  submit() {
    const deliveryType = this.classForm.get('classDeliveryType')?.value;
    const meetingPlatform = this.classForm.get('meetingPlatform')?.value;
    // if (deliveryType === 'online' && meetingPlatform === 'zoom' && !this.zoomSessionCreated && !this.classId) {
    //   alert('Please create the Zoom session before submitting the form.');
    //   return;
    // }
    if(this.classForm.valid){
      
    const sessions = this.getSession();
    if (this.classId) {
      this.sessions = this.getSession();
      if (this.sessions) {
        this.classForm.value.sessions = sessions;
        this.classForm.value.courseName = this.courseTitle
        this.classForm.value.course= this.getTPCourse(this.classForm);
        this.classForm.value.courseTPRunId=this.courseTPRunId;
        this.classForm.value.courseReferenceNumber=this.courseReferenceNumber;

        Swal.fire({
          title: 'Are you sure?',
          text: 'Do you want to update this batch!',
          icon: 'warning',
          confirmButtonText: 'Yes',
          showCancelButton: true,
          cancelButtonColor: '#d33',
        }).then((result) => {
          if (result.isConfirmed) {
            Swal.fire({
              title: 'Please wait',
              text: 'Updating the class...',
              allowOutsideClick: false,
              showConfirmButton: false,
              didOpen: () => {
                Swal.showLoading(); 
              },
            });
    
            this._classService.updateClass(this.classId, this.classForm.value)
              .subscribe((response) => {
                if (response) {
                  Swal.fire({
                    title: 'Success',
                    text: 'Class Updated Successfully.',
                    icon: 'success',
                  });
                  window.history.back();
                }
              }, (error) => {
                Swal.fire({
                  title: 'Error',
                  text: 'Something went wrong. Please try again.',
                  icon: 'error',
                });
              });
          }
        });
      }
    }
    
     else {
      if (sessions) {
        this.classForm.value.sessions = sessions;
         this.classForm.value.courseName = this.courseTitle;  
        // this.classForm.value.courseName ="TestTPnew123" 
        const userData = localStorage.getItem('user_data');
        if (userData) {
          let userId = JSON.parse(userData).user.companyId;
          this.classForm.value.companyId = userId;
        }
              if (this.code) {
          this.classForm.value.code = this.code;
        }
         this.classForm.value.courseReferenceNumber=this.courseCode;
                this.classForm.value.trainingProvider = {
                  uen:localStorage.getItem('uen') || ''
                };
        this.classForm.value.course= this.getTPCourse(this.classForm);
              if (!this.classForm.valid) {
          Swal.fire({
            title: 'Error',
            text: 'Please fill out all required fields before submitting.',
            icon: 'error',
          });
          return;
        }
              Swal.fire({
          title: 'Are you sure?',
          text: 'Do you want to create a batch!',
          icon: 'warning',
          confirmButtonText: 'Yes',
          showCancelButton: true,
          cancelButtonColor: '#d33',
        }).then((result) => {
          if (result.isConfirmed) {
            Swal.fire({
              title: 'Please wait',
              text: 'Scheduling your class...',
              allowOutsideClick: false,
              didOpen: () => {
                Swal.showLoading();
              },
            });
            this._classService.saveClass(this.classForm.value).subscribe(
              (response) => {
                Swal.fire({
                  title: 'Success',
                  text: 'Batch Created Successfully.',
                  icon: 'success',
                });
                localStorage.removeItem('zoomSessionCreated');
                localStorage.removeItem('classFormData');
                this.zoomSessionCreated = false;
                this.router.navigate(['/admin/courses/class-list'], {
                  state: { newClass: response },
                });
              })
            }});

  }else{
    this.classForm.markAllAsTouched();
  }
  }
} else{
  this.classForm.markAllAsTouched();
}
  }
  startDateChange(element: { end: any; start: any }) {
    element.end = element.start;
  }
  onChangeInstructor(element: any, i: number) {
    this.selectedPosition = i;
    this.checkAvailabilityOfInstructor(element);
  }
  checkAvailabilityOfInstructor(element: {
    instructor: any;
    start: any;
    end: any;
  }) {
    this._classService
      .validateInstructor(
        element.instructor,
        new DatePipe('en-US').transform(new Date(element.start), 'yyyy-MM-dd')!,
        new DatePipe('en-US').transform(new Date(element.end), 'yyyy-MM-dd')!,
        new DatePipe('en-US').transform(new Date(element.start), 'HH:MM')!,
        new DatePipe('en-US').transform(new Date(element.end), 'HH:MM')!
      )
      .subscribe((response: any) => {
        if (!response['success']) {
          this.isInstructorFailed = 1;
        } else {
          this.isInstructorFailed = 0;
        }
      });
  }
  checkAvailabilityOfLaboratory(element: {
    start: string | number | Date;
    end: string | number | Date;
  }) {
    this._classService
      .validateLaboratory(
        new DatePipe('en-US').transform(new Date(element.start), 'yyyy-MM-dd')!,
        new DatePipe('en-US').transform(new Date(element.end), 'yyyy-MM-dd')!,
        new DatePipe('en-US').transform(new Date(element.start), 'HH:MM')!,
        new DatePipe('en-US').transform(new Date(element.end), 'HH:MM')!
      )
      .subscribe((response) => {
      });
  }

  setCourseNameControlState(): void {
    if (this.mode === 'viewUrl') {
      this.courseNameControl.disable({ emitEvent: false });
    } else {
      this.courseNameControl.enable({ emitEvent: false });
    }
  }
  setClassTypeControlState(): void {
    if (this.mode === 'viewUrl') {
      this.classTypeControl.disable({ emitEvent: false });
    } else {
      this.classTypeControl.enable({ emitEvent: false });
    }
  }
  setRoomTypeControlState(): void {
    if (this.mode === 'viewUrl') {
      this.roomTypeControl.disable({ emitEvent: false });
    } else {
      this.roomTypeControl.enable({ emitEvent: false });
    }
  }
  setGuaranteeControlState(): void {
    if (this.mode === 'viewUrl') {
      this.guaranteeControl.disable({ emitEvent: false });
    } else {
      this.guaranteeControl.enable({ emitEvent: false });
    }
  }

  setClassDeliveryControlState(): void {
    if (this.mode === 'viewUrl') {
      this.classDeliveryControl.disable({ emitEvent: false });
    } else {
      this.classDeliveryControl.enable({ emitEvent: false });
    }
  }
  isInputReadonly(): boolean {
    return this.mode === 'viewUrl';
  }

  mapPropertiesInstructor(response: any[]) {
    response.forEach((element: InstructorList) => {
      this.instructorList.push(element);
    });
  }
  cancel() {

    window.history.back();
    localStorage.removeItem('classFormData');
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
  getCurrentHost(): string {
    return window.location.hostname; // Get the current host without port
  }
  updateHost(url: string): string {
    const currentHost = this.getCurrentHost();
    try {
      const parsedUrl = new URL(url);
      if (parsedUrl.hostname !== currentHost) {
        parsedUrl.hostname = currentHost; // Replace the hostname
      }
      return encodeURI(parsedUrl.toString());
    } catch (e) {
      console.error('Invalid URL:', url);
      return encodeURIComponent(url); // Return the original URL if it's invalid
    }
  }
  scheduleMeet() {
    const formData = this.classForm.value;
    localStorage.setItem('classFormData', JSON.stringify(formData));
    localStorage.setItem('courseCode', this.courseCode);
    localStorage.setItem('expiryDate', this.expiryDate);
    localStorage.setItem('courseTitle', this.courseTitle);
    if (this.classForm.get('meetingPlatform')?.value === 'zoom') {
      const zoomKey = JSON.parse(localStorage.getItem('user_data')!)?.user?.zoomKey;

      const clientId = zoomKey.clientId || '';
      const redirectUri = this.updateHost(zoomKey.redirectUri) 
      const zoomURL = `https://zoom.us/oauth/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}`
      const zoomAuthUrl = zoomURL;
      localStorage.setItem('zoomSessionCreated', 'true');
      window.location.href = zoomAuthUrl;
    }
  }

  onDurationChange() {
    const duration = this.classForm.get('duration')?.value;
    if (duration && duration.length === 5) {
      const [hours, minutes] = duration.split(':').map(Number);

      if (!isNaN(hours) && !isNaN(minutes) && hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59) {
        this.totalMinutes = hours * 60 + minutes;
      } else {
        this.totalMinutes = null;
      }
    } else {
      this.totalMinutes = null;
    }
  }

  formatDuration() {
    let value = this.classForm.get('duration')?.value || '';
    
    // Remove all non-numeric characters
    const cleaned = value.replace(/[^0-9]/g, '');

    // Format it to HH:mm format (2 digits for hours, 2 for minutes)
    if (cleaned.length <= 2) {
      this.classForm.get('duration')?.setValue(cleaned);
    } else {
      const hours = cleaned.slice(0, 2);
      const minutes = cleaned.slice(2, 4);
      this.classForm.get('duration')?.setValue(`${hours}:${minutes}`);
    }
  }
  endDateChange(event:any, element:any){
    const duration = this.classForm.get('duration')?.value;
    const startDateTime = element.start;
    const endDateTime = event;
    if (duration && startDateTime && endDateTime) {
      const [hours, minutes] = duration.split(':').map(Number);
      const startDateObj =  moment(startDateTime);
      const st_hour = startDateObj.get('hours');
      const st_min = startDateObj.get('minutes');
      const updatedendDateTime = moment(endDateTime)
        .hour(st_hour+hours)
        .minute(st_min+minutes)
        .second(0).toDate();
        element.end =  updatedendDateTime;
    }
  }
  
}
