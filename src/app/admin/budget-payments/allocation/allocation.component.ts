import { SelectionModel } from '@angular/cdk/collections';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router, NavigationStart } from '@angular/router';
import { CourseKitModel, CourseModel, CoursePaginationModel } from '@core/models/course.model';
import { CourseService } from '@core/service/course.service';
import { UtilsService } from '@core/service/utils.service';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { TableElement, TableExportUtil } from '@shared';
import { EtmsService } from '@core/service/etms.service';

@Component({
  selector: 'app-allocation',
  templateUrl: './allocation.component.html',
  styleUrls: ['./allocation.component.scss']
})
export class AllocationComponent implements OnInit{
  displayedColumns: string[] = [
    'Department Name',
    // 'Percentage Allocated',
    'By Value',
    'Approval',
    'Budget-Allocated',
  ];

  breadscrums = [
    {
      title: 'Over All Budget',
      items: ['Finance'],
      active: 'Allocation',
    },
  ];
  courseKitModel!: Partial<CourseKitModel>;
  totalItems: any;
  pageSizeArr = this.utils.pageSizeArr;
  selection = new SelectionModel<CourseModel>(true, []);
  dataSource: any;
  coursePaginationModel!: Partial<CoursePaginationModel>;
  searchTerm: string = '';
  department?: CourseModel;
  id?: string;
 
  

 
  constructor(private router: Router, private formBuilder: FormBuilder,
    public utils: UtilsService, private courseService: CourseService,
    private snackBar: MatSnackBar,private ref: ChangeDetectorRef,
    private etmsService:EtmsService
  ) {
    this.coursePaginationModel = {};
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
      }
    });
  }

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild('filter', { static: true }) filter!: ElementRef;

  
  ngOnInit(): void {
   this.getAllDepartmentBudgets();
  }
  edit(id: any) {
    this.router.navigate(['/admin/budgets/edit-dept-budget-request'], {
      queryParams: { id: id, action: 'edit' },
    });
  }

  pageSizeChange($event: any) {
    this.coursePaginationModel.page = $event?.pageIndex + 1;
    this.coursePaginationModel.limit = $event?.pageSize;
    this.getAllDepartmentBudgets()
  }
  getAllDepartmentBudgets(){
    this.etmsService.getAllDepartmentBudgets({...this.coursePaginationModel}).subscribe((res) => {
      this.dataSource = res.docs;
      this.totalItems = res.totalDocs;
      this.coursePaginationModel.docs = res.docs;
      this.coursePaginationModel.page = res.page;
      this.coursePaginationModel.limit = res.limit;
    })
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
          text: 'Training Deleted Successfully...!!!',
          icon: 'success',
        });
      }
    });

  
  }
  approveCourse(): void {
    Swal.fire({
      title: 'Success',
      text: 'Training approved successfully.',
      icon: 'success',
    });
  }
  isAnyRowSelected(): boolean {
    return this.selection.hasValue();
  }

  exportExcel() {
    const exportData: Partial<TableElement>[] =
      this.dataSource.map((x: any) => ({
        'Department': x.departmentName,
        HOD: x.hod,
        Year: x.year,
        'Budget Allocated':  '$'+x.trainingBudget,
        'Status': x.approval,
      }));

    TableExportUtil.exportToExcel(exportData, 'Department-budget-allocation');
  }
  generatePdf() {
    const doc = new jsPDF();
    const headers = [[' Department','HOD','Year','Budget Allocated', 'Status']];
    
    const data = this.dataSource.map((x:any) =>
      [x.departmentName,
        x.hod,
        x.year,
        '$'+x.trainingBudget,
        x.approval,
  
    ] );
    const columnWidths = [20, 20, 20, 20, 20, 20, 20, 20, 20, 20];
    (doc as any).autoTable({
      head: headers,
      body: data,
      startY: 20,
  
  
  
    });
    doc.save('Department-budget-allocation.pdf');
  }


  delete(id: string){
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.etmsService.deleteBudget(id).subscribe((res) => {
          this.getAllDepartmentBudgets();
          Swal.fire(
            'Deleted!',
            'Budget Deleted Successfully.',
          'success'
          )
        })
      }
    })
  }

  
}
