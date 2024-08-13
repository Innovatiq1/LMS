import { SelectionModel } from '@angular/cdk/collections';
import { formatDate } from '@angular/common';
import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { CourseModel, CoursePaginationModel } from '@core/models/course.model';
import { UserType } from '@core/models/user.model';
import { AdminService } from '@core/service/admin.service';
import { AuthenService } from '@core/service/authen.service';
import { UserService } from '@core/service/user.service';
import { UtilsService } from '@core/service/utils.service';
import { TableElement, TableExportUtil } from '@shared';
import jsPDF from 'jspdf';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-type',
  templateUrl: './user-type.component.html',
  styleUrls: ['./user-type.component.scss'],
})
export class UserTypeComponent {
  displayedColumns = [
    'User Role',
    'Accessbility Module',
    'Sub Module',
    'Status',
    // 'actions'
  ];
  breadscrums = [
    {
      title: 'Role',
      items: ['Manage Users'],
      active: 'Module Access',
    },
  ];
  modal: boolean = false;
  admin: boolean = false;
  isNext: boolean = false;
  isNext1: boolean = false;
  isCreate: boolean = false;
  coursePaginationModel: Partial<CoursePaginationModel>;
  typesList: any;
  totalItems: any;
  pageSizeArr = this.utils.pageSizeArr;
  isLoading = true;
  selection = new SelectionModel<UserType>(true, []);
  dataSource: any[] = [];

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  menu: any;
  last: any;
  isEdit = false;

  constructor(
    public router: Router,
    private adminService: AdminService,
    private userService: UserService,
    private ref: ChangeDetectorRef,
    public utils: UtilsService,
    private authenService: AuthenService
  ) {
    const roleDetails =this.authenService.getRoleDetails()[0].settingsMenuItems
    let urlPath = this.router.url.split('/');
    const parentId = `${urlPath[1]}/${urlPath[2]}`;
    const childId =  urlPath[urlPath.length - 1];
    let parentData = roleDetails.filter((item: any) => item.id == parentId);
    let childData = parentData[0].children.filter((item: any) => item.id == childId);
    let actions = childData[0].actions
    let editAction = actions.filter((item:any) => item.title == 'Edit')

    if(editAction.length >0){
      this.isEdit = true;
    }
    this.getUserTypeList();
    this.coursePaginationModel = {};
  }

  cancelModal() {
    this.modal = false;
  }
  edit(id: any) {
    this.router.navigate(['/student/settings/user-type/edit-user-type'], {
      queryParams: { id: id },
    });
    // this.router.navigate(['/Users/Type/edit'],{queryParams:{id:id}});
  }

  changeInActive(dataDetails: UserType): void {
    dataDetails.status = 'inactive';
    this.userService.updateUserType(dataDetails).subscribe(
      () => {
        Swal.fire({
          title: 'Success',
          text: 'Role moved to Inactive.',
          icon: 'success',
        });
        this.getUserTypeList({});
      },
      (error) => {
        console.error(error, 'result_error');
        Swal.fire({
          title: 'Error',
          text: 'Role attached to  User. Cannot Make Inactive.',
          icon: 'error',
        });
        this.getUserTypeList({});
      }
    );
  }
  changeActive(dataDetails: UserType): void {
    dataDetails.status = 'active';
    this.userService.updateUserType(dataDetails).subscribe(
      () => {
        Swal.fire({
          title: 'Success',
          text: 'Role moved to Active.',
          icon: 'success',
        });
        this.getUserTypeList({});
      },
      (error) => {
        console.error(error, 'result_error');
      }
    );
  }
  delete(data: any) {
    console.log('data', data);

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
        this.userService.deleteUserType(data.id, data.typeName, data.companyId).subscribe(
          () => {
            Swal.fire({
              title: 'Success',
              text: 'Role deleted successfully.',
              icon: 'success',
            });
            this.getUserTypeList({});
          },
          (error) => {
            Swal.fire({
              title: 'Error',
              text: 'Role attached to  User. Cannot Delete.',
              icon: 'error',
            });
            this.getUserTypeList({});
          }
        );
      }
    });
  }

  pageSizeChange($event: any) {
    this.coursePaginationModel.page = $event?.pageIndex + 1;
    this.coursePaginationModel.limit = $event?.pageSize;
    this.getUserTypeList();
  }

  getUserTypeList(filters?: any) {
    let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
        this.adminService
      .getUserTypeList({ ...this.coursePaginationModel },userId)
      .subscribe(
        (response: any) => {
          this.isLoading = false;
          this.totalItems = response.totalDocs;
          this.typesList = response.docs;
          let limit = filters?.limit ? filters?.limit : 10;
          if (response.totalDocs <= limit || response.totalDocs <= 0) {
          }
          this.ref.detectChanges();
        },
        (error) => {}
      );
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
          const index: number = this.typesList.renderedData.findIndex(
            (d: UserType) => d === item
          );
          this.refreshTable();
          this.selection = new SelectionModel<UserType>(true, []);
        });
        Swal.fire({
          title: 'Success',
          text: 'Record Deleted Successfully...!!!',
          icon: 'success',
          // confirmButtonColor: '#526D82',
        });
      }
    });

    // this.showNotification(
    //   'snackbar-danger',
    //   totalSelect + ' Record Delete Successfully...!!!',
    //   'bottom',
    //   'center'
    // );
  }
  exportExcel() {
    const exportData: Partial<TableElement>[] = this.typesList.map(
      (x: any) => ({
        Role: x.typeName,
        Module: x.menuItems.map((x: any) => x.title).toString(),
        SubModule: x.menuItems.map((x: any) => x.children[0].title).toString(),
        Status: x.status,
      })
    );
    TableExportUtil.exportToExcel(exportData, 'Module Access-list');
  }
  generatePdf() {
    const doc = new jsPDF();
    const headers = [[' Role', 'Module', 'Sub Module     ', 'Status']];

    const data = this.typesList.map((x: any) => [
      x?.typeName,
      x.menuItems.map((x: any) => x.title),
      x.menuItems.map((x: any) => x.children[0].title),
      x.status,
    ]);
    //const columnWidths = [60, 80, 40];

    // Generate the table using jspdf-autotable
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
    doc.save('Module Access-list.pdf');
  }
}
