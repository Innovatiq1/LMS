import { formatDate } from '@angular/common';
import { SelectionModel } from '@angular/cdk/collections';
import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder} from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import {CourseKitModel, CourseModel, CoursePaginationModel } from '@core/models/course.model';
import { CourseService } from '@core/service/course.service';
import { UtilsService } from '@core/service/utils.service';
import { TableElement, TableExportUtil } from '@shared';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-payment-report',
  templateUrl: './payment-report.component.html',
  styleUrls: ['./payment-report.component.scss']
})
export class PaymentReportComponent {
  displayedColumns: string[] = [
    'Student Name',
    'email',
    'Course Name',
    'Payment Mode',
    'Payment Date',
    'Amount',
    'Payment Status',
  ];
  
  breadscrums = [
    {
      items: ['Reports'],
      active: 'Payment Reports',
    },
  ];
  courseKitModel!: Partial<CourseKitModel>;
  totalItems: any;
  pageSizeArr = this.utils.pageSizeArr;
  selection = new SelectionModel<CourseModel>(true, []);
  dataSource: any;
  coursePaginationModel!: Partial<CoursePaginationModel>;
  searchTerm: string = '';
 

  constructor(private router: Router, private formBuilder: FormBuilder,
    public utils: UtilsService, private courseService: CourseService,
    private snackBar: MatSnackBar,private ref: ChangeDetectorRef,
  ) {
    this.coursePaginationModel = {};
  }

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild('filter', { static: true }) filter!: ElementRef;

  
  ngOnInit(): void {
   this.getAllCourse();
  }
  getAllCourse(){
    this.courseService.getAllPayments({ ...this.coursePaginationModel}).subscribe(response =>{
     this.dataSource = response.data.docs;
     this.ref.detectChanges();
     this.totalItems = response.data.totalDocs;
     this.coursePaginationModel.docs = response.docs;
    this.coursePaginationModel.page = response.page;
    this.coursePaginationModel.limit = response.limit;
    }, error => {
    });
  }
  pageSizeChange($event: any) {
    this.coursePaginationModel.page = $event?.pageIndex + 1;
    this.coursePaginationModel.limit = $event?.pageSize;
    this.getAllCourse();
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

view(id:any){

this.router.navigate(['/admin/budgets/view-course-payment/'], {queryParams:{id:id}})
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
        });
      }
    });
  }
   performSearch() {
    
    
    if(this.searchTerm){
    this.dataSource = this.dataSource?.filter((item: any) =>{   
      const search = (item.course + item.name).toLowerCase()
      return search.indexOf(this.searchTerm.toLowerCase())!== -1;
      
    }
    );
    } else {
       this.getAllCourse();

    }
  }
  exportExcel() {
   const exportData: Partial<TableElement>[] =
      this.dataSource.map((user:any) => ({
        User:user.name,
        Email:user.email,
        Course:user.course,
        Amount: '$'+user.price,
        PaymentDate: formatDate(new Date(user.createdAt), 'yyyy-MM-dd', 'en') || '',
        Status: user.status
      }));
    TableExportUtil.exportToExcel(exportData, 'Payment Report');
  }
  // pdf
  generatePdf() {
    const doc = new jsPDF();
    const headers = [['User','Email','Course','Amount', 'Payment Date', 'Status']];
    
    const data = this.dataSource.map((user:any) =>
      [user.name,
       user.email,
       user.course,
       '$'+user.price,
       formatDate(new Date(user.createdAt), 'yyyy-MM-dd', 'en') || '',
       user.status

    ] );
    const columnWidths = [20, 20, 20, 20, 20, 20, 20, 20, 20, 20];
    (doc as any).autoTable({
      head: headers,
      body: data,
      startY: 20,



    });
    doc.save('Payment Report.pdf');
  }
  getStatusClass(status: string): string {
    return status === 'Success' ? 'success' : 'fail';
  }
}
