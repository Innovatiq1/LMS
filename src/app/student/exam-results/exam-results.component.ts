import { Component, ElementRef, ViewChild } from '@angular/core';
import { AssessmentQuestionsPaginationModel } from '@core/models/assessment-answer.model'
import { UtilsService } from '@core/service/utils.service';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { AssessmentService } from '@core/service/assessment.service';


@Component({
  selector: 'app-exam-results',
  templateUrl: './exam-results.component.html',
  styleUrls: ['./exam-results.component.scss']
})
export class ExamResultsComponent {
  displayedColumns: string[] = [
    'Course Title',
    'Exam Name',
    'Exam Assessment Score',
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
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild('filter', { static: true }) filter!: ElementRef;

  constructor(public utils: UtilsService, private assessmentService: AssessmentService){
    this.assessmentPaginationModel = {};
  }

  ngOnInit() {
    this.getAllAnswers()
   }

   getAllAnswers() {
    this.assessmentService.getLatestExamAnswers({ ...this.assessmentPaginationModel})
      .subscribe(res => {
        this.dataSource = res.data.docs;
        this.totalItems = res.data.totalDocs;
        this.assessmentPaginationModel.docs = res.docs;
        this.assessmentPaginationModel.page = res.page;
        this.assessmentPaginationModel.limit = res.limit;
      })
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
