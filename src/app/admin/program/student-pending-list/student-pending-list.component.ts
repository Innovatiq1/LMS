import { SelectionModel } from '@angular/cdk/collections';
import { formatDate } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Session, Student, StudentApproval, StudentPaginationModel } from '@core/models/class.model';
import { CourseModel, CoursePaginationModel } from '@core/models/course.model';
import { CourseService } from '@core/service/course.service';
import { UtilsService } from '@core/service/utils.service';
import { TableElement } from '@shared/TableElement';
import { AppConstants } from '@shared/constants/app.constants';
import { TableExportUtil } from '@shared/tableExportUtil';
import { ClassService } from 'app/admin/schedule-class/class.service';
import jsPDF from 'jspdf';
import * as moment from 'moment';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-student-pending-list',
  templateUrl: './student-pending-list.component.html',
  styleUrls: ['./student-pending-list.component.scss']
})
export class StudentPendingListComponent {
  displayedColumns: string[] = [
    // 'select',
    'Student Name',
    'status',
    'Program Name',
    'Program-Fee',
    'Instructor-Fee',
    'Class Start Date',
    'Class End Date',
    'Registered Date',
    // 'Program Fee',
    // 'Instructor Fee',
    
  ];
  breadscrums = [
    {
      items: ['Registered Program'],
      active: 'Pending Programs',
    },
  ];

  dataSource: any;
  pageSizeArr =[10, 20, 50, 100];
  totalPages: any;
  studentPaginationModel: StudentPaginationModel;
  selection = new SelectionModel<CourseModel>(true, []);
  isLoading :any;
  coursePaginationModel!: Partial<CoursePaginationModel>;
  searchTerm:string = '';
  commonRoles: any;


  upload() {
    document.getElementById('input')?.click();
  }

  constructor(private classService: ClassService,
    private courseService: CourseService,
    private snackBar: MatSnackBar,
    private utils:UtilsService) {
    // this.displayedColumns = ["title", "studentName", "classStartDate", "classEndDate",  "action"];
    this.studentPaginationModel = {} as StudentPaginationModel;
  }

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

    ngOnInit(): void {
      this.commonRoles = AppConstants
      this.getRegisteredClasses();
    }

  getRegisteredClasses() {
    let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
    this.classService
      .getProgramRegisteredClasses(this.studentPaginationModel.page, this.studentPaginationModel.limit,this.studentPaginationModel.filterText,userId)
      .subscribe((response: { data: StudentPaginationModel; }) => {
        this.isLoading = false;
        // 
        this.studentPaginationModel = response.data;
      this.dataSource = response.data.docs;
      this.totalPages = response.data.totalDocs;
      })
  }

  getCurrentUserId(): string {
    return JSON.parse(localStorage.getItem("user_data")!).user.id;
  }
  pageSizeChange($event: any) {
    this.coursePaginationModel.page= $event?.pageIndex + 1;
    this.coursePaginationModel.limit= $event?.pageSize;
    this.getRegisteredClasses();
   }

