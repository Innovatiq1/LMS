// import { CourseId } from './../../../core/models/class.model';
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  ClassModel,
  Session,
  Student,
  StudentApproval,
  StudentPaginationModel,
} from 'app/admin/schedule-class/class.model';
import { ClassService } from 'app/admin/schedule-class/class.service';
import { CoursePaginationModel } from '@core/models/course.model';
import * as moment from 'moment';
import { SelectionModel } from '@angular/cdk/collections';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { MatPaginator } from '@angular/material/paginator';
// import { fromEvent } from 'rxjs';
import { UnsubscribeOnDestroyAdapter } from '@shared/UnsubscribeOnDestroyAdapter';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { TableElement, TableExportUtil } from '@shared';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { formatDate } from '@angular/common';
import { LecturesService } from 'app/teacher/lectures/lectures.service';
import { AppConstants } from '@shared/constants/app.constants';

@Component({
  selector: 'app-class-list',
  templateUrl: './class-list.component.html',
  styleUrls: ['./class-list.component.scss'],
})
export class ClassListComponent extends UnsubscribeOnDestroyAdapter implements OnInit{
  displayedColumns = [
    // 'select',
    // 'Instructor',
    'Course',
    'Code',
    'Price',
    'Department',
    'Start Date',
    'End Date',
    'Class',
    'Minimum Students',
    'Maximum Students',
    // 'Price',
  ];

  breadscrums = [
    {
      title: 'Course Class',
      items: ['Timetable'],
      active: 'Course Class',
    },
  ];
  coursePaginationModel!: Partial<CoursePaginationModel>;
  selection = new SelectionModel<ClassModel>(true, []);
  dataSource: any;
  totalItems: any;
  isLoading = true;
  pageSizeArr = [10, 20, 50, 100];
  searchTerm: string = '';
  filterName='';
  isAdmin: boolean = false;
  isInstructor: boolean = false;
  commonRoles: any;

  constructor(
    public _classService: ClassService,
    private snackBar: MatSnackBar,
    private _router: Router,
    public lecturesService: LecturesService,
    private cdr: ChangeDetectorRef
  ) {
    super();
    this.coursePaginationModel = {};
    // let userType = localStorage.getItem('user_type');
    // // if(userType == "Student"){
    // //   this.getApprovedCourse();
    // //   this.getApprovedProgram();
    // // }
    // if (userType == 'admin') {
    //   this.getClassList();
    // }
    // if (userType == 'Instructor') {
    //   this.getClassLectures();
    // }
  }
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild('filter', { static: true }) filter!: ElementRef;

  ngOnInit(): void {
    this.commonRoles = AppConstants
    let userType = localStorage.getItem('user_type');
    if (userType == AppConstants.ADMIN_USERTYPE || AppConstants.ADMIN_ROLE) {
      this.isAdmin = true;
      this.getClassList();
    }
    if (userType == AppConstants.INSTRUCTOR_ROLE) {
      this.isInstructor = true;
      this.getClassLectures();
    }
    // this.getClassList();
    // this.getClassLectures();
  }

  getClassList() {
    let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
        this._classService
      .getClassListWithPagination({ ...this.coursePaginationModel },userId)
      .subscribe(
        (response) => {
          if (response.data) {
            this.isLoading = false;
            this.dataSource = response.data.docs;
            this.totalItems = response.data.totalDocs;
            this.coursePaginationModel.docs = response.data.docs;
            this.coursePaginationModel.page = response.data.page;
            this.coursePaginationModel.limit = response.data.limit;
            this.mapClassList();
          }
        },
        (error) => {
          console.log('error', error);
        }
      );
  }


  getClassLectures() {
    let instructorId = localStorage.getItem('id')
    this.lecturesService.getClassListWithPagination(instructorId, this.filterName,{ ...this.coursePaginationModel }).subscribe(
      (response) => {
        this.dataSource = response.data.docs;
        this.totalItems = response.data.totalDocs
        this.coursePaginationModel.docs = response.data.docs;
        this.coursePaginationModel.page = response.data.page;
        this.coursePaginationModel.limit = response.data.limit;
        console.log("PV", this.dataSource)
        this.mapClassList();
        this.isLoading=false;
        
      },
      (error) => {
      }
    );
   
    
  }
  // getSession() {
  //   if(this.dataSource1){
  //   this.dataSource1&&this.dataSource1?.forEach((item: any, index: any) => {
  //     if (item.sessions[0]&& item.sessions[0]?.courseName&&item.sessions[0]?.courseCode) {
  //       let starttimeObject = moment(item.sessions[0].sessionStartTime, "HH:mm");
        
  //       const duration = moment.duration(moment(item.sessions[0].sessionEndDate).diff(moment(item.sessions[0].sessionStartDate)));
  //       let daysDifference = duration.asDays()+1
        

        
  //       this.dataSource.push({
  //         //sessionNumber: index + 1,
  //         classId:item._id,
  //         sessionStartDate: moment(item.sessions[0].sessionStartDate).format("YYYY-MM-DD"),
  //         sessionEndDate: moment(item.sessions[0].sessionEndDate).format("YYYY-MM-DD"),
  //         sessionStartTime: starttimeObject.format("hh:mm A"),
  //         sessionEndTime: moment(item.sessions[0].end).format("hh:mm A"),
  //         //instructorId: item.instructor,
  //         laboratoryId: item.sessions[0].laboratoryId,
  //         courseName: item.sessions[0].courseName,
  //         courseCode: item.sessions[0].courseCode,
  //         status: item.sessions[0].status,
  //         _id:item.sessions[0]._id,
  //         duration:daysDifference,

  //         sessionNumber: 0,
  //         instructorId: ''
  //       });
  //     } else {
        
  //     }
      
