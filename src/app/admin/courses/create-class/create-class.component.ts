import { map } from 'rxjs';

/* eslint-disable @typescript-eslint/no-unused-vars */

/* eslint-disable @typescript-eslint/no-explicit-any */
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
// import * as moment from 'moment';

@Component({
  selector: 'app-create-class',
  templateUrl: './create-class.component.html',
  styleUrls: ['./create-class.component.scss'],
})
export class CreateClassComponent {
  item: any;
  dept: any;
  @ViewChild('allSelected') private allSelected!: MatOption;
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
  // isLabFailed: number = 0;
  isStartDateFailed: number = 0;
  isEndDateFailed: number = 0;
  dataSourceArray: DataSourceModel[] = [];
  dataSource: any;
  courseTitle: any;
  user_id: any;
  courseCode: any;
  classId!: string;
  forms!: any[];
  title: boolean = false;

  breadscrums = [
    {
      title: 'Create Class',
      items: ['Schedule Class'],
      active: 'Create Class',
    },
  ];
  startDate = new Date(1990, 0, 1);
  date = new UntypedFormControl(new Date());
  serializedDate = new UntypedFormControl(new Date().toISOString());
  minDate: Date | undefined;
  maxDate!: Date;
  // status = true;
  courseList!: any;
  instructorList: any = [];
  // labList: any = [];
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


