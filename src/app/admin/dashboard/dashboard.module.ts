import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { MainComponent } from './main/main.component';
import { Dashboard2Component } from './dashboard2/dashboard2.component';
import { NgxEchartsModule } from 'ngx-echarts';
import { NgApexchartsModule } from 'ng-apexcharts';
import { SharedModule } from '@shared';
import { ComponentsModule } from '@shared/components/components.module';
import { SupportComponent } from '../../apps/support/support.component';
import { NgxGaugeModule } from 'ngx-gauge';
import { NgChartsModule } from 'ng2-charts';
import { EtmsDashboardComponent } from './etms-dashboard/etms-dashboard.component';
import { SuperAdminComponent } from 'app/superAdmin/super-admin/super-admin.component';
import { CeoDashboardComponent } from './ceo-dashboard/ceo-dashboard.component';
import { ManagerDashboardComponent } from './manager-dashboard/manager-dashboard.component';
import { TotalListComponent } from './total-list/total-list.component';
import { CorpCourseListComponent } from './corp-course-list/corp-course-list.component';
import { CorpManagerListComponent } from './corp-manager-list/corp-manager-list.component';
import { CorpStaffListComponent } from './corp-staff-list/corp-staff-list.component';
import { ChartCourseViewComponent } from './chart-course-view/chart-course-view.component';
import { ManagersPieChartComponent } from './managers-pie-chart/managers-pie-chart.component';
import { CourseViewManagerComponent } from './course-view-manager/course-view-manager.component';
import { OfficersListComponent } from './ceo-dashboard/officers-list/officers-list.component';

@NgModule({
  declarations: [
    MainComponent,
    Dashboard2Component,
    SupportComponent,
    EtmsDashboardComponent,
    SuperAdminComponent,
    CeoDashboardComponent,
    ManagerDashboardComponent,
    TotalListComponent,
    CorpCourseListComponent,
    CorpManagerListComponent,
    CorpStaffListComponent,
    ChartCourseViewComponent,
    ManagersPieChartComponent,
    CourseViewManagerComponent,
    OfficersListComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts'),
    }),
    NgScrollbarModule,
    NgApexchartsModule,
    ComponentsModule,
    SharedModule,
    NgxGaugeModule,
    NgChartsModule,
  ],
})
export class DashboardModule {}
