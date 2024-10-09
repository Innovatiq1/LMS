import { ChangeDetectorRef, Component, ElementRef, ViewChild, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from '@core/service/course.service';
import { UtilsService } from '@core/service/utils.service';
import { ClassService } from 'app/admin/schedule-class/class.service';
import { ProgramCourse } from '../program.model';
import { CoursePaginationModel } from '@core/models/course.model';
import Swal from 'sweetalert2';
import { TableElement, TableExportUtil } from '@shared';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { sort } from 'd3';
import { MatDialog } from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import { FilterPopupComponent } from './filter-popup/filter-popup.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { UserService } from '@core/service/user.service';
import { DatePipe } from '@core/service/date.pipe';
import { formatDate } from '@angular/common';
import { AuthenService } from '@core/service/authen.service';

@Component({
  selector: 'app-program-list',
  templateUrl: './program-list.component.html',
  styleUrls: ['./program-list.component.scss']
})
export class ProgramListComponent {
  breadscrums = [
    {
      title: 'Program List',
      items: ['Program'],
      active: 'Program List',
    },
  ];
  displayedColumns = [
    'program',
    'status',
    'code',
    'Creator',
    'Duration',
    'Start Date',
    'End Date',
    'Payment',
    'Compulsory Count',
    'Elective Count',
    
  ];
  isLoading = false;
  isNoMoreData = false;
  programData: any = [];
  programCourse!: ProgramCourse;
  pageSizeArr = this.utils.pageSizeArr;
  coursePaginationModel!: Partial<CoursePaginationModel>;
  totalItems: any;
  searchTerm: string = '';
  selection = new SelectionModel<ProgramCourse>(true, []);
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild('filter', { static: true }) filter!: ElementRef;
  subscribeParams: any;
  path: any;
  isProgram = false;
  isCreator = false;
  isFilter = false;
  titles: string[] = []; 
  codes: string[] = []; 
  creator: string[] = [];
  duration: string[] = [];
  startDate: string[] = [];
  endDate: string[] = [];
  status: string[] = [];
  programList: any;
  selectedPrograms: any = [];
  limit: any = 10
  isFiltered = false;
  vendors: any;
  selectedVendors: any = [];
  selectedStatus: any = [];
  users: any;
  selectedCreators: any = [];
  filterForm!: FormGroup

row: any;
  programsData: any;
  create = false;
  view = false;
  filterName: string='';
  userGroupIds: any;

  constructor(
  
    private utils: UtilsService,
    private activatedRoute: ActivatedRoute,
    private ref: ChangeDetectorRef,
    private courseService: CourseService,
    private classService: ClassService,
    private route :Router,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private userService: UserService,
    private authenService: AuthenService
  ) { this.coursePaginationModel = {};
  let urlPath = this.route.url.split('/')
  this.path = urlPath[urlPath.length - 1];
  
  this.filterForm = this.fb.group({
    program: ['', []],
    creator: ['', []],
    status: ['', []],
    vendor: ['', []]

  })

  if (this.path == 'program'){
    this.isProgram = true;
    this.displayedColumns = [
      'program',
      'status',
      'code',
      'Creator',
      'Duration',
      'Start Date',
      'End Date',
      'Payment',
      'Compulsory Count',
      'Elective Count',
      
    ];

    this.breadscrums = [
      {
        title: 'Program Name',
        items: ['Program List'],
        active: 'Program Name',
      },
    ];
  }
  if (this.path == 'pcreator'){
    this.isCreator = true;
    this.displayedColumns = [
      'Creator',
      'status',
      'program',
      'code',
      'Duration',
      'Start Date',
      'End Date',
      'Payment',
      'Compulsory Count',
      'Elective Count',
      
    ];
    this.breadscrums = [
      {
        title: 'Creator',
        items: ['Program List'],
        active: 'Creator',
      },
    ];
  }
 }
 openFilterCard(){
this.isFilter = !this.isFilter;
 }

 openFilterPopup(event:MouseEvent,data:any): void {
  const dialogRef = this.dialog.open(FilterPopupComponent, {
    hasBackdrop: true,
    backdropClass: 'filter-popup-backdrop',
    position: { top: `65px`, left: `650px` },
    width: '600px',
    maxHeight: '90vh',
  });
}

onSelectionChange(event: any, field: any) {
  if (field == 'program') {
    this.selectedPrograms = event.value;
  }
  if (field == 'vendor') {
  }
  if (field == 'status') {
    this.selectedStatus = event.value;
  }
  if (field == 'creator') {
    this.selectedCreators = event.value;
  }
  if (field == 'startDate') {
    this.selectedCreators = event.value;
  }



}
// clearFilter() {
//   this.filterForm.reset()
//   this.getProgramList()
// }

clearFilter() {
  this.filterForm.reset(); 
  this.selectedPrograms = [];
  this.selectedVendors = [];
  this.selectedStatus = [];
  this.selectedCreators = [];
  this.isFiltered = false;
  this.coursePaginationModel.page = 1;
  this.getProgramList();
}

applyFilter() {
  
  let body: any = {};

  if (this.selectedPrograms.length > 0) {
    body.title = this.selectedPrograms;
  }
  if (this.selectedVendors.length > 0) {
    body.vendor = this.selectedVendors;
  }
  if (this.selectedStatus.length > 0) {
    body.status = this.selectedStatus;
  }
  if (this.selectedCreators.length > 0) {
    body.creator = this.selectedCreators;
  }
   if (this.selectedCreators.length > 0) {
    body.creator = this.selectedCreators;
  }
  this.coursePaginationModel.page = 1;
  this.paginator.pageIndex = 0;
  this.courseService.getFilteredProgramData(body, { ...this.coursePaginationModel }).subscribe((response) => {
    this.programData = response.data.docs;
    this.totalItems = response.data.totalDocs;
    this.isFiltered = false;
    this.coursePaginationModel.docs = response.data.docs;
    this.coursePaginationModel.page = response.data.page;
    this.coursePaginationModel.limit = response.data.limit;
    this.coursePaginationModel.totalDocs = response.data.totalDocs;
  });
}


getFilterData(filters?: any) {
  this.courseService.getAllPrograms().subscribe(
    (response: any) => {
      this.programData = response.docs;
      this.titles = this.programData.map((doc: any) => doc.title);
      this.codes = this.programData.map((doc: any) => doc.courseCode);
      this.creator = this.programData.map((doc: any) => doc.creator);
      this.duration = this.programData.map((doc: any) => doc.duration);
      this.startDate = this.programData.map((doc: any) => doc.sessionStartDate);
      this.endDate = this.programData.map((doc: any) => doc.sessionEndDate);
      this.status = this.programData.map((doc: any) => doc.status);
    },
    (error) => {
    }
  );
}

  getProgramList(filters?: any) {
    this.isLoading = true;
    this.isNoMoreData = false;
    let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;

    let filterProgram = this.filterName;
    const payload = { ...this.coursePaginationModel,title:filterProgram };
  if(this.userGroupIds){
    payload.userGroupId=this.userGroupIds
  }

    this.courseService.getAllPrograms(payload,userId).subscribe(
      (response: any) => {
        this.isLoading = false;
        this.programData = response.docs;
        this.totalItems = response.totalDocs;
        this.coursePaginationModel.docs = response.docs;
        this.coursePaginationModel.page = response.page;
        this.coursePaginationModel.limit = response.limit;
        this.coursePaginationModel.totalDocs = response.totalDocs;
      },
      (error) => {
        this.isLoading = false;
      }
    );
  }

  
  
  delete(id: string) {
    this.classService.getProgramClassList({ courseId: id }).subscribe((classList: any) => {
      const matchingClasses = classList.docs.filter((classItem: any) => {
        return classItem.courseId && classItem.courseId.id === id;
      });
      if (matchingClasses.length > 0) {
        Swal.fire({
          title: 'Error',
          text: 'Classes have been registered with this program. Cannot delete.',
          icon: 'error',
        });
        return;
      }

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
          this.courseService.deleteProgram(id).subscribe(() => {
            this.getProgramList();
            Swal.fire({
              title: 'Success',
              text: 'Program deleted successfully.',
              icon: 'success',
            });
          });
        }
      });
      
    });
  }
  
  pageSizeChange($event: any) {
    this.coursePaginationModel.page = $event?.pageIndex + 1;
    this.coursePaginationModel.limit = $event?.pageSize;
  
    if (this.isFiltered) {
      this.applyFilter();
    } else {
      this.getProgramList();
    }
  }
  
  ngOnInit(): void {
    const roleDetails =this.authenService.getRoleDetails()[0].menuItems
    let urlPath = this.route.url.split('/');
    const parentId = `${urlPath[1]}/${urlPath[2]}`;
    const childId =  urlPath[urlPath.length - 2];
    const subChildId =  urlPath[urlPath.length - 1];
    let parentData = roleDetails.filter((item: any) => item.id == parentId);
    let childData = parentData[0].children.filter((item: any) => item.id == childId);
    let subChildData = childData[0].children.filter((item: any) => item.id == subChildId);
    let actions = subChildData[0].actions
    let createAction = actions.filter((item:any) => item.title == 'Create')
    let viewAction = actions.filter((item:any) => item.title == 'View')

    if(createAction.length > 0){
      this.create = true
    }
    if(viewAction.length >0){
      this.view = true;
    }
    this.getProgramList();
    this.getFilterData();
    this.getAllVendorsAndUsers();
    let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
    forkJoin({
      courses: this.courseService.getAllProgramsWithoutPagination({ ...this.coursePaginationModel},userId),
    }).subscribe((response) => {
      this.programList = response.courses;
    });

  }

  // getAllVendorsAndUsers() {
  //   this.courseService.getVendor().subscribe((response: any) => {
  //     this.vendors = response.reverse();
  //   });
  
  //   this.userService.getAllUsers().subscribe((response: any) => {
  //     console.log("response", response);
  //     console.log("user Role response==",response)
  //     this.users = response?.results?.filter((user: any) => {
  //       const userName = user.name.toLowerCase();
  //       return !userName.startsWith('trainee');
  //     });
  //   });
  // }
  getAllVendorsAndUsers() {
    this.courseService.getVendor().subscribe((response: any) => {
      this.vendors = response.reverse();
    });
  
    this.userService.getAllUsers().subscribe((response: any) => {
      // this.users=response?.results;
  
      this.users = response?.results?.filter((user: any) => {
        const role = user.role.toLowerCase(); 
        return !(role === 'trainee' || role === 'student');
      });
    });
  }
  

