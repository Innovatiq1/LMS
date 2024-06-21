/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, ElementRef, ViewChild } from '@angular/core';
import { CourseService } from '@core/service/course.service';
import {  CoursePaginationModel, MainCategory, SubCategory } from '@core/models/course.model';
import Swal from 'sweetalert2';
import { ClassService } from 'app/admin/schedule-class/class.service';
import { MatTabChangeEvent } from '@angular/material/tabs';
@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss'],
})
export class CourseComponent {
  breadscrums = [
    {
      title: 'Enrollment',
      items: ['Enrollment'],
      active: 'Courses',
    },
  ];

  coursePaginationModel: Partial<CoursePaginationModel>;
  studentRegisteredModel!: Partial<CoursePaginationModel>;
  studentApprovedModel!: Partial<CoursePaginationModel>;
  studentCompletedModel!: Partial<CoursePaginationModel>;
  freeCourseModel!: Partial<CoursePaginationModel>;

  filterName='';
  filterRegistered='';
  filterApproved='';
  filterCompleted ='';
  classesData: any;
  pagination :any;
  totalItems: any;
  totalRegisteredItems: any;
  pageSizeArr = [10, 25, 50, 100];
  mainCategories!: MainCategory[];
  subCategories!: SubCategory[];
  allSubCategories!: SubCategory[];
  dataSource: any;
  studentRegisteredClasses: any;
  studentApprovedClasses: any;
  studentCompletedClasses: any;
  totalApprovedItems: any;
  totalCompletedItems: any;

  @ViewChild('filter', { static: true }) filter!: ElementRef;
  tab: number = 0;
  department: any;
  totalFreeItems: any;
  userGroupIds: string = '';


  constructor(public _courseService:CourseService,  private classService: ClassService) {
    this.coursePaginationModel = {};
    this.studentRegisteredModel = {};
    this.studentApprovedModel = {};
    this.studentCompletedModel = {};
    this.freeCourseModel = {};
    this.department= JSON.parse(localStorage.getItem('user_data')!).user.department;
    this.userGroupIds = (JSON.parse(localStorage.getItem('user_data')!).user.userGroup.map((v:any)=>v.id) || []).join()

  }

  ngOnInit(){
    this.getFreeCoursesList();
    this.getAllCourse();
    this.getRegisteredCourse();
    this.getApprovedCourse();
    this.getCompletedCourse();
  }

