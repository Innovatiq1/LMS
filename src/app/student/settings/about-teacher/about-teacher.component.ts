import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CoursePaginationModel } from '@core/models/course.model';
import { LecturesService } from 'app/teacher/lectures/lectures.service';
import * as moment from 'moment';
import { MatTableDataSource } from '@angular/material/table';
import { SessionModel } from '@core/models/class.model';
import Swal from 'sweetalert2';
import { TeachersService } from 'app/admin/teachers/teachers.service';
import { AppConstants } from '@shared/constants/app.constants';
import { AuthenService } from '@core/service/authen.service';

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
  isEdit = false;
  isDelete = false;

  constructor(private activeRoute:ActivatedRoute, 
    public lecturesService: LecturesService,
   private cdr: ChangeDetectorRef,
   public teachersService: TeachersService,
   private router : Router,
   private authenService: AuthenService) {
    this.coursePaginationModel = {};
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
   this.getClassList();
   this.getProgramList();
   this.commonRoles = AppConstants
   }
 
 
   loadData(){
     this.teachersService.getUserById( this.aboutDataId).subscribe(res => {
       this.aboutData = res;
 
     })
 }
 



 getClassList() {
   this.lecturesService.getClassListWithPagination(this.aboutDataId, this.filterName,{ ...this.coursePaginationModel }).subscribe(
     (response) => {
       this.dataSource1 = response.data.docs;
       this.dataSource = [];
       
     },
     (error) => {
     }
   );
  
   
 }
 getProgramList() {
  this.lecturesService.getClassListWithPagination1(this.aboutDataId, this.filterName,{ ...this.coursePaginationModel }).subscribe(
    (response) => {
 
      this.dataSource2 = response.data.docs;
      this.dataSource = [];
      
    },
    (error) => {
    }
  );
 
  
}
deleteItem(row: any) {
  console.log("rowdata",row)
  console.log("rowdata",row.trainerId)
  // this.id = row.id;
  const payLoad:any ={
    userId:row.id,
    trainerId:row.trainerId,
    action:"delete"
  }
   Swal.fire({
     title: "Confirm Deletion",
     text: `Are you sure you want to delete this ${row.role}?`,
     icon: "warning",
     showCancelButton: true,
     confirmButtonColor: "#d33",
     cancelButtonColor: "#3085d6",
     confirmButtonText: "Delete",
     cancelButtonText: "Cancel",
   }).then((result) => {
     if (result.isConfirmed) {
       this.teachersService.deleteUser(row.id,payLoad).subscribe(
         () => {
           Swal.fire({
             title: "Deleted",
             text: `${row.role} deleted successfully`,
             icon: "success",
           });
           this.loadData()
           window.history.back();
         },
         (error: { message: any; error: any; }) => {
           Swal.fire(
             `Failed to delete  ${row.role}`,
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


confirmItem(row: any) {
  
  Swal.fire({
    title: "Confirm Active",
    text: `Are you sure you want to activate this ${row.role}?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Active",
    cancelButtonText: "Cancel",
  }).then((result) => {
    if (result.isConfirmed) {
      this.teachersService.confrim(row.id,row.type).subscribe(
        () => {
          Swal.fire({
            title: "Active",
            text: `${row.role} Activated successfully`,
            icon: "success",
          });
          this.loadData();
          window.history.back();
        },
        (error: { message: any; error: any; }) => {
          Swal.fire(
            `Failed to Activate ${row.role}`,
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
      this.teachersService.deActiveconfrim(row.id,row.type).subscribe(
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
 }

