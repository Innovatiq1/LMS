import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CoursePaginationModel } from '@core/models/course.model';
import { LecturesService } from 'app/teacher/lectures/lectures.service';
import * as moment from 'moment';
import { MatTableDataSource } from '@angular/material/table';
import { SessionModel } from '@core/models/class.model';
import Swal from 'sweetalert2';
import { TeachersService } from 'app/admin/teachers/teachers.service';
import { AppConstants } from '@shared/constants/app.constants';

@Component({
  selector: 'app-about-teacher',
  templateUrl: './about-teacher.component.html',
  styleUrls: ['./about-teacher.component.scss'],
})
export class AboutTeacherComponent {
  breadscrums = [
    {
      title: 'Profile',
      items: [`${AppConstants.INSTRUCTOR_ROLE}`],
      active: 'Profile',
    },
  ];
  aboutDataId: any;
  aboutData:any
  coursePaginationModel!: Partial<CoursePaginationModel>;
  dataSource1:any;
  dataSource2: any;
  dataSource: any[] = [];
  filterName='';
  myArray = new MatTableDataSource<SessionModel>([]);
  commonRoles: any;

  constructor(private activeRoute:ActivatedRoute, 
    // private StudentService:TeachersService,
    public lecturesService: LecturesService,
   private cdr: ChangeDetectorRef,
   public teachersService: TeachersService,) {
    this.coursePaginationModel = {};
    this.activeRoute.queryParams.subscribe(param =>{
    console.log("params:",param['data'])
 
    this.aboutDataId = param['data'];
    })
   }
 
   ngOnInit() {
     this.loadData();
   this.getClassList();
   this.getProgramList();
   this.commonRoles = AppConstants
   }
 
 
   loadData(){
     this.teachersService.getUserById( this.aboutDataId).subscribe(res => {
       this.aboutData = res;
       console.log("edit",this.aboutData)
 
     })
 }
 



 getClassList() {
  //  let instructorId = localStorage.getItem('id')
   this.lecturesService.getClassListWithPagination(this.aboutDataId, this.filterName,{ ...this.coursePaginationModel }).subscribe(
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
 getProgramList() {
  // let instructorId = localStorage.getItem('id')
  this.lecturesService.getClassListWithPagination1(this.aboutDataId, this.filterName,{ ...this.coursePaginationModel }).subscribe(
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
deleteItem(row: any) {
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
       this.teachersService.deleteUser(row.id).subscribe(
         () => {
           Swal.fire({
             title: "Deleted",
             text: "Instructor deleted successfully",
             icon: "success",
           });
           this.loadData()
           window.history.back();
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