performSearch() {
  // if(this.searchTerm){
  // this.programData = this.programData?.filter((item: any) =>{
  //   const searchList = (item.title).toLowerCase();
  //   return searchList.indexOf(this.searchTerm.toLowerCase()) !== -1
  // }
  // );
  // } else {
    this.getProgramList();

  // }
}

viewActiveProgram(id:string, status: string):void {
  this.route.navigate(['/admin/program/view-program'],{queryParams:{id:id, status: status}});
}
  exportExcel() {
    const mapStatus = (status: string): string => {
      if (status === 'active') {
          return 'approved';
      } else if (status === 'inactive') {
          return 'pending';
      } else {
          return status;
      }
  };
    const exportData: Partial<TableElement>[] =
      this.programData.map((x: any) => ({
        'Program Name': x.title,
        'Status':mapStatus(x.status),
        'Program Code': x.courseCode,
        'Creator':x.creator,
        'Duration': x.duration + ' Hours',
        'Payment': '$ ' + x.courseFee,
        'Start Date':
          formatDate(new Date(x.sessionStartDate), 'yyyy-MM-dd', 'en') || '',
        'End Date':
          formatDate(new Date(x.sessionEndDate), 'yyyy-MM-dd', 'en') || '',
        'Compulsory Count' : x.coreCourseCount,
        'Elective Count': x.electiveCourseCount
      }));

    TableExportUtil.exportToExcel(exportData, 'AllPrograms-list.pdf');
  }
  generatePdf() {
    const doc = new jsPDF();
    const headers = [['Program Name', 'Status', 'Program Code', 'Creator', 'Duration', 'Payment', 'Start Date', 'End Date', 'Compulsory Count', 'Elective Count']];
    
    const mapStatus = (status: string): string => {
        if (status === 'active') {
            return 'approved';
        } else if (status === 'inactive') {
            return 'pending';
        } else {
            return status; 
        }
    };

    const data = this.programData.map((x: any) =>
        [x.title,
        mapStatus(x.status), 
        x.courseCode,
        x.creator,
        x.duration,
        '$ ' + x.courseFee,
        formatDate(new Date(x.sessionStartDate), 'yyyy-MM-dd', 'en') || '',
        formatDate(new Date(x.sessionEndDate), 'yyyy-MM-dd', 'en') || '',
        x.coreCourseCount,
        x.electiveCourseCount
    ]);

    const columnWidths = [30, 30, 25, 25, 20, 25, 25, 25, 25, 25];
    (doc as any).autoTable({
        head: headers,
        body: data,
        startY: 20,
        columnStyles: {
            0: { cellWidth: 20 },
            1: { cellWidth: 20 },
            2: { cellWidth: 20 },
            3: { cellWidth: 17 },
            4: { cellWidth: 17 },
            5: { cellWidth: 20 },
            6: { cellWidth: 20 },
            7: { cellWidth: 20 },
            8: { cellWidth: 20 },
            9: { cellWidth: 20 }
        },
        margin: { top: 20, bottom: 20, left: 10, right: 10 },
        pageBreak: 'auto'
    });
    doc.save('AllPrograms-list.pdf');
}
  refresh() {
    window.location.reload();
  }
  addNew() {
    this.route.navigateByUrl("/admin/program/create-program")


  }
  private refreshTable() {
    this.paginator._changePageSize(this.paginator.pageSize);
  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.programData.renderedData.length;
    return numSelected === numRows;
  }
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.programData.renderedData.forEach((row: ProgramCourse) =>
          this.selection.select(row)
        );
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
          const index: number = this.programData.renderedData.findIndex(
            (d: ProgramCourse) => d === item
          );
          
          this.refreshTable();
          this.selection = new SelectionModel<ProgramCourse>(true, []);
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
