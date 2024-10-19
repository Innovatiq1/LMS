import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { InstructorLeaveRequestService } from './leave-request.service';
import { HttpClient } from '@angular/common/http';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, fromEvent, merge } from 'rxjs';
import { map } from 'rxjs/operators';
import { LeaveRequest } from './leave-request.model';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { AuthenService } from '@core/service/authen.service';
import { Logger } from '@core/service/logger.service';
import { TableElement, TableExportUtil } from '@shared';
import jsPDF from 'jspdf';
import { formatDate } from '@angular/common';
import { UtilsService } from '@core/service/utils.service';
import { AppConstants } from '@shared/constants/app.constants';
import { EditLeaveRequestComponent } from './dialogs/edit-leave-request/edit-leave-request.component';
const Logging = new Logger('AnnouncementService');

@Component({
  selector: 'app-leave-request',
  templateUrl: './leave-request.component.html',
  styleUrls: ['./leave-request.component.scss'],
  providers: [],
})
export class InstructorLeaveRequestComponent implements OnInit {
  displayedColumns = ['img', 'className', 'name', 'applyDate', 'toDate', 'status', 'reason'];
  dataSource: LeaveRequest[] = [];
  pageSizeArr = this.utils.pageSizeArr;
  totalItems = 0;
  isLoading = true;
  breadscrums = [
        {
          title: 'Leave Request',
          items: ['Reschedule'],
          active: 'Reschedule Requests',
        },
      ];
  coursePaginationModel = {
    page: 1,
    limit: 10,
    totalDocs: 0,
    docs: [],
  };
  filterName = '';
  edit = false;

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild('filter', { static: true }) filter!: ElementRef;
  commonRoles:any;

  constructor(
    public httpClient: HttpClient,
    public leaveRequestService: InstructorLeaveRequestService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private router: Router,
    private authenService: AuthenService,
    public utils:UtilsService
  ) {}

  ngOnInit() {
    const roleDetails = this.authenService.getRoleDetails()[0].menuItems;
    this.checkEditPermission(roleDetails);
    this.getLeaveRequestList();
        this.commonRoles = AppConstants

  }

  checkEditPermission(roleDetails: any) {
    const urlPath = this.router.url.split('/');
    const parentId = urlPath[urlPath.length - 2];
    const childId = urlPath[urlPath.length - 1];
    const parentData = roleDetails.filter((item: any) => item.id == parentId);
    const childData = parentData[0].children.filter((item: any) => item.id == childId);
    const actions = childData[0].actions;
    const editAction = actions.filter((item: any) => item.title == 'Edit');

    this.edit = editAction.length > 0;
  }

  pageSizeChange(event: any) {
    this.coursePaginationModel.page = event?.pageIndex + 1;
    this.coursePaginationModel.limit = event?.pageSize;
    this.getLeaveRequestList(this.coursePaginationModel);
  }

  performSearch() {
    this.coursePaginationModel.page = 1;
    this.paginator.pageIndex = 0;
    this.getLeaveRequestList();
  }

  getLeaveRequestList(filter?: any) {
    const filterProgram = this.filter.nativeElement.value || this.filterName;
    let id = JSON.parse(localStorage.getItem('user_data')!).user.id;

    const payload = { ...this.coursePaginationModel, title: filterProgram};
    
    this.leaveRequestService.getLeaveRequestList(payload,id).subscribe((res: any) => {
      this.isLoading = false;
      this.dataSource = res.docs;
      console.log('res',res.docs)
      this.totalItems = res.totalDocs;
      this.coursePaginationModel.docs = res.docs;
      this.coursePaginationModel.page = res.page;
      this.coursePaginationModel.limit = res.limit;
      this.coursePaginationModel.totalDocs = res.totalDocs;
      
      if (res.totalRecords <= this.coursePaginationModel.limit || res.totalRecords <= 0) {
        this.isLoading = true;
      }
    });
  }

  editCall(row: LeaveRequest) {
    const dialogRef = this.dialog.open(EditLeaveRequestComponent, {
            data: {
              leaveRequest: row,
              action: 'edit',
            },
          });

          dialogRef.afterClosed().subscribe(result => {
            if (result === 1) {
              console.log('hii')
              // Call getLeaveRequestList to refresh data
              this.getLeaveRequestList();
            }
          });
        
  }

  removeSelectedRows() {
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
        this.deleteSelectedRows();
      }
    });
  }

  deleteSelectedRows() {
    // Perform deletion of selected rows logic
  }
  
  showNotification(colorName: string, text: string) {
    this.snackBar.open(text, '', {
      duration: 2000,
      panelClass: colorName,
    });
  }

  exportExcel() {
    const exportData: Partial<TableElement>[] =   this.dataSource.map((x) => ({
            'Class Name': x.className,
            "Student Name": x.learnerId?.name,
            "Apply Date":formatDate(new Date(x.applyDate), 'yyyy-MM-dd', 'en') || '',
            "To Date":formatDate(new Date(x.toDate), 'yyyy-MM-dd', 'en') || '',
            "Status": x.status,
            "Reason": x.reason,
    }));

    TableExportUtil.exportToExcel(exportData, 'Reschedule requests-list');
}

removeHtmlTags(html: string) {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
}

generatePdf() {
      const doc = new jsPDF();
      const headers = [[' Class Name','Roll No', 'Student Name','Apply Date','From Date','To Date','Status','Reason']];
      
      const data = this.dataSource.map((user:any) =>
        [user.className,
        user.learnerId?.name, 
        formatDate(new Date(user.applyDate), 'yyyy-MM-dd', 'en') || '',
        formatDate(new Date(user.toDate), 'yyyy-MM-dd', 'en') || '',
        user.status,
        user.reason
          
          
      ] );
      const columnWidths = [20, 20, 20, 20, 20, 20, 20, 20, 20, 20];
      (doc as any)?.autoTable({
        head: headers,
        body: data,
        startY: 20,
    
    
    
      });
      doc.save('leaverequest-list.pdf');
    }
    

}
