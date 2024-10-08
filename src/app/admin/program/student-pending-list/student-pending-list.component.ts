import { SelectionModel } from '@angular/cdk/collections';
import { formatDate } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Session, Student, StudentApproval, StudentPaginationModel } from '@core/models/class.model';
import { CourseModel, CoursePaginationModel } from '@core/models/course.model';
import { AuthenService } from '@core/service/authen.service';
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
    'select',
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


  dataSource: any;
  // selection = new SelectionModel<any>(true, []); 
  pageSizeArr =[10, 20, 50, 100];
  totalPages: any;
  studentPaginationModel: StudentPaginationModel;
  selection = new SelectionModel<CourseModel>(true, []);
  isLoading :any;
  coursePaginationModel!: Partial<CoursePaginationModel>;
  searchTerm:string = '';
  commonRoles: any;
  view = false;
  filterName: string = '';
  userGroupIds: string = '';

  upload() {
    document.getElementById('input')?.click();
  }

  constructor(private classService: ClassService,
    private courseService: CourseService,
    private snackBar: MatSnackBar, private authenService: AuthenService, private route :Router, 
    private utils:UtilsService) {
    // this.displayedColumns = ["title", "studentName", "classStartDate", "classEndDate",  "action"];
    this.studentPaginationModel = {} as StudentPaginationModel;

  }

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

    ngOnInit(): void {
      const roleDetails =this.authenService.getRoleDetails()[0].menuItems
      let urlPath = this.route.url.split('/');
      const parentId = `${urlPath[1]}/${urlPath[2]}`;
      const childId =  urlPath[urlPath.length - 2];
      const subChildId =  urlPath[urlPath.length - 1];
      let parentData = roleDetails.filter((item: any) => item.id == parentId);
      let childData = parentData[0].children.filter((item: any) => item.id == childId);
      let subChildData = childData[0].children.filter((item: any) => item.id == subChildId);
      let actions = subChildData[0].actions
  
      let viewAction = actions.filter((item:any) => item.title == 'View')
      if(viewAction.length >0){
        this.view = true;
      }
      this.commonRoles = AppConstants
      this.getRegisteredClasses();
    }

  getRegisteredClasses() {
    let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
    let filterProgram = this.filterName;
    const payload = { ...this.coursePaginationModel,title:filterProgram };
  if(this.userGroupIds){
    payload.userGroupId=this.userGroupIds
  }
    this.classService
      .getProgramRegisteredClasse(userId,payload)
      .subscribe((response: { data: CoursePaginationModel; }) => {
        this.isLoading = false;
        // 
        this.coursePaginationModel = response.data;
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
    // if(this.searchTerm){
    // this.dataSource = this.dataSource?.filter((item: any) =>{
    //   const searchList = (item.classId.courseId?.title + item.studentId?.name).toLowerCase()
    //   return searchList.indexOf(this.searchTerm.toLowerCase()) !== -1
    // }

    // );
    // } else {
      this.getRegisteredClasses();

    // }
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

  approveSelectedRows() {
    const selectedRows = this.selection.selected;
  
    if (selectedRows.length > 0) {
      Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to approve the selected Programs?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonColor: '#d33',
      }).then((result) => {
        if (result.isConfirmed) {
          const approvalPromises = selectedRows.map((row:any) => {
            let item: StudentApproval = {
              approvedBy: this.getCurrentUserId(),
              approvedOn: moment().format("YYYY-MM-DD"),
              classId: row.classId._id,
              status: "approved",
              studentId: row.studentId.id,
              session: this.getSessions(row)
            };
  
            return this.classService.saveApprovedProgramClasses(row.id, item).toPromise();
          });
  
          Promise.all(approvalPromises).then(() => {
            Swal.fire({
              title: 'Success',
              text: 'All selected Program have been approved successfully.',
              icon: 'success',
            });
            this.getRegisteredClasses();
          }).catch((error) => {
            Swal.fire({
              title: 'Error',
              text: 'Failed to approve some Programs. Please try again.',
              icon: 'error',
            });
          });
        }
      });
    }
  }
  

  deleteSelectedRows() {
    const selectedRows = this.selection.selected;
    if (selectedRows.length > 0) {
      selectedRows.forEach(row => {
        this.deleteRow(row);
      });
    }
  }
  deleteRow(row: any) {
    // Swal.fire({
    //   title: 'Are you sure?',
    //   text: 'Do you want to delete this course?',
    //   icon: 'warning',
    //   showCancelButton: true,
    //   confirmButtonText: 'Yes',
    //   cancelButtonColor: '#d33',
    // }).then((result) => {
    //   if (result.isConfirmed) {
    //     this.classService.deleteProgramClass(row.id).subscribe((response: any) => {
    //       Swal.fire({
    //         title: 'Success',
    //         text: 'Course deleted successfully.',
    //         icon: 'success',
    //       });
    //       this.getRegisteredClasses(); // Refresh the table data after deletion
    //     }, (error) => {
    //       Swal.fire({
    //         title: 'Error',
    //         text: 'Failed to delete course. Please try again.',
    //         icon: 'error',
    //       });
    //     });
    //   }
    // });

    
  }
  

}
