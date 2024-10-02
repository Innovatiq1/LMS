import { SelectionModel } from '@angular/cdk/collections';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import {
  CourseModel,
  CoursePaginationModel,
  MainCategory,
  SubCategory,
} from '@core/models/course.model';
import { CourseService } from '@core/service/course.service';
import { forkJoin, map } from 'rxjs';
import Swal from 'sweetalert2';
import { TableElement, TableExportUtil } from '@shared';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { formatDate } from '@angular/common';
import { AuthenService } from '@core/service/authen.service';

@Component({
  selector: 'app-in-active-courses',
  templateUrl: './in-active-courses.component.html',
  styleUrls: ['./in-active-courses.component.scss'],
})
export class InActiveCoursesComponent {
  displayedColumns: string[] = [
    'Course Name',
    'status',
    'Course Code',
    'Fee Type',
    'Main Category',
    'days',
    'hr',
    'vendors',
    'startDate',
    'endDate',
    'Fees',
  ];
  breadscrums = [
    {
      title: 'Course Approval',
      items: ['Submitted Course'],
      active: 'Pending Courses',
    },
  ];
  edit: boolean = false;
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
  view = false;
  filterName: string = '';
  userGroupIds: string = '';

  constructor(
    private router: Router,
    private courseService: CourseService,
    private cd: ChangeDetectorRef,
    private snackBar: MatSnackBar,
    private authenService: AuthenService
  ) {
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
    const roleDetails =this.authenService.getRoleDetails()[0].menuItems
    let urlPath = this.router.url.split('/');
    const parentId = `${urlPath[1]}/${urlPath[2]}`;
    const childId =  urlPath[urlPath.length - 2];
    const subChildId =  urlPath[urlPath.length - 1];
    let parentData = roleDetails.filter((item: any) => item.id == parentId);
    let childData = parentData[0].children.filter((item: any) => item.id == childId);
    let subChildData = childData[0].children.filter((item: any) => item.id == subChildId);
    let actions = subChildData[0].actions
    let viewAction = actions.filter((item:any) => item.title == 'View')

    if(viewAction.length >0){
      this.view = true;
    }
    this.setup();
  }
  private setup(): void {
    forkJoin({
      mainCategory: this.courseService.getMainCategories(),
      subCategory: this.courseService.getSubCategories(),
    }).subscribe((response: any) => {
      this.mainCategories = response.mainCategory;
      this.allSubCategories = response.subCategory;
      this.getCoursesList();
      this.cd.detectChanges();
    });
  }
  mainCategoryChange(): void {
    this.coursePaginationModel.sub_category = (0).toString();
    this.subCategories = this.coursePaginationModel.main_category
      ? this.allSubCategories.filter(
          (item) =>
            item.main_category_id === this.coursePaginationModel.main_category
        )
      : [];
    this.getCoursesList();
  }
  private mapCategories(): void {
    this.coursePaginationModel.docs?.forEach((item) => {
      item.main_category_text = this.mainCategories.find(
        (x) => x.id === item.main_category
      )?.category_name;
    });

    this.coursePaginationModel.docs?.forEach((item) => {
      item.sub_category_text = this.allSubCategories.find(
        (x) => x.id === item.sub_category
      )?.category_name;
    });
  }
  pageSizeChange($event: any) {
    this.coursePaginationModel.page = $event?.pageIndex + 1;
    this.coursePaginationModel.limit = $event?.pageSize;
    this.getCoursesList();
  }

  getCoursesList() {
    let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
    let filterProgram = this.filterName;
    const payload = { ...this.coursePaginationModel,title:filterProgram,status: 'inactive' };
  if(this.userGroupIds){
    payload.userGroupId=this.userGroupIds
  }
        this.courseService
      .getAllCourses(userId,payload)
      .subscribe(
        (response) => {
          this.isLoading = false;
          this.coursePaginationModel.docs = response.data.docs;
          this.coursePaginationModel.page = response.data.page;
          this.coursePaginationModel.limit = response.data.limit;
          this.coursePaginationModel.totalDocs = response.data.totalDocs;
          this.dataSource = response.data.docs;
          this.totalItems = response.data.totalDocs;
          this.mapCategories();
        },
        (error) => {}
      );
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
      if (result.isConfirmed) {
        this.courseService.updateCourse(course).subscribe(
          () => {
            Swal.fire({
              title: 'Success',
              text: 'Course approved successfully.',
              icon: 'success',
            });
            this.getCoursesList();
          },
          (error) => {
            Swal.fire({
              title: 'Error',
              text: 'Failed to approve course. Please try again.',
              icon: 'error',
            });
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
      title: 'Confirm Deletion',
      text: 'Are you sure you want to delete this course kit?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
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
    // if (this.searchTerm) {
    //   this.dataSource = this.dataSource?.filter((item: any) => {
    //     const search = (
    //       item.main_category_text +
    //       item.sub_category_text +
    //       item.title
    //     ).toLowerCase();
    //     return search.indexOf(this.searchTerm.toLowerCase()) !== -1;
    //   });
    // } else {
      this.getCoursesList();
    // }
  }
  exportExcel() {
    const exportData: Partial<TableElement>[] = this.dataSource.map(
      (x: any) => ({
        Course: x.title,
        Status: x.status === 'inactive' ? 'Pending' : '',
        Code: x.courseCode,
        'Main Category': x.main_category_text,
        Days: x.course_duration_in_days || 0,
        Hours: x.training_hours || 0,
        Vendor: x.vendor,
        Payment: x.fee === null ? 0 : '$'+x.fee,
        'Start Date':
          formatDate(new Date(x.sessionStartDate), 'yyyy-MM-dd', 'en') || '',
        'End Date':
          formatDate(new Date(x.sessionEndDate), 'yyyy-MM-dd', 'en') || '',
      })
    );
    TableExportUtil.exportToExcel(exportData, 'Pending Course List');
  }

  generatePdf() {
    const doc = new jsPDF();
    const headers = [
      [
        ' Course ',
        'Status',
        'Code',
        'Main Category',
        'Days',
        'Hours',
        'Vendor',
        'Payment',
        'Start Date   ',
        'End Date     ',
        ,
      ],
    ];
    const data = this.dataSource.map((x: any) => [
      x.title,
      x.status === 'inactive' ? 'Pending' : '',
      x.courseCode,
     
      x.main_category_text,
      x.course_duration_in_days,
      x.training_hours,
      x.vendor,
      x.fee === null ? '0' : '$'+x.fee,
      formatDate(new Date(x.sessionStartDate), 'yyyy-MM-dd', 'en') || '',
      formatDate(new Date(x.sessionEndDate), 'yyyy-MM-dd', 'en') || '',
      
    ]);
    const columnWidths = [20, 20, 20, 20, 20, 20, 20, 20, 20, 20];
    (doc as any).autoTable({
      head: headers,
      body: data,
      startY: 20,
    });
    doc.save('Pending Course List.pdf');
  }
  viewCourse(id: string) {
    this.router.navigate(['/admin/courses/submitted-courses/pending-courses/course-view/'], {
      queryParams: { id: id, status: 'in-active' },
    });
  }
}
