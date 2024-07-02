/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChangeDetectorRef, Component, HostListener } from '@angular/core';
import { CoursePaginationModel } from '@core/models/course.model';
// import { ProgramService } from '../program.service';
import { FormControl, FormGroup } from '@angular/forms';
import { ClassService } from 'app/admin/schedule-class/class.service';
import { forkJoin } from 'rxjs';
import { DataSourceModel } from 'app/admin/schedule-class/class.model';
import * as moment from 'moment';
import { DatePipe, formatDate } from '@angular/common';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { InstructorService } from '@core/service/instructor.service';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import {
  TableExportUtil,
  TableElement,
  UnsubscribeOnDestroyAdapter,
} from '@shared';
import { ProgramService } from 'app/admin/program/program.service';
import { LecturesService } from 'app/teacher/lectures/lectures.service';
import { AppConstants } from '@shared/constants/app.constants';

@Component({
  selector: 'app-schedule-class',
  templateUrl: './schedule-class.component.html',
  styleUrls: ['./schedule-class.component.scss'],
})
export class ScheduleClassComponent {
  status: boolean = false;
  sessions: any;
  // @HostListener('document:keypress', ['$event'])
  // keyPressNumbers(event: KeyboardEvent) {
  //   const charCode = event.which ? event.which : event.keyCode;
  //   if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
  //     event.preventDefault();
  //     return false;
  //   }
  //   return true;
  // }
  isLoading: boolean = false;
  edit: boolean = false;
  next: boolean = false;
  classForm!: FormGroup;
  courseNameControl!: FormControl;
  classTypeControl!: FormControl;
  classDeliveryControl!: FormControl;
  roomTypeControl!: FormControl;
  guaranteeControl!: FormControl;
  instructorControl!: FormControl;
  classId!: string;
  instructorList: any = [];
  programList!: any;
  labList: any = [];
  isInstructorFailed: number = 0;
  isLabFailed: number = 0;
  isStartDateFailed: number = 0;
  isEndDateFailed: number = 0;
  selectedPosition: number = 0;
  selectedLabPosition: number = 0;
  dataSourceArray: DataSourceModel[] = [];
  coursePaginationModel!: Partial<CoursePaginationModel>;
  pageSizeArr = [10, 20, 50, 100];
  searchTerm: string = '';

  displayedColumns = [
    'courseName',
    'Code',
    'Price',
    'Department',
    'startDate',
    'endDate',
    'Class',
    'Minimum Students',
    'Maximum Students',
    // 'Price',
  ];

  breadscrums = [
    {
      title: 'Program Class',
      items: ['Timetable'],
      active: 'Program Class',
    },
  ];
  dataSource: any;
  totalItems: any;
  filterName='';
  isAdmin: boolean = false;
  isInstructor: boolean = false;
  commonRoles: any;
  constructor(
    public courseService: ProgramService,
    private classService: ClassService,
    private cd: ChangeDetectorRef,
    public router: Router,
    private instructorService: InstructorService,
    public lecturesService: LecturesService,
  ) {
    this.coursePaginationModel = {};
  }

  ngOnInit(): void {
    this.commonRoles = AppConstants
    let userType = localStorage.getItem('user_type');
    if (userType == AppConstants.ADMIN_USERTYPE ||  AppConstants.ADMIN_ROLE) {
      this.isAdmin = true;
      this.getClassList();
    }
    if (userType == AppConstants.INSTRUCTOR_ROLE) {
      this.isInstructor = true;
      this.getClassLectures();
    }
  }

  pageSizeChange($event: any) {
    this.coursePaginationModel.page = $event?.pageIndex + 1;
    this.coursePaginationModel.limit = $event?.pageSize;
    let userType = localStorage.getItem('user_type');
    if (userType == AppConstants.ADMIN_USERTYPE ||  AppConstants.ADMIN_ROLE) {
      this.isAdmin = true;
      this.getClassList();
    }
    if (userType == AppConstants.INSTRUCTOR_ROLE) {
      this.isInstructor = true;
      this.getClassLectures();
    }
  }

  getClassList() {
    let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
    this.courseService
      .getProgramClassListWithPagination(userId,{ ...this.coursePaginationModel })
      .subscribe(
        (response) => {
          this.dataSource = response.data.docs;
          this.totalItems = response.data.totalDocs;
          this.coursePaginationModel.docs = response.data.docs;
          this.coursePaginationModel.page = response.data.page;
          this.coursePaginationModel.limit = response.data.limit;
        },
        () => {}
      );
  }

  getClassLectures() {
    let instructorId = localStorage.getItem('id')
    this.lecturesService.getClassListWithPagination1(instructorId, this.filterName,{ ...this.coursePaginationModel }).subscribe(
      (response) => {
   
        this.dataSource = response.data.docs;
        //this.dataSource1 = response.data.sessions;
        this.totalItems = response.data.totalDocs
        this.coursePaginationModel.docs = response.data.docs;
        this.coursePaginationModel.page = response.data.page;
        this.coursePaginationModel.limit = response.data.limit;
        //this.mapClassList()
        // this.dataSource = [];
       this.getSession()
        
      },
      (error) => {
      }
    );
   
    
  }

