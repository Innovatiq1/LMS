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









// import { Component, OnInit, ViewChild } from '@angular/core';
// import { CourseService } from '@core/service/course.service';
// import {
//   CoursePaginationModel,
//   MainCategory,
//   SubCategory,
// } from '@core/models/course.model';
// import Swal from 'sweetalert2';
// import { ClassService } from 'app/admin/schedule-class/class.service';
// import { TableElement, TableExportUtil } from '@shared';
// import jsPDF from 'jspdf';
// import 'jspdf-autotable';
// import { SelectionModel } from '@angular/cdk/collections';
// import { MatPaginator } from '@angular/material/paginator';
// import { Router } from '@angular/router';
// import { forkJoin } from 'rxjs';
// import { UserService } from '@core/service/user.service';
// import { FormBuilder, FormGroup } from '@angular/forms';
// import { formatDate } from '@angular/common';
// import { UtilsService } from '@core/service/utils.service';
// import { MatTableDataSource } from '@angular/material/table';


// @Component({
//   selector: 'app-e-attendance',
//   templateUrl: './e-attendance.component.html',
//   styleUrls: ['./e-attendance.component.scss']
// })
// export class EAttendanceComponent {
//   displayedColumns = [
//     'name',
//     'code',
//     'startDate',
//     'endDate',
//     'Attendance'
//   ];
//   coursePaginationModel: Partial<CoursePaginationModel>;
//   courseData: any;
//   pagination: any;
//   totalItems: any;
//   // pageSizeArr = [10, 25, 50, 100];
//   pageSizeArr = this.utils.pageSizeArr;
//   mainCategories!: MainCategory[];
//   subCategories!: SubCategory[];
//   allSubCategories!: SubCategory[];
//   dataSource: any;
//   searchTerm: string = '';
//   path: any;
//   isCourse = false;
//   isCreator = false;
//   selection = new SelectionModel<MainCategory>(true, []);
//   @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
//   isFilter = false;
//   // programData: any;
//   titles: string[] = [];
//   codes: string[] = [];
//   creator: string[] = [];
//   duration: string[] = [];
//   startDate: string[] = [];
//   endDate: string[] = [];
//   status: string[] = [];
//   courseList: any;
//   selectedCourses: any = [];
//   limit: any = 10;
//   filter = false;
//   vendors: any;
//   selectedVendors: any = [];
//   selectedStatus: any = [];
//   users: any;
//   selectedCreators: any = [];
//   filterForm: FormGroup;

//   constructor(
//     public utils: UtilsService,
//     public _courseService: CourseService,
//     private route: Router,
//     private classService: ClassService,
//     private userService: UserService,
//     private fb: FormBuilder
//   ) {
//     // constructor
//     this.coursePaginationModel = { limit: 10 };
//     let urlPath = this.route.url.split('/');
//     this.path = urlPath[urlPath.length - 1];
//     this.filterForm = this.fb.group({
//       course: ['', []],
//       creator: ['', []],
//       status: ['', []],
//       vendor: ['', []],
//     });

//   }

//   ngOnInit() {
//     this.getAllCourses();
//     this.getAllVendorsAndUsers();
//     forkJoin({
//       courses: this.classService.getAllCourses(),
//     }).subscribe((response) => {
//       this.courseList = response.courses.reverse();
//     });
//   }

//   getAllVendorsAndUsers() {
//     this._courseService.getVendor().subscribe((response: any) => {
//       this.vendors = response.reverse();
//     });
//     this.userService.getAllUsers().subscribe((response: any) => {
//       this.users = response?.results;
//     });
//   }

//   openFilterCard() {
//     this.isFilter = !this.isFilter;
//   }
//   exportExcel() {
//     const exportData: Partial<TableElement>[] = this.courseData.map(
//       (x: any) => ({
//         'Course': x.title,
//         'Course Code': x.courseCode,
//         'Start Date':
//           formatDate(new Date(x.sessionStartDate), 'yyyy-MM-dd', 'en') || '',
//         'End Date':
//           formatDate(new Date(x.sessionEndDate), 'yyyy-MM-dd', 'en') || '',
//       })
//     );

//     TableExportUtil.exportToExcel(exportData, 'Reports');
//   }
//   onSelectionChange(event: any, field: any) {
//     if (field == 'course') {
//       this.selectedCourses = event.value;
//     }
//     if (field == 'vendor') {
//       this.selectedVendors = event.value;
//     }
//     if (field == 'status') {
//       this.selectedStatus = event.value;
//     }
//     if (field == 'creator') {
//       this.selectedCreators = event.value;
//     }
//     if (field == 'startDate') {
//       this.selectedCreators = event.value;
//     }
//   }
//   clearFilter() {
//     this.filterForm.reset();
//     this.getAllCourses();
//   }
  
//   applyFilter() {
//     let body: any = {};
//     if (this.selectedCourses.length > 0) {
//        body.title = this.selectedCourses;
//     }
//     if (this.selectedVendors.length > 0) {
//        body.vendor = this.selectedVendors;
//     }
//     if (this.selectedStatus.length > 0) {
//        body.status = this.selectedStatus;
//     }
//     if (this.selectedCreators.length > 0) {
//        body.creator = this.selectedCreators;
//     }
 
