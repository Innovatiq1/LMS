import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Session, Student, StudentApproval, StudentPaginationModel } from '@core/models/class.model';
import { AuthenService } from '@core/service/authen.service';
import { CourseService } from '@core/service/course.service';
import { ClassService } from 'app/admin/schedule-class/class.service';
import * as moment from 'moment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-view-student-pending-list',
  templateUrl: './view-student-pending-list.component.html',
  styleUrls: ['./view-student-pending-list.component.scss']
})
export class ViewStudentPendingListComponent {
  breadscrums = [
    {
      title: 'Blank',
      items: ['Pending Programs'],
      active: 'View Pending Program',
    },
  ];
  classDataById: any;
  completedData: any;
  studentPaginationModel: StudentPaginationModel;
  courseId: any;
  response: any;
  edit = false;
  isDelete = false;

  constructor(private classService: ClassService,private courseService: CourseService,private _router: Router, private activatedRoute: ActivatedRoute,private authenService: AuthenService) {

    this.studentPaginationModel = {} as StudentPaginationModel;
    this.activatedRoute.params.subscribe((params: any) => {
      
      this.courseId = params.id;
      // if(this.courseId){
      //   this.getProgramByID(this.courseId);
      // }

    });
   
  }

    ngOnInit(): void {
      const roleDetails =this.authenService.getRoleDetails()[0].menuItems
    let urlPath = this._router.url.split('/');
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
      this.edit = true;
    }
    if(deleteAction.length >0){
      this.isDelete = true;
    }
      this.getCompletedClasses();
      if (this.courseId) {
        this.activatedRoute.params.subscribe((params: any) => {
          
          this.courseId = params.id;
          this.getCategoryByID(this.courseId);
        });
      }
    }

  getCompletedClasses() {
    this.classService
      .getProgramRegisteredClasses(this.studentPaginationModel.page, this.studentPaginationModel.limit)
      .subscribe((response: { docs: any; page: any; limit: any; totalDocs: any; }) => {
        this.completedData = response.docs;
      })
  }
  getCategories(id: string): void {
    
    this.getCategoryByID(id);
  }
  getCategoryByID(id: string) {
    this.courseService.getStudentProgramClassById(id).subscribe((response: any) => {
     this.classDataById = response?._id;
     this.response = response;
     // this.subCategory = response.subCategories;
     // if (response && response.data && response.data._id) {
     //   this.classDataById = response?._id;
     //   this.response = response.data;
     // } else {
      
     // }
   });
 }
 getCurrentUserId(): string {
  return JSON.parse(localStorage.getItem("user_data")!).user.id;
}
 changeStatus(element: Student, status:string) {
  let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
  let item: any = {
    approvedBy: this.getCurrentUserId(),
    approvedOn: moment().format("YYYY-MM-DD"),
    classId: element.classId._id,
    status,
    companyId:userId,
    coreprogramCourse:element.programId.coreprogramCourse,
    electiveprogramCourse:element.programId.electiveprogramCourse,
    studentId: element.studentId.id,
    session: this.getSessions(element)
  };

  Swal.fire({
    title: 'Are you sure?',
    text: 'Do you want to approve this program!',
    icon: 'warning',
    confirmButtonText: 'Yes',
    showCancelButton: true,
    cancelButtonColor: '#d33',
  }).then((result) => {
    if (result.isConfirmed){
      this.classService.saveApprovedProgramClasses(element.id, item).subscribe((response:any) => {
        Swal.fire({
          title: 'Success',
          text: 'Program approved successfully.',
          icon: 'success',
          // confirmButtonColor: '#d33',
        });
        // this.getCompletedClasses();
        window.history.back();
      });
      () => {
            Swal.fire({
              title: 'Error',
              text: 'Failed to approve course. Please try again.',
              icon: 'error',
              // confirmButtonColor: '#d33',
            });
          };
    }
  });

}

Status(element: Student, status:string) {
  let item: any = {
    approvedBy: this.getCurrentUserId(),
    approvedOn: moment().format("YYYY-MM-DD"),
    classId: element.classId._id,
    status,
    studentId: element.studentId.id,
    session: this.getSessions(element)
  };

  Swal.fire({
    title: 'Are you sure?',
    text: 'Do you want to withdraw this program!',
    icon: 'warning',
    confirmButtonText: 'Yes',
    showCancelButton: true,
    cancelButtonColor: '#d33',
  }).then((result) => {
    if (result.isConfirmed){
      this.classService.saveApprovedProgramClasses(element.id, item).subscribe((response:any) => {
        Swal.fire({
          title: 'Success',
          text: 'Program withdrawn successfully.',
          icon: 'success',
          // confirmButtonColor: '#526D82',
        });
        this.getCompletedClasses();
        this._router.navigate(['/admin/program/student-program/pending-program'])
      }, (error) => {
        Swal.fire({
          title: 'Error',
          text: 'Failed to withdraw prograam. Please try again.',
          icon: 'error',
          // confirmButtonColor: '#526D82',
        });
      });
    }
  });

 
}
getSessions(element: { classId: { sessions: any[]; }; }) {
  let sessions = element.classId?.sessions?.map((_: any, index: number) => {
    let session: Session = {} as Session;
    session.sessionNumber = index + 1;
    return session;
  });
  return sessions;
}
}
