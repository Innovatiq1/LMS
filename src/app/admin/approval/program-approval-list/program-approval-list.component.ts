import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { BehaviorSubject, forkJoin, fromEvent, merge, Observable } from 'rxjs';
import { SelectionModel } from '@angular/cdk/collections';
import {
  TableExportUtil,
  TableElement,
  UnsubscribeOnDestroyAdapter,
} from '@shared';
import { formatDate } from '@angular/common';
import { MatMenuTrigger } from '@angular/material/menu';
import { CourseModel, CoursePaginationModel, MainCategory, SubCategory } from '@core/models/course.model';
import { Router } from '@angular/router';
import { CourseService } from '@core/service/course.service';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import 'jspdf-autotable';


@Component({
  selector: 'app-program-approval-list',
  templateUrl: './program-approval-list.component.html',
  styleUrls: ['./program-approval-list.component.scss']
})
export class ProgramApprovalListComponent
implements OnInit{
  displayedColumns: string[] = [
    // 'select',
    'Program Name',
    'Compulsory Count',
    'Elective Count',
    'status'
  ];
  breadscrums = [
    {
      title: 'Program Approval',
      items: ['Approval'],
      active: 'Program Approval',
    },
  ];
  edit :boolean = false;
  dataSource: any;
  mainCategories!: MainCategory[];
  subCategories!: SubCategory[];
  allSubCategories!: SubCategory[];
  coursePaginationModel: Partial<CoursePaginationModel>;
  totalItems: any;
  pageSizeArr = [10, 20, 50, 100];
  isLoading = true;
  selection = new SelectionModel<CourseModel>(true, []);
  searchTerm :string ='';

  constructor(private router: Router,
  private courseService: CourseService,private cd: ChangeDetectorRef, private snackBar: MatSnackBar){
    this.coursePaginationModel = {};
    this.coursePaginationModel.main_category = '0';
    this.coursePaginationModel.sub_category = '0';
  }
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild('filter', { static: true }) filter!: ElementRef;

  upload() {
    document.getElementById('input')?.click();
  }
  selectopt(item: any) {
    item.optselected = !item.optselected;
  }

  ngOnInit(): void {
    this.setup()
  }
  private setup(): void {
    forkJoin({
      mainCategory: this.courseService.getMainCategories(),
      subCategory: this.courseService.getSubCategories(),
    }).subscribe((response:any) => {
      this.mainCategories = response.mainCategory;
      this.allSubCategories = response.subCategory;
      this.getProgramList();
      this.cd.detectChanges();
    });
  }
  pageSizeChange($event: any) {
    this.coursePaginationModel.page= $event?.pageIndex + 1;
    this.coursePaginationModel.limit= $event?.pageSize;
    this.getProgramList();
   }

  getProgramList(filters?: any) {
    this.courseService.getCourseProgram({...this.coursePaginationModel,status:'inactive'}).subscribe(
      (response: any) => {
        this.totalItems = response.totalDocs;
        this.dataSource = response.docs;
        this.coursePaginationModel.docs = response.docs;
        this.coursePaginationModel.page = response.page;
        this.coursePaginationModel.limit = response.limit;
        this.coursePaginationModel.totalDocs = response.totalDocs;
      },
      (error) => {
      }
    );
  }
  performSearch() {
    if(this.searchTerm){
    this.dataSource = this.dataSource?.filter((item: any) =>{
      const searchList = (item?.title).toLowerCase()
      return searchList.indexOf(this.searchTerm.toLowerCase()) !== -1
    }
    );
    } else {
      this.getProgramList();

    }
  }
  approveProgram(id:any,program: any): void {
    program.status = 'active';

    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to approve this program!',
      icon: 'warning',
      confirmButtonText: 'Yes',
      showCancelButton: true,
      cancelButtonColor: '#d33',
    }).then((result) => {
      if (result.isConfirmed){
        this.courseService.updateCourseProgram(id,program).subscribe(() => {
          Swal.fire({
            title: 'Success',
            text: 'Program approved successfully.',
            icon: 'success',
          });
          this.getProgramList();
        }, (error) => {
          Swal.fire({
            title: 'Error',
            text: 'Failed to approve program. Please try again.',
            icon: 'error',
          });
        });
      }
    });
 
  }
  exportExcel() {
   const exportData: Partial<TableElement>[] =
      this.dataSource.map((user:any) => ({
        ProgramName:user?.title,
        CompulsoryCount: user?.coreCourseCount,
        ElectiveCount: user?.electiveCourseCount
       
      }));
    TableExportUtil.exportToExcel(exportData, 'Program Approve-list');
  }
  generatePdf() {
    const doc = new jsPDF();
    const headers = [['Program Name','Compulsory Count','Elective Count']];
    const data = this.dataSource.map((user:any) =>
      [user?.title,
        user?.coreCourseCount,
       user?.electiveCourseCount,
       

    ] );
    const columnWidths = [20, 20, 20, 20, 20, 20, 20, 20, 20, 20];
    (doc as any).autoTable({
      head: headers,
      body: data,
      startY: 20,
    });
    doc.save('Program Approve-list.pdf');
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
      text: "Are you sure you want to delete this course kit?",
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
}

