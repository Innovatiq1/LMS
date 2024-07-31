import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { CoursePaginationModel } from '@core/models/course.model';
import { UserService } from '@core/service/user.service';
import { UtilsService } from '@core/service/utils.service';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-edit-update-dashboard',
  templateUrl: './edit-update-dashboard.component.html',
  styleUrls: ['./edit-update-dashboard.component.scss'],
})
export class EditUpdateDashboardComponent {
  coursePaginationModel: Partial<CoursePaginationModel>;
  totalItems: any;
  pageSizeArr = this.utils.pageSizeArr;
  selection: any;
  isCreateDashboard: boolean = false;
  @Input() isCreate: boolean = false;
  @Input() isEdit: boolean = false;
  @Output() isCreateChange = new EventEmitter<boolean>();
  @Output() isEditChange = new EventEmitter<string>();
  dashboards: any;
  filteredDashboards: any[] = [];

  constructor(
    private router: Router,
    public utils: UtilsService,
    private userService: UserService
  ) {
    this.coursePaginationModel = {};
  }
  displayedColumns = [
    'type',
    'Dashboards',
    // 'Components',
    // 'Status',
    // 'actions'
  ];
  breadscrums = [
    {
      title: 'Customize',
      items: ['Manage Users'],
      active: 'Dashboard List',
    },
  ];

  ngOnInit() {
    this.getDashboardComponents();
  }

  getDashboardComponents() {
    const companyId = JSON.parse(localStorage.getItem('user_data')!).user
      .companyId;
    this.userService.getDashboardsByCompanyId(companyId).subscribe(
      (data: any) => {
        const dashboards = data.data;
        console.log('dashboards', dashboards);
        const processedData = dashboards.map(
          (dashboard: { typeName: any; dashboards: any[] }) => {
            return {
              typeName: dashboard.typeName,
              dashboards: dashboard.dashboards.map((dash) => ({
                title: dash.title,
                components: dash.components.map(
                  (component: { component: any }) => component.component
                ),
              })),
            };
          }
        );

        this.filteredDashboards = processedData;
      },
      (error) => {
        console.error('Error fetching dashboards:', error);
      }
    );
  }

  edit(dashboard: any) {
    let type = dashboard.typeName;
    this.isEditChange.emit(type);
    // this.isCreateDashboard = true;
    // this.isCreateChange.emit(this.isCreateDashboard);
  }

  createDashboard() {
    this.isCreateDashboard = true;
    this.isCreateChange.emit(this.isCreateDashboard);
  }

  generatePdf() {
    const doc = new jsPDF();
    const headers = [[' Role', 'Module', 'Sub Module     ', 'Status']];

    // const data = this.typesList.map((x: any) => [
    //   x?.typeName,
    //   x.menuItems.map((x: any) => x.title),
    //   x.menuItems.map((x: any) => x.children[0].title),
    //   x.status,
    // ]);
    //const columnWidths = [60, 80, 40];

    // Generate the table using jspdf-autotable
    // (doc as any).autoTable({
    //   head: headers,
    //   body: data,
    //   startY: 20,
    //   headStyles: {
    //     fontSize: 10,
    //     cellWidth: 'wrap',
    //   },
    // });

    // Save or open the PDF
    doc.save('Module Access-list.pdf');
  }
  exportExcel() {
    // const exportData: Partial<TableElement>[] = this.typesList.map(
    //   (x: any) => ({
    //     Role: x.typeName,
    //     Module: x.menuItems.map((x: any) => x.title).toString(),
    //     SubModule: x.menuItems.map((x: any) => x.children[0].title).toString(),
    //     Status: x.status,
    //   })
    // );
    // TableExportUtil.exportToExcel(exportData, 'Module Access-list');
  }

  removeSelectedRows() {
    // const totalSelect = this.selection.selected.length;
    // Swal.fire({
    //   title: 'Confirm Deletion',
    //   text: 'Are you sure you want to delete?',
    //   icon: 'warning',
    //   showCancelButton: true,
    //   confirmButtonColor: '#d33',
    //   cancelButtonColor: '#3085d6',
    //   confirmButtonText: 'Delete',
    //   cancelButtonText: 'Cancel',
    // }).then((result) => {
    //   if (result.isConfirmed) {
    //     this.selection.selected.forEach((item) => {
    //       const index: number = this.typesList.renderedData.findIndex(
    //         (d: UserType) => d === item
    //       );
    //       this.refreshTable();
    //       this.selection = new SelectionModel<UserType>(true, []);
    //     });
    //     Swal.fire({
    //       title: 'Success',
    //       text: 'Record Deleted Successfully...!!!',
    //       icon: 'success',
    //       // confirmButtonColor: '#526D82',
    //     });
    //   }
    // });
    // this.showNotification(
    //   'snackbar-danger',
    //   totalSelect + ' Record Delete Successfully...!!!',
    //   'bottom',
    //   'center'
    // );
  }
  pageSizeChange($event: any) {
    this.coursePaginationModel.page = $event?.pageIndex + 1;
    this.coursePaginationModel.limit = $event?.pageSize;
    // this.getUserTypeList();
  }
}
