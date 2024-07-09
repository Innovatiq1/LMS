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

  getApprovedCourse() {
    let studentId = localStorage.getItem('id');
    let filterApprovedCourse = this.filterApproved;
    const payload = {
      filterApprovedCourse,
      studentId: studentId,
      rescheduledDate: 'yes',
      status: 'approved',
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

  performSearch() {
    if (this.filterApproved) {
      this.studentApprovedClasses = this.studentApprovedClasses?.filter(
        (item: any) => {
          const searchList = item.title.toLowerCase();
          return searchList.indexOf(this.filterApproved.toLowerCase()) !== -1;
        }
      );
    } else {
      this.getApprovedCourse();
    }
  }

  // private mapCategories(): void {
  //   this.coursePaginationModel.docs?.forEach((item) => {
  //     item.main_category_text = this.mainCategories.find((x) => x.id === item.main_category)?.category_name;
  //   });

  //   this.coursePaginationModel.docs?.forEach((item) => {
  //     item.sub_category_text = this.allSubCategories.find((x) => x.id === item.sub_category)?.category_name;
  //   });

  // }

  // delete(id: string) {
  //   this.classService.getClassList({ courseId: id }).subscribe((classList: any) => {
  //     const matchingClasses = classList.docs.filter((classItem: any) => {
  //       return classItem.courseId && classItem.courseId.id === id;
  //     });
  //     if (matchingClasses.length > 0) {
  //       Swal.fire({
  //         title: 'Error',
  //         text: 'Classes have been registered with this course. Cannot delete.',
  //         icon: 'error',
  //       });
  //       return;
  //     }

  //     Swal.fire({
  //       title: "Confirm Deletion",
  //       text: "Are you sure you want to delete?",
  //       icon: "warning",
  //       showCancelButton: true,
  //       confirmButtonColor: "#d33",
  //       cancelButtonColor: "#3085d6",
  //       confirmButtonText: "Delete",
  //       cancelButtonText: "Cancel",
  //     }).then((result) => {
  //       if (result.isConfirmed){
  //         this._courseService.deleteCourse(id).subscribe(() => {
  //           this.getFreeCoursesList();
  //           Swal.fire({
  //             title: 'Success',
  //             text: 'Course deleted successfully.',
  //             icon: 'success',
  //           });
  //         });
  //       }
  //     });

  //   });
  // }
}