  toggleStatus() {
    this.status = !this.status;
  }

  nextBtn() {
    if (
      this.classForm.get('classDeliveryType')?.valid &&
      this.classForm.get('courseId')?.valid &&
      this.classForm.get('instructorCost')?.valid &&
      this.classForm.get('minimumEnrollment')?.valid &&
      this.classForm.get('maximumEnrollment')?.valid
    ) {
      this.next = true;
    }
  }
  back() {
    this.next = false;
  }
  exportExcel() {
    const exportData: Partial<TableElement>[] = this.dataSource.map(
      (user: any) => ({
        Program: user?.courseId?.title,
        'Program Code': user?.courseId?.courseCode,
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
    TableExportUtil.exportToExcel(exportData, 'Program Class-list');
  }
  generatePdf() {
    const doc = new jsPDF();
    const headers = [
      [
        'Program',
        'Program Code',
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
    doc.save('Program Class-list.pdf');
  }

  addNewRow() {
    if (this.isInstructorFailed != 1 && this.isLabFailed != 1) {
      this.isInstructorFailed = 0;
      this.isLabFailed = 0;
      this.dataSourceArray.push({
        start: moment().set({ hour: 8, minute: 0 }).format('YYYY-MM-DD HH:mm'),
        end: moment().set({ hour: 8, minute: 0 }).format('YYYY-MM-DD HH:mm'),
        instructor: '0',
        // lab: '0',
      });
      this.dataSource = this.dataSourceArray;
    }
  }
  editRow(_id: string) {
    console.log('id', _id);
  }
  delete(id: string) {
    this.courseService
      .getProgramClassList({ courseId: id })
      .subscribe((classList: any) => {
        const matchingClasses = classList.docs.filter((classItem: any) => {
          return classItem.courseId && classItem.courseId.id === id;
        });
        if (matchingClasses.length > 0) {
          Swal.fire({
            title: 'Error',
            text: 'Classes have been registered with program`. Cannot delete.',
            icon: 'error',
          });
          return;
        }
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
            this.courseService.deleteProgramClass(id).subscribe(() => {
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

  startDateChange(element: { end: any; start: any }) {
    element.end = element.start;
  }
  onChangeInstructor(element: any, i: number) {
    this.selectedPosition = i;
    this.checkAvailabilityOfInstructor(element);
  }

  onChangeLab(element: any, i: number) {
    this.selectedLabPosition = i;
    this.checkAvailabilityOfLaboratory(element);
  }

  checkAvailabilityOfInstructor(element: {
    instructor: any;
    start: any;
    end: any;
  }) {
    this.classService
      .validateInstructor(
        element.instructor,
        new DatePipe('en-US').transform(new Date(element.start), 'yyyy-MM-dd')!,
        new DatePipe('en-US').transform(new Date(element.end), 'yyyy-MM-dd')!,
        new DatePipe('en-US').transform(new Date(element.start), 'HH:MM')!,
        new DatePipe('en-US').transform(new Date(element.end), 'HH:MM')!
      )
      .subscribe((response: any) => {
        if (!response['success']) {
          this.isInstructorFailed = 1;
          // this.cd.detectChanges();
        } else {
          this.isInstructorFailed = 0;
        }
      });
  }
  checkAvailabilityOfLaboratory(element: {
    lab: string | undefined;
    start: string | number | Date;
    end: string | number | Date;
  }) {
    this.classService
      .validateLaboratory(
        element.lab,
        new DatePipe('en-US').transform(new Date(element.start), 'yyyy-MM-dd')!,
        new DatePipe('en-US').transform(new Date(element.end), 'yyyy-MM-dd')!,
        new DatePipe('en-US').transform(new Date(element.start), 'HH:MM')!,
        new DatePipe('en-US').transform(new Date(element.end), 'HH:MM')!
      )
      .subscribe((response) => {
        if (!response.data['success']) {
          this.isLabFailed = 1;
        } else {
          this.isLabFailed = 0;
        }
      });
  }
  getSession() {
    let sessions: any = [];
    this.dataSource.forEach((item: any, index: any) => {
      if (
        this.isInstructorFailed == 0 &&
        item.instructor != '0' &&
        item.lab != '0'
      ) {
        sessions.push({
          sessionNumber: index + 1,
          sessionStartDate: moment(item.start).format('YYYY-MM-DD'),
          sessionEndDate: moment(item.end).format('YYYY-MM-DD'),
          sessionStartTime: moment(item.start).format('HH:mm'),
          sessionEndTime: moment(item.end).format('HH:mm'),
          instructorId: item.instructor,
          laboratoryId: item.lab,
        });
      } else {
        // this.toaster.error("Please choose Instructor and Lab")
        sessions = null;
      }
    });
    return sessions;
  }

  performSearch() {
    if (this.searchTerm) {
      this.dataSource = this.dataSource?.filter((item: any) => {
        const search = (item.courseId?.title).toLowerCase();
        return search.indexOf(this.searchTerm.toLowerCase()) !== -1;
      });
    } else {
      this.getClassList();
    }
  }

  getStatusClass(classDeliveryType: string): string {
    return classDeliveryType === 'online' ? 'success' : 'fail';
  }
}
