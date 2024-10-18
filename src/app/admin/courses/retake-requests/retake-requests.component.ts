import { MatTableDataSource } from '@angular/material/table';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import 'jspdf-autotable';
import { MatSort } from '@angular/material/sort';
import {CoursePaginationModel} from '@core/models/course.model';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { AppConstants } from '@shared/constants/app.constants';
import { AuthenService } from '@core/service/authen.service';
import { SettingsService } from '@core/service/settings.service';
import { SelectionModel } from '@angular/cdk/collections';
@Component({
  selector: 'app-retake-requests',
  templateUrl: './retake-requests.component.html',
  styleUrls: ['./retake-requests.component.scss']
})
export class RetakeRequestsComponent implements OnInit {

  displayedColumns = [
    'select',
    'studentname',
    'coursename',
    'Registered Date',
    'examType',
    'action'
  ];

  breadscrums = [
    {
      title: 'Registered Courses',
      items: ['Registered Courses'],
      active: 'Retake Requests',
    },
  ];
  selection = new SelectionModel<any>(true, []);
  searchTerm: string = '';
  coursePaginationModel: CoursePaginationModel;
  dataSource = new MatTableDataSource<any>([]); // Use MatTableDataSource for pagination
  totalItems: any;
  pageSizeArr = [10, 20, 30, 50, 100];
  isLoading = true;
  commonRoles: any;
  isView = false;

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort) matSort!: MatSort;

  constructor(
    public router: Router,
    private authenService: AuthenService,
    private settingService: SettingsService
  ) {
    this.coursePaginationModel = {} as CoursePaginationModel;
  }

  ngOnInit(): void {
    const roleDetails = this.authenService.getRoleDetails()[0].menuItems;
    let urlPath = this.router.url.split('/');
    const parentId = `${urlPath[1]}/${urlPath[2]}`;
    const childId = urlPath[urlPath.length - 2];
    const subChildId = urlPath[urlPath.length - 1];
    let parentData = roleDetails.filter((item: any) => item.id == parentId);
    let childData = parentData[0].children.filter((item: any) => item.id == childId);
    let subChildData = childData[0].children.filter((item: any) => item.id == subChildId);
    let actions = subChildData[0].actions;
    let viewAction = actions.filter((item: any) => item.title == 'View');

    if (viewAction.length > 0) {
      this.isView = true;
    }

    this.commonRoles = AppConstants;

    this.getAllRetakeRequests();
  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach((row) => this.selection.select(row));
  }

  // Bulk approve function
  bulkApprove() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You are about to approve all selected retake requests.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, approve them!'
    }).then((result) => {
      if (result.isConfirmed) {
        const selectedRows = this.selection.selected;

        selectedRows.forEach((row: any) => {
          row.retakes = 1;
          row.requestStatus = 'approved';
          const courseId = row.courseId;
          const studentId = row.studentId;

          // Call the approve API for each row
          this.settingService.putRetakeRequestByStudentIdCourseId(studentId, courseId, row).subscribe((response) => {
            console.log('response', response);
          });
        });

        Swal.fire('Approved!', 'Selected requests have been approved.', 'success');
        this.getAllRetakeRequests();  // Refresh data
        this.selection.clear();  // Clear selection after approval
      }
    });
  }
  getAllRetakeRequests() {
    this.settingService.getRetakeRequest({ ...this.coursePaginationModel })
      .subscribe(response => {
        this.isLoading = false;
        this.totalItems = response.data.totalDocs

        this.dataSource = response.data.docs;
        this.coursePaginationModel.docs = response.data.docs;
        this.coursePaginationModel.page = response.data.page;
        this.coursePaginationModel.limit = response.data.limit;

      }, (error) => {
        this.isLoading = false;
        console.error('Error fetching retake requests:', error);
      });
  }
  // getAllRetakeRequests() {
  //   const filter = {
  //     page: this.coursePaginationModel.page,
  //     limit: this.coursePaginationModel.limit,
  //   };
  
  //   this.settingService.getRetakeRequest(filter).subscribe((response) => {
  //     // console.log("datasocurse==",response.data.docs)
  //     this.dataSource.data = response.data.docs; 
  //     this.totalItems = response.data.totalDocs; 
  //     this.courseKitModel.page = response.page;
  //     this.courseKitModel.limit = response.limit;
  //     // this.dataSource.paginator = this.paginator;
  //     // this.paginator.pageIndex = this.coursePaginationModel.page - 1;
  //     // this.paginator.length = this.totalItems;
  
  //     // this.dataSource.sort = this.matSort;
  //     this.isLoading = false;
  //   }, error => {
  //     this.isLoading = false;
  //     console.error('Error fetching retake requests:', error);
  //   });
  // }
  
  
  

  approve(row: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You are about to approve this retake request.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, approve it!'
    }).then((result) => {
      if (result.isConfirmed) {
        row.retakes = 1;
        row.requestStatus = 'approved';
        const courseId = row.courseId;
        const studentId = row.studentId;

        this.settingService.putRetakeRequestByStudentIdCourseId(studentId, courseId, row).subscribe((response) => {
          // console.log('response', response);
          Swal.fire(
            'Approved!',
            'The retake request has been approved.',
            'success'
          );
        });
      }
    });
  }

  reject(row: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You are about to reject this retake request.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, reject it!'
    }).then((result) => {
      if (result.isConfirmed) {
        row.retakes = 0;
        row.requestStatus = 'rejected';
        const courseId = row.courseId;
        const studentId = row.studentId;

        this.settingService.putRetakeRequestByStudentIdCourseId(studentId, courseId, row).subscribe((response) => {
          console.log('response', response);
          Swal.fire(
            'Rejected!',
            'The retake request has been rejected.',
            'success'
          );
        });
      }
    });
  }

  pageSizeChange($event: any) {
    this.coursePaginationModel.page = $event.pageIndex + 1;
    this.coursePaginationModel.limit = $event.pageSize;
  
    this.getAllRetakeRequests();
  }
  
  

  filterData($event: any) {
    this.dataSource.filter = $event.target.value.trim().toLowerCase();
  }

  view(id: string) {
    this.router.navigate(['/admin/courses/student-courses/verification-list/view-completion-list'], {
      queryParams: { id: id, status: 'pending', verify: false },
    });
  }
}
