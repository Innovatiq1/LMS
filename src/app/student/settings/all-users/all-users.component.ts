import { SelectionModel } from '@angular/cdk/collections';
import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseModel, CoursePaginationModel } from '@core/models/course.model';
import { Users } from '@core/models/user.model';
import { CourseService } from '@core/service/course.service';
import { UserService } from '@core/service/user.service';
import { UtilsService } from '@core/service/utils.service';
import { TableElement, TableExportUtil } from '@shared';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Swal from 'sweetalert2';
import { RoleDailogComponent } from './role-dailog/role-dailog.component';
import { Direction } from '@angular/cdk/bidi';
import { MatDialog } from '@angular/material/dialog';
import { AuthenService } from '@core/service/authen.service';
@Component({
  selector: 'app-all-users',
  templateUrl: './all-users.component.html',
  styleUrls: ['./all-users.component.scss']
})
export class AllUsersComponent {

  displayedColumns: string[] = [
    'img',
    'Name',
    'User Type',
    'gender',
    'Qualification',
    'Mobile',
    'Email',
    'Status',
  ];
  breadscrums = [
    {
      title: 'All User',
      items: ['User Profile'],
      active: 'All Users',
    },
  ];
  create = true;
  status = true;
  dataSource: any;
  response: any;
  isLoading = true;
  selection = new SelectionModel<CourseModel>(true, []);
  coursePaginationModel!: Partial<CoursePaginationModel>;
  totalItems: any;
  searchTerm:string = '';
  pageSizeArr = this.utils.pageSizeArr;
  typeName?: any;
  isCreate: boolean = false;
  isView: boolean = false;
  

  constructor(private router: Router,
    public utils: UtilsService,
    private alluserService: UserService,
    private activatedRoute: ActivatedRoute,
    private ref: ChangeDetectorRef,
    private courseService: CourseService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private authenService: AuthenService
  ) {

    this.coursePaginationModel = {};
}

@ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
@ViewChild('filter', { static: true }) filter!: ElementRef;

getBlogsList(filters?:any) {
  let filterText = this.searchTerm;
  let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
  this.alluserService.getUserList({filterText,...this.coursePaginationModel},userId).subscribe((response: any) => {
    this.dataSource = response.data.data;
    console.log("dataSource==",this.dataSource)
    this.isLoading = false;
    this.ref.detectChanges();
    this.totalItems = response.totalRecords
    this.coursePaginationModel.docs = response.docs;
    this.coursePaginationModel.page = response.page;
    this.coursePaginationModel.limit = response.limit;

  }, error => {
  });
}

ngOnInit(): void {
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
  this.activatedRoute.queryParams.subscribe((params: any) => {
    this.getBlogsList(params);
  });
  

}

pageSizeChange($event: any) {
  this.coursePaginationModel.page = $event?.pageIndex + 1;
  this.coursePaginationModel.limit = $event?.pageSize;
  this.getBlogsList()

}

private refreshTable() {
  this.paginator._changePageSize(this.paginator.pageSize);
}
isAllSelected() {
  const numSelected = this.selection.selected.length;
  const numRows = this.dataSource.length;
  return numSelected === numRows;
}
masterToggle() {
  this.isAllSelected()
    ? this.selection.clear()
    : this.dataSource.forEach((row: CourseModel) =>
        this.selection.select(row)
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
removeSelectedRows() {
  const totalSelect = this.selection.selected.length;

  Swal.fire({
    title: "Confirm Deletion",
    text: "Are you sure you want to delete selected records?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Delete",
    cancelButtonText: "Cancel",
  }).then((result) => {
    if (result.isConfirmed) {
      this.selection.selected.forEach((item) => {
        const index: number = this.dataSource.findIndex(
          (d: CourseModel) => d === item
        );
        
        this.courseService?.dataChange.value.splice(index, 1);
        this.refreshTable();
        this.selection = new SelectionModel<CourseModel>(true, []);
      });
      Swal.fire({
        title: 'Success',
        text: 'Record Deleted Successfully...!!!',
        icon: 'success',
      });
}
});
  
}
performSearch() {
this.getBlogsList()
console.log("this.dataSourse",this.dataSource)
}
getData(row:any){
  console.log("row==",row)
  console.log("row.id==",row.id)

}
edit(row:any){
this.router.navigate(['/admin/users/edit-all-users'], {queryParams:{row:row}})
}
addNew(type: any) {
  let tempDirection: Direction;
  if (localStorage.getItem('isRtl') === 'true') {
    tempDirection = 'rtl';
  } else {
    tempDirection = 'ltr';
  }
  const dialogRef = this.dialog.open(RoleDailogComponent, {
    data: {
      typeName: type,
    },
    direction: tempDirection,
   
  });
}
exportExcel() {
 const exportData: Partial<TableElement>[] = this.dataSource.map(
   (user: any) => ({
     'Name': user.name,
     'Role': user.type,
     'Gender':  user.gender,
     'Qualification': user.qualification,
     'Mobile': user.mobile,
     'Email': user.email,
     'Status' : user.Active ?  'Active': 'Inactive' 
   })
 );
  TableExportUtil.exportToExcel(exportData, 'AllUsers-list');
}

generatePdf() {
  const doc = new jsPDF();
  const headers = [['Name       ','Role       ','Gender','Qualification','Mobile','Email','Status']];
  const data = this.dataSource.map((user:any) =>
    [user.name,
      user.type,
      user.gender,
     user.qualification,
     user.mobile,
     user.email,
     user.Active ? 'Active': 'Inactive'
  ] );
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

  doc.save('AllUsers-list.pdf');
}

}
