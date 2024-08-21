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

@Component({
  selector: 'app-student-course',
  templateUrl: './student-course.component.html',
  styleUrls: ['./student-course.component.scss']
})
export class StudentCourseComponent {
  displayedColumns: string[] = [
    'img',
    'User Type',
    'Name',
  ];
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

  ) {

    this.subscribeParams = this.activatedRoute.params.subscribe((params:any) => {
      this.courseId = params.id;
      this.title = params.coursename;
    
    
    });
    this.coursePaginationModel = {};
   
}


ngOnInit(): void {
  this.commonRoles = AppConstants
  this.getStudentClassesList();
}

getStudentClassesList(filters?:any) {
  this.courseService.getStudentsByCourseId(this.courseId).subscribe((response: any) => {
    this.dataSource = response;
    this.isLoading = false;

  }, error => {
  });
}

exportExcel() {
  const exportData: Partial<TableElement>[] = this.dataSource.map(
    (x: any) => ({
      'Users': x.studentId.name,
      'Department': x.studentId.department,
      'Status': x.status,
      'Registered Date':
          formatDate(new Date(x.registeredOn), 'yyyy-MM-dd', 'en') || '',
    })
  );

  TableExportUtil.exportToExcel(exportData, 'Reports');
}

generatePdf() {
  const doc = new jsPDF();
  const headers = [
    [
      'Users',
      'Department',
      'Status',
      'Registered Date'
    ],
  ];
  const data = this.dataSource.map((x: any) => [
    x.studentId.name,
    x.studentId.department,
    x.status,
    formatDate(new Date(x.registeredOn), 'yyyy-MM-dd', 'en') || '',
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

  doc.save('Reports.pdf');
}

}
