import { SelectionModel } from '@angular/cdk/collections';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { CoursePaginationModel } from '@core/models/course.model';
import { EtmsService } from '@core/service/etms.service';
import { QuestionService } from '@core/service/question.service';
import { UtilsService } from '@core/service/utils.service';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-all-questions',
  templateUrl: './all-questions.component.html',
  styleUrls: ['./all-questions.component.scss'],
})
export class AllQuestionsComponent {
  displayedColumns: string[] = [
    'Name',
    'Count',
    'Created At',
    'Assessment Type',
    'Approval Status',
  ];
  coursePaginationModel!: Partial<CoursePaginationModel>;
  totalItems: any;
  pageSizeArr = this.utils.pageSizeArr;

  id: any;
  selection = new SelectionModel<any>(true, []);
  dataSource: any;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild('filter', { static: true }) filter!: ElementRef;
  assessmentList: any[] = [];
  breadscrums = [
    {
      title: 'Questions',
      items: ['Configuration'],
      active: 'Assessment Configuration',
    },
  ];
  private keyupSubject: Subject<Event> = new Subject<Event>();

  constructor(
    private router: Router,
    public utils: UtilsService,
    private questionService: QuestionService
  ) {
    this.coursePaginationModel = {};
    this.keyupSubject.pipe(
      debounceTime(300)  // Adjust the debounce time as needed
    ).subscribe(event => {
      this.applyFilter(event);
    });
  }
  ngOnInit() {
    this.getAllQuestions();
  }
  getAllQuestions() {
    this.questionService
      .getExamAssessmentsAndAssesments({ ...this.coursePaginationModel })
      .subscribe((res) => {
        this.dataSource = res.data.docs;
        this.assessmentList = res.data.docs;
        this.totalItems = res.data.totalDocs;
        this.coursePaginationModel.docs = res.docs;
        this.coursePaginationModel.page = res.page;
        this.coursePaginationModel.limit = res.limit;
      });
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

  assessmentType(row: any) {
    if (row.collectionName === 'assesmentquestions') {
      return 'Assessment';
    } else {
      return 'Exam';
    }
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.forEach((row: any) => this.selection.select(row));
  }

  getStatusClass(status: string): string {
    return status === 'approved' ? 'success' : 'fail';
  }
  getDotClass(status: string): string {
    return status === 'approved' ? 'green' : 'red';
  }

  onKeyup(event: Event) {
    this.keyupSubject.next(event);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value?.trim()?.toLowerCase();
    if(filterValue){
      this.coursePaginationModel.filterName = filterValue;
    }else {
      delete this.coursePaginationModel.filterName;
    }
    this.getAllQuestions();
  }

  ngOnDestroy() {
    this.keyupSubject.unsubscribe();
  }
}
