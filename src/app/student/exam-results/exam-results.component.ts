import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AssessmentQuestionsPaginationModel } from '@core/models/assessment-answer.model'
import { UtilsService } from '@core/service/utils.service';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { AssessmentService } from '@core/service/assessment.service';
import { SettingsService } from '@core/service/settings.service';
import Swal from 'sweetalert2';
import { AppConstants } from '@shared/constants/app.constants';

@Component({
  selector: 'app-exam-results',
  templateUrl: './exam-results.component.html',
  styleUrls: ['./exam-results.component.scss']
})
export class ExamResultsComponent {
  displayedColumns: string[] = [
    'Course Title',
    'Exam Name',
    'Exam Score',
    'Submitted At',
    'Retakes left',
    'Exam',
    'Request Retake'
  ];

  breadscrums = [
    {
      title: 'Exam Results',
      items: ['Course'],
      active: 'Exam Results',
    },
  ];

  assessmentPaginationModel!: Partial<AssessmentQuestionsPaginationModel>;
  totalItems: any;
  pageSizeArr = this.utils.pageSizeArr;
  id: any;
  selection = new SelectionModel<any>(true, []);
  dataSource :any;
  studentClassId:any;

  isCertIssued:boolean=true;
  retakeRequestData:any;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild('filter', { static: true }) filter!: ElementRef;
  

  constructor(public utils: UtilsService, 
    private assessmentService: AssessmentService,
    private settingService:SettingsService,
    public router: Router){
    this.assessmentPaginationModel = {};
  }

  ngOnInit() {
    this.getAllAnswers()
   }

   getAllAnswers() {
    let studentId = localStorage.getItem('id')||'';
    let role = localStorage.getItem('user_type');
    let payload = {...this.assessmentPaginationModel}
    if (role == AppConstants.STUDENT_ROLE) {
          payload.studentId = studentId;
    } 
    this.assessmentService.getLatestExamAnswers( {...this.assessmentPaginationModel, studentId})
      .subscribe(res => {
        this.studentClassId=res?.data?.docs[0]?.studentClassId?._id;
        this.dataSource = res.data.docs;
        this.totalItems = res.data.totalDocs;
        this.assessmentPaginationModel.docs = res.docs;
        this.assessmentPaginationModel.page = res.page;
        this.assessmentPaginationModel.limit = res.limit;
        this.dataSource.forEach((row: any) => {
          if (row.retakeLeft === 0 && !row.studentClassId.certificate) {
            this.getRetakeRequestsDatas(row);
          }
        });
      })
  }
  // handleRetakeTest(row: any) {
  //   this.getRetakeRequestdata(row);
  //   console.log("response Data after Exam:",this.retakeRequestData)
  //     this.navigateToRetakeTest(row);
  // }
  handleRetakeTest(row: any) {
    this.getRetakeRequestdata(row)
      .subscribe((response) => {
        if (response?.data && response.data[0]?.retakes === 1) {
          this.updateRetakeRequestdata(response, row.studentId.id, row.courseId._id);
          
        }
      });
      this.navigateToRetakeTest(row);
  }
  getRetakeRequestdata(row: any) {
    const studentId = row.studentId.id;
    const courseId = row.courseId._id;
  
    // Fetch retake request data by student and course ID
    return this.settingService.getRetakeRequestByStudentIdAndCourseId(studentId, courseId);
  }

  updateRetakeRequestdata(response: any, studentId: any, courseId: any) {
    response.data[0].retakes = 0;
  
    const payload = response.data[0];
    this.settingService.putRetakeRequestByStudentIdCourseId(studentId, courseId, payload)
      .subscribe((updateResponse) => {
        console.log("Retake request updated:", updateResponse);
      });
  }

  navigateToRetakeTest(row: any) {
    
    this.router.navigate(['/student/exam-questions/',
      this.studentClassId,
      row.id,
      row.studentId.id,
      row.courseId._id,
      row.examAssessmentId.id
    ], { queryParams: { retake: false } });
  }
  
