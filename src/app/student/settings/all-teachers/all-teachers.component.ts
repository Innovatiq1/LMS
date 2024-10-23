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
import {
  TableExportUtil,
  TableElement,
  UnsubscribeOnDestroyAdapter,
} from '@shared';
import { formatDate } from '@angular/common';
import { UsersModel, UsersPaginationModel } from '@core/models/user.model';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Location } from '@angular/common';
import { UtilsService } from '@core/service/utils.service';
import { Teachers } from 'app/admin/teachers/teachers.model';
import { TeachersService } from 'app/admin/teachers/teachers.service';
import { AppConstants } from '@shared/constants/app.constants';
import { AuthenService } from '@core/service/authen.service';

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
    'img',
    'name',
    'department',
    'gender',
    'degree',
    'mobile',
    'email',
    'Status',
  ];
  exampleDatabase?: TeachersService;
  dataSource!: any;
  selection = new SelectionModel<Teachers>(true, []);
  id?: number;
  teachers?: Teachers;
  UsersModel!: Partial<UsersModel>;
  usersPaginationModel!: Partial<UsersPaginationModel>;
  breadscrums = [
    {
      title: 'Instructors',
      items: ['User Profile'],
      active: `${AppConstants.INSTRUCTOR_ROLE}s`,
    },
  ];
  totalItems: any;
  pageSizeArr = this.utils.pageSizeArr;
  isCreate: boolean = false;
  isView: boolean = false;
  isTblLoading: boolean = true;
  userGroupIds: any;
  filterName: any;
  dataSourceGrid: any;
  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public teachersService: TeachersService,
    private snackBar: MatSnackBar,
    private route: Router,
    private location: Location,
    public utils: UtilsService,
    private authenService: AuthenService
  ) {
    super();
    this.usersPaginationModel = {};
  }
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild('filter', { static: true }) filter!: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu?: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  searchTerm: string = '';

  ngOnInit() {
    const roleDetails =this.authenService.getRoleDetails()[0].settingsMenuItems
    let urlPath = this.route.url.split('/');
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
    this.GridloadData();
    
  }
  refresh() {
    window.location.reload();
  }
  addNew() {
    this.route.navigateByUrl('/student/settings/add-instructor');
  }
  aboutInstructor(id: any) {
    this.route.navigate(['/student/settings/all-user/all-instructors/view-instructor'], {
      queryParams: { data: id },
    });
  }
  deleteItem(row: any) {
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
            this.GridloadData();
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
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.renderedData.length;
    return numSelected === numRows;
  }
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.forEach((row: Teachers) =>
          this.selection.select(row)
        );
  }
  removeSelectedRows() {
    const totalSelect = this.selection.selected.length;
    this.selection.selected.forEach((item) => {
      const index: number = this.dataSource.findIndex(
        (d: Teachers) => d === item
      );

      this.exampleDatabase?.dataChange.value.splice(index, 1);
      this.refreshTable();
      this.selection = new SelectionModel<Teachers>(true, []);
    });
    Swal.fire({
      title: 'Success',
      text: 'Record Deleted Successfully...!!!',
      icon: 'success',
    });
  }

  pageSizeChange($event: any) {
    this.usersPaginationModel.page = $event?.pageIndex + 1;
    this.usersPaginationModel.limit = $event?.pageSize;
    this.loadData();
  }
  performSearch() {
    this.usersPaginationModel.page = 1;
    this.paginator.pageIndex = 0;
      this.loadData();
  }
 
    public loadData() {
      let filterProgram = this.filterName;
      const payload = { ...this.usersPaginationModel,title:filterProgram };
    // if(this.userGroupIds){
    //   payload.userGroupId=this.userGroupIds
    // }
      const type = AppConstants.INSTRUCTOR_ROLE
        this.teachersService.getInstructor(payload,type).subscribe((result) => {
          this.isTblLoading = false;
          this.dataSource = result.data.docs;
          this.totalItems = result.data.totalDocs;
          this.usersPaginationModel.docs = result.data.docs;
          this.usersPaginationModel.page = result.data.page;
          this.usersPaginationModel.limit = result.data.limit;
        });
      }

      public GridloadData() {
        let filterProgram = this.filterName;
        const payload = { ...this.usersPaginationModel,title:filterProgram };
        const type = AppConstants.INSTRUCTOR_ROLE
          this.teachersService.getInstructor(payload,type).subscribe((result) => {
            this.isTblLoading = false;
            this.dataSourceGrid = result.data.docs;
            this.totalItems = result.data.totalDocs;
            this.usersPaginationModel.docs = result.data.docs;
            this.usersPaginationModel.page = result.data.page;
            this.usersPaginationModel.limit = result.data.limit;
          });
        }
    
      GirdpageSizeChange($event: any) {
        this.usersPaginationModel.page = $event?.pageIndex + 1;
        this.usersPaginationModel.limit = $event?.pageSize;
        this.GridloadData();
      }
  

  exportExcel() {
    const exportData: Partial<TableElement>[] =
      this.dataSource.map((x: { name: any; department: any; gender: any; qualification: any; mobile: any; email: any; Active: any; }) => ({
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
}
// export class ExampleDataSource extends DataSource<Teachers> {
//   rowData: any;

//   filterChange = new BehaviorSubject('');
//   get filter(): string {
//     return this.filterChange.value;
//   }
//   set filter(filter: string) {
//     this.filterChange.next(filter);
//   }
//   filteredData: Teachers[] = [];
//   renderedData: Teachers[] = [];
//   constructor(
//     public exampleDatabase: TeachersService,
//     public paginator: MatPaginator,
//     public _sort: MatSort
//   ) {
//     super();
//     this.filterChange.subscribe(() => (this.paginator.pageIndex = 0));
//   }
//   connect(): Observable<Teachers[]> {
//     const displayDataChanges = [
//       this.exampleDatabase.dataChange,
//       this._sort.sortChange,
//       this.filterChange,
//       this.paginator.page,
//     ];
//     let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
//     let payload = {
//       type: AppConstants.INSTRUCTOR_ROLE,
//       companyId:userId
//     };
//     this.exampleDatabase.getAllTeacherss(payload);
//     this.rowData = this.exampleDatabase.data;
//     return merge(...displayDataChanges).pipe(
//       map(() => {
//         this.filteredData = this.exampleDatabase.data
//           .slice()
//           .filter((teachers: Teachers) => {
//             const searchStr = (
//               teachers.name +
//               teachers.department +
//               teachers.gender +
//               teachers.degree +
//               teachers.email +
//               teachers.mobile
//             ).toLowerCase();
//             return searchStr.indexOf(this.filter.toLowerCase()) !== -1;
//           });
//         const sortedData = this.sortData(this.filteredData.slice());
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
//   }
//   sortData(data: Teachers[]): Teachers[] {
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
//         case 'name':
//           [propertyA, propertyB] = [a.name, b.name];
//           break;
//         case 'email':
//           [propertyA, propertyB] = [a.email, b.email];
//           break;
//         case 'date':
//           [propertyA, propertyB] = [a.date, b.date];
//           break;
//         case 'time':
//           [propertyA, propertyB] = [a.department, b.department];
//           break;
//         case 'mobile':
//           [propertyA, propertyB] = [a.mobile, b.mobile];
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
