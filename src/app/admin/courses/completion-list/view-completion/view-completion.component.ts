import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Session, Student, StudentApproval, StudentPaginationModel } from '@core/models/class.model';
import { AssessmentService } from '@core/service/assessment.service';
import { AuthenService } from '@core/service/authen.service';
import { CourseService } from '@core/service/course.service';
import { AppConstants } from '@shared/constants/app.constants';
import { ClassService } from 'app/admin/schedule-class/class.service';
import * as moment from 'moment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-view-completion',
  templateUrl: './view-completion.component.html',
  styleUrls: ['./view-completion.component.scss']
})
export class ViewCompletionComponent {
  breadscrums :any[]= [];

  classDataById: any;
  completedData: any;
  studentPaginationModel: StudentPaginationModel;
  courseId: any;
  response: any;
  status:boolean = false;
  showTab:boolean = false;
  paramStatus: any;
  verify :boolean = false;
  commonRoles: any;
  discountDetails:any;
  isDiscount = false;
  edit = false;
  delete = false;
  storedItems: string | null;

  constructor(private classService: ClassService,private courseService: CourseService,private _router: Router, private activatedRoute: ActivatedRoute,public _classService: ClassService, private assessmentService: AssessmentService, 
    private authenService: AuthenService) {

      this.storedItems = localStorage.getItem('activeBreadcrumb');
    if (this.storedItems) {
     this.storedItems = this.storedItems.replace(/^"(.*)"$/, '$1');
     this.breadscrums = [
       {
         title: '', 
         items: [this.storedItems],  
         active: 'View Pending Courses',  
       },
     ];
   }
    this.studentPaginationModel = {} as StudentPaginationModel;
    this.activatedRoute.queryParams.subscribe((params: any) => {
      
      this.courseId = params['id'];
      this.getCategoryByID(this.courseId);
  if(params['status'] === 'pending') {
    this.status = true;
    this.showTab = false;
    if(params['verify'] === 'false') {
      this.verify = true;
    }
    // this.breadscrums = [
    //   {
    //     title: 'Blank',
    //     items: ['Pending Courses'],
    //     active: 'View Pending Courses',
    //   },
    // ];
  } else if(params['status'] === 'approved') {
    this.status = false;
    this.showTab = false;
    // this.breadscrums = [
    //   {
    //     title: 'Blank',
    //     items: ['Approved Courses'],
    //     active: 'View Approved Courses',
    //   },
    // ];
  } else if(params['status'] === 'completed'){
    this.showTab = true;
  }
  this.paramStatus =  params['status'];
    });
  }

  back(){
    window.history.back()
  }

