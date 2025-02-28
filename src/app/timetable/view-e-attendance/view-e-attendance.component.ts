// import { Component } from '@angular/core';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { CoursePaginationModel } from '@core/models/course.model';
import { CourseService } from '@core/service/course.service';
import { UtilsService } from '@core/service/utils.service';
import { TableElement, TableExportUtil } from '@shared';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { formatDate } from '@angular/common';
import { AppConstants } from '@shared/constants/app.constants';
import { SettingsService } from '@core/service/settings.service';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-view-e-attendance',
  templateUrl: './view-e-attendance.component.html',
  styleUrls: ['./view-e-attendance.component.scss']
})
export class ViewEAttendanceComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // displayedColumns: string[] = [
  //   'img',
  //   'User Type',
  //   'Name',
  // ];

  displayedColumns: string[] = ['student', 'email', 'date', 'time', 'loginCount'];

  breadscrums = [
    {
      title: 'Users',
      items: ['Course'],
      active: 'User Details',
    },
  ];

  dataSource: any;
  isLoading = true;
  coursePaginationModel!: Partial<CoursePaginationModel>;
  totalItems: any;
  pageSizeArr = this.utils.pageSizeArr;
  subscribeParams: any;
  courseId: any;
  title: any;
  commonRoles: any;

  constructor(private router: Router,
    public utils: UtilsService,
    private courseService: CourseService,
    private activatedRoute: ActivatedRoute,
    private settingsService:SettingsService

  ) {

    this.subscribeParams = this.activatedRoute.params.subscribe((params:any) => {
      this.courseId = params.id;
      this.title = params.coursename;
    
    
    });
    this.coursePaginationModel = {};
   
}

pageSizeChange(event: PageEvent) {
  this.pageSizeArr = [5, 10, 25, 50]; // Define available page sizes
  this.totalItems = event.length; // Set total items
  this.dataSource.paginator = this.paginator; // Update paginator
}


ngOnInit(): void {
  this.commonRoles = AppConstants
  // this.getStudentClassesList();
  this.getAttendanceByCourseId();
}

// getStudentClassesList(filters?:any) {
//   this.courseService.getStudentsByCourseId(this.courseId).subscribe((response: any) => {
//     // this.dataSource = response;
//     this.isLoading = false;

//   }, error => {
//   });
// }
getAttendanceByCourseId(){
  this.settingsService.getAttendanceByCourseId(this.courseId).subscribe((res)=>{
    // console.log("res123",res)
    this.dataSource=res.data;
    this.isLoading = false;
  })

}
exportExcel() {
  const exportData: Partial<TableElement>[] = this.dataSource.map(
    (x: any) => ({
      
      'Users': x.course?.attendance?.trainee?.name,
      'Email': x.course?.attendance?.trainee?.email,
      'Time': x.time,
      'Date':
          formatDate(new Date(x.date), 'yyyy-MM-dd', 'en') || '',
      'Login Count':x.loginCount,
    })
  );

  TableExportUtil.exportToExcel(exportData, 'Attendance');
}




generatePdf() {
  const doc = new jsPDF();
  const headers = [
    [
      'Users',
      'Email',
      'Time',
      'Date',
      'Login Count',
    ],
  ];
  const data = this.dataSource.map((x: any) => [
    x.course?.attendance?.trainee?.name,
    x.course?.attendance?.trainee?.email,
    x.time,
    formatDate(new Date(x.date), 'yyyy-MM-dd', 'en') || '',
    x.loginCount||1,
  ]);
  const columnWidths = [50, 20, 30, 20, 20, 20, 30, 30, 30, 20];

  (doc as any).autoTable({
    head: headers,
    columnWidths: columnWidths,
    body: data,
    startY: 20,
    headStyles: {
      fontSize: 10,
      cellWidth: 'wrap',
    },
  });

  doc.save('Attendance.pdf');
}
}
