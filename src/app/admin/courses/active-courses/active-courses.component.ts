import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { CourseService } from '@core/service/course.service';
import {
  CoursePaginationModel,
  MainCategory,
  SubCategory,
} from '@core/models/course.model';
import Swal from 'sweetalert2';
import { ClassService } from 'app/admin/schedule-class/class.service';
import { TableElement, TableExportUtil } from '@shared';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { formatDate } from '@angular/common';
import { O } from '@angular/cdk/keycodes';
import { AuthenService } from '@core/service/authen.service';

@Component({
  selector: 'app-active-courses',
  templateUrl: './active-courses.component.html',
  styleUrls: ['./active-courses.component.scss'],
})
export class ActiveCoursesComponent {
  breadscrums = [
    {
      title: 'Blank',
      items: ['Submitted Courses'],
      active: 'Approved Courses',
    },
  ];
  displayedColumns = [
    'name',
    'status',
    'code',
    'Fee Type',
    'Main Category',
    'Days',
    'Training Hours',
    'Vendor',
    'startDate',
    'endDate',
    'Fees',
  ];
  coursePaginationModel: Partial<CoursePaginationModel>;
  courseData: any;
  pagination: any;
  totalItems: any;
  pageSizeArr = [10, 25, 50, 100];
  mainCategories!: MainCategory[];
  subCategories!: SubCategory[];
  allSubCategories!: SubCategory[];
  dataSource: any;
  searchTerm: string = '';
  selection = new SelectionModel<MainCategory>(true, []);
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  view = false;

  constructor(
    public _courseService: CourseService,
    private classService: ClassService,
    private cd: ChangeDetectorRef,
    private router: Router,
    private authenService: AuthenService
  ) {
    // constructor
    this.coursePaginationModel = {};
    this.coursePaginationModel.main_category = '0';
    this.coursePaginationModel.sub_category = '0';
  }

  ngOnInit() {
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
    this.getAllCourse();
    this.setup();
  }
  getAllCourse() {
    let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
        this._courseService
      .getAllCourses(userId,{ ...this.coursePaginationModel, status: 'active' })
      .subscribe((response) => {
        this.courseData = response.data.docs;
        this.totalItems = response.data.totalDocs;
        this.coursePaginationModel.docs = response.data.docs;
        this.coursePaginationModel.page = response.data.page;
        this.coursePaginationModel.limit = response.data.limit;
        this.coursePaginationModel.totalDocs = response.data.totalDocs;
        this.mapCategories();
      });
  }
  pageSizeChange($event: any) {
    this.coursePaginationModel.page = $event?.pageIndex + 1;
    this.coursePaginationModel.limit = $event?.pageSize;
    this.getAllCourse();
  }
  private setup(): void {
    forkJoin({
      mainCategory: this._courseService.getMainCategories(),
      subCategory: this._courseService.getSubCategories(),
    }).subscribe((response: any) => {
      this.mainCategories = response.mainCategory;
      this.allSubCategories = response.subCategory;
      this.getAllCourse();
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
    this.getAllCourse();
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
  getCoursesList() {
    let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
        this._courseService
      .getAllCourses(userId,{ ...this.coursePaginationModel, status: 'active' })
      .subscribe(
        (response) => {
          this.dataSource = response.data.docs;
          this.totalItems = response.data.totalDocs;
          this.coursePaginationModel.docs = response.data.docs;
          this.coursePaginationModel.page = response.data.page;
          this.coursePaginationModel.limit = response.data.limit;
          this.coursePaginationModel.totalDocs = response.data.totalDocs;
          this.mapCategories();
        },
        (error) => {}
      );
  }

  viewCourse(id: string) {
    this.router.navigate(['/admin/courses/course-view/'], {
      queryParams: { id: id, status: 'approved' },
    });
  }
  exportExcel() {
    const exportData: Partial<TableElement>[] = this.courseData.map(
      (x: any) => ({
        'Course': x.title,
        Status: x.status,
        'Code': x.courseCode,
        'Main Category': x.main_category_text,
        Days: x.course_duration_in_days || 0,
        Hours: x.training_hours || 0,
        Vendor: x.vendor,
        Payment: x.fee === null ? 0 :'$'+x.fee,
        'Start Date':
          formatDate(new Date(x.sessionStartDate), 'yyyy-MM-dd', 'en') || '',
        'End Date':
          formatDate(new Date(x.sessionEndDate), 'yyyy-MM-dd', 'en') || '',
       
      })
    );

    TableExportUtil.exportToExcel(exportData, 'Approved Courses-list');
  }
  generatePdf() {
    const doc = new jsPDF();
    const headers = [
      [
        'Course',
        'Status     ',
        'Code',
        'Main Category',
        'Days',
        'Hours',
        'Vendor',
        'Payment',
        'Start Date   ',
        'End Date    ',
      ],
    ];
    const data = this.courseData.map((x: any) => [
      x.title,
      x.status === 'active' ? 'Approved' : 'Pending',
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
      headStyles: {
        fontSize: 10,
        cellWidth: 'wrap',
      },
    });

    // Save or open the PDF
    doc.save('Approved Courses-list.pdf');
  }
  performSearch() {
    if (this.searchTerm) {
      this.courseData = this.courseData?.filter(
        (item: any) => {
          const searchList = item.title.toLowerCase();
          return searchList.indexOf(this.searchTerm.toLowerCase()) !== -1;
        }
      );
    } else {
      this.getAllCourse();
    }
  }
  private refreshTable() {
    this.paginator._changePageSize(this.paginator.pageSize);
  }
  removeSelectedRows() {
    const totalSelect = this.selection.selected.length;

    Swal.fire({
      title: 'Confirm Deletion',
      text: 'Are you sure you want to delete?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.selection.selected.forEach((item) => {
          const index: number = this.courseData.renderedData.findIndex(
            (d: MainCategory) => d === item
          );
          this.refreshTable();
          this.selection = new SelectionModel<MainCategory>(true, []);
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
