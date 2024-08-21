import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { LeaveRequestService } from './leave-request.service';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { LeaveRequest } from './leave-request.model';
import { DataSource } from '@angular/cdk/collections';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { BehaviorSubject, fromEvent, merge, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FormDialogComponent } from './dialogs/form-dialog/form-dialog.component';
import { DeleteDialogComponent } from './dialogs/delete/delete.component';
import { MatMenuTrigger } from '@angular/material/menu';
import { SelectionModel } from '@angular/cdk/collections';
import { Direction } from '@angular/cdk/bidi';
import {
  TableExportUtil,
  TableElement,
  UnsubscribeOnDestroyAdapter,
} from '@shared';
import { formatDate } from '@angular/common';
import { LeaveService } from '@core/service/leave.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { AuthenService } from '@core/service/authen.service';

@Component({
  selector: 'app-leave-request',
  templateUrl: './leave-request.component.html',
  styleUrls: ['./leave-request.component.scss'],
})
export class LeaveRequestComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit {
  displayedColumns = [
    'class',
    'applyDate',
    'toDate',
    'reason',
    'status',
  ];

  exampleDatabase?: LeaveRequestService;
  dataSource!: ExampleDataSource;
  selection = new SelectionModel<LeaveRequest>(true, []);
  id?: number;
  leaveRequest?: LeaveRequest;

  breadscrums = [
    {
      title: 'Course',
      items: ['Reschedule'],
      active: 'Course',
    },
  ];
  coursesUrl: boolean;
  programsUrl: boolean;
  create = false;
  view = false;

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public leaveRequestService: LeaveRequestService,
    private snackBar: MatSnackBar,
    private leaveService: LeaveService,
    private router: Router,
    private authenService: AuthenService
  ) {
    super();
    let urlPath = this.router.url.split('/')
    this.coursesUrl = urlPath.includes('courses');
    this.programsUrl = urlPath.includes('programs');
    if(this.coursesUrl){
      this.breadscrums = [
        {
          title: 'Course',
          items: ['Reschedule'],
          active: 'Course',
        },
      ];
    
    } else if(this.programsUrl){
      this.breadscrums = [
        {
          title: 'Program',
          items: ['Reschedule'],
          active: 'Program',
        },
      ];
    
    }

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
    const parentId = urlPath[urlPath.length - 2];
    const childId =  urlPath[urlPath.length - 1];
    let parentData = roleDetails.filter((item: any) => item.id == parentId);
    let childData = parentData[0].children.filter((item: any) => item.id == childId);
    let actions = childData[0].actions
    let createAction = actions.filter((item:any) => item.title == 'Create')
    let viewAction = actions.filter((item:any) => item.title == 'View')

    if(createAction.length >0){
      this.create = true;
    }
    if(viewAction.length >0){
      this.view = true;
    }
    this.loadData();
  }
  refresh() {
    this.loadData();
  }
  addNew() {
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(FormDialogComponent, {
      data: {
        leaveRequest: this.leaveRequest,
        action: 'add',
      },
      direction: tempDirection,
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result === 1) {
        this.exampleDatabase?.dataChange.value.unshift(
          this.leaveRequestService.getDialogData()
        );
        this.refreshTable();
      }
    });
   
  }
  editCall(row: LeaveRequest) {
    this.id = row.id;
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(FormDialogComponent, {
      data: {
        leaveRequest: row,
        action: 'edit',
      },
      direction: tempDirection,
    });

    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result === 1) {
        const foundIndex = this.exampleDatabase?.dataChange.value.findIndex(
          (x) => x.id === this.id
        );
        if (foundIndex != null && this.exampleDatabase) {
          this.exampleDatabase.dataChange.value[foundIndex] =
            this.leaveRequestService.getDialogData();
          this.refreshTable();
         
        }
      }
    });
    
  }
  viewCall(id: any): void {
    this.router.navigate(['reschedule/courses/programs-view'], {queryParams:{id:id}});
  }
  private refreshTable() {
    this.paginator._changePageSize(this.paginator.pageSize);
  }
  /** Whether the number of selected elements matches the total number of rows. */
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
      this.selection = new SelectionModel<LeaveRequest>(true, []);
    });
    Swal.fire({
      title: 'Success',
      text: 'Record Deleted Successfully...!!!',
      icon: 'success',
    });
  }
  public loadData() {
    this.exampleDatabase = new LeaveRequestService(this.httpClient);
    this.dataSource = new ExampleDataSource(
      this.exampleDatabase,
      this.paginator,
      this.sort
    );
    this.subs.sink = fromEvent(this.filter.nativeElement, 'keyup').subscribe(
      () => {
        if (!this.dataSource) {
          return;
        }
        this.dataSource.filter = this.filter.nativeElement.value;
      }
    );
  }

  exportExcel() {
    const exportData: Partial<TableElement>[] =
      this.dataSource.filteredData.map((x) => ({
        Class: x.className,
        'Apply Date':
          formatDate(new Date(x.applyDate), 'yyyy-MM-dd', 'en') || '',
        'From Date': formatDate(new Date(x.fromDate), 'yyyy-MM-dd', 'en') || '',
        'To Date': formatDate(new Date(x.toDate), 'yyyy-MM-dd', 'en') || '',
        Reason: x.reason,
        Status: x.status,
      }));

    TableExportUtil.exportToExcel(exportData, 'excel');
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
  onContextMenu(event: MouseEvent, item: LeaveRequest) {
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
export class ExampleDataSource extends DataSource<LeaveRequest> {
  filterChange = new BehaviorSubject('');
  get filter(): string {
    return this.filterChange.value;
  }
  set filter(filter: string) {
    this.filterChange.next(filter);
  }
  filteredData: LeaveRequest[] = [];
  renderedData: LeaveRequest[] = [];
  constructor(
    public exampleDatabase: LeaveRequestService,
    public paginator: MatPaginator,
    public _sort: MatSort
  ) {
    super();
    this.filterChange.subscribe(() => (this.paginator.pageIndex = 0));
  }
  connect(): Observable<LeaveRequest[]> {
    const displayDataChanges = [
      this.exampleDatabase.dataChange,
      this._sort.sortChange,
      this.filterChange,
      this.paginator.page,
    ];
      let learnerId = localStorage.getItem('id')
  
    this.exampleDatabase.getAllLeavesByStudentId('651bdef02191b64db4db0e06',learnerId);
    return merge(...displayDataChanges).pipe(
      map(() => {
        // Filter data
        this.filteredData = this.exampleDatabase.data
          .slice()
          .filter((leaveRequest: LeaveRequest) => {
            const searchStr = (
              leaveRequest?.className +
              leaveRequest.applyDate +
              leaveRequest.reason
            ).toLowerCase();
            return searchStr.indexOf(this.filter.toLowerCase()) !== -1;
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
    //disconnect
  }
  sortData(data: LeaveRequest[]): LeaveRequest[] {
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
        case 'class':
          [propertyA, propertyB] = [a.className, b.className];
          break;
        case 'applyDate':
          [propertyA, propertyB] = [a.applyDate, b.applyDate];
          break;
        case 'fromDate':
          [propertyA, propertyB] = [a.fromDate, b.fromDate];
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
