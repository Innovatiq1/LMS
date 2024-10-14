import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { SelectionModel } from '@angular/cdk/collections';
import {
  TableExportUtil,
  TableElement,
} from '@shared';
import { CourseModel, CoursePaginationModel, MainCategory, SubCategory } from '@core/models/course.model';
import { Router } from '@angular/router';
import { CourseService } from '@core/service/course.service';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { forkJoin } from 'rxjs';
import { formatDate } from '@angular/common';
import { AuthenService } from '@core/service/authen.service';

@Component({
  selector: 'app-approved-programs',
  templateUrl: './approved-programs.component.html',
  styleUrls: ['./approved-programs.component.scss']
})
export class ApprovedProgramsComponent {


  displayedColumns: string[] = [
    'name',
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
  view = false;
  filterName!: string;
  userGroupIds: string = '';

  constructor(private router: Router,
  private courseService: CourseService,private cd: ChangeDetectorRef,private route :Router, private snackBar: MatSnackBar, private authenService: AuthenService){
    this.coursePaginationModel = {};
    this.coursePaginationModel.main_category = '0';
    this.coursePaginationModel.sub_category = '0';
    this.userGroupIds = (JSON.parse(localStorage.getItem('user_data')!).user.userGroup.map((v:any)=>v.id) || []).join()
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
    let urlPath = this.route.url.split('/');
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
    let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
    let filterProgram = this.filterName;
    const payload = { ...this.coursePaginationModel,title:filterProgram, status: 'active' };
  if(this.userGroupIds){
    payload.userGroupId=this.userGroupIds
  }
    this.courseService.getCourseProgram(userId,payload).subscribe(
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
    this.coursePaginationModel.page = 1;
    this.paginator.pageIndex = 0;
    this.getProgramList();
    // if(this.searchTerm){
    // this.dataSource = this.dataSource?.filter((item: any) =>{
    //   const searchList = (item?.title).toLowerCase()
    //   return searchList.indexOf(this.searchTerm.toLowerCase()) !== -1
    // }
    // );
    // } else {
    //   this.getProgramList();

    // }
  }

  addNew() {
    this.route.navigateByUrl("/admin/program/create-program");
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
      this.dataSource.map((user: any) => ({
        'Program Name': user.title,
        'Status':mapStatus(user.status),
        'Program Code': user.courseCode,
        'Creator':user.creator,
        'Duration': user.duration + ' Hours',
        'Start Date':
          formatDate(new Date(user.sessionStartDate), 'yyyy-MM-dd', 'en') || '',
        'End Date':
          formatDate(new Date(user.sessionEndDate), 'yyyy-MM-dd', 'en') || '',
          'Payment': '$ ' + user.courseFee,
        'Compulsory Count' : user.coreCourseCount,
        'Elective Count': user.electiveCourseCount
      }));

    TableExportUtil.exportToExcel(exportData, 'Program Approve-list');
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

    const data = this.dataSource.map((user: any) =>
        [user?.title,
        mapStatus(user?.status), 
        user?.courseCode,
        user?.creator,
        user?.duration +' Hours',
        formatDate(new Date(user?.sessionStartDate), 'yyyy-MM-dd', 'en') || '',
        formatDate(new Date(user?.sessionEndDate), 'yyyy-MM-dd', 'en') || '',
        '$ ' + user?.courseFee,
        user?.coreCourseCount,
        user?.electiveCourseCount
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
  viewInActiveProgram(id:string){
    this.route.navigate(['/admin/program/view-program'],{queryParams:{id:id, status:'approved'}});
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