  tabChanged(event: MatTabChangeEvent) {
    if(event.index == 0){
      this.tab = 0
    } else if (event.index == 1){
      this.tab = 1
    } else if(event.index == 2){
      this.tab = 2
    } else if(event.index == 3){
      this.tab = 3
    }
  }
getAllCourse(){
  let filterText = this.filterName
  const payload = { filterText,...this.coursePaginationModel, status: 'open' ,department:this.department, userGroupId: this.userGroupIds}
  if(this.userGroupIds){
    payload.userGroupId=this.userGroupIds
  }
  let adminId= JSON.parse(localStorage.getItem('user_data')!).user.adminId;
  this.classService.getClassListWithPagination(payload,adminId).subscribe(response =>{
   this.classesData = response.data.docs;
   this.totalItems = response.data.totalDocs
   this.coursePaginationModel.docs = response.data.docs;
   this.coursePaginationModel.page = response.data.page;
   this.coursePaginationModel.limit = response.data.limit;
   this.coursePaginationModel.totalDocs = response.data.totalDocs;
   this.coursePaginationModel.page = 1; // Set the page to 1

  })
}


getRegisteredCourse(){
  let studentId=localStorage.getItem('id')
  let filterRegisteredCourse = this.filterRegistered
  const payload = {  filterRegisteredCourse,studentId: studentId, status: 'registered' ,...this.coursePaginationModel};
  this.classService.getStudentRegisteredClasses(payload).subscribe(response =>{
   this.studentRegisteredClasses = response.data.docs;
   this.totalRegisteredItems = response.data.totalDocs
   this.studentRegisteredModel.docs = response.data.docs;
   this.studentRegisteredModel.page = response.data.page;
   this.studentRegisteredModel.limit = response.data.limit;
   this.studentRegisteredModel.totalDocs = response.data.totalDocs;
  })
}
getApprovedCourse(){
  let studentId=localStorage.getItem('id')
  let filterApprovedCourse = this.filterApproved
  const payload = {  filterApprovedCourse,studentId: studentId, status: 'approved' ,...this.coursePaginationModel};
  this.classService.getStudentRegisteredClasses(payload).subscribe(response =>{
   this.studentApprovedClasses = response.data.docs;
   this.totalApprovedItems = response.data.totalDocs
   this.studentApprovedModel.docs = response.data.docs;
   this.studentApprovedModel.page = response.data.page;
   this.studentApprovedModel.limit = response.data.limit;
   this.studentApprovedModel.totalDocs = response.data.totalDocs;
  })
}

getCompletedCourse(){
  let studentId=localStorage.getItem('id')
  let filterCompletedCourse = this.filterCompleted
  const payload = {  filterCompletedCourse,studentId: studentId, status: 'completed' ,...this.coursePaginationModel};
  this.classService.getStudentRegisteredClasses(payload).subscribe(response =>{
   this.studentCompletedClasses = response.data.docs;
   this.totalCompletedItems = response.data.totalDocs
   this.studentCompletedModel.docs = response.data.docs;
   this.studentCompletedModel.page = response.data.page;
   this.studentCompletedModel.limit = response.data.limit;
   this.studentCompletedModel.totalDocs = response.data.totalDocs;
  })
}



pageSizeChange($event: any) {
  this.coursePaginationModel.page = $event?.pageIndex + 1;
  this.coursePaginationModel.limit = $event?.pageSize;
  this.getAllCourse();
}
pageStudentRegisteredSizeChange($event: any) {
  this.studentRegisteredModel.page = $event?.pageIndex + 1;
  this.studentRegisteredModel.limit = $event?.pageSize;
  this.getRegisteredCourse();
}
pageStudentApprovedSizeChange($event: any) {
  this.studentApprovedModel.page = $event?.pageIndex + 1;
  this.studentApprovedModel.limit = $event?.pageSize;
  this.getApprovedCourse();
}

pageStudentCompletedSizeChange($event: any) {
  this.studentCompletedModel.page = $event?.pageIndex + 1;
  this.studentCompletedModel.limit = $event?.pageSize;
  this.getCompletedCourse();
}
pagefreeCourseSizeChange($event: any) {
  this.freeCourseModel.page = $event?.pageIndex + 1;
  this.freeCourseModel.limit = $event?.pageSize;
  this.getFreeCoursesList();
}




private mapCategories(): void {
  this.coursePaginationModel.docs?.forEach((item) => {
    item.main_category_text = this.mainCategories.find((x) => x.id === item.main_category)?.category_name;
  });

  this.coursePaginationModel.docs?.forEach((item) => {
    item.sub_category_text = this.allSubCategories.find((x) => x.id === item.sub_category)?.category_name;
  });

}
getFreeCoursesList() {
  this._courseService.getAllCourses({ ...this.coursePaginationModel, status: 'active' ,feeType:'free'})
    .subscribe(response => {
      this.dataSource = response.data.docs;
      this.totalFreeItems = response.data.totalDocs
      this.freeCourseModel.docs = response.data.docs;
      this.freeCourseModel.page = response.data.page;
      this.freeCourseModel.limit = response.data.limit;
      this.freeCourseModel.totalDocs = response.data.totalDocs;
      this.mapCategories();
    }, (error) => {
    }
    )
}
delete(id: string) {
  this.classService.getClassList({ courseId: id }).subscribe((classList: any) => {
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
      title: "Confirm Deletion",
      text: "Are you sure you want to delete?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed){
        this._courseService.deleteCourse(id).subscribe(() => {
          this.getFreeCoursesList();
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


performSearch() {
    this.getAllCourse();
    this.getRegisteredCourse();
    this.getApprovedCourse();
    this.getCompletedCourse();
}

checkExpiry(dateString:string){
  const date = new Date(dateString);
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);
  return date < currentDate;
}

}