//     this._courseService
//        .getFilteredCourseData(body, { ...this.coursePaginationModel })
//        .subscribe((response) => {
//           this.courseData = response.data.docs;
//           this.dataSource = new MatTableDataSource(this.courseData); // Update table data source
//           this.totalItems = response.data.totalDocs;
//           this.filter = true;
//           this.coursePaginationModel.docs = response.data.docs;
//           this.coursePaginationModel.page = response.data.page;
//           this.coursePaginationModel.limit = response.data.limit;
//           this.coursePaginationModel.totalDocs = response.data.totalDocs;
//        });
//  }
 
//   generatePdf() {
//     const doc = new jsPDF();
//     const headers = [
//       [
//         'Course',
//         'Course Code',
//         'Start Date ',
//         'End Date   ',
        
//       ],
//     ];
//     const data = this.courseData.map((x: any) => [
//       x.title,
//       x.courseCode,
//       formatDate(new Date(x.sessionStartDate), 'yyyy-MM-dd', 'en') || '',
//       formatDate(new Date(x.sessionEndDate), 'yyyy-MM-dd', 'en') || '',
      
//     ]);
//     const columnWidths = [50, 20, 30, 20, 20, 20, 30, 30, 30, 20];
//     (doc as any).autoTable({
//       head: headers,
//       columnWidths: columnWidths,
//       body: data,
//       startY: 20,
//       headStyles: {
//         fontSize: 10,
//         cellWidth: 'wrap',
//       },
//     });
//     doc.save('Report.pdf');
//   }
//   performSearch() {
//     if (this.searchTerm) {
//       this.courseData = this.courseData?.filter(
//         (item: any) => {
//           const searchList = item.title.toLowerCase();
//           return searchList.indexOf(this.searchTerm.toLowerCase()) !== -1;
//         }

//       );
//     } else {
//       this.getAllCourses();
//     }
//   }
//   viewActiveProgram(id: string, status: string): void {
//     this.route.navigate(['/admin/courses/view-course/', 'data.id']);
//   }
//   delete(id: string) {
//     this.classService
//       .getClassList({ courseId: id })
//       .subscribe((classList: any) => {
//         const matchingClasses = classList.docs.filter((classItem: any) => {
//           return classItem.courseId && classItem.courseId.id === id;
//         });
//         if (matchingClasses.length > 0) {
//           Swal.fire({
//             title: 'Error',
//             text: 'Classes have been registered with this course. Cannot delete.',
//             icon: 'error',
//           });
//           return;
//         }
//         Swal.fire({
//           title: 'Confirm Deletion',
//           text: 'Are you sure you want to delete this  Course?',
//           icon: 'warning',
//           showCancelButton: true,
//           confirmButtonColor: '#d33',
//           cancelButtonColor: '#3085d6',
//           confirmButtonText: 'Delete',
//           cancelButtonText: 'Cancel',
//         }).then((result) => {
//           if (result.isConfirmed) {
//             this._courseService.deleteCourse(id).subscribe(() => {
//               this.getAllCourses();
//               Swal.fire({
//                 title: 'Success',
//                 text: 'Course deleted successfully.',
//                 icon: 'success',
//               });
//             });
//           }
//         });
//       });
//   }
//   private refreshTable() {
//     this.paginator._changePageSize(this.paginator.pageSize);
//   }
//   isAllSelected() {
//     const numSelected = this.selection.selected.length;
//     const numRows = this.courseData.renderedData.length;
//     return numSelected === numRows;
//   }

//   masterToggle() {
//     this.isAllSelected()
//       ? this.selection.clear()
//       : this.courseData.renderedData.forEach((row: any) =>
//           this.selection.select(row)
//         );
//   }
 
//   pageSizeChange($event: any) {
//     this.coursePaginationModel.page = $event?.pageIndex + 1;
//     this.coursePaginationModel.limit = $event?.pageSize;
 
    
//     if (this.filter) {
//        this.applyFilter();
//     } else {
//        this.getAllCourses();
//     }
//  }
 
//   private mapCategories(): void {
//     this.coursePaginationModel.docs?.forEach((item) => {
//       item.main_category_text = this.mainCategories.find(
//         (x) => x.id === item.main_category
//       )?.category_name;
//     });

//     this.coursePaginationModel.docs?.forEach((item) => {
//       item.sub_category_text = this.allSubCategories.find(
//         (x) => x.id === item.sub_category
//       )?.category_name;
//     });
//   }
  
//   getAllCourses() {
//     this._courseService.getAllCoursesWithPagination({ ...this.coursePaginationModel }).subscribe((response) => {
//        this.courseData = response.data.docs; 
//        this.dataSource = new MatTableDataSource(this.courseData); 
//        this.totalItems = response.data.totalDocs; 
//        this.coursePaginationModel.docs = response.data.docs;
//        this.coursePaginationModel.page = response.data.page;
//        this.coursePaginationModel.limit = response.data.limit;
//        this.coursePaginationModel.totalDocs = response.data.totalDocs;
//     });
//  }
// }
