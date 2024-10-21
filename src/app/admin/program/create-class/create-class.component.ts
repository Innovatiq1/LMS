import { ChangeDetectorRef, Component, HostListener, ViewChild } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  UntypedFormControl,
  Validators,
} from '@angular/forms';
import { forkJoin } from 'rxjs';
import * as moment from 'moment';
import { DatePipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { CourseService } from '@core/service/course.service';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { InstructorService } from '@core/service/instructor.service';
import Swal from 'sweetalert2';
import {
  CourseTitleModel,
  DataSourceModel,
  InstructorList,
  LabListModel,
} from 'app/admin/schedule-class/class.model';
import { ClassService } from 'app/admin/schedule-class/class.service';
import { CoursePaginationModel } from '@core/models/course.model';
import { Subscription } from 'rxjs';
import { StudentsService } from 'app/admin/students/students.service';
import { FormService } from '@core/service/customization.service';
import { UserService } from '@core/service/user.service';
import { MatOption } from '@angular/material/core';
import { AppConstants } from '@shared/constants/app.constants';

@Component({
  selector: 'app-create-class',
  templateUrl: './create-class.component.html',
  styleUrls: ['./create-class.component.scss'],
})
export class CreateClassComponent {
  item: any;
  editUrl!: boolean;
  subscribeParams: any;
  dept: any;
  commonRoles: any;
  @HostListener('document:keypress', ['$event'])
  keyPressNumbers(event: KeyboardEvent) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    }
    return true;
  }
  isSubmitted = false;

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
  title: boolean = false;
  studentId: any;
  breadscrums: any[];
  startDate = new Date(1990, 0, 1);
  date = new UntypedFormControl(new Date());
  serializedDate = new UntypedFormControl(new Date().toISOString());
  minDate: Date | undefined;
  maxDate!: Date;
  // status = true;
  programList!: any;
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
  coursePaginationModel!: Partial<CoursePaginationModel>;
  secondFormGroup!: FormGroup;
  configuration: any;
  configurationSubscription!: Subscription;
  defaultCurrency: string = '';
  forms!: any[];
  userGroups!: any[];
  submitted : boolean = false;

  @ViewChild('allSelected') private allSelected!: MatOption;

  addNewRow() {
    if (this.isInstructorFailed != 1) {
      this.isInstructorFailed = 0;
      // this.isLabFailed = 0;
      const currentYear = new Date().getFullYear();
      this.dataSourceArray.push({
        start: moment().set({ hour: 8, minute: 0 }).format('YYYY-MM-DD HH:mm'),
        end: moment().set({ hour: 8, minute: 0 }).format('YYYY-MM-DD HH:mm'),
        instructor: '0',
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
    private formService: FormService,
    private userService: UserService
  ) {
    this._activeRoute.queryParams.subscribe((params) => {
      this.classId = params['id'];
      if (this.classId) {
        this.title = true;
      }
    });
    let urlPath = this.router.url.split('/');
    this.editUrl = urlPath.includes('edit-class');

    if (this.editUrl) {
      this.breadscrums = [
        {
          title: 'Edit Class',
          items: ['Program Class'],
          active: 'Edit Program Class',
        },
      ];
    } else {
      this.breadscrums = [
        {
          title: 'Create Class',
          items: ['Program Class'],
          active: 'Create Program Class',
        },
      ];
    }

    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 5, 0, 1);
    this.maxDate = new Date(currentYear + 1, 11, 31);
    this.coursePaginationModel = {};
  }
  ngOnInit(): void {
    this.commonRoles = AppConstants
    this.subscribeParams = this._activeRoute.params.subscribe((params: any) => {
      this.classId = params.id;
    });
    this.getDepartments();
    this.getForms();
    this.getUserGroups();

    this.loadForm();
    if (!this.editUrl) {
      let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
      forkJoin({
        courses: this.courseService.getPrograms({
          ...this.coursePaginationModel,
          status: 'active',
        },userId),
        instructors: this.instructorService.getInstructor({
          type: this.commonRoles?.INSTRUCTOR_ROLE,
          companyId:userId
        }),
      }).subscribe((response) => {
        this.programList = response.courses;
        this.instructorList = response.instructors;
        this.cd.detectChanges();
      });
      this.dataSource = this.dataSourceArray;
    }

    if (this.editUrl) {
      let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
      forkJoin({
        courses: this.courseService.getCourseProgram(userId,{
          ...this.coursePaginationModel,
          status: 'active',
        }),
        instructors: this.instructorService.getInstructor({
          type: this.commonRoles?.INSTRUCTOR_ROLE,
          companyId:userId
        }),
        class: this._classService.getProgramClassById(this.classId),
      }).subscribe((response) => {
        this.programList = response.courses.docs;
        this.instructorList = response.instructors;
        let item = response.class;
        console.log("patchvalue=",item.courseId?.id)
        this.classForm.patchValue({
          
          courseId: item.courseId?.id,
          classType: item?.classType,
          classDeliveryType: item?.classDeliveryType,
          instructorCost: item?.instructorCost,
          currency: item?.currency,
          instructorCostCurrency: item?.instructorCostCurrency,
          isGuaranteedToRun: item?.isGuaranteedToRun,
          externalRoom: item?.externalRoom,
          department: item?.department,
          minimumEnrollment: item?.minimumEnrollment,
          maximumEnrollment: item?.maximumEnrollment,
          // status: item?.status,
          sessions: item?.sessions,
          userGroupId: item?.userGroupId
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
    if (this.classId == undefined) {
      this.addNewRow();
    }
    this.configurationSubscription =
      this.studentsService.configuration$.subscribe((configuration) => {
        this.configuration = configuration;
        const config = this.configuration.find((v:any)=>v.field === 'currency')
        if (config) {
          this.defaultCurrency = config.value;
          this.classForm.patchValue({
            currency: this.defaultCurrency,
          });
        }
      });
    this.loadData();
  }

  toggleAllSelection() {
    if (this.allSelected.selected) {
      this.classForm.controls['userGroupId']
        .patchValue([...this.userGroups.map(item => item.id)]);
    } else {
      this.classForm.controls['userGroupId'].patchValue([]);
    }
  }

  loadData() {
    this.studentId = localStorage.getItem('id');
    this.studentsService.getStudentById(this.studentId).subscribe((res) => {});
  }

  getUserGroups() {
    this.userService.getUserGroups().subscribe((response: any) => {
      this.userGroups = response.data.docs;
    });
  }

  getForms(): void {
    let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
        this.formService
      .getAllForms(userId,'Program Class Creation Form')
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

  getDepartments() {
    this.studentsService.getAllDepartments().subscribe((response: any) => {
      this.dept = response.data.docs;
    });
  }
  loadForm() {
    this.classForm = this._fb.group({
      courseId: ['', [Validators.required]],
      classType: ['', []],
      classDeliveryType: ['', [Validators.required]],
      instructorCost: ['', [Validators.required]],
      instructorCostCurrency: ['USD'],
      currency: [''],
      department: ['', [Validators.required]],
      userGroupId: ['', [Validators.required]],
      isGuaranteedToRun: [false, [Validators.required]],
      externalRoom: [false],
      minimumEnrollment: ['', [Validators.required]],
      maximumEnrollment: ['', [Validators.required]],
      classStartDate: ['2023-05-20'],
      classEndDate: ['2023-06-10'],
      // userGroupId: ['',[Validators.required]]
    });
    this.secondFormGroup = this._fb.group({
      sessions: ['', [Validators.required]],
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
  getSession() {
    let sessions: any = [];
    this.dataSource.forEach((item: any, index: any) => {
      // if (
      //   this.isInstructorFailed == 0 &&
      //   item.instructor != '0'
      // )
      if (
        this.isInstructorFailed === 0
      ) {
        sessions.push({
          sessionNumber: index + 1,
          sessionStartDate: moment(item.start).format('YYYY-MM-DD'),
          sessionEndDate: moment(item.end).format('YYYY-MM-DD'),
          sessionStartTime: moment(item.start).format('HH:mm'),
          sessionEndTime: moment(item.end).format('HH:mm'),
          instructorId: item.instructor||'',
          courseName: this.courseTitle,
          courseCode: this.courseCode,
          status: 'Pending',
          user_id: this.user_id,
        });
      } else {
        sessions = null;
      }
    });
    return sessions;
  }

  onSelectChange(event: any) {
    const filteredData = this.programList.filter(
      (item: { _id: string }) =>
        item._id === this.classForm.controls['courseId'].value
    );
    this.courseTitle = filteredData[0].title;
    this.courseCode = filteredData[0].courseCode;
  }

  onSelectChange1(event: any, element: any) {
    const filteredData = this.instructorList.filter(
      (item: { _id: string }) => item._id === element.instructor
    );
    this.user_id = filteredData[0]._id;
  }

  saveProgramClass() {
    let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
    if(this.classForm.valid) {
    if (!this.editUrl) {
      
      let sessions = this.getSession();
      if (sessions) {
        this.classForm.value.sessions = sessions;
        this.classForm.value.programName = this.courseTitle;
        this.isSubmitted = true;
       this.classForm.value.companyId=userId;

        Swal.fire({
          title: 'Are you sure?',
          text: 'Do you want to create a class!',
          icon: 'warning',
          confirmButtonText: 'Yes',
          showCancelButton: true,
          cancelButtonColor: '#d33',
        }).then((result) => {
          if (result.isConfirmed) {
            this._classService
              .saveProgramClass(this.classForm.value)
              .subscribe((response: any) => {
                Swal.fire({
                  title: 'Success',
                  text: 'Class Created successfully.',
                  icon: 'success',
                });
                this.router.navigateByUrl(`/timetable/schedule-class`);
              });
          }
        });
      }
    }
    if (this.editUrl) {
      let sessions = this.getSession();
      if (sessions) {
        this.classForm.value.sessions = sessions;
        this.classForm.value.programName = this.courseTitle;
        Swal.fire({
          title: 'Are you sure?',
          text: 'You want to update this class!',
          icon: 'warning',
          confirmButtonText: 'Yes',
          showCancelButton: true,
          cancelButtonColor: '#d33',
        }).then((result) => {
          if (result.isConfirmed) {
            this._classService
              .updateProgramClass(this.classId, this.classForm.value)
              .subscribe((response: any) => {
                Swal.fire({
                  title: 'Success',
                  text: 'Class updated successfully.',
                  icon: 'success',
                });
                window.history.back();
              });
          }
        });
      }
    }
  }else{
    this.classForm.markAllAsTouched();
    this.submitted = true;
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
      .subscribe((response) => {});
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
  }
}
