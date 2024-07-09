import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { InstructorLeaveRequestService } from './leave-request.service';
import { HttpClient } from '@angular/common/http';
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
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { SelectionModel } from '@angular/cdk/collections';
import { TableElement, TableExportUtil, UnsubscribeOnDestroyAdapter } from '@shared';
import { Direction } from '@angular/cdk/bidi';
import { EditLeaveRequestComponent } from './dialogs/edit-leave-request/edit-leave-request.component';
import { MatDialog } from '@angular/material/dialog';
import { formatDate } from '@angular/common';
import jsPDF from 'jspdf';
import Swal from 'sweetalert2';
import { AppConstants } from '@shared/constants/app.constants';



@Component({
  selector: 'app-leave-request',
  templateUrl: './leave-request.component.html',
  styleUrls: ['./leave-request.component.scss'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],
})
export class InstructorLeaveRequestComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit
{
  displayedColumns = [
    // 'select',
    'img',
    "className",
    // 'rNo',
    'name',
    'applyDate',
    // 'fromDate',
    'toDate',
    'status',
    'reason',
    'actions',
  ];
  exampleDatabase?: InstructorLeaveRequestService;
  dataSource!: ExampleDataSource;
  selection = new SelectionModel<LeaveRequest>(true, []);
  index?: number;
  id?: number;
  studentId?: number;
  clId?: number;
  leaveRequest?: LeaveRequest;

  breadscrums = [
    {
      title: 'Leave Request',
      items: ['Reschedule'],
      active: 'Reschedule Requests',
    },
  ];
  commonRoles: any;

  constructor(
    public httpClient: HttpClient,
    public leaveRequestService: InstructorLeaveRequestService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {
    super();
  }
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild('filter', { static: true }) filter!: ElementRef;

  ngOnInit() {
    this.commonRoles = AppConstants
    this.loadData();
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
  editCall(row: LeaveRequest) {
    this.id = row.id;
    this.studentId = row.studentId._id;
    // this.clId = row?.classId;
    console.log("row", row)
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(EditLeaveRequestComponent, {
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
                this.loadData();
                this.refreshTable();
              }
            }
              })
    // Swal.fire({
    //   title: 'Are you sure?',
    //   text: 'Do you want to update this user!',
    //   icon: 'warning',
    //   confirmButtonText: 'Yes',
    //   showCancelButton: true,
    //   cancelButtonColor: '#d33',
    // }).then((result) => {
    //   if (result.isConfirmed){
    //     this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
    //       if (result === 1) {
    //         // When using an edit things are little different, firstly we find record inside DataService by id
    //         const foundIndex = this.exampleDatabase?.dataChange.value.findIndex(
    //           (x) => x.id === this.id
    //         );
    //         // Then you update that record using data from dialogData (values you enetered)
    //         if (foundIndex != null && this.exampleDatabase) {
    //           this.exampleDatabase.dataChange.value[foundIndex] =
    //             this.leaveRequestService.getDialogData();
    //             //this.ro
    //           // And lastly refresh table
    //           this.loadData();
    //           this.refreshTable();
    //           Swal.fire({
    //             title: 'Success',
    //             text: 'Edit Record Successfully...!!!',
    //             icon: 'success',
    //             // confirmButtonColor: '#526D82',
    //           });
    //         }
    //       }
    //     });
    //   }
    // });
   
  }


