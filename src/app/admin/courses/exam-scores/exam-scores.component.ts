import { Component, ElementRef, ViewChild } from '@angular/core';
import { AssessmentQuestionsPaginationModel } from '@core/models/assessment-answer.model'
import { UtilsService } from '@core/service/utils.service';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { AssessmentService } from '@core/service/assessment.service';
import { Subject, debounceTime } from 'rxjs';
import { AppConstants } from '@shared/constants/app.constants';

@Component({
  selector: 'app-exam-scores',
  templateUrl: './exam-scores.component.html',
  styleUrls: ['./exam-scores.component.scss']
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
    'Action'
  ];

  

  assessmentPaginationModel!: Partial<AssessmentQuestionsPaginationModel>;
  totalItems: any;
  pageSizeArr = this.utils.pageSizeArr;
  id: any;
  selection = new SelectionModel<any>(true, []);
  dataSource :any;
  examScores: any;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild('filter', { static: true }) filter!: ElementRef;
  private keyupSubject: Subject<Event> = new Subject<Event>();
  commonRoles: any;
  userGroupIds: any;
  filterName: any;

  constructor(public utils: UtilsService, private assessmentService: AssessmentService){
    this.assessmentPaginationModel = {};
    this.keyupSubject.pipe(
      debounceTime(300)
    ).subscribe(event => {
      this.applyFilter(event);
    });
  }

  ngOnInit() {
    this.commonRoles = AppConstants
    this.getAllAnswers()
   }


   getAllAnswers() {
    let company = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
    let filterProgram = this.filterName;
    const payload = { ...this.assessmentPaginationModel, company, studentName:filterProgram };
 
    this.assessmentService.getExamAnswersV2(payload)
      .subscribe(res => {
        this.dataSource = res.data.docs;
        this.examScores = res.data.docs;
        this.totalItems = res.data.totalDocs;
        this.assessmentPaginationModel.docs = res.docs;
        this.assessmentPaginationModel.page = res.page;
        this.assessmentPaginationModel.limit = res.limit;
      })
  }

  performSearch() {
    this.assessmentPaginationModel.page = 1;
    this.paginator.pageIndex = 0;
      this.getAllAnswers();
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

  
  onKeyup(event: Event) {
    this.keyupSubject.next(event);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value?.trim()?.toLowerCase();
    
    if(filterValue){
      this.assessmentPaginationModel.studentName = filterValue;
    }else {
      delete this.assessmentPaginationModel.studentName;
    }
    this.getAllAnswers();
  }

  ngOnDestroy() {
    this.keyupSubject.unsubscribe();
  }

  enableStudentView(data: any){
    if(data.examAssessmentAnswer){
      const payload = {id: data.examAssessmentAnswer._id, studentView: true}
      this.assessmentService.updateAssessmentStudentView(payload).subscribe(res=> {
        this.getAllAnswers();
      })
    }
  }

}
