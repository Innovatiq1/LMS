import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { LecturesService } from './lectures.service';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Lectures } from './lectures.model';
import { DataSource } from '@angular/cdk/collections';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { BehaviorSubject, fromEvent, merge, Observable } from 'rxjs';
import { DataSourceModel, SessionModel} from'@core/models/class.model'
import { map } from 'rxjs/operators';
import { FormDialogComponent } from './dialogs/form-dialog/form-dialog.component';
import { DeleteDialogComponent } from './dialogs/delete/delete.component';
import { MatMenuTrigger } from '@angular/material/menu';
import { SelectionModel } from '@angular/cdk/collections';
import { Direction } from '@angular/cdk/bidi';
import { MatTableDataSource } from '@angular/material/table';


import {
  TableExportUtil,
  TableElement,
  UnsubscribeOnDestroyAdapter,
} from '@shared';
import { formatDate } from '@angular/common';
import { CoursePaginationModel } from '@core/models/course.model';
import * as moment from 'moment';
import jsPDF from 'jspdf';
//import 'jspdf-autotable';
import 'jspdf-autotable';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-lectures',
  templateUrl: './lectures.component.html',
  styleUrls: ['./lectures.component.scss'],
})
export class LecturesComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit
{
  displayedColumns = [
    // 'select',
    'sName',
    'date',
    'endDate',
    'time',
    'status',
    'actions',
  ];
  exampleDatabase?: LecturesService;
  dataSource: any[] = [];
  myArray = new MatTableDataSource<SessionModel>([]);
  selection = new SelectionModel<Lectures>(true, []);
  coursePaginationModel!: Partial<CoursePaginationModel>;
  
  id?: number;
  lectures?: Lectures;
  dataSource1:any;

