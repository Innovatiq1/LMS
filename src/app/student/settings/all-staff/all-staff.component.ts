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
import { formatDate } from '@angular/common';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Staff } from 'app/admin/staff/staff.model';
import { StaffService } from 'app/admin/staff/staff.service';

@Component({
  selector: 'app-all-staff',
  templateUrl: './all-staff.component.html',
  styleUrls: ['./all-staff.component.scss'],
})
export class AllstaffComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit
{
  displayedColumns = [
    // 'select',
    'img',
    'name',
    'User Type',
    'gender',
    'education',
    //'designation',
    'mobile',
    'email',
    // 'date',
    'salary',
    // 'actions',
  ];
  exampleDatabase?: StaffService;
  dataSource!: ExampleDataSource;

  selection = new SelectionModel<Staff>(true, []);
  id?: number;
  staff?: Staff;
  isLoading = true;
  breadscrums = [
    {
      title: 'Staff',
      items: ['User Profile'],
      active: 'Staff',
    },
  ];
  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public staffService: StaffService,
    private snackBar: MatSnackBar,
    public router:Router
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
    this.loadData();
  }
  refresh() {
    this.loadData();
  }
  addNew() {
    this.router.navigate(['/student/settings/add-staff']);
  }

  aboutStaff(id:any){
    this.router.navigate(['/student/settings/about-staff'],{queryParams:{data:id}})

  }

  editCall(row: Staff) {
    console.log("rowEdit",row)
    this.router.navigate(['/student/settings/add-staff'],{queryParams:row});
  }


  deleteItem(id:any) {

    Swal.fire({
      title: "Confirm Deletion",
      text: "Are you sure you want to delete this Student?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        this.staffService.deleteStaff(id).subscribe(() => {
            Swal.fire({
              title: "Deleted",
              text: "Staff deleted successfully",
              icon: "success",
            });
            //this.fetchCourseKits();
            this.loadData()
          },
          (error: { message: any; error: any; }) => {
            Swal.fire(
              "Failed to delete Staff",
              error.message || error.error,
              "error"
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
      this.selection = new SelectionModel<Staff>(true, []);
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
  public loadData() {

    // let data = this.staffService.getAllStaffs();
    // console.log("data",data)
    this.exampleDatabase = new StaffService(this.httpClient);
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
      this.dataSource.filteredData.map((x) => ({
        Name: x.name,
        Role:x.type,
        Designation: x.role,
        Mobile: x.mobile,
        Email: x.email,
        Salary: x.salary,
      }));

    TableExportUtil.exportToExcel(exportData, 'AllStaff-list');
  }
  generatePdf() {
    const doc = new jsPDF();
    const headers = [['Name','Role','Gender','Designation','Mobile','Email','Salary']];
    
    const data = this.dataSource.filteredData.map((x:any) =>
      [x.name,
        x.type,
        x.gender,
        x.role,
        x.mobile,
        x.email,
        x.salary
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
      headStyles: {
        fontSize: 10,
        cellWidth: 'wrap',
      },
  
  
  
    });
  
    // Save or open the PDF
    doc.save('AllStaff-list.pdf');
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
  onContextMenu(event: MouseEvent, item: Staff) {
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
export class ExampleDataSource extends DataSource<Staff> {
  filterChange = new BehaviorSubject('');
  get filter(): string {
    return this.filterChange.value;
  }
  set filter(filter: string) {
    this.filterChange.next(filter);
  }
  filteredData: Staff[] = [];
  renderedData: Staff[] = [];
  constructor(
    public exampleDatabase: StaffService,
    public paginator: MatPaginator,
    public _sort: MatSort
  ) {
    super();
    // Reset to the first page when the user changes the filter.
    this.filterChange.subscribe(() => (this.paginator.pageIndex = 0));
  }
  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<Staff[]> {
    // Listen for any changes in the base data, sorting, filtering, or pagination
    const displayDataChanges = [
      this.exampleDatabase.dataChange,
      this._sort.sortChange,
      this.filterChange,
      this.paginator.page,
    ];

    let payload = {
      status:'active'
    }
    let userId = localStorage.getItem('id')
    this.exampleDatabase.getAllStaffs(userId);
    return merge(...displayDataChanges).pipe(
      map(() => {
        // Filter data
     let data_source = this.exampleDatabase.data.filter(res => res.role !== 'Student')
        this.filteredData = data_source
          .slice()
          .filter((staff: Staff) => {
            const searchStr = (
              staff.name +
              staff.role +
              staff.email +
              staff.mobile +
              staff.date +
              staff.address
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
        console.log("vkvk",this.renderedData)
        return this.renderedData;
      })
    );
  }
  disconnect() {
    // disconnect
  }
  /** Returns a sorted copy of the database data. */
  sortData(data: Staff[]): Staff[] {
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
        case 'address':
          [propertyA, propertyB] = [a.address, b.address];
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
