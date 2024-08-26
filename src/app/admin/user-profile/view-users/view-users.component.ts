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

@Component({
  selector: 'app-view-users',
  templateUrl: './view-users.component.html',
  styleUrls: ['./view-users.component.scss']
})
export class ViewUsersComponent {
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
  // currentId!: string;

  coursePaginationModel: Partial<CoursePaginationModel>;
  studentRegisteredModel!: Partial<CoursePaginationModel>;
  studentApprovedModel!: Partial<CoursePaginationModel>;
  studentCompletedModel!: Partial<CoursePaginationModel>;
  subscribeParams: any;
  currentId: any;
  
  constructor(private activeRoute:ActivatedRoute, 
    private StudentService:StudentsService,
    public _courseService:CourseService,  
    private classService: ClassService,
    private router : Router,
    public lecturesService: LecturesService,
    private userService: UserService,
    ) {

      this.coursePaginationModel = {};
      this.studentRegisteredModel = {};
      this.studentApprovedModel = {};
      this.studentCompletedModel = {};
   this.activeRoute.queryParams.subscribe(param =>{
   console.log("params:",param['data'])

   this.aboutDataId = param['data'];
   })
   this.activeRoute.queryParams.subscribe(param =>{
    console.log("params:",param['data'])
 
    this.aboutDataId1 = param['data'];
    })
    this.subscribeParams = this.activeRoute.params.subscribe((params:any) => {
      this.currentId = params.id;
    });
   
  }

  ngOnInit() {
   
    this.userService.getUserById(this.currentId).subscribe((response: any) => {
      this.userType = response.data.data.type
  
    // this.userType = localStorage.getItem("user_type")
    if(this.userType == 'Staff'){
      console.log("student", this.userType)
    this.loadData();
    this.getRegisteredCourse();
    this.getApprovedCourse();
    this.getCompletedCourse();
    this.getRegisteredProgram();
    this.getApprovedProgram();
    this.getCompletedProgram();
    this.isStudent = true;
    }
    if(this.userType == "IT Manager" || this.userType == "HR Manager" || this.userType == "Admin Manager" || this.userType == "Finance Manager"){
    this.loadData1();
    this.getClassList1();
    this.getProgramList1();
    this.isInstructor = true;
    }else{
      this.loadData1();
    }
    console.log("users", this.userType)
  })
  }


  loadData(){
    this.StudentService.getStudentById( this.currentId).subscribe(res => {
      this.aboutData = res;
      console.log("edit",this.aboutData)

    })
}
getRegisteredCourse(){
  // let studentId=localStorage.getItem('id')
  let filterRegisteredCourse = this.filterRegistered
  const payload = {  filterRegisteredCourse,studentId:  this.currentId, status: 'registered' ,...this.coursePaginationModel};
  this.classService.getStudentRegisteredClasses(payload).subscribe(response =>{
   this.studentRegisteredClasses = response.data.docs.length;
  })
}
getApprovedCourse(){
  // let studentId=localStorage.getItem('id')
  let filterApprovedCourse = this.filterApproved
  const payload = {  filterApprovedCourse,studentId:  this.currentId, status: 'approved' ,...this.coursePaginationModel};
  this.classService.getStudentRegisteredClasses(payload).subscribe(response =>{
   this.studentApprovedClasses = response.data.docs;
  })
}

getCompletedCourse(){
  // let studentId=localStorage.getItem('id')
  let filterCompletedCourse = this.filterCompleted
  const payload = {  filterCompletedCourse,studentId:  this.currentId, status: 'completed' ,...this.coursePaginationModel};
  this.classService.getStudentRegisteredClasses(payload).subscribe(response =>{
   this.studentCompletedClasses = response.data.docs;
  })
}



getRegisteredProgram(){
// let studentId=localStorage.getItem('id')
let filterRegisteredCourse = this.filterRegistered
const payload = {  filterRegisteredCourse,studentId: this.currentId, status: 'registered' ,...this.coursePaginationModel};
this.classService.getStudentRegisteredProgramClasses(payload).subscribe(response =>{
this.studentRegisteredPrograms = response.data.docs.length;
})
}
getApprovedProgram(){
// let studentId=localStorage.getItem('id')
let filterApprovedCourse = this.filterApproved
const payload = {  filterApprovedCourse,studentId:this.currentId, status: 'approved' ,...this.coursePaginationModel};
this.classService.getStudentRegisteredProgramClasses(payload).subscribe(response =>{
this.studentApprovedPrograms = response.data.docs;
})
}
getCompletedProgram(){
// let studentId=localStorage.getItem('id')
let filterCompletedCourse = this.filterCompleted
const payload = {  filterCompletedCourse,studentId: this.currentId, status: 'completed' ,...this.coursePaginationModel};
this.classService.getStudentRegisteredProgramClasses(payload).subscribe(response =>{
this.studentCompletedPrograms = response.data.docs;
})
}

editCall(row: Students) {
  console.log("edit",row)
  this.router.navigate(['/admin/users/add-student'],{queryParams:{id:row.id}})
}

deleteItem(row: any) {
  // this.id = row.id;
  console.log("kjkj",row);
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
           //this.fetchCourseKits();
           this.router.navigate(['/admin/user-profile/all-users'])
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
    console.log("edit",this.aboutData)

  })
}




getClassList1() {
//  let instructorId = localStorage.getItem('id')
this.lecturesService.getClassListWithPagination(this.currentId, this.filterName,{ ...this.coursePaginationModel }).subscribe(
  (response) => {
    //console.log("this",response.data.ssions)

    this.dataSource1 = response.data.docs;
    //this.mapClassList()
    this.dataSource = [];
    
  },
  (error) => {
  }
);


}
getProgramList1() {
// let instructorId = localStorage.getItem('id')
this.lecturesService.getClassListWithPagination1(this.currentId, this.filterName,{ ...this.coursePaginationModel }).subscribe(
 (response) => {
   //console.log("this",response.data.ssions)

   this.dataSource2 = response.data.docs;
   //this.mapClassList()
   this.dataSource = [];
   
 },
 (error) => {
 }
);


}
deleteItem1(row: any) {
// this.id = row.id;
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
        //this.fetchCourseKits();
        //this.instructorData()
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

cancel(){
  window.history.back();
}
}