  pageSizeChange($event: any) {
    this.assessmentPaginationModel.page = $event?.pageIndex + 1;
    this.assessmentPaginationModel.limit = $event?.pageSize;
    this.getAllAnswers();
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.forEach((row: any) =>
          this.selection.select(row)
        );
  }
  getRetakeRequestsDatas(row: any) {
    const studentId = row.studentId.id;
    const courseId = row.courseId._id;
  
    this.settingService.getRetakeRequestByStudentIdAndCourseId(studentId, courseId)
      .subscribe((response) => {
      
        if (response?.data && response.data[0]?.retakes === 1) {
          this.retakeRequestData=response.data[0];
          row.retakeLeft = 1;
          row.enableRetakeTest = true;
        } else {
          row.enableRetakeTest = false;
        }
      });
  }

  // updateRetakeRequestdata(response:any,studentId:any,courseId:any){
  //   response.data[0].retakes=0;
  //   const payload=response.data[0]
  
  //   this.settingService.putRetakeRequestByStudentIdCourseId(studentId,courseId,payload).subscribe((response)=>{
  //     console.log("response updateRetakeRequest=",response)

  //   })
  // }
  
  // getRetakeRequestdata(row:any){
  //   const studnetId=row.studentId.id;
  //     const courseId=row.courseId._id;
  //   this.settingService.getRetakeRequestByStudentIdAndCourseId(studnetId,courseId).subscribe((response)=>{
  //     console.log("response exam ==",response)
  //   })
  // }

  // onRequestRetake(row:any){
  //   console.log("exam Row=",row);
  //   // console.log("row",row)
  //   console.log("assessmentId",row.examAssessmentId._id)
  //   console.log("courseId",row.courseId._id)
  //   console.log("courseName",row.courseId.title)
  //   console.log("companyId",row.companyId)
  //   console.log("studetnId",row.studentId._id)
  //   console.log("studentName",row.studentId.name)
  //   console.log("examType",'assessment')
  //   let payload={
  //     "assessmentId":row.examAssessmentId._id,
  //     "courseId":row.courseId._id,
  //     "courseName":row.courseId.title,
  //     "companyId":row.companyId,
  //     "studentId":row.studentId._id,
  //     "studentName":row.studentId.name,
  //     "examType":"exam",
  //     "requestStatus":"requested",
  //     "retakes":0

  //   }
  //   this.settingService.saveRetakeRequest(payload).subscribe(
  //     (response) => {
  //     Swal.fire({
  //       title: 'Request Retake',
  //       text: 'Are you sure you want to request a retake for this assessment?',
  //       icon: 'question',
  //       showCancelButton: true,
  //       confirmButtonText: 'Yes, request retake!',
  //       cancelButtonText: 'Cancel',
  //     })
  //   })

  // }
  onRequestRetake(row: any) {
    Swal.fire({
      title: 'Request Retake',
      text: 'Are you sure you want to request a retake for this assessment?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, request retake!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        const payload = {
          assessmentId: row.examAssessmentId._id,
          courseId: row.courseId._id,
          courseName: row.courseId.title,
          companyId: row.companyId,
          studentId: row.studentId._id,
          studentName: row.studentId.name,
          examType: 'exam',
          requestStatus: 'requested',
          retakes: 0,
        };
  
        this.settingService.saveRetakeRequest(payload).subscribe(
          (response) => {
            if (response.message) {
              Swal.fire({
                icon: 'info',
                title: 'Request Status',
                text: response.message,
              });
            } else {
              Swal.fire({
                icon: 'success',
                title: 'Retake Requested',
                text: 'Your retake request has been submitted successfully.',
              });
            }
          },
          (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Request Failed',
              text: 'There was an issue submitting your retake request.',
            });
          }
        );
      } else {
        console.log('User canceled the request.');
      }
    });
  }
  
}
