import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
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
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  dashboards: any;
  filteredDashboards: any[] = [];
  filterName: any;

  constructor(
    private router: Router,
    public utils: UtilsService,
    private userService: UserService
  ) {
    this.coursePaginationModel = {};
  }
  displayedColumns = ['type', 'Dashboards'];
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
    let filterProgram = this.filterName;
    const payload = { ...this.coursePaginationModel, title: filterProgram };
    this.userService.getAllDashboardList(companyId, payload).subscribe(
      (data: any) => {
        const dashboards = data.data.docs;
        this.totalItems = data.data.totalDocs;
        this.coursePaginationModel.docs = data.data.docs;
        this.coursePaginationModel.page = data.data.page;
        this.coursePaginationModel.limit = data.data.limit;
        this.coursePaginationModel.totalDocs = data.data.totalDocs;
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

        this.filteredDashboards = processedData.reverse();
      },
      (error) => {
        console.error('Error fetching dashboards:', error);
      }
    );
  }

  edit(dashboard: any) {
    let type = dashboard.typeName;
    this.isEditChange.emit(type);
  }

  createDashboard() {
    this.isCreateDashboard = true;
    this.isCreateChange.emit(this.isCreateDashboard);
  }

  generatePdf() {
    const doc = new jsPDF();
    const headers = [[' Role', 'Module', 'Sub Module     ', 'Status']];

    doc.save('Module Access-list.pdf');
  }
  exportExcel() {}

  removeSelectedRows() {}
  pageSizeChange($event: any) {
    console.log('$event', $event);
    this.coursePaginationModel.page = $event?.pageIndex + 1;
    this.coursePaginationModel.limit = $event?.pageSize;
    this.getDashboardComponents();
  }

  performSearch() {
    this.paginator.pageIndex = 0;
    this.coursePaginationModel.page = 1;
    this.getDashboardComponents();
  }
}
