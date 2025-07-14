import { Component, ElementRef, ViewChild } from '@angular/core';
import { AssessmentQuestionsPaginationModel } from '@core/models/assessment-answer.model';
import { UtilsService } from '@core/service/utils.service';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { AssessmentService } from '@core/service/assessment.service';
import { Subject, debounceTime } from 'rxjs';
import { AppConstants } from '@shared/constants/app.constants';
import { MatDialog } from '@angular/material/dialog';
import { ActivityLogComponent } from '@shared/components/activity-log/activity-log.component';
// import { ActivatedRoute,Route } from '@angular/router';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-exam-scores',
  templateUrl: './exam-scores.component.html',
  styleUrls: ['./exam-scores.component.scss'],
})
export class ExamScoresComponent {
  displayedColumns: string[] = [
    'img',
    'Student Name',
    'Email',
    'Course Title',
    // 'Exam Name',
    'Assessment Score',
    'Exam Assessment Score',
    'Activity',
    'Evaluate',
    'Action',
  ];

  assessmentPaginationModel!: Partial<AssessmentQuestionsPaginationModel>;
  totalItems: any;
  pageSizeArr = this.utils.pageSizeArr;
  id: any;
  limit: any = 10;
  selection = new SelectionModel<any>(true, []);
  dataSource: any;
  examScores: any;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild('filter', { static: true }) filter!: ElementRef;
  private keyupSubject: Subject<Event> = new Subject<Event>();
  commonRoles: any;

  constructor(
    public utils: UtilsService,
    public router: Router,
    private assessmentService: AssessmentService,
    private dialog: MatDialog
  ) {
    this.assessmentPaginationModel = {};
    this.keyupSubject.pipe(debounceTime(300)).subscribe((event) => {
      this.applyFilter(event);
    });
  }

  ngOnInit() {
    this.commonRoles = AppConstants;
    this.getAllAnswers();
  }
  EvaluateExam(row:any,isEdit:any){
    // console.log("row",row)
    
      // console.log('Evaluating row:', row, 'isEdit:', isEdit);
      this.router.navigate(['/admin/courses/exam-manual-evaluation'], {
        queryParams: {
          courseId: row?.courseId?._id,
          examAssAnsId:row?.examAssessmentAnswer?._id,
          examFirstAssAnsId:row?.examAssessmentAnswer?.assessmentAnswerId,
          examQuestionId:row?.examAssessmentAnswer?.examAssessmentId?._id,
          isEdit: isEdit
        }
      });
    
  }
  getAllAnswers() {
    let company = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
    this.assessmentService
      .getExamAnswersV2({ ...this.assessmentPaginationModel, company })
      .subscribe((res) => {
        // console.log('reeeee', res.data);
        this.dataSource = res.data.docs.map((data: any) => ({
          ...data,
          activityCount: data.activityLogs.reduce((count: any, obj: any) => {
            return count + (obj.warnings ? obj.warnings.length : 0);
          }, 0),
        }));
        // console.log('dataSourse==', this.dataSource);
        this.examScores = res.data.docs;
        this.totalItems = res.data.totalDocs;
        this.assessmentPaginationModel.docs = res.data.docs;
        this.assessmentPaginationModel.page = res.data.page;
        this.assessmentPaginationModel.limit = res.data.limit;
        this.assessmentPaginationModel.totalDocs = res.data.totalDocs;
      });
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
      : this.dataSource.forEach((row: any) => this.selection.select(row));
  }

  onKeyup(event: Event) {
    this.keyupSubject.next(event);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
      ?.trim()
      ?.toLowerCase();

    if (filterValue) {
      this.assessmentPaginationModel.studentName = filterValue;
    } else {
      delete this.assessmentPaginationModel.studentName;
    }
    this.getAllAnswers();
  }

  ngOnDestroy() {
    this.keyupSubject.unsubscribe();
  }

  enableStudentView(data: any) {
    if (data.examAssessmentAnswer) {
      this.assessmentPaginationModel.page = 1;
      const payload = { id: data.examAssessmentAnswer._id, studentView: true };
      this.assessmentService
        .updateAssessmentStudentView(payload)
        .subscribe((res) => {
          this.getAllAnswers();
        });
    }
  }

  openActivityLogModal(payload: any) {
    const dialogRef = this.dialog.open(ActivityLogComponent, {
      width: '800px',
      data: payload,
    });
  }
}
