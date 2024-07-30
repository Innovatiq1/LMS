import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AssessmentQuestionsPaginationModel } from '@core/models/assessment-answer.model'
import { UtilsService } from '@core/service/utils.service';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { AssessmentService } from '@core/service/assessment.service';
import Swal from 'sweetalert2';

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
    'Exam'
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
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild('filter', { static: true }) filter!: ElementRef;
  

  constructor(public utils: UtilsService, 
    private assessmentService: AssessmentService, 
    public router: Router){
    this.assessmentPaginationModel = {};
  }

  ngOnInit() {
    this.getAllAnswers()
   }

   getAllAnswers() {
    let studentId = localStorage.getItem('id')||'';
    this.assessmentService.getLatestExamAnswers({ ...this.assessmentPaginationModel, studentId})
      .subscribe(res => {

        //console.log("retake Exam res=",res)
        //console.log("StudentClassId===",res?.data?.docs[0]?.studentClassId?._id)
        this.studentClassId=res?.data?.docs[0]?.studentClassId?._id;
        //console.log("this.student",res?.data?.docs[0]?.studentClassId?.certificate)
        //this.isCertIssued=res?.data?.docs[0]?.studentClassId?.certificate;
        this.dataSource = res.data.docs;
        this.totalItems = res.data.totalDocs;
        this.assessmentPaginationModel.docs = res.docs;
        this.assessmentPaginationModel.page = res.page;
        this.assessmentPaginationModel.limit = res.limit;
      })
  }
  handleRetakeTest(row: any) {

    //console.log("row responce ",row.studentClassId.certificate);
    this.isCertIssued=row.studentClassId.certificate;
    // console.log("row response==",row.data.docs)
    if (this.isCertIssued) {
      this.showCertificateIssuedAlert();
    } else {
      this.navigateToRetakeTest(row);
    }
  }

  showCertificateIssuedAlert() {
  
   Swal.fire({
    title: 'Your certificate has been issued',
    text: ' You cannot retake the Exam.',
    icon: 'warning',
    confirmButtonText: 'Ok'
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
}
