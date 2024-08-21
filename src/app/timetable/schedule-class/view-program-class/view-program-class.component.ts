import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenService } from '@core/service/authen.service';
import { AppConstants } from '@shared/constants/app.constants';
import { ProgramService } from 'app/admin/program/program.service';
import { ClassService } from 'app/admin/schedule-class/class.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-view-program-class',
  templateUrl: './view-program-class.component.html',
  styleUrls: ['./view-program-class.component.scss']
})
export class ViewProgramClassComponent {
  breadscrums = [
    {
      title: 'Schedule Class',
      items: ['Program Class'],
      active: 'View Program Class',
    },
  ];
  

  subscribeParams: any;
  classId: any;
  aboutData1: any;
  id?: number;
  isAdmin: boolean = false;
  isInstructor: boolean = false;
  commonRoles: any;
  edit = false;
  isDelete = false;

  constructor(private activatedRoute: ActivatedRoute,
    private _classService:ClassService,
    public programService: ProgramService,
    private router: Router,
    private authenService: AuthenService){
    this.subscribeParams = this.activatedRoute.params.subscribe((params:any) => {
      this.classId = params.id;
    });
  
  }
  ngOnInit() {
    const roleDetails =this.authenService.getRoleDetails()[0].menuItems
    let urlPath = this.router.url.split('/');
    const parentId = urlPath[urlPath.length - 4];
    const childId =  urlPath[urlPath.length - 3];
    let parentData = roleDetails.filter((item: any) => item.id == parentId);
    let childData = parentData[0].children.filter((item: any) => item.id == childId);
    let actions = childData[0].actions
    let editAction = actions.filter((item:any) => item.title == 'Edit')
    let deleteAction = actions.filter((item:any) => item.title == 'Delete')

    if(editAction.length >0){
      this.edit = true;
    }
    if(deleteAction.length >0){
      this.isDelete = true;
    }
    this.commonRoles = AppConstants
    this.loadData()
    let userType = localStorage.getItem('user_type');
    if (userType == AppConstants.ADMIN_USERTYPE ||  AppConstants.ADMIN_ROLE) {
      this.isAdmin = true;
    }
    if (userType == AppConstants.INSTRUCTOR_ROLE) {
      this.isInstructor = true;
    }
  }

  loadData(){
    this._classService.getProgramClassById(this.classId).subscribe((response:any)=>{
    this.aboutData1 = response;
  })
}
delete(id: string) {
  this.programService
    .getProgramClassList({ courseId: id })
    .subscribe((classList: any) => {
      const matchingClasses = classList.docs.filter((classItem: any) => {
        return classItem.courseId && classItem.courseId.id === id;
      });
      if (matchingClasses.length > 0) {
        Swal.fire({
          title: 'Error',
          text: 'Classes have been registered with program`. Cannot delete.',
          icon: 'error',
        });
        return;
      }
      Swal.fire({
        title: "Confirm Deletion",
        text: "Are you sure you want to delete this Class?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Delete",
        cancelButtonText: "Cancel",
      }).then((result) => {
        if (result.isConfirmed) {
          this.programService.deleteProgramClass(id).subscribe(() => {
            Swal.fire({
              title: 'Success',
              text: 'Class deleted successfully.',
              icon: 'success',
            });
            this.loadData();
            window.history.back();
          });
    }
    });
    });
}
}
