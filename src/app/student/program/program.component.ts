/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, ElementRef, ViewChild } from '@angular/core';
import { CourseService } from '@core/service/course.service';
import {  CoursePaginationModel, MainCategory, SubCategory } from '@core/models/course.model';
import Swal from 'sweetalert2';
import { ClassService } from 'app/admin/schedule-class/class.service';
import { MatTabChangeEvent } from '@angular/material/tabs';
@Component({
  selector: 'app-program',
  templateUrl: './program.component.html',
  styleUrls: ['./program.component.scss'],
})
export class ProgramComponent {
  breadscrums = [
    {
      title: 'Enrollment',
      items: ['Enrollment'],
      active: 'Programs',
    },
  ];
  tab: number = 0;
  coursePaginationModel: Partial<CoursePaginationModel>;
  studentRegisteredModel!: Partial<CoursePaginationModel>;
  studentApprovedModel!: Partial<CoursePaginationModel>;
  studentCompletedModel!: Partial<CoursePaginationModel>;

  @ViewChild('filter', { static: true }) filter!: ElementRef;
  filterName='';
  classesData: any;
  pagination :any;
  totalItems: any;
  pageSizeArr = [10, 25, 50, 100];
  mainCategories!: MainCategory[];
  subCategories!: SubCategory[];
  allSubCategories!: SubCategory[];
  dataSource: any;
  studentRegisteredClasses: any;
  totalRegisteredItems: any;
  studentApprovedClasses: any;
  studentCompletedClasses: any;
  totalApprovedItems: any;
  totalCompletedItems: any;
  filterRegistered='';
  filterApproved='';
  filterCompleted='';
  department: any;
  userGroupIds: string = '';

  constructor(public _courseService:CourseService,  private classService: ClassService) {
    this.coursePaginationModel = {};
    this.studentRegisteredModel = {};
    this.studentApprovedModel = {};
    this.studentCompletedModel = {};
    this.department= JSON.parse(localStorage.getItem('user_data')!).user.department;
    this.userGroupIds = (JSON.parse(localStorage.getItem('user_data')!).user.userGroup.map((v:any)=>v.id) || []).join()
  }

  ngOnInit(){
    this.getClassList();
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


getClassList() {
  let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
  let filterProgram = this.filterName
  const payload = { filterProgram,...this.coursePaginationModel, status: 'open' ,department:this.department};
  if(this.userGroupIds){
    payload.userGroupId=this.userGroupIds
  }
  this.classService.getProgramClassListWithPagination(userId,payload).subscribe(
    (response) => {
      this.dataSource = response.data.docs;
      this.totalItems = response.data.totalDocs
      this.coursePaginationModel.docs = response.data.docs;
      this.coursePaginationModel.page = response.data.page;
      this.coursePaginationModel.limit = response.data.limit;
      this.coursePaginationModel.page = 1; // Set the page to 1
    },
    (error) => {
    }
  );
}

performSearch() {
    this.getClassList();
    this.getRegisteredCourse();
    this.getApprovedCourse();
    this.getCompletedCourse();
}

getRegisteredCourse(){
  let studentId=localStorage.getItem('id')
  let filterRegisteredCourse = this.filterRegistered
  const payload = {  filterRegisteredCourse,studentId: studentId, status: 'registered' ,...this.coursePaginationModel};
  this.classService.getStudentRegisteredProgramClasses(payload).subscribe(response =>{
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
  this.classService.getStudentRegisteredProgramClasses(payload).subscribe(response =>{
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
  this.classService.getStudentRegisteredProgramClasses(payload).subscribe(response =>{
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
  this.getClassList();
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



}