  removeSelectedRows() {
    const totalSelect = this.selection.selected.length;

    Swal.fire({
      title: "Confirm Deletion",
      text: "Are you sure you want to delete selected record?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
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
          // confirmButtonColor: '#526D82',
        });
  }
  });

  
  }

  private refreshTable() {
    this.paginator._changePageSize(this.paginator.pageSize);
  }
  public loadData() {
    this.exampleDatabase = new InstructorLeaveRequestService(this.httpClient);
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
  exportExcel() {
    //key name with space add in brackets
    const exportData: Partial<TableElement>[] =
      this.dataSource.filteredData.map((x) => ({
      'Class Name': x.className,
      // "Roll No": x.studentId?.rollNo,
      "Student Name": x.studentId?.name,
      "Apply Date":formatDate(new Date(x.applyDate), 'yyyy-MM-dd', 'en') || '',
      // "From Date":formatDate(new Date(x.fromDate), 'yyyy-MM-dd', 'en') || '',
      "To Date":formatDate(new Date(x.toDate), 'yyyy-MM-dd', 'en') || '',
      "Status": x.status,
      "Reason": x.reason,
      }));
  
    TableExportUtil.exportToExcel(exportData, 'excel');
  }
  // generatePdf() {
  //   const doc = new jsPDF();
  //   const headers = [['Class Name', 'Apply Date','From Date','To Date','Status','Reason']];
  //   const data = this.dataSource.filteredData.map((user: {
  //    className: any; applyDate:any; fromDate:any; toDate:any; status:any; reason:any
  //     //formatDate(arg0: Date, arg1: string, arg2: string): unknown;
  
      
  //   }, index: any) => [user.className, 
  //   //user.studentId?.rollNo, 
  //     // user.studentId?.name, 
  //     formatDate(new Date(user.applyDate), 'yyyy-MM-dd', 'en') || '',
  //     formatDate(new Date(user.fromDate), 'yyyy-MM-dd', 'en') || '',
  //     formatDate(new Date(user.toDate), 'yyyy-MM-dd', 'en') || '',
  //     user.status,
  //     user.reason
      
  
  
  //   ]);
  //   //const columnWidths = [60, 80, 40];
  //   const columnWidths = [20, 20, 20, 20, 20, 20, 20, 20, 20, 20];
  
  //   // Add a page to the document (optional)
  //   //doc.addPage();
  
  //   // Generate the table using jspdf-autotable
  //   (doc as any).autoTable({
  //     head: headers,
  //     body: data,
  //     startY: 20,
  
  
  
  //   });
  
  //   // Save or open the PDF
  //   doc.save('lecture-list.pdf');
  // }
  generatePdf() {
    const doc = new jsPDF();
    const headers = [[' Class Name','Roll No', 'Student Name','Apply Date','From Date','To Date','Status','Reason']];
    
    const data = this.dataSource.filteredData.map((user:any) =>
      [user.className,
        // user.studentId?.rollNo, 
      user.studentId?.name, 
      formatDate(new Date(user.applyDate), 'yyyy-MM-dd', 'en') || '',
      // formatDate(new Date(user.fromDate), 'yyyy-MM-dd', 'en') || '',
      formatDate(new Date(user.toDate), 'yyyy-MM-dd', 'en') || '',
      user.status,
      user.reason
        
        
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
    doc.save('leaverequest-list.pdf');
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
    public exampleDatabase: InstructorLeaveRequestService,
    public paginator: MatPaginator,
    public _sort: MatSort
  ) {
    super();
    // Reset to the first page when the user changes the filter.
    this.filterChange.subscribe(() => (this.paginator.pageIndex = 0));
  }
  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<LeaveRequest[]> {
    // Listen for any changes in the base data, sorting, filtering, or pagination
    const displayDataChanges = [
      this.exampleDatabase.dataChange,
      this._sort.sortChange,
      this.filterChange,
      this.paginator.page,
    ];
    let instructorId = localStorage.getItem('id')

    this.exampleDatabase.getAllLeaveRequest(instructorId);
    return merge(...displayDataChanges).pipe(
      map(() => {
        // Filter data
        this.filteredData = this.exampleDatabase.data
          .slice()
          .filter((leaveRequest: LeaveRequest) => {
            const searchStr = (
              leaveRequest.className +
              leaveRequest.studentId.name +
              leaveRequest.toDate +
              leaveRequest.status +
              leaveRequest.reason
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
          case 'className':
          [propertyA, propertyB] = [a.className, b.className];
          break;
          // case 'rNo':
          // [propertyA, propertyB] = [a.studentId.rollNo, b.studentId.rollNo];
          // break;
        case 'name':
          [propertyA, propertyB] = [a.studentId.name, b.studentId.name];
          break;
        // case 'fromDate':
        //   [propertyA, propertyB] = [a.fromDate, b.fromDate];
        //   break;
        case 'toDate':
          [propertyA, propertyB] = [a.toDate, b.toDate];
          break;
        case 'status':
          [propertyA, propertyB] = [a.status, b.status];
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
