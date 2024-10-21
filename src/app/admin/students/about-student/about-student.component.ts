import { ActivatedRoute, Router } from '@angular/router';
import { Component } from '@angular/core';
import { CourseService } from '@core/service/course.service';
import { ClassService } from 'app/admin/schedule-class/class.service';
import { CoursePaginationModel } from '@core/models/course.model';
import Swal from 'sweetalert2';
import { Students } from '../students.model';
import { StudentsService } from '../students.service';

@Component({
  selector: 'app-about-student',
  templateUrl: './about-student.component.html',
  styleUrls: ['./about-student.component.scss'],
})
export class AboutStudentComponent {
  breadscrums = [
    {
      title: 'Profile',
      items: ['Student'],
      active: 'Profile',
    },
  ];
  aboutDataId:any;
  aboutData:any;
  studentRegisteredClasses: any;
  studentApprovedClasses: any;
  studentCompletedClasses: any;
  studentRegisteredPrograms: any;
  studentApprovedPrograms: any;
  studentCompletedPrograms: any;
  filterRegistered='';
  filterApproved='';
  filterCompleted ='';
  totalRegisteredItems: any;
  totalApprovedItems: any;
  totalCompletedItems: any;
  students?: Students;

  coursePaginationModel: Partial<CoursePaginationModel>;
  studentRegisteredModel!: Partial<CoursePaginationModel>;
  studentApprovedModel!: Partial<CoursePaginationModel>;
  studentCompletedModel!: Partial<CoursePaginationModel>;
  
  constructor(private activeRoute:ActivatedRoute, 
    private StudentService:StudentsService,
    public _courseService:CourseService,  
    private classService: ClassService,
    private router : Router
    ) {

      this.coursePaginationModel = {};
      this.studentRegisteredModel = {};
      this.studentApprovedModel = {};
      this.studentCompletedModel = {};
   this.activeRoute.queryParams.subscribe(param =>{

   this.aboutDataId = param['data'];
   })
  }

  ngOnInit() {
    this.loadData();
    this.getRegisteredCourse();
    this.getApprovedCourse();
    this.getCompletedCourse();
    this.getRegisteredProgram();
    this.getApprovedProgram();
    this.getCompletedProgram();
  }


  loadData(){
    this.StudentService.getStudentById( this.aboutDataId).subscribe(res => {
      this.aboutData = res;

    })
}
getRegisteredCourse(){
  // let studentId=localStorage.getItem('id')
  let filterRegisteredCourse = this.filterRegistered
  const payload = {  filterRegisteredCourse,studentId:  this.aboutDataId, status: 'registered' ,...this.coursePaginationModel};
  this.classService.getStudentRegisteredClasses(payload).subscribe(response =>{
   this.studentRegisteredClasses = response.data.docs.length;
  })
}
getApprovedCourse(){
  // let studentId=localStorage.getItem('id')
  let filterApprovedCourse = this.filterApproved
  const payload = {  filterApprovedCourse,studentId:  this.aboutDataId, status: 'approved' ,...this.coursePaginationModel};
  this.classService.getStudentRegisteredClasses(payload).subscribe(response =>{
   this.studentApprovedClasses = response.data.docs;
  })
}

getCompletedCourse(){
  // let studentId=localStorage.getItem('id')
  let filterCompletedCourse = this.filterCompleted
  const payload = {  filterCompletedCourse,studentId:  this.aboutDataId, status: 'completed' ,...this.coursePaginationModel};
  this.classService.getStudentRegisteredClasses(payload).subscribe(response =>{
   this.studentCompletedClasses = response.data.docs;
  })
}



getRegisteredProgram(){
// let studentId=localStorage.getItem('id')
let filterRegisteredCourse = this.filterRegistered
const payload = {  filterRegisteredCourse,studentId: this.aboutDataId, status: 'registered' ,...this.coursePaginationModel};
this.classService.getStudentRegisteredProgramClasses(payload).subscribe(response =>{
this.studentRegisteredPrograms = response.data.docs.length;
})
}
getApprovedProgram(){
// let studentId=localStorage.getItem('id')
let filterApprovedCourse = this.filterApproved
const payload = {  filterApprovedCourse,studentId: this.aboutDataId, status: 'approved' ,...this.coursePaginationModel};
this.classService.getStudentRegisteredProgramClasses(payload).subscribe(response =>{
this.studentApprovedPrograms = response.data.docs;
})
}
getCompletedProgram(){
// let studentId=localStorage.getItem('id')
let filterCompletedCourse = this.filterCompleted
const payload = {  filterCompletedCourse,studentId: this.aboutDataId, status: 'completed' ,...this.coursePaginationModel};
this.classService.getStudentRegisteredProgramClasses(payload).subscribe(response =>{
this.studentCompletedPrograms = response.data.docs;
})
}

editCall(row: Students) {
  this.router.navigate(['/admin/users/add-student'],{queryParams:{id:row.id}})
}

deleteItem(row: any) {
  // this.id = row.id;
   Swal.fire({
     title: "Confirm Deletion",
     text: "Are you sure you want to delete this Student?",
     icon: "warning",
     showCancelButton: true,
     confirmButtonColor: "#d33",
     cancelButtonColor: "#3085d6",
     confirmButtonText: "Delete",
     cancelButtonText: "Cancel",
   }).then((result) => {
     if (result.isConfirmed) {
       this.StudentService.deleteUser(row.id).subscribe(
         () => {
           Swal.fire({
             title: "Deleted",
             text: "Student deleted successfully",
             icon: "success",
           });
           //this.fetchCourseKits();
           this.loadData()
           window.history.back();
          //  this.router.navigate(['/admin/users/all-students'])
         },
         (error: { message: any; error: any; }) => {
           Swal.fire(
             "Failed to delete Student",
             error.message || error.error,
             "error"
           );
         }
       );
     }
   });

 }
 confirmItem(row: any) {


  // this.id = row.id;
   Swal.fire({
     title: "Confirm Active",
     text: "Are you sure you want to active this Student?",
     icon: "warning",
     showCancelButton: true,
     confirmButtonColor: "#d33",
     cancelButtonColor: "#3085d6",
     confirmButtonText: "Active",
     cancelButtonText: "Cancel",
   }).then((result) => {
     if (result.isConfirmed) {
       this.StudentService.confrim(row.id).subscribe(
         () => {
           Swal.fire({
             title: "Active",
             text: "Student Active successfully",
             icon: "success",
           });
           //this.fetchCourseKits();
           this.loadData();
           window.history.back();
         },
         (error: { message: any; error: any; }) => {
           Swal.fire(
             "Failed to Active Student",
             error.message || error.error,
             "error"
           );
         }
       );
     }
   });

 }
}



