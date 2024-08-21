import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { CourseService } from '@core/service/course.service';
import { ClassService } from 'app/admin/schedule-class/class.service';
import { CoursePaginationModel } from '@core/models/course.model';
import Swal from 'sweetalert2';
import { SessionModel } from '@core/models/class.model';
import { MatTableDataSource } from '@angular/material/table';
import { LecturesService } from 'app/teacher/lectures/lectures.service';
import { UserService } from '@core/service/user.service';
import { Students } from 'app/admin/students/students.model';
import { StudentsService } from 'app/admin/students/students.service';
import { AppConstants } from '@shared/constants/app.constants';
import { AuthenService } from '@core/service/authen.service';

@Component({
  selector: 'app-view-users',
  templateUrl: './view-users.component.html',
  styleUrls: ['./view-users.component.scss']
})
export class ViewUsersComponent implements OnInit{
  breadscrums = [
    {
      title: 'Profile',
      items: ['Users'],
      active: 'Profile',
    },
  ];
  aboutDataId:any;
  aboutDataId1:any;
  aboutData:any;
  aboutData1:any;
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
  isStudent: boolean = false;
  isInstructor: boolean = false;
  dataSource1:any;
  dataSource2: any;
  dataSource: any[] = [];
  filterName='';
  myArray = new MatTableDataSource<SessionModel>([]);
  userType: any;

  coursePaginationModel: Partial<CoursePaginationModel>;
  studentRegisteredModel!: Partial<CoursePaginationModel>;
  studentApprovedModel!: Partial<CoursePaginationModel>;
  studentCompletedModel!: Partial<CoursePaginationModel>;
  subscribeParams: any;
  currentId: any;
  commonRoles: any;
  isEdit = false;
  isDelete = false;
  
  constructor(private activeRoute:ActivatedRoute, 
    private StudentService:StudentsService,
    public _courseService:CourseService,  
    private classService: ClassService,
    private router : Router,
    public lecturesService: LecturesService,
    private userService: UserService,
    private authenService: AuthenService
    ) {

      this.coursePaginationModel = {};
      this.studentRegisteredModel = {};
      this.studentApprovedModel = {};
      this.studentCompletedModel = {};
   this.activeRoute.queryParams.subscribe(param =>{

   this.aboutDataId = param['data'];
   })
   this.activeRoute.queryParams.subscribe(param =>{
 
    this.aboutDataId1 = param['data'];
    })
    this.subscribeParams = this.activeRoute.params.subscribe((params:any) => {
      this.currentId = params.id;
    });
   
  }

  ngOnInit() {
    const roleDetails =this.authenService.getRoleDetails()[0].settingsMenuItems
    let urlPath = this.router.url.split('/');
    const parentId = `${urlPath[1]}/${urlPath[2]}`;
    const childId =  urlPath[urlPath.length - 4];
    const subChildId =  urlPath[urlPath.length - 3];
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
    this.commonRoles = AppConstants
    this.userService.getUserById(this.currentId).subscribe((response: any) => {
      this.userType = response.data.data.type
    if(this.userType == AppConstants.STUDENT_ROLE){
    this.loadData();
    this.getRegisteredCourse();
    this.getApprovedCourse();
    this.getCompletedCourse();
    this.getRegisteredProgram();
    this.getApprovedProgram();
    this.getCompletedProgram();
    this.isStudent = true;
    }
    if(this.userType == AppConstants.INSTRUCTOR_ROLE){
    this.loadData1();
    this.getClassList1();
    this.getProgramList1();
    this.isInstructor = true;
    }else{
      this.loadData1();
    }
  })
  }