  changeStatus(element: Student, status:string) {
    let item: StudentApproval = {
      approvedBy: this.getCurrentUserId(),
      approvedOn: moment().format("YYYY-MM-DD"),
      classId: element.classId._id,
      status,
      studentId: element.studentId.id,
      session: this.getSessions(element)
    };

    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to approve this program!',
      icon: 'warning',
      confirmButtonText: 'Yes',
      showCancelButton: true,
      cancelButtonColor: '#d33',
    }).then((result) => {
      if (result.isConfirmed){
        this.classService.saveApprovedProgramClasses(element.id, item).subscribe((response:any) => {
          Swal.fire({
            title: 'Success',
            text: 'Program approved successfully.',
            icon: 'success',
            // confirmButtonColor: '#d33',
          });
          this.getRegisteredClasses();
        });
        () => {
              Swal.fire({
                title: 'Error',
                text: 'Failed to approve course. Please try again.',
                icon: 'error',
                // confirmButtonColor: '#d33',
              });
            };
      }
    });
  
  }

  performSearch() {
    if(this.searchTerm){
    this.dataSource = this.dataSource?.filter((item: any) =>{
      const searchList = (item.classId.courseId?.title + item.studentId?.name).toLowerCase()
      return searchList.indexOf(this.searchTerm.toLowerCase()) !== -1
    }


    // item.classId.courseId?.title.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    } else {
      this.getRegisteredClasses();

    }
  }
  Status(element: Student, status:string) {
    let item: StudentApproval = {
      approvedBy: this.getCurrentUserId(),
      approvedOn: moment().format("YYYY-MM-DD"),
      classId: element.classId._id,
      status,
      studentId: element.studentId.id,
      session: this.getSessions(element)
    };

    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to approve this course!',
      icon: 'warning',
      confirmButtonText: 'Yes',
      showCancelButton: true,
      cancelButtonColor: '#d33',
    }).then((result) => {
      if (result.isConfirmed){
        this.classService.saveApprovedProgramClasses(element.id, item).subscribe((response:any) => {
          Swal.fire({
            title: 'Success',
            text: 'Course approved successfully.',
            icon: 'success',
            // confirmButtonColor: '#526D82',
          });
          this.getRegisteredClasses();
        }, (error) => {
          Swal.fire({
            title: 'Error',
            text: 'Failed to approve course. Please try again.',
            icon: 'error',
            // confirmButtonColor: '#526D82',
          });
        });
      }
    });

   
  }
  generatePdf() {
    const doc = new jsPDF();
 const headers = [[[AppConstants.STUDENT_ROLE], 'Status', 'Program','Program Fee', [`${AppConstants.INSTRUCTOR_ROLE} Fee`], 'Start Date', 'End Date','Registered Date']];
    // Map status values to desired strings
   const mapStatus = (status: string): string => {
       if (status === 'active') {
           return 'approved';
       } else if (status === 'inactive') {
           return 'pending';
       } else {
           return status; 
       }
   };
 const data = this.dataSource.map((user:any) =>
      [
       user?.student_name,
       mapStatus(user?.status), 
       user?.programTitle, 
       '$ '+user?.classId?.courseId?.courseFee,
       '$ '+user?.classId?.instructorCost,
       formatDate(new Date(user?.classId?.sessions[0]?.sessionStartDate), 'yyyy-MM-dd', 'en') || '',
       formatDate(new Date(user?.classId?.sessions[0]?.sessionEndDate ), 'yyyy-MM-dd', 'en') || '',
       formatDate(new Date(user?.registeredOn), 'yyyy-MM-dd', 'en') || '',
       

    ] );
    const columnWidths = [20, 20, 20, 20, 20, 20, 20, 20, 20, 20];
    (doc as any).autoTable({
      head: headers,
      body: data,
      startY: 20,
    });
    doc.save('Student Pending-Programs-list.pdf');
  }
  exportExcel() {
   const mapStatus = (status: string): string => {
     if (status === 'active') {
         return 'approved';
     } else if (status === 'inactive') {
         return 'pending';
     } else {
         return status; // Handle other cases if needed
     }
 };
   // key name with space add in brackets
   const exportData: Partial<TableElement>[] =
     this.dataSource.map((user: any) => ({
      [AppConstants.STUDENT_ROLE]: user?.student_name,
       'Status':mapStatus(user.status),  
       'Program':user?.programTitle,
       'Program Fee': '$ ' + user?.classId?.courseId?.courseFee,
       [`${AppConstants.INSTRUCTOR_ROLE} Fee`]: '$ ' + user?.classId?.instructorCost,
       'Start Date': formatDate(new Date(user?.classId?.sessions[0]?.sessionStartDate), 'yyyy-MM-dd', 'en') || '',
       'End Date': formatDate(new Date(user?.classId?.sessions[0]?.sessionEndDate ), 'yyyy-MM-dd', 'en') || '',
       'Registered Date': formatDate(new Date(user?.registeredOn), 'yyyy-MM-dd', 'en') || '',
     }));

   TableExportUtil.exportToExcel(exportData, 'Student Pending-Programs-list');
 }
  // exportExcel() {
  //   //k//ey name with space add in brackets
  //  const exportData: Partial<TableElement>[] =
  //     this.dataSource.map((x: { program_name: any; student_name: any; classStartDate: string | number | Date; classEndDate: string | number | Date; registeredOn: string | number | Date; })=>({
  //       "Program Name": x.program_name,
  //       "Student Name": x.student_name,
  //       'Class Start Date': formatDate(new Date(x.classStartDate), 'yyyy-MM-dd', 'en') || '',
  //       'Class End Date': formatDate(new Date(x.classEndDate), 'yyyy-MM-dd', 'en') || '',
  //       'Registered Date': formatDate(new Date(x.registeredOn), 'yyyy-MM-dd', 'en') || '',
  //     }));

  //   TableExportUtil.exportToExcel(exportData, 'excel');
  // }
  // generatePdf() {
  //   const doc = new jsPDF();
  //   const headers = [['Program Name', 'Student Name', 'Class Start Date','Class End Date','Registered Date']];
  //   const data = this.dataSource.map((user: {
  //     //formatDate(arg0: Date, arg1: string, arg2: string): unknown;

  //     program_name: any; student_name: any; classStartDate: any; classEndDate: any; registeredOn: any;
  //   }, index: any) => [user.program_name, user.student_name,

  //     formatDate(new Date(user.classStartDate), 'yyyy-MM-dd', 'en') || '',
  //     formatDate(new Date(user.classEndDate), 'yyyy-MM-dd', 'en') || '',
  //     formatDate(new Date(user.registeredOn), 'yyyy-MM-dd', 'en') || '',


  //   ]);
  //   //const columnWidths = [60, 80, 40];
  //   const columnWidths = [20, 20, 20, 20, 20, 20, 20, 20, 20, 20];

  //   // Add a page to the document (optional)
  //   //doc.addPage();

  //   // Generate the table using jspdf-autotable
  //   (doc as any).autoTable({
  //     head: headers,
  //     body: data,
  //     startY: 20,



  //   });

  //   // Save or open the PDF
  //   doc.save('student-approve.pdf');
  // }


  getSessions(element: { classId: { sessions: any[]; }; }) {
    let sessions = element.classId?.sessions?.map((_: any, index: number) => {
      let session: Session = {} as Session;
      session.sessionNumber = index + 1;
      return session;
    });
    return sessions;
  }
  private refreshTable() {
    this.paginator._changePageSize(this.paginator.pageSize);
  }
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.length;
    return numSelected === numRows;
  }
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.forEach((row: CourseModel) =>
          this.selection.select(row)
        );
  }

  showNotification(
    colorName: string,
    text: string,
    placementFrom: MatSnackBarVerticalPosition,
    placementAlign: MatSnackBarHorizontalPosition
  ) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName,
    });
  }
  removeSelectedRows() {
    const totalSelect = this.selection.selected.length;

    Swal.fire({
      title: "Confirm Deletion",
      text: "Are you sure you want to delete this course kit?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed){
        this.selection.selected.forEach((item) => {
          const index: number = this.dataSource.findIndex(
            (d: CourseModel) => d === item
          );
          
          this.courseService?.dataChange.value.splice(index, 1);
          this.refreshTable();
          this.selection = new SelectionModel<CourseModel>(true, []);
        });
        Swal.fire({
          title: 'Success',
          text: 'Record Deleted Successfully...!!!',
          icon: 'success',
          // confirmButtonColor: '#526D82',
        });
      }
    });
 
    // this.showNotification(
    //   'snackbar-danger',
    //   totalSelect + ' Record Delete Successfully...!!!',
    //   'top',
    //   'right'
    // );
  }

}
