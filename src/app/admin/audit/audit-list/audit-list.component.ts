import { SelectionModel } from '@angular/cdk/collections';
import { formatDate } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { AuditModel, AuditPaginationModel } from '@core/models/audit.model';
import { CourseModel, CoursePaginationModel } from '@core/models/course.model';
import { AuditService } from '@core/service/audit.service';
import { CourseService } from '@core/service/course.service';
import { UtilsService } from '@core/service/utils.service';
import { TableElement, TableExportUtil } from '@shared';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-audit-list',
  templateUrl: './audit-list.component.html',
  styleUrls: ['./audit-list.component.scss'],
})
export class AuditListComponent {
  displayedColumns: string[] = [
    // 'select',
    'Name',
    'Email',
    'User Type',
    

    'Login Time',
    'Logout Time',
    
  ];
  breadscrums = [
    {
      title: 'Logs',
      items: ['Logs'],
      active: 'List',
    },
  ];

  pages = 3;
  nums = [...Array(this.pages).keys()];
  curr = 0;
  totalItems: any;
  pageSizeArr = this.utils.pageSizeArr;
  AuditPaginationModel: Partial<AuditPaginationModel>;
  dataSource: any;
  dataSource$: any;
  isLoading = true;
  selection = new SelectionModel<CourseModel>(true, []);
  coursePaginationModel!: Partial<CoursePaginationModel>;

  constructor(
    public auditService: AuditService,
    private utils: UtilsService,
    private courseService: CourseService,
    private snackBar: MatSnackBar
  ) {
    this.dataSource = new MatTableDataSource<AuditModel>();
    this.AuditPaginationModel = {};
    this.getAuditList();
  }

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild('filter', { static: true }) filter!: ElementRef;

  upload() {
    document.getElementById('input')?.click();
  }
  pageSizeChange($event: any) {
    this.AuditPaginationModel.page = $event?.pageIndex + 1;
    this.AuditPaginationModel.limit = $event?.pageSize;
    this.getAuditList();
  }
  getAuditList(filter?: any): void {
    let payload = { ...this.AuditPaginationModel};
    if (filter) payload = { ...payload, filter };
    this.auditService.getAuditList(payload).subscribe((response: any) => {
      this.dataSource = response.docs;
      this.isLoading = false;
      this.totalItems = response.totalDocs
      this.AuditPaginationModel.docs = response.docs;
      this.AuditPaginationModel.page = response.page;
      this.AuditPaginationModel.limit = response.limit;
      this.AuditPaginationModel.totalDocs = response.totalDocs;
    });
  }

  private refreshTable() {
    this.paginator._changePageSize(this.paginator.pageSize);
  }
  /** Whether the number of selected elements matches the total number of rows. */
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
      title: 'Are you sure?',
      text: 'Do you want to update this user!',
      icon: 'warning',
      confirmButtonText: 'Yes',
      showCancelButton: true,
      cancelButtonColor: '#d33',
    }).then((result) => {
      if (result.isConfirmed){
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
  exportExcel() {
    const exportData: Partial<TableElement>[] = this.dataSource.map(
      (user: any) => ({
        'Name': user.name,
        'Email': user?.email,
        'User Type': user.type,
        'Login Time': formatDate(new Date(user.loginTime), 'yyyy-MM-dd hh:mm:ss a', 'en') || '',
        'Logout Time': user.logoutTime?formatDate(new Date(user.logoutTime), 'yyyy-MM-dd hh:mm:ss a', 'en') :''
      })
    );
    TableExportUtil.exportToExcel(exportData, 'Audit-list');
  }

  generatePdf() {
    const doc = new jsPDF();
    const headers = [
      ['Name', 'Email', 'User Type', 'Login Time', 'Logout Time'],
    ];
    const data = this.dataSource.map((user: any) => [
      user.name,
      user?.email,
      user.type,
      formatDate(new Date(user.loginTime), 'yyyy-MM-dd hh:mm:ss a', 'en') || '',
      user.logoutTime?formatDate(new Date(user.logoutTime), 'yyyy-MM-dd hh:mm:ss a', 'en'):''
    ]);
    const columnWidths = [20, 20, 20, 20, 20, 20, 20, 20, 20, 20];
    (doc as any).autoTable({
      head: headers,
      body: data,
      startY: 20,
    });

    doc.save('Audit-list.pdf');
  }
}
