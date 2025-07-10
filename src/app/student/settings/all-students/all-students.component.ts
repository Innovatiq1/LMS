import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DataSource } from '@angular/cdk/collections';
import { ActivatedRoute } from '@angular/router';
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
import { Users, UsersPaginationModel } from '@core/models/user.model';
import { Students } from 'app/admin/students/students.model';
import { StudentsService } from 'app/admin/students/students.service';
import { AppConstants } from '@shared/constants/app.constants';
import { AuthenService } from '@core/service/authen.service';
import { CoursePaginationModel } from '@core/models/course.model';
import { UtilsService } from '@core/service/utils.service';
import { UserProfileModule } from 'app/admin/user-profile/user-profile.module';
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
  convertedUserData: any[] = [];
  exampleDatabase?: StudentsService;
  dataSource!: any;
  selection = new SelectionModel<Students>(true, []);
  usersPaginationModel!: Partial<UsersPaginationModel>;
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
  isTblLoading: boolean = true;
  totalItems:any;
  pageSizeArr = this.utils.pageSizeArr;
  filterName: any;
  dataSourceGrid: any;
  studentData: any;

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public studentsService: StudentsService,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private cdRef: ChangeDetectorRef,
    private authenService: AuthenService,
    private ref: ChangeDetectorRef,  public utils: UtilsService
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

  ngOnInit() {
    const roleDetails =
      this.authenService.getRoleDetails()[0].settingsMenuItems;
    let urlPath = this.router.url.split('/');
    const parentId = `${urlPath[1]}/${urlPath[2]}`;
    const childId = urlPath[urlPath.length - 2];
    const subChildId = urlPath[urlPath.length - 1];
    let parentData = roleDetails.filter((item: any) => item.id == parentId);
    let childData = parentData[0].children.filter(
      (item: any) => item.id == childId
    );
    let subChildData = childData[0].children.filter(
      (item: any) => item.id == subChildId
    );
    let actions = subChildData[0].actions;
    let createAction = actions.filter((item: any) => item.title == 'Create');
    let viewAction = actions.filter((item: any) => item.title == 'View');

    if (createAction.length > 0) {
      this.isCreate = true;
    }
    if (viewAction.length > 0) {
      this.isView = true;
    }
    this.loadData();
    this.loadDataGridData();
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.studentData = navigation.extras.state['data'];
      console.log('Received Data:', this.studentData);
    }
    
  }
  
  ngAfterViewInit() {
    this.cdRef.detectChanges(); 
  }

  convertToTrainee(data: any) {
    console.log("Convert Triggered with:", data);
  
    if (!this.dataSource || !this.dataSource.length) {
      console.warn('No students loaded yet.');
      return;
    }
  
    // Match by name or email from existing table data
    const matchedStudent = this.dataSource.find((student: any) =>
      student.email === data.email || student.name === data.name
    );
  
    if (matchedStudent) {
      const alreadyExists = this.convertedUserData.some(
        s => s.email === matchedStudent.email || s.name === matchedStudent.name
      );
  
      if (!alreadyExists) {
        this.convertedUserData.push(matchedStudent);
        this.showNotification('bg-success', 'Student matched and added!', 'top', 'right');
      } else {
        this.showNotification('bg-warning', 'Already added.', 'top', 'right');
      }
    } else {
      this.showNotification('bg-danger', 'No match found.', 'top', 'right');
    }
  }
  

  refresh() {
    this.loadData();
    this.loadDataGridData();
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
      : this.dataSource.forEach((row: Students) => this.selection.select(row));
  }
  removeSelectedRows() {
    const totalSelect = this.selection.selected.length;
    this.selection.selected.forEach((item) => {
      const index: number = this.dataSource.findIndex(
        (d: Students) => d === item
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
    
  const type = AppConstants.STUDENT_ROLE;
  let filterProgram = this.filterName;
  const payload = { ...this.usersPaginationModel,title:filterProgram };
    this.studentsService.getAllStudentss(payload,type).subscribe((result) => {
      console.log('result: ', result.data);
      this.isTblLoading = false;
      this.dataSource = result.data.docs;
      this.totalItems = result.data.totalDocs;
      this.usersPaginationModel.docs = result.data.docs;
      this.usersPaginationModel.page = result.data.page;
      this.usersPaginationModel.limit = result.data.limit;
    });
  }
  performSearch() {
    this.usersPaginationModel.page = 1;
    this.paginator.pageIndex = 0;
      this.loadData();
  }
  pageSizeChange($event: any) {
    this.usersPaginationModel.page = $event?.pageIndex + 1;
    this.usersPaginationModel.limit = $event?.pageSize;
    this.loadData()
  
  }
  public loadDataGridData() {
    const type = AppConstants.STUDENT_ROLE;
    let filterProgram = this.filterName;
    const payload = { ...this.usersPaginationModel,title:filterProgram };
      this.studentsService.getAllStudentss(payload,type).subscribe((result) => {
        this.isTblLoading = false;
        this.dataSourceGrid = result.data.docs;
        this.totalItems = result.data.totalDocs;
        this.usersPaginationModel.docs = result.data.docs;
        this.usersPaginationModel.page = result.data.page;
        this.usersPaginationModel.limit = result.data.limit;
      });
    }
  gridpageSizeChange($event: any) {
    this.usersPaginationModel.page = $event?.pageIndex + 1;
    this.usersPaginationModel.limit = $event?.pageSize;
    this.loadDataGridData()
  
  }
  
  exportExcel() {
    const exportData: Partial<TableElement>[] = this.dataSource.map(
      (x: {
        name: any;
        department: any;
        gender: any;
        education: any;
        mobile: any;
        email: any;
        Active: any;
      }) => ({
        Name: x.name,
        Department: x.department,
        Gender: x.gender,
        Education: x.education,
        Mobile: x.mobile,
        Email: x.email,
        Status: x.Active ? 'Active' : 'Inactive',
      })
    );

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
    this.router.navigate(
      ['/student/settings/all-user/all-students/view-student'],
      {
        queryParams: { data: id },
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
