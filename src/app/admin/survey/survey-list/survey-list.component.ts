import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DataSource } from '@angular/cdk/collections';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { BehaviorSubject, fromEvent, merge, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MatMenuTrigger } from '@angular/material/menu';
import { SelectionModel } from '@angular/cdk/collections';
import {
  TableExportUtil,
  TableElement,
  UnsubscribeOnDestroyAdapter,
} from '@shared';
import { SurveyService } from '../survey.service';
import { SurveyBuilderModel } from '../survey.model';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AppConstants } from '@shared/constants/app.constants';
import { AuthenService } from '@core/service/authen.service';
import { CoursePaginationModel } from '@core/models/course.model';
@Component({
  selector: 'app-survey-list',
  templateUrl: './survey-list.component.html',
  styleUrls: ['./survey-list.component.scss'],
})
export class SurveyListComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit
{
  displayedColumns = [
    // 'select',

    'studentName',
    'courseName',
    // 'actions',
  ];
  exampleDatabase?: SurveyService;
  dataSource!: ExampleDataSource;
  selection = new SelectionModel<SurveyBuilderModel>(true, []);
  id?: number;
  isLoading = true;
  // breadscrums = [
  //   {
  //     title: 'Feedbacks List',
  //     items: ['Survey'],
  //     active: 'Feedbacks List',
  //   },
  // ];
  commonRoles: any;
  isView = false;
  totalItems: any;
  searchTerm: string = '';
  pageSizeArr = [10, 25, 50, 100];
  coursePaginationModel: Partial<CoursePaginationModel>;
  getSeryData: any;
  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public surveyService: SurveyService,
    private snackBar: MatSnackBar,
    private router: Router,
    private authenService: AuthenService
  ) {
    super();
    this.coursePaginationModel = {};
  }
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild('filter', { static: true }) filter!: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu?: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };

  ngOnInit() {
    const roleDetails =this.authenService.getRoleDetails()[0].menuItems
    let urlPath = this.router.url.split('/');
    const parentId = `${urlPath[1]}/${urlPath[2]}`;
    const childId =  urlPath[urlPath.length - 1];
    let parentData = roleDetails.filter((item: any) => item.id == parentId);
    let childData = parentData[0].children.filter((item: any) => item.id == childId);
    let actions = childData[0].actions
    let viewAction = actions.filter((item:any) => item.title == 'View')

    if(viewAction.length >0){
      this.isView = true;
    }
    this.commonRoles = AppConstants
    this.loadData();
  }
  refresh() {
    this.loadData();
  }
  editCall(row: SurveyBuilderModel) {
    this.router.navigate(['/admin/survey/feedbacks-list/view-survey'], {
      queryParams: { id: row },
    });
  }
  getStudentName(data: any) {
    return data.studentId
      ? `${data?.studentId?.name} ${data?.studentId?.last_name}`
      : `${data?.studentFirstName} ${data?.studentLastName}`;
  }
  deleteItem(id: SurveyBuilderModel) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this survey entry!',
      icon: 'warning',
      confirmButtonText: 'Yes',
      showCancelButton: true,
      cancelButtonColor: '#d33',
    }).then((result) => {
      if (result.isConfirmed) {
        this.surveyService.deleteSurveyBuilders(id).subscribe((response) => {
          
          if (response.success) {
            Swal.fire('Deleted!', 'Survey entry has been deleted.', 'success');
            this.loadData();
          }
        });
      }
    });
  }
  
  generatePdf() {
    const doc = new jsPDF();
    const headers = [[[AppConstants.STUDENT_ROLE],'Course/Program Name' ]];
    ;
    const data = this.dataSource.filteredData.map((user: any) => [
      user.studentFirstName,
      user.courseName,
    ]);
    const columnWidths = [20, 20, 20, 20, 20, 20, 20, 20, 20, 20];
    (doc as any).autoTable({
      head: headers,
      body: data,
      startY: 20,
      headStyles: {
        fontSize: 10,
        cellWidth: 'wrap',
      },
    });
    doc.save('SurveyList.pdf');
  }
  private refreshTable() {
    this.paginator._changePageSize(this.paginator.pageSize);
  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.renderedData.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.renderedData.forEach((row) =>
          this.selection.select(row)
        );
  }
  removeSelectedRows() {
    const totalSelect = this.selection.selected.length;
    this.selection.selected.forEach((item) => {
      const index: number = this.dataSource.renderedData.findIndex(
        (d) => d === item
      );
      
      this.exampleDatabase?.dataChange.value.splice(index, 1);
      this.refreshTable();
      this.selection = new SelectionModel<SurveyBuilderModel>(true, []);
    });
    Swal.fire({
      title: 'Success',
      text: 'Record Deleted Successfully...!!!',
      icon: 'success',
      // confirmButtonColor: '#526D82',
    });
  }

  public loadData() {
    // this.exampleDatabase = new SurveyService(this.httpClient);
    // this.dataSource = new ExampleDataSource(
    //   this.exampleDatabase,
    //   this.paginator,
    //   this.sort
    // );
    // this.subs.sink = fromEvent(this.filter.nativeElement, 'keyup').subscribe(
    //   () => {
    //     if (!this.dataSource) {
    //       return;
    //     }
    //     this.dataSource.filter = this.filter.nativeElement.value;
    //   }
    // );
    let filterProgram = this.searchTerm;
    const payload = { ...this.coursePaginationModel,title:filterProgram };
 
    this.surveyService.getSurveyList(payload)
    .subscribe(response => {
      this.isLoading = false;
      this.totalItems = response.data.totalDocs;
      this.getSeryData=response.data.docs;

      this.dataSource = response.data.docs;
      this.coursePaginationModel.docs = response.data.docs;
      this.coursePaginationModel.page = response.data.page;
      this.coursePaginationModel.limit = response.data.limit;
      this.coursePaginationModel.totalDocs = response.data.totalDocs;

      // this.getJobTemplates();

    }, (error) => {

    });
  }
  pageSizeChange($event: any) {
    this.coursePaginationModel.page = $event?.pageIndex + 1;
    this.coursePaginationModel.limit = $event?.pageSize;
    this.loadData();
  }

  performSearch() {
    this.coursePaginationModel.page = 1;
    this.paginator.pageIndex = 0;
    this.loadData();
  }

  // export table data in excel file
  exportExcel() {
    // key name with space add in brackets
    const exportData: Partial<TableElement>[] =
      this.dataSource.filteredData.map((x) => ({
        [AppConstants.STUDENT_ROLE]: x.studentFirstName,
        'Course Name': x.courseName,
       
      }));

    TableExportUtil.exportToExcel(exportData, 'SurveyList');
  }

  showNotification(
    colorName: string,
    text: string,
    placementFrom: MatSnackBarVerticalPosition,
    placementAlign: MatSnackBarHorizontalPosition
  ) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName,
    });
  }
  // context menu
  onContextMenu(event: MouseEvent, item: SurveyBuilderModel) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    if (this.contextMenu !== undefined && this.contextMenu.menu !== null) {
      this.contextMenu.menuData = { item: item };
      this.contextMenu.menu.focusFirstItem('mouse');
      this.contextMenu.openMenu();
    }
  }
}
export class ExampleDataSource extends DataSource<SurveyBuilderModel> {
  filterChange = new BehaviorSubject('');
  get filter(): string {
    return this.filterChange.value;
  }
  set filter(filter: string) {
    this.filterChange.next(filter);
  }
  filteredData: SurveyBuilderModel[] = [];
  renderedData: SurveyBuilderModel[] = [];
  constructor(
    public exampleDatabase: SurveyService,
    public paginator: MatPaginator,
    public _sort: MatSort
  ) {
    super();
    this.filterChange.subscribe(() => (this.paginator.pageIndex = 0));
  }
  connect(): Observable<SurveyBuilderModel[]> {
    const displayDataChanges = [
      this.exampleDatabase.dataChange,
      this._sort.sortChange,
      this.filterChange,
      this.paginator.page,
    ];
    this.exampleDatabase.getAllSurvey();
    return merge(...displayDataChanges).pipe(
      map(() => {
        // Filter data
        this.filteredData = this.exampleDatabase.data
          .slice()
          .filter((staff: SurveyBuilderModel) => {
            const searchStr = (
              staff.courseName + staff.studentFirstName
            )?.toLowerCase();
            return searchStr?.indexOf(this.filter?.toLowerCase()) !== -1;
          });
        const sortedData = this.sortData(this.filteredData.slice());
        const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
        this.renderedData = sortedData.splice(
          startIndex,
          this.paginator.pageSize
        );
        return this.renderedData;
      })
    );
  }
  disconnect() {
    // disconnect
  }
  sortData(data: SurveyBuilderModel[]): SurveyBuilderModel[] {
    if (!this._sort.active || this._sort.direction === '') {
      return data;
    }
    return data.sort((a, b) => {
      let propertyA: number | string = '';
      let propertyB: number | string = '';
      switch (this._sort.active) {
        case 'id':
          [propertyA, propertyB] = [a.id, b.id];
          break;
        case 'name':
          [propertyA, propertyB] = [a.title, b.title];
          break;
      }
      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;
      return (
        (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1)
      );
    });
  }
}
