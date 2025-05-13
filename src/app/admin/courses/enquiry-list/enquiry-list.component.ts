// import { Component } from '@angular/core';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import * as moment from 'moment';
import { DataSource, SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import {
  TableElement,
  TableExportUtil,
  UnsubscribeOnDestroyAdapter,
} from '@shared';
import { formatDate } from '@angular/common';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { Direction } from '@angular/cdk/bidi';
import { BehaviorSubject, Observable, fromEvent, map, merge } from 'rxjs';
import {
  ClassModel,
  Session,
  Student,
  StudentApproval,
  StudentPaginationModel,
} from 'app/admin/schedule-class/class.model';
import { ClassService } from 'app/admin/schedule-class/class.service';
import Swal from 'sweetalert2';
import { id } from '@swimlane/ngx-charts';
import { Router } from '@angular/router';
import { AppConstants } from '@shared/constants/app.constants';
import { AuthenService } from '@core/service/authen.service';
import { CoursePaginationModel } from '@core/models/course.model';
// In enquiry.component.ts or wherever you're using the model
// import { ThirdPartyPaginationModel, SitePaginationModel } from '@core/models/enquiry.model';
// enquiry-list.component.ts
import {
  SitePaginationModel,
  ThirdPartyPaginationModel,
  SiteEnquiryModel,
  ThirdPartyEnquiryModel,
} from '@core/models/enquiry.model';

import { SurveyService } from '@core/service/survey.service';
import { el } from '@fullcalendar/core/internal-common';

@Component({
  selector: 'app-enquiry-list',
  templateUrl: './enquiry-list.component.html',
  styleUrls: ['./enquiry-list.component.scss']
})
export class EnquiryListComponent {
  displayedColumns = [
    'studentname',
    'status',
    'coursename',
    'Fee Type',
    'classstartDate',
    'classendDate',
    'Registered Date',
    'programFee',
    // 'instructorFee',
  ];

  
  sitePaginationModel: SitePaginationModel = {
    page: 1,
    limit: 10,
    search: '',
    docs: [],
    totalCount: 0,
    filterText: '',
    sortBy: 'createdAt',
    sortByDirection: 'desc',
  };

  thirdPartyPaginationModel: ThirdPartyPaginationModel = {
    page: 1,
    limit: 10,
    search: '',
    docs: [],
    totalCount: 0,
    filterText: '',
    sortBy: 'createdAt',
    sortByDirection: 'desc',
  };
 
  filteredDataSource: any[] = []; // Data filtered based on search input

  siteDataSource: any[] = [];
  dynamicColumns: string[] = [];
  userRegistrationData: any[] = [];
  isConverting = false;

  breadscrums = [
    {
      title: 'Registered Courses',
      items: ['Registered Courses'],
      active: 'Approved Courses',
    },
  ];
  searchTerm: string = '';
  studentPaginationModel: StudentPaginationModel;
  coursePaginationModel: Partial<CoursePaginationModel> ;
  selection = new SelectionModel<ClassModel>(true, []);
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort) matSort!: MatSort;
  totalItems: any;
  approveData: any;
  pageSizeArr = [10, 20, 30, 50, 100];
  isLoading = true;
  dataSource!: any;
  commonRoles: any;
  isView = false;
  filterName: any;
  userGroupIds: any;
  dispalyedColumns: string[] = [];
  enquiryList: any;
  constructor(
    public _classService: ClassService,
    private snackBar: MatSnackBar,
    public router: Router,
    private http: HttpClient ,// Add HttpClient for API call
    private surveyService: SurveyService,
    private authenService: AuthenService,private changeDetectorRef: ChangeDetectorRef
  ) {
    this.studentPaginationModel = {} as StudentPaginationModel;
    this.coursePaginationModel = {} as CoursePaginationModel;
    // super();
  }

  ngOnInit(): void {
    // const roleDetails =this.authenService.getRoleDetails()[0].menuItems
    // let urlPath = this.router.url.split('/');
    // const parentId = `${urlPath[1]}/${urlPath[2]}`;
    // const childId =  urlPath[urlPath.length - 2];
    // const subChildId =  urlPath[urlPath.length - 1];
    // let parentData = roleDetails.filter((item: any) => item.id == parentId);
    // let childData = parentData[0].children.filter((item: any) => item.id == childId);
    // let subChildData = childData[0].children.filter((item: any) => item.id == subChildId);
    // let actions = subChildData[0].actions
    // let viewAction = actions.filter((item:any) => item.title == 'View')

    // if(viewAction.length >0){
    //   this.isView = true;
    // }
    this.surveyService.getAllSurveys().subscribe(
      (data: any[]) => {
        this.dataSource = data;  // All surveys or data
        this.filteredDataSource = [...this.dataSource];  // Initialize filtered data
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
    this.commonRoles = AppConstants
    this.getRegisteredClasses();
    this.getSiteRegistrationData();
  }

  selectedTabIndex = 0;
  onTabChange(index: number) {
    this.selectedTabIndex = index;
    if (index === 0) {
      this.getRegisteredClasses();
    }
    else if (index === 1) {
      this.getSiteRegistrationData();
    }
    else if (index === 2) { 
      this.getRegisteredClasses();
    }
  
  }
   
  // performSearch(): void {
  //   const searchTerm = this.filterName.toLowerCase();
  //   this.filteredDataSource = this.dataSource.filter(item => 
  //     (item.studentId?.name.toLowerCase().includes(searchTerm) ||
  //      item.studentId?.last_name?.toLowerCase().includes(searchTerm))
  //   );
  // }
  
 
  convertToTrainee(enquiry: any) {
    if (this.isConverting) return;
  
    this.isConverting = true;
  
    const payload = {
      name: enquiry.name,
      email: enquiry.email,
      gender: enquiry.gender
    };
  
    this.http.post('http://localhost:3001/x-api/v1/admin/convert-to-trainee', payload)
      .subscribe({
        next: (res: any) => {
          console.log('Conversion result:', res);
  
          const adminUserPayload = {
            name: enquiry.name,
            email: enquiry.email,
            gender: enquiry.gender,
            password: 'Default@123',
            companyId: enquiry.companyId || "acd2934b-0924-4d5c-8ca5-96bab0d2895f",
            superAdmin: false,
            type: 'Trainee',
            traineeStatus: 'Converted',
            users: 1000
          };
  
          this.http.post('http://localhost:3001/api/admin/adminUserListing', adminUserPayload)
            .subscribe({
              next: (saveRes: any) => {
                console.log('User data saved successfully:', saveRes);
  
                this.http.delete(`http://localhost:3001/x-api/v1/admin/delete-enquiry/${enquiry.email}`)
                  .subscribe({
                    next: () => {
                      // this.enquiryList = this.enquiryList.filter((item: { email: any; }) => item.email !== enquiry.email);
                      Swal.fire({
                        title: 'Success!',
                        text: 'User converted to Trainee',
                        icon: 'success',
                        confirmButtonText: 'OK'
                      }).then(() => {
                        this.router.navigate(['/student/settings/all-user/all-students']);
                      });
  
                      this.isConverting = false;
                    },
                    error: (deleteErr) => {
                      console.error('Delete Error:', deleteErr);
                      Swal.fire('Error', 'Converted but failed to delete enquiry.', 'warning');
                      this.isConverting = false;
                    }
                  });
              },
              error: (saveErr) => {
                console.error('Error saving user data:', saveErr);
                Swal.fire('Error', 'Failed to save user data!', 'error');
                this.isConverting = false;
              }
            });
        },
        error: (err) => {
          console.error('Conversion Error:', err);
          Swal.fire('Error', 'Conversion failed or no match found.', 'error');
          this.isConverting = false;
        }
      });
  }
  

  // convertToTrainee(enquiry: any) {
  //   if (this.isConverting) return;

  //   this.isConverting = true;
  //   const payload = {
  //     name: enquiry.name,
  //     email: enquiry.email,
  //     gender: enquiry.gender
  //   };
  //     this.http.post('http://localhost:3001/x-api/v1/admin/convert-to-trainee', payload)
  //     .subscribe({
  //       next: (res: any) => {
  //         console.log('Conversion result:', res);
          
  //         const adminUserPayload = {
  //           name: enquiry.name,
  //           email: enquiry.email,
  //           gender: enquiry.gender,
  //           password: 'Default@123',              
  //           companyId: enquiry.companyId || "acd2934b-0924-4d5c-8ca5-96bab0d2895f",
  //           superAdmin: false,
  //           type: 'Trainee' ,
  //           traineeStatus: 'Converted' , 
  //           users: 1000           
  //         };
  //         this.http.post('http://localhost:3001/api/admin/adminUserListing', adminUserPayload)
          
  //           .subscribe({
  //             next: (saveRes: any) => {
  //               console.log('User data saved successfully:', saveRes);
  //               this.showNotification('bg-success', 'User data saved and converted to Trainee!', 'top', 'right');
  //               this.router.navigate(['/student/settings/all-user/all-students']);
  //             },
  //             error: (saveErr) => {
  //               this.showNotification('bg-danger', 'Failed to save user data!', 'top', 'right');
  //               console.error('Error saving user data:', saveErr);
  //               this.isConverting = false;
  //             }
  //           });
  //       },
  //       error: (err) => {
  //         this.showNotification('bg-danger', 'Conversion failed or no match.', 'top', 'right');
  //         console.error('Conversion Error:', err);
  //         this.isConverting = false;
  //       }
  //     });
  // }

  // convertToTrainee(enquiry: any) {
  //   const payload = {
  //     name: enquiry.name,
  //     email: enquiry.email,
  //     gender: enquiry.gender
  //   };

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
  pageSizeChange($event: any) {
    this.coursePaginationModel.page = $event?.pageIndex + 1;
    this.coursePaginationModel.limit = $event?.pageSize;
    this.getRegisteredClasses();
  }
 
  
  getSiteRegistrationData() {
    this.surveyService.getUserRegistration().subscribe((res: any) => {
      this.siteDataSource = res;
      console.log('Fetched registration data:', this.siteDataSource);
      if (res.length > 0 && res[0].responses) {
        this.dynamicColumns = Object.keys(res[0].responses);
        const excludedColumns = ['password', 'Confirmpassword', 'type'];
        this.dynamicColumns = this.dynamicColumns.filter(
          (column) => !excludedColumns.includes(column)
        );
        console.log('Dynamic columns:', this.dynamicColumns);
        this.dynamicColumns.push('actions');
      }
    });
  }

  onActionClick(row: any, action: string) {
    this.router.navigate(['settings/all-user/all-students']);
  }

  getRegisteredClasses() {
    let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
    let filterProgram = this.filterName;
    const payload = { ...this.coursePaginationModel,title:filterProgram };
  if(this.userGroupIds){
    payload.userGroupId=this.userGroupIds
  }
        this._classService
      .getEnquiryClasse(userId,
        payload
      )
      .subscribe((response: { data: CoursePaginationModel }) => {
        // console.log("response data==",response)
        this.isLoading = false;
        this.coursePaginationModel = response.data;
        this.dataSource = response.data.docs;
        this.dataSource.sort = this.matSort;
        this.totalItems = response.data.totalDocs;
        this.mapClassList();
      });
  }
  filterData($event: any) {
    this.dataSource.filter = $event.target.value;
  }

  view(id: string) {
    this.router.navigate(['/admin/courses/student-courses/registered-approved-courses/view-completion-list'], {
      queryParams: { id: id, status: 'approved' },
    });
  }
  mapClassList() {
    if (Array.isArray(this.coursePaginationModel?.docs)) {
      this.coursePaginationModel.docs.forEach((item: any) => {
        const startDateArr: any = [];
        const endDateArr: any = [];
        
        item?.classId?.sessions?.forEach((session: { sessionStartDate: { toString: () => string | number | Date; }; sessionEndDate: { toString: () => string | number | Date; }; }) => {
          startDateArr.push(new Date(session?.sessionStartDate?.toString()));
          endDateArr.push(new Date(session?.sessionEndDate?.toString()));
        });
  
        const minStartDate = new Date(Math.min.apply(null, startDateArr));
        const maxEndDate = new Date(Math.max.apply(null, endDateArr));
  
        item.classStartDate = !isNaN(minStartDate.valueOf())
          ? moment(minStartDate).format('YYYY-DD-MM')
          : '';
        item.classEndDate = !isNaN(maxEndDate.valueOf())
          ? moment(maxEndDate).format('YYYY-DD-MM')
          : '';
        item.studentId.name = `${item?.studentId?.name}`;
      });
    }
  }
  
  getCurrentUserId(): string {
    return JSON.parse(localStorage.getItem('user_data')!).user.id;
  }

  changeStatus(element: Student, status: string) {
    const item: StudentApproval = {
      approvedBy: this.getCurrentUserId(),
      approvedOn: moment().format('YYYY-MM-DD'),
      classId: element.classId._id,
      status,
      studentId: element.studentId.id,
      session: this.getSessions(element),
    };

    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to approve this course!',
      icon: 'warning',
      confirmButtonText: 'Yes',
      showCancelButton: true,
      cancelButtonColor: '#d33',
    }).then((result) => {
      if (result.isConfirmed) {
        this._classService.saveApprovedClasses(element.id, item).subscribe(
          (_response: any) => {
            Swal.fire({
              title: 'Success',
              text: 'Course approved successfully.',
              icon: 'success',
            });
            this.getRegisteredClasses();
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

  Status(element: Student, status: string) {
    const item: StudentApproval = {
      approvedBy: this.getCurrentUserId(),
      approvedOn: moment().format('YYYY-MM-DD'),
      classId: element.classId._id,
      status,
      studentId: element.studentId.id,
      session: this.getSessions(element),
    };
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to withdraw this course!',
      icon: 'warning',
      confirmButtonText: 'Yes',
      showCancelButton: true,
      cancelButtonColor: '#d33',
    }).then((result) => {
      if (result.isConfirmed) {
        this._classService.saveApprovedClasses(element.id, item).subscribe(
          (response: any) => {
            Swal.fire({
              title: 'Success',
              text: 'Course Withdraw successfully.',
              icon: 'success',
            });
            this.getRegisteredClasses();
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
  // performSearch() {
  //   this.paginator.pageIndex = 0;
  //   this.coursePaginationModel.page = 1;
    
  //   // Ensure change detection runs
  //   this.changeDetectorRef.detectChanges();
    
  //   this.getRegisteredClasses();
  // }

  // performSearch(): void {
  //   this.paginator.pageIndex = 0;
  
  //   switch (this.selectedTabIndex) {
  //     case 0: // Course Enquiry
  //       this.coursePaginationModel.page = 1;
  //       this.changeDetectorRef.detectChanges();
  //       this.getRegisteredClasses();
  //       break;
  
  //     case 1: // Site Details Enquiry
  //       this.sitePaginationModel.page = 1;
  //       this.getSiteDetails(); // <-- You need to implement this function for API call
  //       break;
  
  //     case 2: // Third Party Details Enquiry
  //       this.thirdPartyPaginationModel.page = 1;
  //       // this.getThirdPartyDetails(); // <-- You need to implement this function for API call
  //       break;
  //   }
  // }
  performSearch(): void {
    this.paginator.pageIndex = 0;
    this.coursePaginationModel.page = 1;
    this.coursePaginationModel.title = this.filterName?.trim() || '';
  
    // Refresh the data
    this.getRegisteredClasses();
  }
  
  clearSearch(): void {
    this.filterName = '';
    this.performSearch();
  }
  
  getSiteDetails() {
    const params = {
      page: this.sitePaginationModel.page.toString(),
      limit: this.sitePaginationModel.limit.toString(),
      search: this.sitePaginationModel.search,
      filterText: this.sitePaginationModel.filterText,
      sortBy: this.sitePaginationModel.sortBy,
      sortByDirection: this.sitePaginationModel.sortByDirection,
    };
  

    this.http.get<SitePaginationModel>('http://localhost:3001/x-api/v1/admin/responses/site', { params })
      .subscribe(
        (response) => {
          this.sitePaginationModel.docs = response.docs;
          this.sitePaginationModel.totalCount = response.totalCount;
        },
        (error) => {
          console.error('Error fetching site details:', error);
        }
      );
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
      : this.dataSource.forEach((row: any) => this.selection.select(row));
  }

  getSessions(element: { classId: { sessions: any[] } }) {
    const sessions = element.classId?.sessions?.map((_: any, index: number) => {
      const session: Session = {} as Session;
      session.sessionNumber = index + 1;
      return session;
    });
    return sessions;
  }

  exportExcel() {
    const exportData: Partial<TableElement>[] = this.dataSource.map(
      (user: any) => ({
        [AppConstants.STUDENT_ROLE] : user.studentId?.name,
         Status: user.status,
        'Course': user.classId?.courseId?.title,
        'Course Fee': '$ '+user.classId?.courseId?.fee,
        // [`${AppConstants.INSTRUCTOR_ROLE} Fee`]: '$ '+user.classId?.instructorCost,
        'Start Date': user.classStartDate,
        'End Date': user.classEndDate,
        'Registered On': formatDate(new Date(user.registeredOn), 'yyyy-MM-dd', 'en') || '',
        
      })
    );
    TableExportUtil.exportToExcel(exportData, 'Student-Approve-list');
  }

  generatePdf() {
    const doc = new jsPDF();
    const headers = [
      [
        [AppConstants.STUDENT_ROLE],
        'Status    ',
        'Course',
        'Course Fee',
        // [`${AppConstants.INSTRUCTOR_ROLE} Fee`],
        'Start Date  ',
        'End date    ',
        'Registered Date',
      ],
    ];
    const data = this.dataSource.map((user: any) => [
      user.studentId?.name,
      user?.status,
      user.classId?.courseId?.title,
     '$ '+ user.classId?.courseId?.fee,
      // '$ '+user.classId?.instructorCost,
      user.classStartDate,
      user.classEndDate,
      formatDate(new Date(user.registeredOn), 'yyyy-MM-dd', 'en') || '',
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
    doc.save('Student-Approve-list.pdf');
  }



}
