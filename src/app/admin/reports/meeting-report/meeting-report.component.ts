import { Component, OnInit, ViewChild } from '@angular/core';
import { CourseService } from '@core/service/course.service';
import {
  CoursePaginationModel,
  MainCategory,
  SubCategory,
} from '@core/models/course.model';
import Swal from 'sweetalert2';
import { ClassService } from 'app/admin/schedule-class/class.service';
import { TableElement, TableExportUtil } from '@shared';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { UserService } from '@core/service/user.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { formatDate } from '@angular/common';
import { UtilsService } from '@core/service/utils.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-meeting-report',
  templateUrl: './meeting-report.component.html',
  styleUrls: ['./meeting-report.component.scss']
})
export class MeetingReportComponent {
  breadscrums = [
    {
      title: 'Reoprts',
      items: ['Reports'],
      active: 'Report',
    },
  ];
  displayedColumns = [
    'name',
    'code',
    'startDate',
    'endDate',
     'totalMeetings',
     'meetingPlatform',
     'registerdUsers'
  ];
  
  coursePaginationModel: Partial<CoursePaginationModel>;
  courseData: any;
  pagination: any;
  totalItems: any;
  // pageSizeArr = [10, 25, 50, 100];
  pageSizeArr = this.utils.pageSizeArr;
  mainCategories!: MainCategory[];
  subCategories!: SubCategory[];
  allSubCategories!: SubCategory[];
  dataSource: any;
  searchTerm: string = '';
  path: any;
  isCourse = false;
  isCreator = false;
  selection = new SelectionModel<MainCategory>(true, []);
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  isFilter = false;
  // programData: any;
  titles: string[] = [];
  codes: string[] = [];
  creator: string[] = [];
  duration: string[] = [];
  startDate: string[] = [];
  endDate: string[] = [];
  status: string[] = [];
  courseList: any;
  selectedCourses: any = [];
  limit: any = 10;
  filter = false;
  vendors: any;
  selectedVendors: any = [];
  selectedStatus: any = [];
  users: any;
  selectedCreators: any = [];
  filterForm: FormGroup;

  constructor(
    public utils: UtilsService,
    public _courseService: CourseService,
    private route: Router,
    private classService: ClassService,
    private userService: UserService,
    private fb: FormBuilder
  ) {
    // constructor
    this.coursePaginationModel = { limit: 10 };
    let urlPath = this.route.url.split('/');
    this.path = urlPath[urlPath.length - 1];
    this.filterForm = this.fb.group({
      course: ['', []],
      creator: ['', []],
      status: ['', []],
      vendor: ['', []],
    });

  }

  ngOnInit() {
    this.getAllCourses();
    this.getAllVendorsAndUsers();
    forkJoin({
      courses: this.classService.getAllCourses(),
    }).subscribe((response) => {
      this.courseList = response.courses.reverse();
    });
  }

  getAllVendorsAndUsers() {
    this._courseService.getVendor().subscribe((response: any) => {
      this.vendors = response.reverse();
    });
    this.userService.getAllUsers().subscribe((response: any) => {
      this.users = response?.results;
    });
  }

  openFilterCard() {
    this.isFilter = !this.isFilter;
  }
  exportExcel() {
    const exportData: Partial<TableElement>[] = this.courseData.map((x: any) => ({
      'Course': x.courseId?.title || '',  // Course Title from courseId
      'Course Code': x.courseId?.courseCode || '',  // Course Code from courseId
      'Start Date': formatDate(new Date(x.sessions[0]?.sessionStartDate), 'yyyy-MM-dd', 'en') || '',  // Start Date
      'End Date': formatDate(new Date(x.sessions[0]?.sessionEndDate), 'yyyy-MM-dd', 'en') || '',  // End Date
      'Total Meetings': x.occurrences.length || 0,  // Total Meetings
      'Meeting Platform': x.meetingPlatform || '',
      'Registered Users': x.registeredUsers.length==0 ?0:x.registerdUsers.length-1 || 0,
    }));
  
    // Call the utility to export to Excel
    TableExportUtil.exportToExcel(exportData, 'Reports');
  }
  
  onSelectionChange(event: any, field: any) {
    if (field == 'course') {
      this.selectedCourses = event.value;
    }
    if (field == 'vendor') {
      this.selectedVendors = event.value;
    }
    if (field == 'status') {
      this.selectedStatus = event.value;
    }
    if (field == 'creator') {
      this.selectedCreators = event.value;
    }
    if (field == 'startDate') {
      this.selectedCreators = event.value;
    }
  }
  clearFilter() {
    this.filterForm.reset();
    this.getAllCourses();
  }
  // applyFilter() {
  //   let body: any = {};
  //   if (this.selectedCourses.length > 0) {
  //     body.title = this.selectedCourses;
  //   }
  //   if (this.selectedVendors.length > 0) {
  //     body.vendor = this.selectedVendors;
  //   }
  //   if (this.selectedStatus.length > 0) {
  //     body.status = this.selectedStatus;
  //   }
  //   if (this.selectedCreators.length > 0) {
  //     body.creator = this.selectedCreators;
  //   }