  addNewRow() {
    if (this.isInstructorFailed != 1) {
      this.isInstructorFailed = 0;
      // this.isLabFailed = 0;
      const currentYear = new Date().getFullYear();
      this.dataSourceArray.push({
        start: moment().set({ hour: 8, minute: 0 }).format('YYYY-MM-DD HH:mm'),
        end: moment().set({ hour: 8, minute: 0 }).format('YYYY-MM-DD HH:mm'),
        instructor: '0',
        // lab: '0',
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
    // Set the minimum to January 1st 5 years in the past and December 31st a year in the future.
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 5, 0, 1);
    this.maxDate = new Date(currentYear + 1, 11, 31);
  }

  // toggleStatus() {
  //   this.status = !this.status;
  // }

  ngOnInit(): void {
    if (this.classId != undefined) {
      this.loadClassList(this.classId);
    }
    if(this.classId == undefined){
      this.addNewRow();
    }
    this.loadForm();
    let payload = {
      type: AppConstants.INSTRUCTOR_ROLE,
    };

    this.instructorService.getInstructor(payload).subscribe((res) => {
      this.instructorList = res;
    });

    forkJoin({
      courses: this._classService.getAllCoursesTitle('active'),
    }).subscribe((response) => {
      this.courseList = response.courses.reverse();
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

  getUserGroups() {
    this.userService.getUserGroups().subscribe((response: any) => {
      this.userGroups = response.data.docs;
    });
  }

  getForms(): void {
    this.formService
      .getAllForms('Course Class Creation Form')
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
      department:['',Validators.required],
      currency: [''],
      isGuaranteedToRun: [false, Validators.required],
      externalRoom: [false],
      minimumEnrollment: ['', Validators.required],
      maximumEnrollment: ['', Validators.required],
      // status: ['open'],
      classStartDate: ['2023-05-20'],
      classEndDate: ['2023-06-10'],
      userGroupId: [null]
    });
    this.secondFormGroup = this._fb.group({
      sessions: ['', Validators.required],
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
        // status: item?.status,
        sessions: item?.sessions,
        userGroupId: item?.userGroupId
      });
         console.log( item.sessions, "++")
      item.sessions.forEach((item: any) => {

        this.dataSourceArray.push({
          start: `${moment(item.sessionStartDate).format('YYYY-MM-DD')}`,
          end: `${moment(item.sessionEndDate).format('YYYY-MM-DD')}`,
          instructor: item.instructorId?.id,

          // lab: item.laboratoryId?.id,
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
  //   console.log('inst', this.InstructorForm);

  //   const index = 0;
  //   if (
  //     this.isInstructorFailed == 0 &&
  //     this.InstructorForm.value.instructor != '0' &&
  //     this.InstructorForm.value.lab != '0'
  //   ) {
  //     this.sessions.push({
  //       sessionNumber: index + 1,
  //       sessionStartDate: moment(this.InstructorForm.value.start_date).format(
  //         'YYYY-MM-DD'
  //       ),
  //       sessionEndDate: moment(this.InstructorForm.value.end_date).format(
  //         'YYYY-MM-DD'
  //       ),
  //       sessionStartTime: moment(this.InstructorForm.value.start_date).format(
  //         'HH:mm'
  //       ),
  //       sessionEndTime: moment(this.InstructorForm.value.end_date).format(
  //         'HH:mm'
  //       ),
  //       instructorId: this.InstructorForm.value.instructor,
  //       laboratoryId: this.InstructorForm.value.lab,
  //     });
  //   } else {
  //     this.showNotification(
  //       'snackbar-danger',
  //       'Please choose Instructor and Lab',
  //       'top',
  //       'right'
  //     );
  //     // this.toaster.error("Please choose Instructor and Lab")
  //     this.sessions = null;
  //   }
  //   return this.sessions;
  // }
  getSession() {
    let sessions: any = [];
    this.dataSource.forEach((item: any, index: any) => {
      if (
        this.isInstructorFailed == 0 &&
        item.instructor != '0'
        // item.lab != '0'
      ) {
        sessions.push({
          sessionNumber: index + 1,
          sessionStartDate: moment(item.start).format('YYYY-MM-DD'),
          sessionEndDate: moment(item.end).format('YYYY-MM-DD'),
          sessionStartTime: moment(item.start).format('HH:mm'),
          sessionEndTime: moment(item.end).format('HH:mm'),
          instructorId: item.instructor,
          // laboratoryId: item.lab,
          courseName: this.courseTitle,
          courseCode: this.courseCode,
          status: 'Pending',
          user_id: this.user_id,
        });
      } else {
        // this.toaster.error("Please choose Instructor and Lab")
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

  }
  // onSelectChange(event: any) {
  //   //this.instructorList.filter(item)
  //   const filteredData = this.instructorList.filter(
  //     (item: { instructor_id: string }) =>
  //       item.instructor_id === this.InstructorForm.controls['instructor'].value
  //   );
  //   this.user_id = filteredData[0].user_id.user_id;

  //   }


  onSelectChange1(event :any,element:any) {
    console.log("ele",element)
    //this.instructorList.filter(item)
    console.log("ibstList",this.instructorList)
    const filteredData = this.instructorList.filter((item: { id: string; }) => item.id === element.instructor);
    console.log("filter",filteredData)
     this.user_id = filteredData[0].id;

  }



  data() {
    console.log(this.classForm.value);
  }

  submit() {
    if(this.classForm.valid){
    // if(!this.viewUrl&&!this.editUrl){
    const sessions = this.getSession();
console.log('sessions',sessions)
    // }
    if (this.classId) {
      this.sessions = this.getSession();
      if (this.sessions) {
        this.classForm.value.sessions = sessions;
        this.classForm.value.courseName = this.courseTitle

        Swal.fire({
          title: 'Are you sure?',
          text: 'Do you want to update this class!',
          icon: 'warning',
          confirmButtonText: 'Yes',
          showCancelButton: true,
          cancelButtonColor: '#d33',
        }).then((result) => {
          if (result.isConfirmed){
            this._classService
            .updateClass(this.classId, this.classForm.value)
            .subscribe((response) => {
              if (response) {
                Swal.fire({
                  title: 'Success',
                  text: 'Class Updated Successfully.',
                  icon: 'success',
                });
                // this.showNotification(
                //   'snackbar-success',
                //   'Class Updated Successfully...!!!',
                //   'top',
                //   'right'
                // );
                // this.router.navigateByUrl(`/timetable/class-list`);
                window.history.back();
              }

              // this.router.navigateByUrl(`Schedule Class/List`);
            });
          }
        });

      }
    } else {
      if (sessions) {
        this.classForm.value.sessions = sessions;
        this.classForm.value.courseName = this.courseTitle
        // this.inProgress = false;
        // this.isSubmitted = true;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars

        Swal.fire({
          title: 'Are you sure?',
          text: 'Do you want to schedule a class!',
          icon: 'warning',
          confirmButtonText: 'Yes',
          showCancelButton: true,
          cancelButtonColor: '#d33',
        }).then((result) => {
          if (result.isConfirmed){
            this._classService
            .saveClass(this.classForm.value)
            .subscribe((response) => {
              if (response) {
                Swal.fire({
                  title: 'Success',
                  text: 'Class Created Successfully.',
                  icon: 'success',
                });
              }
              this.router.navigateByUrl(`/timetable/class-list`);
            });
          }
        });
      }
    }
  }else{
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

  // onChangeLab(element: any, i: number) {
  //   this.selectedLabPosition = i;
  //   this.checkAvailabilityOfLaboratory(element);
  // }

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
          // this.cd.detectChanges();
        } else {
          this.isInstructorFailed = 0;
        }
      });
  }
  checkAvailabilityOfLaboratory(element: {
    // lab: string | undefined;
    start: string | number | Date;
    end: string | number | Date;
  }) {
    this._classService
      .validateLaboratory(
        // element.lab,
        new DatePipe('en-US').transform(new Date(element.start), 'yyyy-MM-dd')!,
        new DatePipe('en-US').transform(new Date(element.end), 'yyyy-MM-dd')!,
        new DatePipe('en-US').transform(new Date(element.start), 'HH:MM')!,
        new DatePipe('en-US').transform(new Date(element.end), 'HH:MM')!
      )
      .subscribe((response) => {
        // if (!response.data['success']) {
        //   this.isLabFailed = 1;
        // } else {
        //   this.isLabFailed = 0;
        // }
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

  // getLaboratoryList() {
  //   this.labList = [];
  //   this._classService.getAllLaboratory().subscribe((response) => {
  //     this.mapPropertiesLab(response);
  //   });
  // }
  // mapPropertiesLab(response: any) {
  //   response.docs.forEach((element: LabListModel) => {
  //     this.labList.push(element);
  //   });
  // }
  cancel() {

    window.history.back();
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
