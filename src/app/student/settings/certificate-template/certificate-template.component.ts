
import { query } from '@angular/animations';
import { SelectionModel } from '@angular/cdk/collections';
import { formatDate } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder} from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import {CourseKitModel, CourseModel, CoursePaginationModel } from '@core/models/course.model';
import { CertificateService } from 'app/core/service/certificate.service';
import { UtilsService } from '@core/service/utils.service';
import { TableElement, TableExportUtil } from '@shared';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Swal from 'sweetalert2';
import { AuthenService } from '@core/service/authen.service';

@Component({
  selector: 'app-certificate-template',
  templateUrl: './certificate-template.component.html',
  styleUrls: ['./certificate-template.component.scss']
})
export class CertificateTemplateComponent {
  displayedColumns: string[] = [
    'Title',
    'Creation Date',
  ];
  
    breadscrums = [
    {
      title: 'Certificate',
      items: ['Customize'],
      active: 'Certificate',
    },
  ];
  courseKitModel!: Partial<CourseKitModel>;
  totalItems: any;
  pageSizeArr = this.utils.pageSizeArr;
  selection = new SelectionModel<CourseModel>(true, []);
  dataSource: any;
  coursePaginationModel!: Partial<CoursePaginationModel>;
  searchTerm: string = '';
  isCreate = false;
  isView = false;
 

  constructor(private router: Router, private formBuilder: FormBuilder,
    public utils: UtilsService, private courseService: CertificateService,
    private snackBar: MatSnackBar,private ref: ChangeDetectorRef,private authenService: AuthenService
  ) {
    this.coursePaginationModel = {};
  }

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild('filter', { static: true }) filter!: ElementRef;

  
  ngOnInit(): void {
    const roleDetails =this.authenService.getRoleDetails()[0].settingsMenuItems
    let urlPath = this.router.url.split('/');
    const parentId = `${urlPath[1]}/${urlPath[2]}/${urlPath[3]}`;
    const childId =  `${urlPath[4]}/${urlPath[5]}`;
    let parentData = roleDetails.filter((item: any) => item.id == parentId);
    let childData = parentData[0].children.filter((item: any) => item.id == childId);
    let actions = childData[0].actions
    let createAction = actions.filter((item:any) => item.title == 'Create')
    let viewAction = actions.filter((item:any) => item.title == 'View')
  
    if(createAction.length >0){
      this.isCreate = true;
    }
    if(viewAction.length >0){
      this.isView = true;
    }
   this.getAllCertificates();
  }

  getAllCertificates(){
    this.courseService.getAllCertificate({ ...this.coursePaginationModel}).subscribe(response =>{
     this.dataSource = response.data.docs;
     this.ref.detectChanges();
     this.totalItems = response.data.totalDocs;
     this.coursePaginationModel.docs = response.docs;
    this.coursePaginationModel.page = response.page;
    this.coursePaginationModel.limit = response.limit;
    }, error => {
    });
  }
  pageSizeChange($event: any) {
    this.coursePaginationModel.page = $event?.pageIndex + 1;
    this.coursePaginationModel.limit = $event?.pageSize;
    this.getAllCertificates();
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
view(id:any){

this.router.navigate(['/student/settings/customize/certificate/template/view/:id'], {queryParams:{id:id}})

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
   performSearch() {
    
    
    if(this.searchTerm){
    this.dataSource = this.dataSource?.filter((item: any) =>{   
      const search = (item.course + item.name).toLowerCase()
      return search.indexOf(this.searchTerm.toLowerCase())!== -1;
      
    }
    );
    } else {
       this.getAllCertificates();

    }
  }
  exportExcel() {
   const exportData: Partial<TableElement>[] =
      this.dataSource.map((user:any) => ({
        Title:user.title,
        CreationDate: formatDate(new Date(user.createdAt), 'yyyy-MM-dd', 'en') || '',
      }));
    TableExportUtil.exportToExcel(exportData, 'Course Payments');
  }
  // pdf
  generatePdf() {
    const doc = new jsPDF();
    const headers = [['Title','Creation Date']];
    
    const data = this.dataSource.map((user:any) =>
      [user.title,
       formatDate(new Date(user.createdAt), 'yyyy-MM-dd', 'en') || '',
       

    ] );
    const columnWidths = [20, 20, 20, 20, 20, 20, 20, 20, 20, 20];
    (doc as any).autoTable({
      head: headers,
      body: data,
      startY: 20,



    });
    doc.save('Course Payments.pdf');
  }
  getStatusClass(status: string): string {
    return status === 'Success' ? 'success' : 'fail';
  }
}