    ngOnInit(): void {
      const roleDetails =this.authenService.getRoleDetails()[0].menuItems
      let urlPath = this._router.url.split('/');
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
        this.edit = true;
      }
      if(deleteAction.length >0){
        this.delete = true;
      }
      this.commonRoles = AppConstants
      this.getCompletedClasses();
    }

  getCompletedClasses() {
    let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
        this.classService
      .getSessionCompletedStudent(userId,this.studentPaginationModel.page, this.studentPaginationModel.limit)
      .subscribe((response: { docs: any; page: any; limit: any; totalDocs: any; }) => {
        this.completedData = response.docs;

      })
  }
  getCategories(id: string): void {
    
    this.getCategoryByID(id);
  }
  getCategoryByID(id: string) {
     this.courseService.getStudentClassById(id).subscribe((response: any) => {
      this.classDataById = response?._id;
      this.response = response;
      if(response.discount){
        this.isDiscount = true;
        this.courseService.getDiscountById(response.discount).subscribe(discountResponse => {
          this.discountDetails = discountResponse;
        })
      }
  
    });
  }

  getCurrentUserId(): string {
    return JSON.parse(localStorage.getItem('user_data')!).user.id;
  }
  changeStatus(element: Student, status: string) {
    if(status == 'verified'){
      const item = {
        classId: element?.classId?._id || null,
        studentId: element.studentId.id,
        studentEmail: element.studentId.email,
        courseId:element.courseId._id,
        verify:true
      };

  
      Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to verify this.!',
        icon: 'warning',
        confirmButtonText: 'Yes',
        showCancelButton: true,
        cancelButtonColor: '#d33',
      }).then((result) => {
        if (result.isConfirmed){
          this._classService
          .saveApprovedClasses(element._id, item)
          .subscribe((_response: any) => {
            Swal.fire({
              title: 'Success',
              text: 'Verified successfully.',
              icon: 'success',
            });
            window.history.back();
          }, (error) => {
                Swal.fire({
                  title: 'Error',
                  text: 'Failed to verify. Please try again.',
                  icon: 'error',
                });
              });
        }
      });
  
    }  else {
      const item = {
        approvedBy: this.getCurrentUserId(),
        approvedOn: moment().format('YYYY-MM-DD'),
        classId: element?.classId?._id || null,
        status,
        studentId: element.studentId.id,
        courseId:element.courseId._id,
        session: this.getSessions(element),
        approve:true
      };
  
      Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to approve this course!',
        icon: 'warning',
        confirmButtonText: 'Yes',
        showCancelButton: true,
        cancelButtonColor: '#d33',
      }).then((result) => {
        if (result.isConfirmed){
          this._classService
          .saveApprovedClasses(element._id, item)
          .subscribe((_response: any) => {
            Swal.fire({
              title: 'Success',
              text: 'Course approved successfully.',
              icon: 'success',
            });
            window.history.back();
          }, (error) => {
                Swal.fire({
                  title: 'Error',
                  text: 'Failed to approve course. Please try again.',
                  icon: 'error',
                });
              });
        }
      });
    }
 
  }
  Status(element: Student, status: string) {
    const item: StudentApproval = {
      approvedBy: this.getCurrentUserId(),
      approvedOn: moment().format('YYYY-MM-DD'),
      classId: element.classId._id,
      status,
      studentId: element.studentId.id,
      session: this.getSessions(element),
    };
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to withdraw this course!',
      icon: 'warning',
      confirmButtonText: 'Yes',
      showCancelButton: true,
      cancelButtonColor: '#d33',
    }).then((result) => {
      if (result.isConfirmed){
        this._classService
        .saveApprovedClasses(element._id, item)
        .subscribe((response: any) => {
          Swal.fire({
            title: 'Success',
            text: 'Course Withdraw successfully.',
            icon: 'success',
          });
          this.getCompletedClasses();
          this._router.navigate(['/admin/courses/student-courses/registered-pending-courses'])
        }, (error) => {
          Swal.fire({
            title: 'Error',
            text: 'Failed to approve course. Please try again.',
            icon: 'error',
          });
        });
      }
    });
  
  }

  
  getSessions(element: { classId: { sessions: any[] } }) {
    const sessions = element.classId?.sessions?.map((_: any, index: number) => {
      const session: Session = {} as Session;
      session.sessionNumber = index + 1;
      return session;
    });
    return sessions;
  }

  assignExam() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to assign Exam!',
      icon: 'warning',
      confirmButtonText: 'Yes',
      showCancelButton: true,
      cancelButtonColor: '#d33',
    }).then((result) => {
      if (result.isConfirmed) {
        this.addEmptyRecord();
      }
    });

  }

  addEmptyRecord(){
    const studentClassId=this.response._id;
    const studentId = this.response.studentId._id;
    const examAssessmentId = this.response.courseId.exam_assessment;
    const assessmentAnswerId = this.response.assessmentAnswer._id;
    const courseId = this.response.courseId._id;
    let companyId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;

    const requestBody = {
      studentId,
      examAssessmentId,
      assessmentAnswerId,
      studentClassId,
      companyId,
      courseId
    };

    this.assessmentService.assignExamAssessment(requestBody).subscribe(
      (response: any) => {
        Swal.fire({
          title: "Assigned!",
          text: "Exam Assigned Successfully!",
          icon: "success"
        });
        this.getCategoryByID(this.courseId);
        this.getCompletedClasses();
      },
      (error: any) => {
        console.error('Error:', error);
      }
    );
  }
}
