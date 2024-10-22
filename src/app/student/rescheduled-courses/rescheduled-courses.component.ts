/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, ElementRef, ViewChild } from '@angular/core';
import { CourseService } from '@core/service/course.service';
import {
  CoursePaginationModel,
  MainCategory,
  SubCategory,
} from '@core/models/course.model';
import Swal from 'sweetalert2';
import { ClassService } from 'app/admin/schedule-class/class.service';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-rescheduled-courses',
  templateUrl: './rescheduled-courses.component.html',
  styleUrls: ['./rescheduled-courses.component.scss'],
})
export class RescheduledCoursesComponent {
  breadscrums = [
    {
      title: 'Enrollment',
      items: ['Reschedule'],
      active: 'Rescheduled Courses',
    },
  ];
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  filterName: string = "";


  coursePaginationModel: Partial<CoursePaginationModel>;
  studentApprovedModel!: Partial<CoursePaginationModel>;
  filterApproved = '';
  totalItems: any;
  pageSizeArr = [10, 25, 50, 100];
  studentApprovedClasses: any;
  totalApprovedItems: any;

  @ViewChild('filter', { static: true }) filter!: ElementRef;
  tab: number = 0;
  department: any;
  userGroupIds: string = '';

  constructor(
    public _courseService: CourseService,
    private classService: ClassService
  ) {
    this.coursePaginationModel = {};
    this.studentApprovedModel = {};
    this.department = JSON.parse(
      localStorage.getItem('user_data')!
    ).user.department;
    this.userGroupIds = (
      JSON.parse(localStorage.getItem('user_data')!).user.userGroup.map(
        (v: any) => v.id
      ) || []
    ).join();
  }

  ngOnInit() {
    this.getApprovedCourse();
  }
  performSearch() {
    this.coursePaginationModel.page = 1;
    this.paginator.pageIndex = 0;
      this.getApprovedCourse();
  }
  getApprovedCourse() {
    let filterCourse = this.filterName;
    let studentId = localStorage.getItem('id');
    let filterApprovedCourse = this.filterApproved;
    const payload = {
      filterApprovedCourse,
      studentId: studentId,
      rescheduledDate: 'yes',
      status: 'approved',
      className:filterCourse,
      ...this.coursePaginationModel,
    };
    this.classService
      .getStudentRegisteredClasses(payload)
      .subscribe((response) => {
        this.studentApprovedClasses = response.data.docs;
        this.totalApprovedItems = response.data.totalDocs;
        this.studentApprovedModel.docs = response.data.docs;
        this.studentApprovedModel.page = response.data.page;
        this.studentApprovedModel.limit = response.data.limit;
        this.studentApprovedModel.totalDocs = response.data.totalDocs;
      });
  }

  pageSizeChange($event: any) {
    this.coursePaginationModel.page = $event?.pageIndex + 1;
    this.coursePaginationModel.limit = $event?.pageSize;
    this.getApprovedCourse();
  }

  pageStudentApprovedSizeChange($event: any) {
    this.studentApprovedModel.page = $event?.pageIndex + 1;
    this.studentApprovedModel.limit = $event?.pageSize;
    this.getApprovedCourse();
  }
}
 
