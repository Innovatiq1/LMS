import { SelectionModel } from '@angular/cdk/collections';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { CoursePaginationModel } from '@core/models/course.model';
import { AuthenService } from '@core/service/authen.service';
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
  isCreate = false;
  isEdit = false;
  isView = false;
  breadscrums = [
    {
      title: 'Questions',
      items: ['Configuration'],
      active: 'Assessment Configuration',
    },
  ];
  private keyupSubject: Subject<Event> = new Subject<Event>();
  editUrl: boolean = false;
  viewUrl: boolean = false;


  constructor(
    private router: Router,
    public utils: UtilsService,
    private questionService: QuestionService,
    private authenService: AuthenService
  ) {
    this.coursePaginationModel = {};
    this.keyupSubject.pipe(
      debounceTime(300)  // Adjust the debounce time as needed
    ).subscribe(event => {
      this.applyFilter(event);
    });
  }
  ngOnInit() {
    const roleDetails =this.authenService.getRoleDetails()[0].settingsMenuItems
    let urlPath = this.router.url.split('/');
    const parentId = `${urlPath[1]}/${urlPath[2]}/${urlPath [3]}`;
    const childId =  urlPath[urlPath.length - 1];
    let parentData = roleDetails.filter((item: any) => item.id == parentId);
    let childData = parentData[0].children.filter((item: any) => item.id == childId);
    let actions = childData[0].actions
    let createAction = actions.filter((item:any) => item.title == 'Create')
    let editAction = actions.filter((item:any) => item.title == 'Edit')
    let viewAction = actions.filter((item:any) => item.title == 'View')

    if(createAction.length >0){
      this.isCreate = true;
    }
    if(editAction.length >0){
      this.isEdit = true;
    }
    if(viewAction.length >0){
      this.isView = true;
    }
    this.getAllQuestions();
  }
  getRouterLink(row: any): any[] | null {
    if (this.isEdit && !this.isView) {
      return row.status !== 'approved' ? ['/student/settings/configuration/all-questions/edit-questions', row.id] : null;
    } else if (this.isView && !this.isEdit) {
      return row.status === 'approved' ? ['/student/settings/configuration/all-questions/preview-questions', row.id] : null;
    }  else if (this.isView && this.isEdit) {
      return row.status !== 'approved' ? ['/student/settings/configuration/all-questions/edit-questions', row.id] : ['/student/settings/configuration/all-questions/preview-questions', row.id];
    } else {
      return null;
    }
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
