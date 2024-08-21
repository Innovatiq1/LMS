import { SelectionModel } from '@angular/cdk/collections';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { CoursePaginationModel } from '@core/models/course.model';
import { EtmsService } from '@core/service/etms.service';
import { QuestionService } from '@core/service/question.service';
import { UtilsService } from '@core/service/utils.service';


@Component({
  selector: 'app-all-exam-questions',
  templateUrl: './all-exam-questions.component.html',
  styleUrls: ['./all-exam-questions.component.scss']
})
export class AllExamQuestionsComponent {
  displayedColumns: string[] = [
    'Name',
    'Count',
    'Created At',
    'status'
   ];
  coursePaginationModel!: Partial<CoursePaginationModel>;
  totalItems: any;
  pageSizeArr = this.utils.pageSizeArr;


  id: any;
  selection = new SelectionModel<any>(true, []);
  dataSource :any;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild('filter', { static: true }) filter!: ElementRef;
  breadscrums = [
    {
      title: 'Questions',
      // items: ['Extra'],
      active: 'All Questions',
    },
  ];

constructor(private router:Router,public utils: UtilsService, private questionService: QuestionService){
  this.coursePaginationModel = {};

}
  ngOnInit() {
   this.getAllQuestions()
  }
  getAllQuestions() {
    this.questionService.getExamQuestionJson({ ...this.coursePaginationModel})
      .subscribe(res => {
        this.dataSource = res.data.docs;
        this.totalItems = res.data.totalDocs;
        this.coursePaginationModel.docs = res.docs;
        this.coursePaginationModel.page = res.page;
        this.coursePaginationModel.limit = res.limit;
      })
  }
  pageSizeChange($event: any) {
    this.coursePaginationModel.page = $event?.pageIndex + 1;
    this.coursePaginationModel.limit = $event?.pageSize;
    this.getAllQuestions();
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
