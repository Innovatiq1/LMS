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
import { environment } from 'environments/environment.development';

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

  // Fixed columns for site and third party tables
  fixedColumns = [
    'name',
    'email',
    'gender',
    'mobile',
    'qualification',
    'actions'
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
  externalSiteDataSource: any[] = [];
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
  public apiurl = environment.apiEndpointNew;
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
   
    this.surveyService.getAllSurveys().subscribe(
      (data: any[]) => {
        this.dataSource = data;  
        this.filteredDataSource = [...this.dataSource];  
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

    const adminUserPayload: any = {
      superAdmin: false,
      type: 'Trainee',
      traineeStatus: 'Converted',
      users: 1000
    };
    
    let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
    
    // Match common fields by attr
    const commonFields = ['name', 'email', 'gender', 'mobile', 'qualification'];
    commonFields.forEach(field => {
      const value = this.findFieldValueByAttr(enquiry, field);
      if (value) {
        adminUserPayload[field] = value;
      }
    });

    // Handle profile image/avatar
    for (const key in enquiry.responses) {
      const field = enquiry.responses[key];
      if (field && field.type === 'Upload') {
        if (field.value && field.value.path) {
          adminUserPayload.avatar = field.value.path;
          break;
        }
      }
    }

    // If no Upload type found, try looking for profile image specifically
    if (!adminUserPayload.avatar) {
      for (const key in enquiry.responses) {
        if (key.toLowerCase().includes('profile') && 
           (key.toLowerCase().includes('image') || key.toLowerCase().includes('photo'))) {
          const img = enquiry.responses[key];
          if (img.value && typeof img.value === 'object' && img.value.path) {
            adminUserPayload.avatar = img.value.path;
            break;
          }
        }
      }
    }

    // Handle password which can come in various forms
    const password = this.findFieldValueByAttr(enquiry, 'password');
    if (password) {
      adminUserPayload.password = password;
    }

    // Add company ID
    adminUserPayload.companyId = userId;

    // Handle special case for qualifications
    if (adminUserPayload.qualification) {
      adminUserPayload.qualifications = [{
        description: adminUserPayload.qualification
      }];
      delete adminUserPayload.qualification;
    }

    console.log('Payload with avatar:', adminUserPayload); // Debug log

    this.http.post(`${environment.apiUrl}admin/adminUserListing`, adminUserPayload)
      .subscribe({
        next: (saveRes: any) => {
          // After successful user save, call convert-to-trainee
          const convertPayload = {
            companyId: adminUserPayload.companyId,
            email: adminUserPayload.email
          };

          this.http.post(`${this.apiurl}admin/convert-to-trainee`, convertPayload)
            .subscribe({
              next: (convertRes: any) => {
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
              error: (convertErr) => {
                console.error('Convert Error:', convertErr);
                Swal.fire('Warning', 'User saved but conversion failed', 'warning');
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
  pageSizeChange($event: any) {
    this.coursePaginationModel.page = $event?.pageIndex + 1;
    this.coursePaginationModel.limit = $event?.pageSize;
    this.getRegisteredClasses();
  }
 
  
  getSiteRegistrationData() {
    this.surveyService.getUserRegistration().subscribe((res: any) => {
      // Sort data based on type
      const siteData = res.filter((item: any) => 
        item.responses && item.responses.type && item.responses.type.value === 'site'
      );
      
      const externalData = res.filter((item: any) => 
        item.responses && item.responses.type && item.responses.type.value === 'thirdparty'
      );
      
      this.siteDataSource = siteData;
      this.externalSiteDataSource = externalData;
      
      this.userRegistrationData = res;
      this.changeDetectorRef.detectChanges();
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
  
    this.http.get<SitePaginationModel>(`${this.apiurl}admin/responses/site`, { params })
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
      user.classStartDate,
      user.classEndDate,
      formatDate(new Date(user.registeredOn), 'yyyy-MM-dd', 'en') || '',
    ]);

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

  // Helper to find field values by matching the attr property from the registration data
  findFieldValueByAttr(formData: any, attrToFind: string): any {
    if (!formData || !formData.responses) return null;
    
    // Special case for email which is stored directly
    if (attrToFind.toLowerCase() === 'email' && formData.responses.email) {
      return formData.responses.email;
    }

    // Special case for qualification - check both direct and nested values
    if (attrToFind.toLowerCase() === 'qualification') {
      // First check if there's a direct qualification field
      for (const key in formData.responses) {
        const field = formData.responses[key];
        if (field?.attr?.toLowerCase() === 'qualification') {
          return field.value;
        }
      }
      // Then check for fields with qualification in their name
      for (const key in formData.responses) {
        if (key.toLowerCase() === 'qualification') {
          return formData.responses[key].value;
        }
      }
    }
    
    // Loop through all form fields in responses
    for (const key in formData.responses) {
      if (formData.responses.hasOwnProperty(key)) {
        const field = formData.responses[key];
        
        // Check if field's attr matches or the key/field name matches
        if (
          (field?.attr && field.attr.toString().toLowerCase() === attrToFind.toLowerCase()) ||
          key.toLowerCase() === attrToFind.toLowerCase()
        ) {
          return field.value;
        }
      }
    }
    
    return null;
  }

  getImageUrl(response: any): string {
    if (!response || !response.responses) {
      return '../assets/login/sign-up.jpg';
    }
    
    try {
      for (const key in response.responses) {
        const field = response.responses[key];
        
        if (field && field.type && field.type === 'Upload') {
          if (field.value && field.value.path) {
            return field.value.path;
          } else if (field.value && field.value.filename) {
            return `${environment.apiEndpointNew}/uploads/register-image/${field.value.filename}`;
          }
        }
      }
      
      for (const key in response.responses) {
        if (key.toLowerCase().includes('profile') && 
           (key.toLowerCase().includes('image') || key.toLowerCase().includes('photo'))) {
          const img = response.responses[key];
          if (img.value && typeof img.value === 'object') {
            if (img.value.path) {
              return img.value.path;
            }
            if (img.value.filename) {
              return `${environment.apiEndpointNew}/uploads/register-image/${img.value.filename}`;
            }
          }
        }
      }
    } catch (error) {
      console.error('Error accessing image path:', error);
    }
    
    return 'assets/login/sign-up.jpg';
  }

  // Handle image loading errors with TypeScript type safety
  handleImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (img) {
      img.src = 'assets/login/sign-up.jpg';
    }
  }
}
