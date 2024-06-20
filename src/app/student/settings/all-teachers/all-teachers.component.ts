import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
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
//import { MatMenuTrigger } from '@angular/material/menu';
import {
  TableExportUtil,
  TableElement,
  UnsubscribeOnDestroyAdapter,
} from '@shared';
import { formatDate } from '@angular/common';
import { UsersModel } from '@core/models/user.model';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
//import 'jspdf-autotable';
import 'jspdf-autotable';
import { Location } from '@angular/common';
import { UtilsService } from '@core/service/utils.service';
import { Teachers } from 'app/admin/teachers/teachers.model';
import { TeachersService } from 'app/admin/teachers/teachers.service';
import { AppConstants } from '@shared/constants/app.constants';

@Component({
  selector: 'app-all-teachers',
  templateUrl: './all-teachers.component.html',
  styleUrls: ['./all-teachers.component.scss'],
})
export class AllTeachersComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit
{
  displayedColumns = [
    // 'select',
    'img',
    'name',
    'department',
    'gender',
    'degree',
    'mobile',
    'email',
    'Status',
    // 'date',
    // 'actions',
  ];
  exampleDatabase?: TeachersService;
  dataSource!: ExampleDataSource;
  selection = new SelectionModel<Teachers>(true, []);
  id?: number;
  teachers?: Teachers;
  UsersModel!: Partial<UsersModel>;
  //dataSource!: any;
  //isTblLoading = true;
  breadscrums = [
    {
      title: 'Instructors',
      items: ['User Profile'],
      active: `${AppConstants.INSTRUCTOR_ROLE}s`,
    },
  ];
  totalItems: any;
  pageSizeArr = this.utils.pageSizeArr;
  // rowData:any
  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public teachersService: TeachersService,
    private snackBar: MatSnackBar,
    private route: Router,
    private location: Location,
    public utils: UtilsService
  ) {
    super();
    this.UsersModel = {};
  }
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild('filter', { static: true }) filter!: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu?: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  searchTerm: string = '';

  ngOnInit() {
    this.loadData();
    //this.instructorData()
  }
  refresh() {
    //this.loadData();
    window.location.reload();

    //this.location.re
  }
  addNew() {
    this.route.navigateByUrl('/student/settings/add-instructor');
  }
  aboutInstructor(id: any) {
    this.route.navigate(['/student/settings/view-instructor'], {
      queryParams: { data: id },
    });
  }
  // performSearch() {
  //
  //
  //   if(this.searchTerm){
  //   this.dataSource = this.dataSource?.filter((item: { name: string; }) =>
  //     item.name.toLowerCase().includes(this.searchTerm.toLowerCase())
  //   );
  //   } else {
  //     this.instructorData()

  //   }
  // }
  // editCall(row: Teachers) {
  //   console.log("edit",row)
  //   this.router.navigate(['/admin/teachers/edit-teacher'],{queryParams:{id:row.id}})
  // }
  deleteItem(row: any) {
    // this.id = row.id;
    Swal.fire({
      title: 'Confirm Deletion',
      text: 'Are you sure you want to delete this Instructor?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.teachersService.deleteUser(row.id).subscribe(
          () => {
            Swal.fire({
              title: 'Deleted',
              text: 'Instructor deleted successfully',
              icon: 'success',
            });
            this.loadData();
            //this.fetchCourseKits();
            //this.instructorData()
          },
          (error: { message: any; error: any }) => {
            Swal.fire(
              'Failed to delete  Instructor',
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
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.renderedData.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
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
      this.selection = new SelectionModel<Teachers>(true, []);
    });
    Swal.fire({
      title: 'Success',
      text: 'Record Deleted Successfully...!!!',
      icon: 'success',
      // confirmButtonColor: '#526D82',
    });
    // this.showNotification(
    //   'snackbar-danger',
    //   totalSelect + ' Record Delete Successfully...!!!',
    //   'bottom',
    //   'center'
    // );
  }

  pageSizeChange($event: any) {
    this.UsersModel.page = $event?.pageIndex + 1;
    this.UsersModel.limit = $event?.pageSize;
    this.instructorData();
  }

  public loadData() {
    this.exampleDatabase = new TeachersService(this.httpClient);
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

  public instructorData() {
    this.teachersService.getInstructor({ ...this.UsersModel }).subscribe(
      (response: {
        docs: any;
        totalDocs: any;
        data: any;
        page: any;
        limit: any;
      }) => {
        // this.isTblLoading=false;
        this.totalItems = response.totalDocs;
        this.dataSource = response?.docs;
        this.UsersModel.docs = response?.docs;
        this.UsersModel.page = response?.page;
        this.UsersModel.limit = response?.limit;
        this.UsersModel.totalDocs = response?.totalDocs;

        //this.getJobTemplates();
      },
      (error) => {}
    );
  }
  // export table data in excel file
  exportExcel() {
    //k//ey name with space add in brackets
    const exportData: Partial<TableElement>[] =
      this.dataSource.filteredData.map((x) => ({
        Name: x.name,
        Department: x.department,
        Gender: x.gender,
        Degree: x.qualification,
        Mobile: x.mobile,
        Email: x.email,
        Status:x.Active ? 'Active' : 'Inactive',
      }));

    TableExportUtil.exportToExcel(exportData, 'Instrucor-list');
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
    const data = this.dataSource.filteredData.map(
      (user: any) => [
        user.name,
        user.department,
        user.gender,
        user.qualification,
        user.mobile,
        user.email,
        user.Active ? 'Active' : 'Inactive',,
      ]
    );
    //const columnWidths = [60, 80, 40];
    const columnWidths = [20, 20, 20, 20, 20, 20, 20, 20, 20, 20];

    // Add a page to the document (optional)
    //doc.addPage();

    // Generate the table using jspdf-autotable
    (doc as any).autoTable({
      head: headers,
      body: data,
      startY: 20,
      headStyles: {
        fontSize: 10,
        cellWidth: 'wrap',
      },
    });

    // Save or open the PDF
    doc.save('Instrucor-list.pdf');
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
  onContextMenu(event: MouseEvent, item: Teachers) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    if (this.contextMenu !== undefined && this.contextMenu.menu !== null) {
      this.contextMenu.menuData = { item: item };
      this.contextMenu.menu.focusFirstItem('mouse');
      this.contextMenu.openMenu();
    }
  }
  // pageSizeChange($event: any) {
  //   this.UsersModel.page = $event?.pageIndex + 1;
  //   this.UsersModel.limit = $event?.pageSize;
  //   this.instructorData();
  // }
}
export class ExampleDataSource extends DataSource<Teachers> {
  rowData: any;

  filterChange = new BehaviorSubject('');
  get filter(): string {
    return this.filterChange.value;
  }
  set filter(filter: string) {
    this.filterChange.next(filter);
  }
  filteredData: Teachers[] = [];
  renderedData: Teachers[] = [];
  constructor(
    public exampleDatabase: TeachersService,
    public paginator: MatPaginator,
    public _sort: MatSort
  ) {
    super();
    // Reset to the first page when the user changes the filter.
    this.filterChange.subscribe(() => (this.paginator.pageIndex = 0));
  }
  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<Teachers[]> {
    // Listen for any changes in the base data, sorting, filtering, or pagination
    const displayDataChanges = [
      this.exampleDatabase.dataChange,
      this._sort.sortChange,
      this.filterChange,
      this.paginator.page,
    ];
    let userId = localStorage.getItem('id')
    let payload = {
      type: AppConstants.INSTRUCTOR_ROLE,
      adminId:userId
    };
    this.exampleDatabase.getAllTeacherss(payload);
    this.rowData = this.exampleDatabase.data;
    return merge(...displayDataChanges).pipe(
      map(() => {
        //this.exampleDatabase.data.slice
        // Filter data
        this.filteredData = this.exampleDatabase.data
          .slice()
          .filter((teachers: Teachers) => {
            const searchStr = (
              teachers.name +
              teachers.department +
              teachers.gender +
              teachers.degree +
              teachers.email +
              teachers.mobile
            ).toLowerCase();
            return searchStr.indexOf(this.filter.toLowerCase()) !== -1;
          });
        // Sort filtered data
        const sortedData = this.sortData(this.filteredData.slice());
        // Grab the page's slice of the filtered sorted data.
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
  /** Returns a sorted copy of the database data. */
  sortData(data: Teachers[]): Teachers[] {
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
          [propertyA, propertyB] = [a.date, b.date];
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