  loadData(){
    this.StudentService.getStudentById( this.currentId).subscribe(res => {
      this.aboutData = res;

    })
}
getRegisteredCourse(){
  let filterRegisteredCourse = this.filterRegistered
  const payload = {  filterRegisteredCourse,studentId:  this.currentId, status: 'registered' ,...this.coursePaginationModel};
  this.classService.getStudentRegisteredClasses(payload).subscribe(response =>{
   this.studentRegisteredClasses = response.data.docs.length;
  })
}
getApprovedCourse(){
  let filterApprovedCourse = this.filterApproved
  const payload = {  filterApprovedCourse,studentId:  this.currentId, status: 'approved' ,...this.coursePaginationModel};
  this.classService.getStudentRegisteredClasses(payload).subscribe(response =>{
   this.studentApprovedClasses = response.data.docs;
  })
}

getCompletedCourse(){
  let filterCompletedCourse = this.filterCompleted
  const payload = {  filterCompletedCourse,studentId:  this.currentId, status: 'completed' ,...this.coursePaginationModel};
  this.classService.getStudentRegisteredClasses(payload).subscribe(response =>{
   this.studentCompletedClasses = response.data.docs;
  })
}



getRegisteredProgram(){
let filterRegisteredCourse = this.filterRegistered
const payload = {  filterRegisteredCourse,studentId: this.currentId, status: 'registered' ,...this.coursePaginationModel};
this.classService.getStudentRegisteredProgramClasses(payload).subscribe(response =>{
this.studentRegisteredPrograms = response.data.docs.length;
})
}
getApprovedProgram(){
let filterApprovedCourse = this.filterApproved
const payload = {  filterApprovedCourse,studentId:this.currentId, status: 'approved' ,...this.coursePaginationModel};
this.classService.getStudentRegisteredProgramClasses(payload).subscribe(response =>{
this.studentApprovedPrograms = response.data.docs;
})
}
getCompletedProgram(){
let filterCompletedCourse = this.filterCompleted
const payload = {  filterCompletedCourse,studentId: this.currentId, status: 'completed' ,...this.coursePaginationModel};
this.classService.getStudentRegisteredProgramClasses(payload).subscribe(response =>{
this.studentCompletedPrograms = response.data.docs;
})
}

editCall(row: Students) {
  this.router.navigate(['/admin/users/add-student'],{queryParams:{id:row.id}})
}

deleteItem(row: any) {
   Swal.fire({
     title: "Confirm Deletion",
     text: "Are you sure you want to delete this user?",
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
             text: "User deleted successfully",
             icon: "success",
           });
           this.router.navigate(['/student/settings/all-users'])
           this.loadData()
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
       this.StudentService.confrim(row.id).subscribe(
         () => {
           Swal.fire({
             title: "Active",
             text: "Student Active successfully",
             icon: "success",
           });
           this.loadData()
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
 loadData1(){
  this._courseService.getUserById( this.currentId).subscribe(res => {
    this.aboutData1 = res;

  })
}
getClassList1() {
this.lecturesService.getClassListWithPagination(this.currentId, this.filterName,{ ...this.coursePaginationModel }).subscribe(
  (response) => {
    this.dataSource1 = response.data.docs;
    this.dataSource = [];
  },
  (error) => {
  }
);
}
getProgramList1() {
this.lecturesService.getClassListWithPagination1(this.currentId, this.filterName,{ ...this.coursePaginationModel }).subscribe(
 (response) => {
   this.dataSource2 = response.data.docs;
   this.dataSource = [];
   
 },
 (error) => {
 }
);


}
deleteItem1(row: any) {
Swal.fire({
  title: "Confirm Deletion",
  text: "Are you sure you want to delete this Instructor?",
  icon: "warning",
  showCancelButton: true,
  confirmButtonColor: "#d33",
  cancelButtonColor: "#3085d6",
  confirmButtonText: "Delete",
  cancelButtonText: "Cancel",
}).then((result) => {
  if (result.isConfirmed) {
    this._courseService.deleteUser(row.id).subscribe(
      () => {
        Swal.fire({
          title: "Deleted",
          text: "Instructor deleted successfully",
          icon: "success",
        });
        this.loadData()
      },
      (error: { message: any; error: any; }) => {
        Swal.fire(
          "Failed to delete  Instructor",
          error.message || error.error,
          "error"
        );
      }
    );
  }
});

}
getStatusClass(classDeliveryType: string): string {
return classDeliveryType === 'online' ? 'success' : 'fail';
}
}
