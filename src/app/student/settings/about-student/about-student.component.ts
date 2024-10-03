import { ActivatedRoute, Router } from '@angular/router';
import { Component } from '@angular/core';
import { CourseService } from '@core/service/course.service';
import { ClassService } from 'app/admin/schedule-class/class.service';
import { CoursePaginationModel } from '@core/models/course.model';
import Swal from 'sweetalert2';
import { Students } from 'app/admin/students/students.model';
import { StudentsService } from 'app/admin/students/students.service';
import { AppConstants } from '@shared/constants/app.constants';
import { AuthenService } from '@core/service/authen.service';

@Component({
  selector: 'app-about-student',
  templateUrl: './about-student.component.html',
  styleUrls: ['./about-student.component.scss'],
})
export class AboutStudentComponent {
  breadscrums = [
    {
      title: 'Profile',
      items: [`${AppConstants.STUDENT_ROLE}`],
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
  commonRoles: any;
  isEdit = false;
  isDelete = false;

  constructor(private activeRoute:ActivatedRoute, 
    private StudentService:StudentsService,
    public _courseService:CourseService,  
    private classService: ClassService,
    private router : Router,
    private authenService: AuthenService
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
    const roleDetails =this.authenService.getRoleDetails()[0].settingsMenuItems
    let urlPath = this.router.url.split('/');
    const parentId = `${urlPath[1]}/${urlPath[2]}`;
    const childId =  urlPath[urlPath.length - 3];
    const subChildId =  urlPath[urlPath.length - 2];
    let parentData = roleDetails.filter((item: any) => item.id == parentId);
    let childData = parentData[0].children.filter((item: any) => item.id == childId);
    let subChildData = childData[0].children.filter((item: any) => item.id == subChildId);
    let actions = subChildData[0].actions
    let editAction = actions.filter((item:any) => item.title == 'Edit')
    let deleteAction = actions.filter((item:any) => item.title == 'Delete')

    if(editAction.length >0){
      this.isEdit = true;
    }
    if(deleteAction.length >0){
      this.isDelete = true;
    }
    this.loadData();
    this.getRegisteredCourse();
    this.getApprovedCourse();
    this.getCompletedCourse();
    this.getRegisteredProgram();
    this.getApprovedProgram();
    this.getCompletedProgram();
    this.commonRoles = AppConstants
  }


  loadData(){
    this.StudentService.getStudentById( this.aboutDataId).subscribe(res => {
      this.aboutData = res;

    })
}
getRegisteredCourse(){
  let filterRegisteredCourse = this.filterRegistered
  const payload = {  filterRegisteredCourse,studentId:  this.aboutDataId, status: 'registered' ,...this.coursePaginationModel};
  this.classService.getStudentRegisteredClasses(payload).subscribe(response =>{
   this.studentRegisteredClasses = response.data.docs.length;
  })
}
getApprovedCourse(){
  let filterApprovedCourse = this.filterApproved
  const payload = {  filterApprovedCourse,studentId:  this.aboutDataId, status: 'approved' ,...this.coursePaginationModel};
  this.classService.getStudentRegisteredClasses(payload).subscribe(response =>{
   this.studentApprovedClasses = response.data.docs;
  })
}

getCompletedCourse(){
  let filterCompletedCourse = this.filterCompleted
  const payload = {  filterCompletedCourse,studentId:  this.aboutDataId, status: 'completed' ,...this.coursePaginationModel};
  this.classService.getStudentRegisteredClasses(payload).subscribe(response =>{
   this.studentCompletedClasses = response.data.docs;
  })
}



getRegisteredProgram(){
let filterRegisteredCourse = this.filterRegistered
const payload = {  filterRegisteredCourse,studentId: this.aboutDataId, status: 'registered' ,...this.coursePaginationModel};
this.classService.getStudentRegisteredProgramClasses(payload).subscribe(response =>{
this.studentRegisteredPrograms = response.data.docs.length;
})
}
getApprovedProgram(){
let filterApprovedCourse = this.filterApproved
const payload = {  filterApprovedCourse,studentId: this.aboutDataId, status: 'approved' ,...this.coursePaginationModel};
this.classService.getStudentRegisteredProgramClasses(payload).subscribe(response =>{
this.studentApprovedPrograms = response.data.docs;
})
}
getCompletedProgram(){
let filterCompletedCourse = this.filterCompleted
const payload = {  filterCompletedCourse,studentId: this.aboutDataId, status: 'completed' ,...this.coursePaginationModel};
this.classService.getStudentRegisteredProgramClasses(payload).subscribe(response =>{
this.studentCompletedPrograms = response.data.docs;
})
}

editCall(row: Students) {
  this.router.navigate(['/student/settings/add-student'],{queryParams:{id:row.id}})
}

deleteItem(row: any) {
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
           this.loadData()
           window.history.back();
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
       this.StudentService.confrim(row.id,row.type).subscribe(
         () => {
           Swal.fire({
             title: "Active",
             text: "Student Active successfully",
             icon: "success",
           });
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
 deactiveconfirmItem(row: any) {
  Swal.fire({
    title: "Confirm InActive",
    text: "Are you sure you want to in-active?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "In-Active",
    cancelButtonText: "Cancel",
  }).then((result) => {
    if (result.isConfirmed) {
      this.StudentService.deActiveconfrim(row.id,row.type).subscribe(
        () => {
          Swal.fire({
            title: "Active",
            text: "In-Active successfully",
            icon: "success",
          });
          this.loadData()
        },
        (error: { message: any; error: any; }) => {
          Swal.fire(
            "Failed to In-Active",
            error.message || error.error,
            "error"
          );
        }
      );
    }
  });

}
 cancel(){
  window.history.back();
 }
}



