import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import * as moment from 'moment';
import { DataSource, SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import {
  TableElement,
  TableExportUtil,
  UnsubscribeOnDestroyAdapter,
} from '@shared';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { MatSort } from '@angular/material/sort';
import {
  ClassModel,
  Session,
  Student,
  StudentApproval,
  StudentPaginationModel,
} from 'app/admin/schedule-class/class.model';
import { ClassService } from 'app/admin/schedule-class/class.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { formatDate } from '@angular/common';
import { AppConstants } from '@shared/constants/app.constants';
import { AuthenService } from '@core/service/authen.service';
import { CoursePaginationModel } from '@core/models/course.model';

@Component({
  selector: 'app-verification-list',
  templateUrl: './verification-list.component.html',
  styleUrls: ['./verification-list.component.scss'],
})
export class VerificationListComponent {
  displayedColumns = [
    'studentname',
    'status',
    'coursename',
    'classstartDate',
    'classendDate',
    'registeredDate',
    'programFee',
    // 'instructorFee',
  ];

  breadscrums = [
    {
      title: 'Registered Courses',
      items: ['Registered Courses'],
      active: 'Verification List',
    },
  ];
  searchTerm: string = '';
  studentPaginationModel: StudentPaginationModel;
  coursePaginationModel!: Partial<CoursePaginationModel> ;
  selection = new SelectionModel<ClassModel>(true, []);
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort) matSort!: MatSort;
  totalItems: any;
  approveData: any;
  pageSizeArr = [10, 20, 30, 50, 100];
  isLoading = true;
  dataSource!: any;
  commonRoles: any;
  isView = false;
  filterName: string = '';
  userGroupIds: string = '';
  constructor(
    public _classService: ClassService,
    private snackBar: MatSnackBar,
    public router: Router,
    private authenService: AuthenService
  ) {
    this.studentPaginationModel = {} as StudentPaginationModel;
    this.coursePaginationModel = {} as CoursePaginationModel;
  }

  ngOnInit(): void {
    const roleDetails = this.authenService.getRoleDetails()[0].menuItems;
    let urlPath = this.router.url.split('/');
    const parentId = `${urlPath[1]}/${urlPath[2]}`;
    const childId =  urlPath[urlPath.length - 2];
    const subChildId =  urlPath[urlPath.length - 1];
    let parentData = roleDetails.filter((item: any) => item.id == parentId);
    let childData = parentData[0].children.filter((item: any) => item.id == childId);
    let subChildData = childData[0].children.filter((item: any) => item.id == subChildId);
    let actions = subChildData[0].actions
    let viewAction = actions.filter((item:any) => item.title == 'View')

    if(viewAction.length >0){
      this.isView = true;
    }
    this.commonRoles = AppConstants;
    this.getPendingVerificationList();
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
  pageSizeChange($event: any) {
    this.studentPaginationModel.page = $event?.pageIndex + 1;
    this.studentPaginationModel.limit = $event?.pageSize;
    this.getPendingVerificationList();
  }

  getPendingVerificationList() {
    let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
    let filterProgram = this.filterName;
    const payload = { ...this.coursePaginationModel, title: filterProgram };
    if (this.userGroupIds) {
      payload.userGroupId = this.userGroupIds;
    }
    this._classService
      .getPendingVerificationLists(
        userId,payload
      )
      .subscribe((response: { data: CoursePaginationModel }) => {
        this.isLoading = false;
        this.coursePaginationModel = response.data;
        this.dataSource = response.data.docs;
        this.dataSource.sort = this.matSort;
        this.totalItems = response.data.totalDocs;
        this.mapClassList();
      });
  }
  filterData($event: any) {
    this.dataSource.filter = $event.target.value;
  }

  view(id: string) {
    this.router.navigate(
      ['/admin/courses/student-courses/registered-pending-courses/view-completion-list'],
      { queryParams: { id: id, status: 'verification', verify: false } }
    );
  }

  mapClassList() {
    this.studentPaginationModel.docs.forEach((item: Student) => {
      const startDateArr: any = [];
      const endDateArr: any = [];
      item?.classId?.sessions?.forEach((session) => {
        startDateArr.push(new Date(session?.sessionStartDate?.toString()));
        endDateArr.push(new Date(session?.sessionEndDate?.toString()));
      });
      const minStartDate = new Date(Math.min.apply(null, startDateArr));
      const maxEndDate = new Date(Math.max.apply(null, endDateArr));

      item.classStartDate = !isNaN(minStartDate.valueOf())
        ? moment(minStartDate).format('YYYY-DD-MM')
        : '';
      item.classEndDate = !isNaN(maxEndDate.valueOf())
        ? moment(maxEndDate).format('YYYY-DD-MM')
        : '';
      // item.registeredOn = item?.registeredOn ? moment(item.registeredOn).format("YYYY-DD-MM") : "";
      item.studentId.name = `${item?.studentId?.name}`;
    });
  }

  getCurrentUserId(): string {
    return JSON.parse(localStorage.getItem('user_data')!).user.id;
  }

  changeStatus(element: Student, status: string) {
    const item: StudentApproval = {
      approvedBy: this.getCurrentUserId(),
      approvedOn: moment().format('YYYY-MM-DD'),
      classId: element.classId._id,
      status,
      studentId: element.studentId.id,
      session: this.getSessions(element),
    };

    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to approve this course!',
      icon: 'warning',
      confirmButtonText: 'Yes',
      showCancelButton: true,
      cancelButtonColor: '#d33',
    }).then((result) => {
      if (result.isConfirmed) {
        this._classService.saveApprovedClasses(element.id, item).subscribe(
          (_response: any) => {
            Swal.fire({
              title: 'Success',
              text: 'Course approved successfully.',
              icon: 'success',
            });
            this.getPendingVerificationList();
          },
          (error) => {
            Swal.fire({
              title: 'Error',
              text: 'Failed to approve course. Please try again.',
              icon: 'error',
            });
          }
        );
      }
    });
  }

  Status(element: Student, status: string) {
    const item: StudentApproval = {
      approvedBy: this.getCurrentUserId(),
      approvedOn: moment().format('YYYY-MM-DD'),
      classId: element.classId._id,
      status,
      studentId: element.studentId.id,
      session: this.getSessions(element),
    };
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to withdraw this course!',
      icon: 'warning',
      confirmButtonText: 'Yes',
      showCancelButton: true,
      cancelButtonColor: '#d33',
    }).then((result) => {
      if (result.isConfirmed) {
        this._classService.saveApprovedClasses(element.id, item).subscribe(
          (response: any) => {
            Swal.fire({
              title: 'Success',
              text: 'Course Withdraw successfully.',
              icon: 'success',
            });
            this.getPendingVerificationList();
          },
          (error) => {
            Swal.fire({
              title: 'Error',
              text: 'Failed to approve course. Please try again.',
              icon: 'error',
            });
          }
        );
      }
    });
  }
  performSearch() {
    this.paginator.pageIndex = 0;
    this.coursePaginationModel.page = 1;
      this.getPendingVerificationList();
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
      : this.dataSource.forEach((row: any) => this.selection.select(row));
  }

  getSessions(element: { classId: { sessions: any[] } }) {
    const sessions = element.classId?.sessions?.map((_: any, index: number) => {
      const session: Session = {} as Session;
      session.sessionNumber = index + 1;
      return session;
    });
    return sessions;
  }

  exportExcel() {
    const exportData: Partial<TableElement>[] = this.dataSource.map(
      (user: any) => ({
        Student: user.studentId?.name,
        Status: user.status === 'inactive' ? 'Pending' : '',
        Course: user.classId?.courseId?.title,
        'Course Fee': '$' + user.classId?.courseId?.fee,
        // 'Instructor Fee': '$' + user.classId?.instructorCost,
        'Start Date': user.classStartDate,
        'End Date': user.classEndDate,
        'Registered On':
          formatDate(new Date(user.registeredOn), 'yyyy-MM-dd', 'en') || '',
      })
    );
    TableExportUtil.exportToExcel(exportData, 'Student Pending-list');
  }
  generatePdf() {
    const doc = new jsPDF();
    const headers = [
      [
        'Student',
        'Status',
        'Course',
        'Course Fee',
        // 'Instructor Fee',
        'Start Date  ',
        'End date  ',
        'Registered Date',
      ],
    ];
    const data = this.dataSource.map((user: any) => [
      user.studentId?.name,
      user.status === 'inactive' ? 'Pending' : '',
      user.classId?.courseId?.title,
      '$' + user.classId?.courseId?.fee,
      '$' + user.classId?.instructorCost,
      user.classStartDate,
      user.classEndDate,
      formatDate(new Date(user.registeredOn), 'yyyy-MM-dd', 'en') || '',
    ]);
    const columnWidths = [20, 20, 20, 20, 20, 20, 20, 20, 20, 20];
    (doc as any).autoTable({
      head: headers,
      body: data,
      startY: 20,
      headStyles: {
        fontSize: 10,
        cellWidth: 'wrap',
      },
    });
    doc.save('Student Pending-list.pdf');
  }
}