  breadscrums = [
    {
      title: 'Lecture',
      items: ['Instructor'],
      active: 'Lecture',
    },
  ];
  totalItems: any;
  filterName='';
  pageSizeArr = [10, 25, 50, 100];

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public lecturesService: LecturesService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
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
    this.loadData();
    this.getClassList()
  }
  getClassList() {
    let instructorId = localStorage.getItem('id')
    this.lecturesService.getClassListWithPagination(instructorId, this.filterName,{ ...this.coursePaginationModel }).subscribe(
      (response) => {
        this.dataSource1 = response.data.docs;
        this.totalItems = response.data.totalDocs
        this.coursePaginationModel.docs = response.data.docs;
        this.coursePaginationModel.page = response.data.page;
        this.coursePaginationModel.limit = response.data.limit;
        this.dataSource = [];
       this.getSession()
        
      },
      (error) => {
      }
    );
   
    
  }
  getSession() {
    if(this.dataSource1){
    this.dataSource1&&this.dataSource1?.forEach((item: any, index: any) => {
      if (item.sessions[0]&& item.sessions[0]?.courseName&&item.sessions[0]?.courseCode) {
        let starttimeObject = moment(item.sessions[0].sessionStartTime, "HH:mm");
        
        const duration = moment.duration(moment(item.sessions[0].sessionEndDate).diff(moment(item.sessions[0].sessionStartDate)));
        let daysDifference = duration.asDays()+1
        

        
        this.dataSource.push({
          classId:item._id,
          sessionStartDate: moment(item.sessions[0].sessionStartDate).format("YYYY-MM-DD"),
          sessionEndDate: moment(item.sessions[0].sessionEndDate).format("YYYY-MM-DD"),
          sessionStartTime: starttimeObject.format("hh:mm A"),
          sessionEndTime: moment(item.sessions[0].end).format("hh:mm A"),
          laboratoryId: item.sessions[0].laboratoryId,
          courseName: item.sessions[0].courseName,
          courseCode: item.sessions[0].courseCode,
          status: item.sessions[0].status,
          _id:item.sessions[0]._id,
          duration:daysDifference,

          sessionNumber: 0,
          instructorId: ''
        });
      } else {
        
      }
      
    });
    this.cdr.detectChanges();
    this.myArray.data = this.dataSource1;
  }
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
        lectures: this.lectures,
        action: 'add',
      },
      direction: tempDirection,
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result === 1) {
        this.exampleDatabase?.dataChange.value.unshift(
          this.lecturesService.getDialogData()
        );
        this.refreshTable();
        Swal.fire({
          title: 'Success',
          text: 'Add Record Successfully...!!!',
          icon: 'success',
        });
      }
    });
  }
  performSearch() {
    if(this.filterName){
      this.getClassList()
    } else {
      this.getClassList()

    }
  }
  editCall(row: Lectures) {
    this.id = row.id;
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(FormDialogComponent, {
      data: {
        lectures: row,
        action: 'edit',
      },
      direction: tempDirection,
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result === 1) {
        this.getClassList()
        const foundIndex = this.exampleDatabase?.dataChange.value.findIndex(
          (x) => x.id === this.id
        );
        if (foundIndex != null && this.exampleDatabase) {
          this.exampleDatabase.dataChange.value[foundIndex] =
            this.lecturesService.getDialogData();
          // And lastly refresh table
          this.refreshTable();
          this.getClassList();
          Swal.fire({
            title: 'Success',
            text: 'Edit Record Successfully...!!!',
            icon: 'success',
          });
        }
      }
    });
  }
  deleteItem(row: Lectures) {
    this.id = row.id;
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: row,
      direction: tempDirection,
    });
    Swal.fire({
      title: "Confirm Deletion",
      text: "Are you sure you want to delete this record?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
          if (result === 1) {
            const foundIndex = this.exampleDatabase?.dataChange.value.findIndex(
              (x) => x.id === this.id
            );
            if (foundIndex != null && this.exampleDatabase) {
              this.exampleDatabase.dataChange.value.splice(foundIndex, 1);
              this.refreshTable();
              Swal.fire({
                title: 'Success',
                text: 'Delete Record Successfully...!!!',
                icon: 'success',
              });
            
            }
          }
        });
  }
  });
    
  }

  pageSizeChange($event: any) {
    this.coursePaginationModel.page = $event?.pageIndex + 1;
    this.coursePaginationModel.limit = $event?.pageSize;
    this.getClassList();
  }

  private refreshTable() {
  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : ""
  }
  removeSelectedRows() {
    const totalSelect = this.selection.selected.length;
    Swal.fire({
      title: 'Success',
      text: 'Record Deleted Successfully...!!!',
      icon: 'success',
    });
    
  }
  public loadData() {
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
      this.myArray.data.map((x) => ({
      'Course Name': x.courseName,
      "Class": x.courseCode,
      "Start Date": formatDate(new Date(x.sessionStartDate), 'yyyy-MM-dd', 'en') || '',
      "End Date":formatDate(new Date(x.sessionEndDate), 'yyyy-MM-dd', 'en') || '',
      "Duration":x.duration+ 'days',
      Time: x.sessionStartTime,
      Status: x.status,
      }));

    TableExportUtil.exportToExcel(exportData, 'excel');
  }
  generatePdf() {
    const doc = new jsPDF();
    const headers = [['Course Name', 'Class', 'Start Date','End Date','Duration','Time','Status']];
    const data = this.myArray.data.map((user: {

      courseName: any; courseCode: any; sessionStartDate: any; sessionEndDate: any; duration: any; sessionStartTime: any; status: string | number | Date;
    }, index: any) => [user.courseName, user.courseCode, 
      formatDate(new Date(user.sessionStartDate), 'yyyy-MM-dd', 'en') || '',
      formatDate(new Date(user.sessionEndDate), 'yyyy-MM-dd', 'en') || '',
      user.duration,
      user.sessionStartTime,
      user.status


    ]);
    const columnWidths = [20, 20, 20, 20, 20, 20, 20, 20, 20, 20];
    (doc as any).autoTable({
      head: headers,
      body: data,
      startY: 20,



    });
    doc.save('lecture-list.pdf');
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
  onContextMenu(event: MouseEvent, item: Lectures) {
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
// export class ExampleDataSource extends DataSource<Lectures> {
//   forEach(arg0: (item: any, index: any) => void) {
//     throw new Error('Method not implemented.');
//   }
//   filterChange = new BehaviorSubject('');
//   get filter(): string {
//     return this.filterChange.value;
//   }
//   set filter(filter: string) {
//     this.filterChange.next(filter);
//   }
//   filteredData: Lectures[] = [];
//   renderedData: Lectures[] = [];
//   constructor(
//     public exampleDatabase: LecturesService,
//     public paginator: MatPaginator,
//     public _sort: MatSort
//   ) {
//     super();
//     // Reset to the first page when the user changes the filter.
//     this.filterChange.subscribe(() => (this.paginator.pageIndex = 0));
//   }
//   /** Connect function called by the table to retrieve one stream containing the data to render. */
//   connect(): Observable<Lectures[]> {
//     // Listen for any changes in the base data, sorting, filtering, or pagination
//     const displayDataChanges = [
//       this.exampleDatabase.dataChange,
//       this._sort.sortChange,
//       this.filterChange,
//       this.paginator.page,
//     ];
//     this.exampleDatabase.getAllLecturess();
//     return merge(...displayDataChanges).pipe(
//       map(() => {
//         // Filter data
//         this.filteredData = this.exampleDatabase.data
//           .slice()
//           .filter((lectures: Lectures) => {
//             const searchStr = (
//               lectures.sName +
//               lectures.class +
//               lectures.date +
//               lectures.time
//             ).toLowerCase();
//             return searchStr.indexOf(this.filter.toLowerCase()) !== -1;
//           });
//         // Sort filtered data
//         const sortedData = this.sortData(this.filteredData.slice());
//         // Grab the page's slice of the filtered sorted data.
//         const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
//         this.renderedData = sortedData.splice(
//           startIndex,
//           this.paginator.pageSize
//         );
//         return this.renderedData;
//       })
//     );
//   }
//   disconnect() {
//     //disconnect
//   }
//   /** Returns a sorted copy of the database data. */
//   sortData(data: Lectures[]): Lectures[] {
//     if (!this._sort.active || this._sort.direction === '') {
//       return data;
//     }
//     return data.sort((a, b) => {
//       let propertyA: number | string = '';
//       let propertyB: number | string = '';
//       switch (this._sort.active) {
//         case 'id':
//           [propertyA, propertyB] = [a.id, b.id];
//           break;
//         case 'sName':
//           [propertyA, propertyB] = [a.sName, b.sName];
//           break;
//         case 'class':
//           [propertyA, propertyB] = [a.class, b.class];
//           break;
//         case 'date':
//           [propertyA, propertyB] = [a.date, b.date];
//           break;
//         case 'time':
//           [propertyA, propertyB] = [a.time, b.time];
//           break;
//       }
//       const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
//       const valueB = isNaN(+propertyB) ? propertyB : +propertyB;
//       return (
//         (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1)
//       );
//     });
//   }
// }
