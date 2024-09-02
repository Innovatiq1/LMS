import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
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
import { Direction } from '@angular/cdk/bidi';
import {
  TableExportUtil,
  TableElement,
  UnsubscribeOnDestroyAdapter,
} from '@shared';
import { formatDate } from '@angular/common';
import { Router } from '@angular/router';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Swal from 'sweetalert2';
import { Users } from '@core/models/user.model';
import { Students } from 'app/admin/students/students.model';
import { StudentsService } from 'app/admin/students/students.service';
import { AppConstants } from '@shared/constants/app.constants';
import { AuthenService } from '@core/service/authen.service';
@Component({
  selector: 'app-all-students',
  templateUrl: './all-students.component.html',
  styleUrls: ['./all-students.component.scss'],
})
export class AllStudentsComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit
{
  displayedColumns = [
    //'select',
    'img',
    'name',
    'department',
    'gender',
    'education',
    'mobile',
    'email',
    // 'date',
    'status',
  ];
  exampleDatabase?: StudentsService;
  dataSource!: ExampleDataSource;
  selection = new SelectionModel<Students>(true, []);
  id?: number;
  students?: Students;
  rowData: any;
  breadscrums = [
    {
      title: 'Students',
      items: ['User Profile'],
      active: `${AppConstants.STUDENT_ROLE}s`,
    },
  ];
  isCreate: boolean = false;
  isView: boolean = false;

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public studentsService: StudentsService,
    private snackBar: MatSnackBar,
    private router: Router,
    private authenService: AuthenService
  ) {
    super();
  }
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild('filter', { static: true }) filter!: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu?: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };

  ngOnInit() {

    const roleDetails =this.authenService.getRoleDetails()[0].settingsMenuItems
    let urlPath = this.router.url.split('/');
    const parentId = `${urlPath[1]}/${urlPath[2]}`;
    const childId =  urlPath[urlPath.length - 2];
    const subChildId =  urlPath[urlPath.length - 1];
    let parentData = roleDetails.filter((item: any) => item.id == parentId);
    let childData = parentData[0].children.filter((item: any) => item.id == childId);
    let subChildData = childData[0].children.filter((item: any) => item.id == subChildId);
    let actions = subChildData[0].actions
    let createAction = actions.filter((item:any) => item.title == 'Create')
    let viewAction = actions.filter((item:any) => item.title == 'View')

    if(createAction.length >0){
      this.isCreate = true;
    }
    if(viewAction.length >0){
      this.isView = true;
    }
    this.loadData();
  }
  refresh() {
    this.loadData();
  }
  addNew() {
    this.router.navigate(['/student/settings/add-student']);
  }
  editCall(row: Students) {
    this.router.navigate(['/student/settings/add-student'], {
      queryParams: { id: row.id },
    });
  }
  deleteItem(row: any) {
    Swal.fire({
      title: 'Confirm Deletion',
      text: 'Are you sure you want to delete this Student?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.studentsService.deleteUser(row.id).subscribe(
          () => {
            Swal.fire({
              title: 'Deleted',
              text: 'Student deleted successfully',
              icon: 'success',
            });
            this.loadData();
          },
          (error: { message: any; error: any }) => {
            Swal.fire(
              'Failed to delete Student',
              error.message || error.error,
              'error'
            );
          }
        );
      }
    });
  }
  confirmItem(row: any) {
    Swal.fire({
      title: 'Confirm Active',
      text: 'Are you sure you want to active this Student?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Active',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.studentsService.confrim(row.id).subscribe(
          () => {
            Swal.fire({
              title: 'Active',
              text: 'Student Active successfully',
              icon: 'success',
            });
            this.loadData();
          },
          (error: { message: any; error: any }) => {
            Swal.fire(
              'Failed to Active Student',
              error.message || error.error,
              'error'
            );
          }
        );
      }
    });
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
      this.selection = new SelectionModel<Students>(true, []);
    });
    Swal.fire({
      title: 'Success',
      text: 'Record Deleted Successfully...!!!',
      icon: 'success',
    });
  }

  public loadData() {
    this.exampleDatabase = new StudentsService(this.httpClient);
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
        Name: x.name,
        Department: x.department,
        Gender: x.gender,
        Education: x.education,
        Mobile: x.mobile,
        Email: x.email,
        Status: x.Active ? 'Active' : 'Inactive',
      }));

    TableExportUtil.exportToExcel(exportData, 'StudentList');
  }

  generatePdf() {
    const doc = new jsPDF();
    const headers = [
      [
        'Name',
        'Department',
        'Gender',
        'Education',
        'Mobile',
        'Email',
        'Status',
      ],
    ];

    const data = this.dataSource.filteredData.map((user: any) => [
      user.name,
      user.department,
      user.gender,
      user.education,
      user.mobile,
      user.email,
      user.Active ? 'Active' : 'Inactive',
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
    doc.save('StudentList.pdf');
  }

  aboutStudent(id: any) {
    this.router.navigate(['/student/settings/all-user/all-students/view-student'], {
      queryParams: { data: id },
    });
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
  onContextMenu(event: MouseEvent, item: Students) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    if (this.contextMenu !== undefined && this.contextMenu.menu !== null) {
      this.contextMenu.menuData = { item: item };
      this.contextMenu.menu.focusFirstItem('mouse');
      this.contextMenu.openMenu();
    }
  }
  onPageChange(event: any) {
    const startIndex = event.pageIndex * event.pageSize;
    const endIndex = startIndex + event.pageSize;
    this.paginator.pageIndex = event.pageIndex;
    this.dataSource.filteredData = this.dataSource.filteredData.slice(
      startIndex,
      endIndex
    );
  }
}
export class ExampleDataSource extends DataSource<Students> {
  filterChange = new BehaviorSubject('');
  get filter(): string {
    return this.filterChange.value;
  }
  set filter(filter: string) {
    this.filterChange.next(filter);
  }
  filteredData: Students[] = [];
  renderedData: Students[] = [];
  rowData: any;
  constructor(
    public exampleDatabase: StudentsService,
    public paginator: MatPaginator,
    public _sort: MatSort
  ) {
    super();
    this.filterChange.subscribe(() => (this.paginator.pageIndex = 0));
  }
  connect(): Observable<Students[]> {
    const displayDataChanges = [
      this.exampleDatabase.dataChange,
      this._sort.sortChange,
      this.filterChange,
      this.paginator.page,
      
    ];
    let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
    let payload = {
      type: AppConstants.STUDENT_ROLE,
      companyId:userId
    };
    this.exampleDatabase.getAllStudentss(payload);

    this.rowData = this.exampleDatabase.data;
    return merge(...displayDataChanges).pipe(
      map((x) => {
        this.filteredData = this.exampleDatabase.data
          .slice()
          .filter((students: Students) => {
            const searchStr = (
              students.rollNo +
              students.name +
              students.last_name +
              students.department +
              students.mobile
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
  }
  sortData(data: Students[]): Students[] {
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
          [propertyA, propertyB] = [a.name, b.name];
          break;
        case 'email':
          [propertyA, propertyB] = [a.email, b.email];
          break;
        case 'date':
          [propertyA, propertyB] = [a.joiningDate, b.joiningDate];
          break;
        case 'time':
          [propertyA, propertyB] = [a.department, b.department];
          break;
        case 'mobile':
          [propertyA, propertyB] = [a.mobile, b.mobile];
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
