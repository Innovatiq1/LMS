import { SelectionModel } from '@angular/cdk/collections';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CourseModel, CoursePaginationModel, MainCategory, SubCategory } from '@core/models/course.model';
import { CourseService } from '@core/service/course.service';
import { forkJoin, map} from 'rxjs';
import Swal from 'sweetalert2';
import { TableElement, TableExportUtil } from '@shared';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

@Component({
  selector: 'app-course-approval',
  templateUrl: './course-approval.component.html',
  styleUrls: ['./course-approval.component.scss']
})
export class CourseApprovalComponent {
  displayedColumns: string[] = [
    // 'select',
    'Course Name',
    'Course Code',
    'Main Category',
    'Sub Category',
    'Fees',
    'status'
  ];
  breadscrums = [
    {
      title: 'Course Approval',
      items: ['Approval'],
      active: 'Course Approval',
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
  searchTerm: string = '';

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
      this.getCoursesList();
      this.cd.detectChanges();
    });
  }
  mainCategoryChange(): void {
    this.coursePaginationModel.sub_category = (0).toString();
    this.subCategories =this.coursePaginationModel.main_category
        ? this.allSubCategories.filter((item) => item.main_category_id === this.coursePaginationModel.main_category):[]
        this.getCoursesList()
  }
  private mapCategories(): void {
    this.coursePaginationModel.docs?.forEach((item) => {
      item.main_category_text = this.mainCategories.find((x) => x.id === item.main_category)?.category_name;
    });

    this.coursePaginationModel.docs?.forEach((item) => {
      item.sub_category_text = this.allSubCategories.find((x) => x.id === item.sub_category)?.category_name;
    });
    
  }
  pageSizeChange($event: any) {
    this.coursePaginationModel.page= $event?.pageIndex + 1;
    this.coursePaginationModel.limit= $event?.pageSize;
    this.getCoursesList();
   }
 
  getCoursesList(){
    let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
        this.courseService.getAllCourses(userId,{...this.coursePaginationModel, status: 'inactive' })
        .subscribe(response => {
          this.isLoading = false;
          this.coursePaginationModel.docs = response.data.docs;
          this.coursePaginationModel.page = response.data.page;
            this.coursePaginationModel.limit = response.data.limit;
            this.coursePaginationModel.totalDocs = response.data.totalDocs;
            this.dataSource=response.data.docs;
            this.totalItems=response.data.totalDocs
            this.mapCategories();
                  }, (error) => {    
          }
          )
  }
  approveCourse(course: CourseModel): void {
    course.status = 'active';

    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to approve this course!',
      icon: 'warning',
      confirmButtonText: 'Yes',
      showCancelButton: true,
      cancelButtonColor: '#d33',
    }).then((result) => {
      if (result.isConfirmed){
        this.courseService.updateCourse(course).subscribe(() => {
          Swal.fire({
            title: 'Success',
            text: 'Course approved successfully.',
            icon: 'success',
          });
          this.getCoursesList();
        }, (error) => {
          Swal.fire({
            title: 'Error',
            text: 'Failed to approve course. Please try again.',
            icon: 'error',
          });
        });
      }
    });
  
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
  performSearch() {
    if(this.searchTerm){
    this.dataSource = this.dataSource?.filter((item: any) =>{   
      const search = (item.main_category_text + item.sub_category_text + item.title).toLowerCase()
      return search.indexOf(this.searchTerm.toLowerCase())!== -1;
      
    }
    );
    } else {
       this.getCoursesList();

    }
  }
  exportExcel() {
   const exportData: Partial<TableElement>[] = this.dataSource.map(
     (user: any) => ({
       'Course Name': user.title,
       'Course Code': user.courseCode,
       'Main Category': user.main_category_text,
       'Sub Category': user.sub_category_text,
       'Fees': user.fee,
     })
   );
    TableExportUtil.exportToExcel(exportData, 'Course-approve-list');
  }

  generatePdf() {
    const doc = new jsPDF();
    const headers = [['Course Name','Course Code','Main Category','Sub Category','Fees']];
    const data = this.dataSource.map((user:any) =>
      [user.title,
        user.courseCode,
       user.main_category_text,
       user.sub_category_text,
       user.fee
    ] );
    const columnWidths = [20, 20, 20, 20, 20, 20, 20, 20, 20, 20];
    (doc as any).autoTable({
      head: headers,
      body: data,
      startY: 20,



    });
    doc.save('Course-approve-list.pdf');
  }

}
