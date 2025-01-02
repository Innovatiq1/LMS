import { ChangeDetectorRef, Component} from '@angular/core';
import { FormBuilder, FormGroup, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { CourseTitleModel } from '@core/models/class.model';
import { CoursePaginationModel } from '@core/models/course.model';
import { CourseService } from '@core/service/course.service';
import { AppConstants } from '@shared/constants/app.constants';
import { ClassService } from 'app/admin/schedule-class/class.service';
import { forkJoin } from 'rxjs';
import { SettingsService } from '@core/service/settings.service';
import { MatTableDataSource } from '@angular/material/table';
@Component({
  selector: 'app-e-attendance',
  templateUrl: './e-attendance.component.html',
  styleUrls: ['./e-attendance.component.scss']
})
export class EAttendanceComponent {
  attendanceForm!:FormGroup
  displayedColumns = [
    'name',
    'code',
    'startDate',
      'endDate',
      'attendance'
  ];
  headeritems: string[] = [ AppConstants.STUDENT_ROLE, ...Array.from({ length: 31 }, (_, i) => (i + 1).toString())];
  courseData = [
   
     
  ];
  programData = [
   
     
  ];
  dataSource = [
    { studentId:{
      name: 'Chung' }
    },
   
     
  ];
  studentApprovedCourses: any;
  studentApprovedPrograms: any;
  courseList!: any;
  courseTitle: any;
  courseCode: any;
  programList!: any;
  programTitle: any;
  programCode: any;
  coursePaginationModel!: Partial<CoursePaginationModel>;
  isCourse: boolean = true;
  isProgram: boolean = false;
  totalItems: any;
  pageSizeArr = [10, 25, 50, 100];
  commonRoles: any;
attendanceData:any;
  constructor(
    private _classService: ClassService,
    private fb:FormBuilder,
    private cd: ChangeDetectorRef,
    private courseService: CourseService,
    private settingsService:SettingsService
    
  ) {
    this.attendanceForm = this.fb.group({
      course: ['',[] ],
      cp:['',[]],
      program: ['',[] ],
      fromDate: [''],
      toDate: [''],
    });
    this.coursePaginationModel = {};
  }

  ngOnInit() {
    this.getAllCourses();
    forkJoin({
      courses: this._classService.getAllCoursesTitle('active'),
      programs: this.courseService.getPrograms({...this.coursePaginationModel,status:'active'}),
    }).subscribe((response) => {
      this.courseList = response.courses.reverse();
      this.programList = response.programs;
      this.cd.detectChanges();
    });
    this.commonRoles = AppConstants;
  }
  search() {
    var startdateObj = new Date(this.attendanceForm.value.fromDate);
    var startyear = startdateObj.getFullYear();
    var startmonth = ("0" + (startdateObj.getMonth() + 1)).slice(-2);
    var startday = ("0" + startdateObj.getDate()).slice(-2);
    var starthours = ("0" + startdateObj.getHours()).slice(-2);
    var startminutes = ("0" + startdateObj.getMinutes()).slice(-2);
    var startseconds = ("0" + startdateObj.getSeconds()).slice(-2);
    var startmilliseconds = ("00" + startdateObj.getMilliseconds()).slice(-3);
    var starttimezoneOffsetMinutes = startdateObj.getTimezoneOffset();
    var timezoneOffsetHours = Math.abs(Math.floor(starttimezoneOffsetMinutes / 60));
    var timezoneOffsetMinutesPart = Math.abs(starttimezoneOffsetMinutes % 60);
    // var timezoneOffset = (timezoneOffsetMinutes >= 0 ? "-" : "+") + ("0" + timezoneOffsetHours).slice(-2) + ":" + ("0" + timezoneOffsetMinutesPart).slice(-2);
    var startDate = startyear + "-" + startmonth + "-" + startday + "T" + starthours + ":" + startminutes + ":" + startseconds + "." + startmilliseconds + '00:00';
    
    var enddateObj = new Date(this.attendanceForm.value.toDate);
    var endyear = enddateObj.getFullYear();
    var endmonth = ("0" + (enddateObj.getMonth() + 1)).slice(-2);
    var endday = ("0" + enddateObj.getDate()).slice(-2);
    var endhours = ("0" + enddateObj.getHours()).slice(-2);
    var endminutes = ("0" + enddateObj.getMinutes()).slice(-2);
    var endseconds = ("0" + enddateObj.getSeconds()).slice(-2);
    var endmilliseconds = ("00" + enddateObj.getMilliseconds()).slice(-3);
    var endtimezoneOffsetMinutes = enddateObj.getTimezoneOffset();
    var endtimezoneOffsetHours = Math.abs(Math.floor(endtimezoneOffsetMinutes / 60));
    var endtimezoneOffsetMinutesPart = Math.abs(endtimezoneOffsetMinutes % 60);
    var endDate = endyear + "-" + endmonth + "-" + endday + "T" + endhours + ":" + endminutes + ":" + endseconds + "." + endmilliseconds + '00:00';
if (this.attendanceForm.value.course !== '') {
  let body ={
      course:this.attendanceForm.value.course,
      program:this.attendanceForm.value.program,
      startDate:startDate,
      endDate:endDate
    }
      this._classService
        .getAttendedStudents(body)
        .subscribe((response: any) => {
        this.courseData = response.data.data;
        this.dataSource=response.data.data;
          this.totalItems = response.data.totalDocs;
  
        })
      } else if(this.attendanceForm.value.program){
        if(this.attendanceForm.value.program){
          let body ={
            program:this.attendanceForm.value.program,
            programStartDate:startDate,
            programEndDate:endDate
          }
            this._classService
              .getProgramAttendedStudents(body)
              .subscribe((response: any) => {
              this.programData = response.data.data;
              this.dataSource=response.data.data;
                this.totalItems = response.data.totalDocs;
        
              })
            }
      
      }
    
  
      }

        getAllCourses() {
    this.courseService.getAllCoursesWithPagination({ ...this.coursePaginationModel }).subscribe((response) => {
      //  this.courseData = response.data.docs; 
       this.attendanceData=response.data.docs;
      //  console.log("response123 ",response.data.docs)
      //  this.dataSource = new MatTableDataSource(this.courseData); 
      //  this.totalItems = response.data.totalDocs; 
      //  this.coursePaginationModel.docs = response.data.docs;
      //  this.coursePaginationModel.page = response.data.page;
      //  this.coursePaginationModel.limit = response.data.limit;
      //  this.coursePaginationModel.totalDocs = response.data.totalDocs;
    });
 }
  onSelectCourse(event: any){
   if(event.value == 'course'){
    this.isCourse = true;
    this.isProgram = false;
   }else if (event.value == 'program'){
    this.isProgram = true;
    this.isCourse = false;
   }
  }
  onSelectChange(event: any) {
    const filteredData = this.courseList
    this.courseTitle=filteredData[0].title
    this.courseCode=filteredData[0].courseCode
    this.isCourse = true;
    this.isProgram = false;
    this.attendanceForm.value.program = '';

  }
  onSelectChange1(event: any) {
    const filteredData = this.programList
    this.programTitle=filteredData[0].title
      this.programCode=filteredData[0].courseCode
      this.isProgram = true;
      this.isCourse = false;
      this.attendanceForm.value.course = '';

  }
  pageSizeChange($event: any) {
    this.coursePaginationModel.page = $event?.pageIndex + 1;
    this.coursePaginationModel.limit = $event?.pageSize;
  }
}
