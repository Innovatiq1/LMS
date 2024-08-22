import { SelectionModel } from '@angular/cdk/collections';
import { formatDate } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { CoursePaginationModel } from '@core/models/course.model';
import { EtmsService } from '@core/service/etms.service';
import { UtilsService } from '@core/service/utils.service';
import { TableElement, TableExportUtil } from '@shared';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-employee-status',
  templateUrl: './employee-status.component.html',
  styleUrls: ['./employee-status.component.scss'],
})
export class EmployeeStatusComponent {
  displayedColumns: string[] = [
    'ID',
    'course',
    'created at',
    'ro approved on',
    'director approved on',
    'trainingadmin approved on',
    'approval stage',
    'status',
    'reason',
    'payment',
  ];
  coursePaginationModel!: Partial<CoursePaginationModel>;
  totalItems: any;
  pageSizeArr = this.utils.pageSizeArr;

  id: any;
  selection = new SelectionModel<any>(true, []);
  dataSource: any;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  breadscrums = [
    {
      title: 'Programs',
      items: ['Finance'],
      active: 'Training Request',
    },
  ];

  constructor(
    private router: Router,
    private etmsService: EtmsService,
    public utils: UtilsService
  ) {
    this.coursePaginationModel = {};
  }
  ngOnInit() {
    this.getAllRequestsByEmployeeId();
  }

  createReq() {
    this.router.navigate(['/admin/budgets/create-request']);
  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.length;
    return numSelected === numRows;
  }
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.forEach((row: any) => this.selection.select(row));
  }

  getAllRequestsByEmployeeId() {
    let employeeId = localStorage.getItem('id');
    this.etmsService
      .getAllRequestsByEmployeeId({ ...this.coursePaginationModel, employeeId })
      .subscribe(
        (response) => {
          this.dataSource = response.data.docs;
          this.totalItems = response.data.totalDocs;
          this.coursePaginationModel.docs = response.docs;
          this.coursePaginationModel.page = response.page;
          this.coursePaginationModel.limit = response.limit;
        },
        (error) => {}
      );
  }

  pageSizeChange($event: any) {
    this.coursePaginationModel.page = $event?.pageIndex + 1;
    this.coursePaginationModel.limit = $event?.pageSize;
    this.getAllRequestsByEmployeeId();
  }
  copy(id: string) {
    this.router.navigate(['/admin/e-tms/copy-request'], {
      queryParams: { id: id, action: 'copy' },
    });
  }
  edit(id: string) {
    this.router.navigate(['/admin/e-tms/edit-request'], {
      queryParams: { id: id, action: 'edit' },
    });
  }

  generatePdf() {
    const doc = new jsPDF();
    const headers = [
      [
        'REQUEST-ID ',
        'Course',
        'Created At',
        'Approver 1',
        'Approver 2',
        'Approver 3',
        'Approval Stage',
        'Status',
        'Reason',
        'Payment',
      ],
    ];
    const data = this.dataSource.map((user: { requestId: any; courseName: any; courseCost: string; createdAt: string | number | Date; roApprovedOn: any; directorApprovedOn: any; trainingadminApprovedOn: any; roApproval: any; directorApproval: any; trainingAdminApproval: any;roReason: any; directorReason: any; trainingAdminReason: any; }) => [
      user.requestId,
      user.courseName,
      '$' + user.courseCost,
      formatDate(new Date(user.createdAt), 'yyyy-MM-dd', 'en') || '',
      user.roApprovedOn,
      user.directorApprovedOn,
      user.trainingadminApprovedOn,
      `Approver 1
  Approver 2
  Approver 3`,
  `${user.roApproval}
  ${user.directorApproval}
  ${user.trainingAdminApproval}`,
     `${user.roReason} 
     ${user.directorReason} 
     ${user.trainingAdminReason}`,
    ]);

    const columnWidths = [20, 20, 20, 20, 20, 20, 20, 20, 20, 20];
    const margin = 10;
    const pageHeight = doc.internal.pageSize.height;

    let startY = margin;
    let remainingData = data.slice();

    while (remainingData.length > 0) {
        const currentData = remainingData.splice(0, 25);

        (doc as any).autoTable({
            head: headers,
            body: currentData,
            startY: startY,
            headStyles: {
                fontSize: 10,
                cellWidth: 'wrap',
            },
            columnStyles: {
                0: { columnWidth: columnWidths[0] },
                1: { columnWidth: columnWidths[1] },
                2: { columnWidth: columnWidths[2] },
                3: { columnWidth: columnWidths[3] },
                4: { columnWidth: columnWidths[4] },
                5: { columnWidth: columnWidths[5] },
                6: { columnWidth: columnWidths[6] },
                7: { columnWidth: columnWidths[7] },
                8: { columnWidth: columnWidths[8] },
                9: { columnWidth: columnWidths[9] },
            },
        });

        if (remainingData.length > 0) {
            doc.addPage();
            startY = margin;
        }
    }
    doc.save('Training-request.pdf');
}


  exportExcel() {
    const exportData: Partial<TableElement>[] = this.dataSource.map(
      (user: any) => ({
        'REQUEST-ID': user.requestId,
        'Course': user.courseName,
        'Payment': '$' + user.courseCost,
        'Created At':  formatDate(new Date(user.createdAt), 'yyyy-MM-dd', 'en') || '',
        'Approver 1':   user.roApprovedOn,
        'Approver 2' :  user.directorApprovedOn,
        'Approver 3' :  user.trainingadminApprovedOn,
        'Approval Stage' : `Approver 1\nApprover 2\nApprover 3`,
        'Status' :  `${user.roApproval}\n${user.directorApproval}\n${user.trainingAdminApproval}`,
        'Reason' :  `${user.roReason}\n${user.directorReason}\n${user.trainingAdminReason}`,
   
      
      })
    );
    TableExportUtil.exportToExcel(exportData, 'Training-request');
  }
}
