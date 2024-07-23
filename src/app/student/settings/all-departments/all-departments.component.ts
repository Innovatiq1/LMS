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
import { Direction } from '@angular/cdk/bidi';
import {
  TableExportUtil,
  TableElement,
  UnsubscribeOnDestroyAdapter,
} from '@shared';
import { DeptService } from '@core/service/dept.service';
import { CoursePaginationModel } from '@core/models/course.model';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { formatDate } from '@angular/common';
import { Department } from 'app/admin/departments/department.model';
import { DepartmentService } from 'app/admin/departments/department.service';
import { AuthenService } from '@core/service/authen.service';
@Component({
  selector: 'app-all-departments',
  templateUrl: './all-departments.component.html',
  styleUrls: ['./all-departments.component.scss'],
})
export class AllDepartmentsComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit
{
  displayedColumns = [
    // 'select',
    'dName',
    'hod',
    'phone',
    // 'email',
    'sYear',
    'sCapacity',
    // 'status',
  ];
  exampleDatabase?: DepartmentService;
  dataSource!: any;
  selection = new SelectionModel<Department>(true, []);
  id?: number;
  department?: Department;
  departmentPaginationModel!: Partial<CoursePaginationModel>;

  breadscrums = [
    {
      title: 'All Department Profiles',
      items: ['Manage Users'],
      active: 'Department Profile',
    },
  ];
  totalItems: any;
  pageSizeArr = [10, 25, 50, 100];
  departmentsData: any;
  searchTerm:string = '';
  isView = false;
  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public departmentService: DepartmentService,
    private snackBar: MatSnackBar,
    private deptService:DeptService,
    private router: Router,
    private authenService: AuthenService
  ) {
    super();
    this.departmentPaginationModel = {};
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
    const childId =  urlPath[urlPath.length - 1];
    let parentData = roleDetails.filter((item: any) => item.id == parentId);
    let childData = parentData[0].children.filter((item: any) => item.id == childId);
    let actions = childData[0].actions
    let viewAction = actions.filter((item:any) => item.title == 'View')
  
    if(viewAction.length >0){
      this.isView = true;
    }
    // this.loadData();
    this.getAllDepartments()
  }
  refresh() {
    this.getAllDepartments();
  }
  addNew() {

  }
  delete(id: string) {
    // this.classService.getClassList({ courseId: id }).subscribe((classList: any) => {
    //   const matchingClasses = classList.docs.filter((classItem: any) => {
    //     return classItem.courseId && classItem.courseId.id === id;
    //   });
      // if (matchingClasses.length > 0) {
      //   Swal.fire({
      //     title: 'Error',
      //     text: 'Classes have been registered with this course. Cannot delete.',
      //     icon: 'error',
      //   });
      //   return;
      // }
      this.deptService.deleteDepartment(id).subscribe(() => {
        this.getAllDepartments();
        Swal.fire({
          title: 'Success',
          text: 'Department deleted successfully.',
          icon: 'success',
        });
      });
    // });
  }



  performSearch() {
    if(this.searchTerm){
    this.dataSource = this.dataSource?.filter((item: any) =>{
      const searchList = (item.department+ item.hod).toLowerCase()
      return searchList.indexOf(this.searchTerm.toLowerCase()) !== -1
    })
  }
  else {
    this.getAllDepartments();

  }
}

  getAllDepartments(){
    this.deptService.getAllDepartments({ ...this.departmentPaginationModel, status: 'active' }).subscribe((response: { data: { docs: any; totalDocs: any; page: any; limit: any; }; }) =>{
     this.dataSource = response.data.docs;
     this.totalItems = response.data.totalDocs
     this.departmentPaginationModel.docs = response.data.docs;
     this.departmentPaginationModel.page = response.data.page;
     this.departmentPaginationModel.limit = response.data.limit;
     this.departmentPaginationModel.totalDocs = response.data.totalDocs;
    })
  }
  pageSizeChange($event: any) {
    this.departmentPaginationModel.page = $event?.pageIndex + 1;
    this.departmentPaginationModel.limit = $event?.pageSize;
    this.getAllDepartments();
  }
  editCall(row: Department) {
    this.id = row.id;
    this.router.navigate(['/admin/departments/edit-department/' + this.id])

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
      : this.dataSource.renderedData.forEach((row: Department) =>
          this.selection.select(row)
        );
  }
  removeSelectedRows() {
    const totalSelect = this.selection.selected.length;

    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to update this user!',
      icon: 'warning',
      confirmButtonText: 'Yes',
      showCancelButton: true,
      cancelButtonColor: '#d33',
    }).then((result) => {
      if (result.isConfirmed){
        this.selection.selected.forEach((item) => {
          const index: number = this.dataSource.renderedData.findIndex(
            (d: Department) => d === item
          );
          
          this.exampleDatabase?.dataChange.value.splice(index, 1);
          this.refreshTable();
          this.selection = new SelectionModel<Department>(true, []);
        });
        Swal.fire({
          title: 'Success',
          text: 'Record Deleted Successfully...!!!',
          icon: 'success',
          // confirmButtonColor: '#526D82',
        });
      }
    });
    
   

  }
  public loadData() {
    this.exampleDatabase = new DepartmentService(this.httpClient);
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
  // export table data in excel file
  exportExcel() {
    // key name with space add in brackets
    const exportData: Partial<TableElement>[] =
      this.dataSource.map((x: any) => ({
        'Department': x.department,
        'HOD': x.hod,
        Phone: x.mobile,
        'Start Year':  formatDate(new Date(x?.departmentStartDate), 'yyyy-MM-dd', 'en') || '',
        'Students Capacity': x.studentCapacity,
      }));

    TableExportUtil.exportToExcel(exportData, 'AllDepartments-list');
  }
  generatePdf() {
    const doc = new jsPDF();
    const headers = [[' Department','HOD', 'Phone', 'Start Year','Students Capacity']];
    
    const data = this.dataSource.map((x:any) =>
      [x.department,
        x.hod,
        x.mobile,
        formatDate(new Date(x?.departmentStartDate), 'yyyy-MM-dd', 'en') || '',
        x.studentCapacity
    ] );
    //const columnWidths = [60, 80, 40];
    const columnWidths = [20, 20, 20, 20, 20, 20, 20, 20, 20, 20];
  
    // Add a page to the document (optional)
    //doc.addPage();
  
    // Generate the table using jspdf-autotable
    (doc as any).autoTable({
      head: headers,
      body: data,
      startY: 20,
  
  
  
    });
  
    // Save or open the PDF
    doc.save('AllDepartments-list.pdf');
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
  onContextMenu(event: MouseEvent, item: Department) {
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
export class ExampleDataSource extends DataSource<Department> {
  filterChange = new BehaviorSubject('');
  departmentsData: any;
  get filter(): string {
    return this.filterChange.value;
  }
  set filter(filter: string) {
    this.filterChange.next(filter);
  }
  filteredData: Department[] = [];
  renderedData: Department[] = [];
  constructor(
    public exampleDatabase: DepartmentService,
    public paginator: MatPaginator,
    public _sort: MatSort,
  ) {
    super();
    // Reset to the first page when the user changes the filter.
    this.filterChange.subscribe(() => (this.paginator.pageIndex = 0));

  }
  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<Department[]> {
    // Listen for any changes in the base data, sorting, filtering, or pagination
    const displayDataChanges = [
      this.exampleDatabase.dataChange,
      this._sort.sortChange,
      this.filterChange,
      this.paginator.page,
    ];
    this.exampleDatabase.getAllDepartments();
    return merge(...displayDataChanges).pipe(
      map(() => {
        // Filter data
        this.filteredData = this.exampleDatabase.data
          .slice()
          .filter((department: Department) => {
            const searchStr = (
              department.dName +
              department.hod +
              department.phone +
              department.email
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
    // disconnect
  }
  /** Returns a sorted copy of the database data. */
  sortData(data: Department[]): Department[] {
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
        case 'dName':
          [propertyA, propertyB] = [a.dName, b.dName];
          break;
        case 'hod':
          [propertyA, propertyB] = [a.hod, b.hod];
          break;
        // case 'date': [propertyA, propertyB] = [a.date, b.date]; break;
        case 'phone':
          [propertyA, propertyB] = [a.phone, b.phone];
          break;
        case 'email':
          [propertyA, propertyB] = [a.email, b.email];
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
