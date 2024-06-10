import { SelectionModel } from '@angular/cdk/collections';
import { formatDate } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder} from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import {CourseKitModel, CourseModel, CoursePaginationModel } from '@core/models/course.model';
import { CourseService } from '@core/service/course.service';
import { UtilsService } from '@core/service/utils.service';
import { TableElement, TableExportUtil } from '@shared';
import { AppConstants } from '@shared/constants/app.constants';
import jsPDF from 'jspdf';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-program-payment',
  templateUrl: './program-payment.component.html',
  styleUrls: ['./program-payment.component.scss']
})
export class ProgramPaymentComponent {

  displayedColumns: string[] = [
    // 'select',
    'Student Name',
    'email',
    'Program Name',
    'Payment Date',
    'Amount',
    'Payment Status',
    // 'status',
    
  ];
  // dataSource1 = [
  //   { name: 'Ship Energy Efficiency Courses', date: 'Nov 9', amount: '2500', sname: 'Gung Tui', status: 'Done' },
  //   { name: 'Fuel Bunkering Operations', date: 'Nov 10', amount: '2000', sname: 'Chung Lee', status: 'Done' },
  // ];

  breadscrums = [
    {
      // title: 'Programs',
      items: ['Finance'],
      active: 'Program Payment',
    },
  ];
  
  courseKitModel!: Partial<CourseKitModel>;
  totalItems: any;
  pageSizeArr = this.utils.pageSizeArr;
  selection = new SelectionModel<CourseModel>(true, []);
  dataSource: any;
  coursePaginationModel!: Partial<CoursePaginationModel>;
  commonRoles: any;

  constructor(private router: Router, private formBuilder: FormBuilder,
    public utils: UtilsService, private courseService: CourseService,
    private snackBar: MatSnackBar,private ref: ChangeDetectorRef,
  ) {
   
    this.coursePaginationModel = {};
  }

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild('filter', { static: true }) filter!: ElementRef;
  
  ngOnInit(): void {
    this.commonRoles = AppConstants
   this.getAllPrograms();
  }
  getAllPrograms(){
    this.courseService.getAllProgramsPayments({ ...this.coursePaginationModel}).subscribe(response =>{
     this.dataSource = response.data.docs;
     this.ref.detectChanges();
     this.totalItems = response.data.totalDocs;
     this.coursePaginationModel.docs = response.docs;
     this.coursePaginationModel.page = response.page;
     this.coursePaginationModel.limit = response.limit;
     }, error => {
     });
  }
  view(id:any){
    
    this.router.navigate(['/admin/budgets/view-program-payment/'], {queryParams:{id:id}})
    // [routerLink]="['/admin/payment/view-payments/']"
    }
  pageSizeChange($event: any) {
    this.coursePaginationModel.page = $event?.pageIndex + 1;
    this.coursePaginationModel.limit = $event?.pageSize;
    this.getAllPrograms();
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
      title: "Confirm Deletion",
      text: "Are you sure you want to delete?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
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
          // confirmButtonColor: '#526D82',
        });
      }
    });
    
   
    // this.showNotification(
    //   'snackbar-danger',
    //   totalSelect + ' Record Delete Successfully...!!!',
    //   'top',
    //   'right'
    // );
  }

  generatePdf() {
    const doc = new jsPDF();
    const headers = [['Student','Email','Program', 'Payment Date', 'Amount', 'Status']];
    const data = this.dataSource.map((user: any) => [
      user.name,
      user.email,
      user.program,
      formatDate(new Date( user.createdAt), 'yyyy-MM-dd', 'en') || '',
      '$'+user.price,
      user.status,
    
    ]);
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
    doc.save('Program Payments.pdf');
  }

  exportExcel() {
    //k//ey name with space add in brackets
    const exportData: Partial<TableElement>[] = this.dataSource.map(
      (user: any) => ({
        Student: user.name,
        Email: user.email,
        Program: user.program,
        'Payment Date':  formatDate(new Date( user.createdAt), 'yyyy-MM-dd', 'en') || '',
        'Amount':'$'+user.price,
        'Status': user.status,
      })
    );
    TableExportUtil.exportToExcel(exportData, 'Program Payments');
  }
  getStatusClass(status: string): string {
    return status === 'success' ? 'success' : 'fail';
  }
  
}
