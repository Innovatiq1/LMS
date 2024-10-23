import { SelectionModel } from '@angular/cdk/collections';
import { formatDate } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarVerticalPosition, MatSnackBarHorizontalPosition } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { StudentPaginationModel, StudentApproval, Session } from '@core/models/class.model';
import { CourseModel, CoursePaginationModel } from '@core/models/course.model';
import { Student } from '@core/models/user.model';
import { AuthenService } from '@core/service/authen.service';
import { CourseService } from '@core/service/course.service';
import { UtilsService } from '@core/service/utils.service';
import { TableElement, TableExportUtil } from '@shared';
import { AppConstants } from '@shared/constants/app.constants';
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
    'Student Name',
    'status',
    'Program Name',
    'Program-Fee',
    // 'Instructor-Fee',
    'Class Start Date',
    'Class End Date',
    'Registered Date',
    
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
  view = false;
  filterName:string = '';
  userGroupIds: string = '';

  upload() {
    document.getElementById('input')?.click();
  }

  constructor(private classService: ClassService,
    private courseService: CourseService,
    private snackBar: MatSnackBar, private authenService: AuthenService,private route :Router,
    private utils:UtilsService) {
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
      .getApprovedProgramClasse(userId,payload)
      .subscribe((response: { data: CoursePaginationModel; }) => {
        this.isLoading = false;
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
   
      this.coursePaginationModel.page = 1;
      this.paginator.pageIndex = 0;
      this.getRegisteredClasses();

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
  const headers = [[[AppConstants.STUDENT_ROLE], 'Status', 'Program ','Program Fee', [`${AppConstants.INSTRUCTOR_ROLE} Fee`], 'Start Date', 'End Date','Registered Date']];
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
       '$ '+ user?.classId?.courseId?.courseFee,
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
     doc.save('Student-Approve-list.pdf');
   }
   exportExcel() {
    const mapStatus = (status: string): string => {
      if (status === 'active') {
          return 'approved';
      } else if (status === 'inactive') {
          return 'pending';
      } else {
          return status;
      }
  };
    const exportData: Partial<TableElement>[] =
      this.dataSource.map((user: any) => ({
        [AppConstants.STUDENT_ROLE]: user?.student_name,
        'Status':mapStatus(user.status),  
        'Program Name':user?.programTitle,
        'Program Fee': '$ ' + user?.classId?.courseId?.courseFee,
        [`${AppConstants.INSTRUCTOR_ROLE} Fee`]: '$ ' + user?.classId?.instructorCost,
        'Start Date': formatDate(new Date(user?.classId?.sessions[0]?.sessionStartDate), 'yyyy-MM-dd', 'en') || '',
        'End Date': formatDate(new Date(user?.classId?.sessions[0]?.sessionEndDate ), 'yyyy-MM-dd', 'en') || '',
        'Registered Date': formatDate(new Date(user?.registeredOn), 'yyyy-MM-dd', 'en') || '',
      }));

    TableExportUtil.exportToExcel(exportData, 'Student-Approve-list');
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
        });
      }
    });
  }
}
