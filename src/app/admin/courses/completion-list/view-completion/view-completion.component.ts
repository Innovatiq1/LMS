import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Session, Student, StudentApproval, StudentPaginationModel } from '@core/models/class.model';
import { AssessmentService } from '@core/service/assessment.service';
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
  breadscrums = [
    {
      title: 'Blank',
      items: ['Completed Courses'],
      active: 'View Completion Course',
    },
  ];

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
  constructor(private classService: ClassService,private courseService: CourseService,private _router: Router, private activatedRoute: ActivatedRoute,public _classService: ClassService, private assessmentService: AssessmentService) {

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
    this.breadscrums = [
      {
        title: 'Blank',
        items: ['Pending Courses'],
        active: 'View Pending Courses',
      },
    ];
  } else if(params['status'] === 'approved') {
    this.status = false;
    this.showTab = false;
    this.breadscrums = [
      {
        title: 'Blank',
        items: ['Approved Courses'],
        active: 'View Approved Courses',
      },
    ];
  } else if(params['status'] === 'completed'){
    this.showTab = true;
  }
  this.paramStatus =  params['status'];
      // if(this.courseId){
      //   this.getProgramByID(this.courseId);
      // }

    });
  }

    ngOnInit(): void {
      this.commonRoles = AppConstants
      this.getCompletedClasses();
      // if (this.courseId) {
      //   this.activatedRoute.params.subscribe((params: any) => {
          
      //     this.courseId = params.id;
          
      //   });
      // }
    }

  getCompletedClasses() {
    this.classService
      .getSessionCompletedStudent(this.studentPaginationModel.page, this.studentPaginationModel.limit)
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
              // confirmButtonColor: '#526D82',
            });
            window.history.back();
          }, (error) => {
                Swal.fire({
                  title: 'Error',
                  text: 'Failed to verify. Please try again.',
                  icon: 'error',
                  // confirmButtonColor: '#526D82',
                });
              });
        }
      });
  
    }  else {
      const item: StudentApproval = {
        approvedBy: this.getCurrentUserId(),
        approvedOn: moment().format('YYYY-MM-DD'),
        classId: element?.classId?._id || null,
        status,
        studentId: element.studentId.id,
        courseId:element.courseId._id,
        session: this.getSessions(element),
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
              // confirmButtonColor: '#526D82',
            });
            window.history.back();
          }, (error) => {
                Swal.fire({
                  title: 'Error',
                  text: 'Failed to approve course. Please try again.',
                  icon: 'error',
                  // confirmButtonColor: '#526D82',
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
        .saveApprovedClasses(element.id, item)
        .subscribe((response: any) => {
          Swal.fire({
            title: 'Success',
            text: 'Course Withdraw successfully.',
            icon: 'success',
            // confirmButtonColor: '#526D82',
          });
          this.getCompletedClasses();
          this._router.navigate(['/admin/courses/student-courses/pending-courses'])
        }, (error) => {
          Swal.fire({
            title: 'Error',
            text: 'Failed to approve course. Please try again.',
            icon: 'error',
            // confirmButtonColor: '#526D82',
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
    const studentId = this.response.studentId._id;
    const examAssessmentId = this.response.courseId.exam_assessment;
    const assessmentAnswerId = this.response.assessmentAnswer._id;
    const courseId = this.response.courseId._id;
    const requestBody = {
      studentId,
      examAssessmentId,
      assessmentAnswerId,
      courseId
    };

    this.assessmentService.assignExamAssessment(requestBody).subscribe(
      (response: any) => {
        Swal.fire({
          title: "Assigned!",
          text: "Exam Assigned Successfully!",
          icon: "success"
        });
      this.getCompletedClasses()
      },
      (error: any) => {
        console.error('Error:', error);
      }
    );
  }
}
