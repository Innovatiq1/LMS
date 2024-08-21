import { SelectionModel } from '@angular/cdk/collections';
import { formatDate } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { StudentPaginationModel, StudentApproval, Session } from '@core/models/class.model';
import { CourseModel, CoursePaginationModel } from '@core/models/course.model';
import { Student } from '@core/models/user.model';
import { CourseService } from '@core/service/course.service';
import { UtilsService } from '@core/service/utils.service';
import { TableElement, TableExportUtil } from '@shared';
import { ClassService } from 'app/admin/schedule-class/class.service';
import jsPDF from 'jspdf';
import * as moment from 'moment';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-student-approval-list',
  templateUrl: './student-approval-list.component.html',
  styleUrls: ['./student-approval-list.component.scss']
})
export class StudentApprovalListComponent {
  displayedColumns: string[] = [
    // 'select',
    'Program Name',
    'Student Name',
    'Class Start Date',
    'Class End Date',
    'Registered Date',
    'actions'
  ];
  breadscrums = [
    {
      items: ['Approval'],
      active: 'Registered Programs',
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


  upload() {
    document.getElementById('input')?.click();
  }

  constructor(private classService: ClassService,
    private courseService: CourseService,
    private snackBar: MatSnackBar,
    private utils:UtilsService) {
    this.studentPaginationModel = {} as StudentPaginationModel;
  }

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

    ngOnInit(): void {
      this.getRegisteredClasses();
    }

  getRegisteredClasses() {
    this.classService
      .getProgramRegisteredClasses(this.studentPaginationModel.page, this.studentPaginationModel.limit, this.studentPaginationModel.filterText)
      .subscribe((response: { data: StudentPaginationModel; }) => {
        this.isLoading = false;
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
          });
          this.getRegisteredClasses();
        });
        () => {
              Swal.fire({
                title: 'Error',
                text: 'Failed to approve course. Please try again.',
                icon: 'error',
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
          });
          this.getRegisteredClasses();
        }, (error) => {
          Swal.fire({
            title: 'Error',
            text: 'Failed to approve course. Please try again.',
            icon: 'error',
          });
        });
      }
    });

   
  }
  exportExcel() {
    const exportData: Partial<TableElement>[] =
       this.dataSource.map((user:any) => ({
         'Program Name':user?.program_name,
         'Student Name': user?.student_name,
         'Class Start Date': formatDate(new Date(user?.classId?.sessions[0]?.sessionStartDate), 'yyyy-MM-dd', 'en') || '',
         'Class End Date': formatDate(new Date(user?.classId?.sessions[0]?.sessionEndDate ), 'yyyy-MM-dd', 'en') || '',
         'Registered Date': formatDate(new Date(user?.registeredOn), 'yyyy-MM-dd', 'en') || '',
        
       }));
     TableExportUtil.exportToExcel(exportData, 'Student-Approve-list');
   }
   generatePdf() {
     const doc = new jsPDF();
     const headers = [['Program Name','Student Name','Class Start Date',  'Class End Date', 'Registered Date']];
     const data = this.dataSource.map((user:any) =>
       [user?.program_name,
        user?.student_name,
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
     doc.save('Student-Approve-list.pdf');
   }
 
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
        });
      }
    });
  }

}