  //   this._courseService
  //     .getFilteredCourseData(body, { ...this.coursePaginationModel })
  //     .subscribe((response) => {
  //       this.courseData = response.data.docs;
  //       this.totalItems = response.data.totalDocs;
  //       this.filter = true;
  //       this.coursePaginationModel.docs = response.data.docs;
  //       this.coursePaginationModel.page = response.data.page;
  //       this.coursePaginationModel.limit = response.data.limit;
  //       this.coursePaginationModel.totalDocs = response.data.totalDocs;
  //     });
  // }
  applyFilter() {
    let body: any = {};
    if (this.selectedCourses.length > 0) {
       body.title = this.selectedCourses;
    }
    if (this.selectedVendors.length > 0) {
       body.vendor = this.selectedVendors;
    }
    if (this.selectedStatus.length > 0) {
       body.status = this.selectedStatus;
    }
    if (this.selectedCreators.length > 0) {
       body.creator = this.selectedCreators;
    }
 
    this._courseService
       .getFilteredCourseData(body, { ...this.coursePaginationModel })
       .subscribe((response) => {
          this.courseData = response.data.docs;
          this.dataSource = new MatTableDataSource(this.courseData); // Update table data source
          this.totalItems = response.data.totalDocs;
          this.filter = true;
          this.coursePaginationModel.docs = response.data.docs;
          this.coursePaginationModel.page = response.data.page;
          this.coursePaginationModel.limit = response.data.limit;
          this.coursePaginationModel.totalDocs = response.data.totalDocs;
       });
 }
 
  generatePdf() {
    const doc = new jsPDF();
    const headers = [
      [
        'name',
    'code',
    'startDate',
    'endDate',
     'totalMeetings',
     'meetingPlatform',
        'registerdUsers'
      ],
    ];
    const data = this.courseData.map((x: any) => [
      x.courseId?.title,  
      x.courseId?.courseCode,  
      formatDate(new Date(x.sessions[0]?.sessionStartDate), 'yyyy-MM-dd', 'en') || '',  // Start Date
      formatDate(new Date(x.sessions[0]?.sessionEndDate), 'yyyy-MM-dd', 'en') || '',  // End Date
      x.occurrences.length,  
      x.meetingPlatform ,
      x.registeredUsers.length==0 ?0:x.registerdUsers.length-1 || 0,
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
    doc.save('Report.pdf');
  }
  performSearch() {
    if (this.searchTerm) {
      this.courseData = this.courseData?.filter(
        (item: any) => {
          const searchList = item.title.toLowerCase();
          return searchList.indexOf(this.searchTerm.toLowerCase()) !== -1;
        }

      );
    } else {
      this.getAllCourses();
    }
  }
  viewActiveProgram(id: string, status: string): void {
    this.route.navigate(['/admin/courses/view-course/', 'data.id']);
  }
  delete(id: string) {
    this.classService
      .getClassList({ courseId: id })
      .subscribe((classList: any) => {
        const matchingClasses = classList.docs.filter((classItem: any) => {
          return classItem.courseId && classItem.courseId.id === id;
        });
        if (matchingClasses.length > 0) {
          Swal.fire({
            title: 'Error',
            text: 'Classes have been registered with this course. Cannot delete.',
            icon: 'error',
          });
          return;
        }
        Swal.fire({
          title: 'Confirm Deletion',
          text: 'Are you sure you want to delete this  Course?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#d33',
          cancelButtonColor: '#3085d6',
          confirmButtonText: 'Delete',
          cancelButtonText: 'Cancel',
        }).then((result) => {
          if (result.isConfirmed) {
            this._courseService.deleteCourse(id).subscribe(() => {
              this.getAllCourses();
              Swal.fire({
                title: 'Success',
                text: 'Course deleted successfully.',
                icon: 'success',
              });
            });
          }
        });
      });
  }
  private refreshTable() {
    this.paginator._changePageSize(this.paginator.pageSize);
  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.courseData.renderedData.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.courseData.renderedData.forEach((row: any) =>
          this.selection.select(row)
        );
  }
  pageSizeChange($event: any) {
    this.coursePaginationModel.page = $event?.pageIndex + 1;
    this.coursePaginationModel.limit = $event?.pageSize;
    if (this.filter) {
       this.applyFilter();
    } else {
       this.getAllCourses();
    }
 }
 
  private mapCategories(): void {
    this.coursePaginationModel.docs?.forEach((item) => {
      item.main_category_text = this.mainCategories.find(
        (x) => x.id === item.main_category
      )?.category_name;
    });

    this.coursePaginationModel.docs?.forEach((item) => {
      item.sub_category_text = this.allSubCategories.find(
        (x) => x.id === item.sub_category
      )?.category_name;
    });
  }
  getAllCourses() {
    const userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;

    const paginationParams = {
      page: this.coursePaginationModel.page || 1, 
      limit: this.coursePaginationModel.limit || 10, 
       classDeliveryType: 'online'
    };
  
    this.classService.getClassListWithPagination(paginationParams, userId).subscribe(
      (response) => {
        if (response.data) {
          console.log("Class List Response Data==", response.data);
          this.courseData = response.data.docs;
          this.dataSource = new MatTableDataSource(this.courseData);
          this.totalItems = response.data.totalDocs; // Total count for paginator
          this.coursePaginationModel = {
            ...this.coursePaginationModel,
            docs: response.data.docs,
            page: response.data.page,
            limit: response.data.limit,
            totalDocs: response.data.totalDocs
          };
          
          // Update paginator properties
          this.paginator.pageIndex = response.data.page - 1; // Adjusting pageIndex to zero-based
          this.paginator.length = response.data.totalDocs; // Total items
        }
      },
      (error) => {
        console.error("Error fetching class list data:", error);
      }
    );
  }
  
}