  //   });
  //   this.cdr.detectChanges();
  //   //console.log("ssssssssssss",this.dataSource)
  //   //this.myArray.push(newItem);
  //   // this.myArray.data = this.dataSource1;
  // }
  //   //return sessions;
    
  // }

  private refreshTable() {
    this.paginator._changePageSize(this.paginator.pageSize);
  }
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.forEach((row: any) => this.selection.select(row));
  }

  pageSizeChange($event: any) {
    console.log('event', $event);
    this.coursePaginationModel.page = $event?.pageIndex + 1;
    this.coursePaginationModel.limit = $event?.pageSize;
    let userType = localStorage.getItem('user_type');
    if (userType == AppConstants.ADMIN_USERTYPE ||  AppConstants.ADMIN_ROLE) {
      this.getClassList();
    }
    if (userType == AppConstants.INSTRUCTOR_ROLE) {
      this.getClassLectures();
    }
  }

  mapClassList() {
    this.dataSource.forEach((item: any) => {
      const startDateArr: any = [];
      const endDateArr: any = [];
      item.sessions.forEach(
        (session: {
          sessionStartDate: { toString: () => string | number | Date };
          sessionEndDate: { toString: () => string | number | Date };
        }) => {
          startDateArr.push(new Date(session.sessionStartDate.toString()));
          endDateArr.push(new Date(session.sessionEndDate.toString()));
        }
      );
      const minStartDate = new Date(Math.min.apply(null, startDateArr));
      const maxEndDate = new Date(Math.max.apply(null, endDateArr));
      item.classStartDate = !isNaN(minStartDate.valueOf())
        ? moment(minStartDate).format('YYYY-DD-MM')
        : '';
      item.classEndDate = !isNaN(maxEndDate.valueOf())
        ? moment(maxEndDate).format('YYYY-DD-MM')
        : '';
      item.registeredOn = item.registeredOn
        ? moment(item.registeredOn).format('YYYY-DD-MM')
        : '';
    });
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
      title: 'Confirm Deletion',
      text: 'Are you sure you want to delete this course kit?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.selection.selected.forEach((item) => {
          const index: number = this.dataSource.findIndex(
            (d: ClassModel) => d === item
          );
          this._classService?.dataChange.value.splice(index, 1);
          this.refreshTable();
          this.selection = new SelectionModel<ClassModel>(true, []);
        });
        Swal.fire({
          title: 'Success',
          text: 'Record Deleted Successfully...!!!',
          icon: 'success',
          // confirmButtonColor: '#526D82',
        });
      }
    });
  }
  //edit
  editClass(id: string) {
    this._router.navigate([`admin/courses/create-class`], {
      queryParams: { id: id },
    });
  }
  //delete
  delete(id: string) {
    this._classService
      .getClassList({ courseId: id })
      .subscribe((classList: any) => {
        const matchingClasses = classList.docs.filter((classItem: any) => {
          return classItem.courseId && classItem.courseId.id === id;
        });

        Swal.fire({
          title: 'Confirm Deletion',
          text: 'Are you sure you want to delete this Class?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#d33',
          cancelButtonColor: '#3085d6',
          confirmButtonText: 'Delete',
          cancelButtonText: 'Cancel',
        }).then((result) => {
          if (result.isConfirmed) {
            if (matchingClasses.length > 0) {
              Swal.fire({
                title: 'Error',
                text: 'Class have been registered . Cannot delete.',
                icon: 'error',
              });
              return;
            }
            this._classService.deleteClass(id).subscribe(() => {
              Swal.fire({
                title: 'Success',
                text: 'Class deleted successfully.',
                icon: 'success',
              });
              this.getClassList();
            });
          }
        });
      });
  }
  performSearch() {
    if (this.searchTerm) {
      this.dataSource = this.dataSource?.filter((item: any) =>
        // console.log(item.courseId?.title)
        item.courseId?.title
          .toLowerCase()
          .includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.getClassList();
    }
  }
  exportExcel() {
    const exportData: Partial<TableElement>[] = this.dataSource.map(
      (user: any) => ({
        Course: user?.courseId?.title,
        'Course Code': user?.courseId?.courseCode,
        Amount: '$ ' + user?.instructorCost,
        Department: user?.department,
        StartDate:
          formatDate(
            new Date(user?.sessions[0]?.sessionStartDate),
            'yyyy-MM-dd',
            'en'
          ) || '',
        EndDate:
          formatDate(
            new Date(user?.sessions[0]?.sessionEndDate),
            'yyyy-MM-dd',
            'en'
          ) || '',
        Class: user?.classDeliveryType,
      })
    );
    TableExportUtil.exportToExcel(exportData, 'Course Class-list');
  }
  generatePdf() {
    const doc = new jsPDF();
    const headers = [
      [
        'Course',
        'Course Code',
        'Amount',
        'Department',
        'Start Date',
        'End Date',
        'Class',
      ],
    ];
    const data = this.dataSource.map((user: any) => [
      user?.courseId?.title,
      user?.courseId?.courseCode,
      '$ ' + user?.instructorCost,
      user?.department,
      formatDate(
        new Date(user?.sessions[0]?.sessionStartDate),
        'yyyy-MM-dd',
        'en'
      ) || '',
      formatDate(
        new Date(user?.sessions[0]?.sessionEndDate),
        'yyyy-MM-dd',
        'en'
      ) || '',
      user?.classDeliveryType,
    ]);
    const columnWidths = [20, 20, 20, 20, 20, 20, 20, 20, 20, 20];
    (doc as any).autoTable({
      head: headers,
      body: data,
      startY: 20,
    });
    doc.save('Course Class-list.pdf');
  }

  getStatusClass(classDeliveryType: string): string {
    return classDeliveryType === 'online' ? 'success' : 'fail';
  }
}
