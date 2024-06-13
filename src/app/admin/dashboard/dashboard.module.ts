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
import { CmDashboardComponent } from './cm-dashboard/cm-dashboard.component';
import { SupervisorDashboardComponent } from './supervisor-dashboard/supervisor-dashboard.component';
import { PmDashboardComponent } from './pm-dashboard/pm-dashboard.component';
import { TrainingAdministratorComponent } from './training-administrator/training-administrator.component';
import { HodDashboardComponent } from './hod-dashboard/hod-dashboard.component';
import { TrainingCoordinatorDbComponent } from './training-coordinator-db/training-coordinator-db.component';
import { DashboardTabsComponent } from './dashboard-tabs/dashboard-tabs.component';
import { StudentDashboardComponent } from './student-dashboard/student-dashboard.component';
import { SupportComponent } from '../../apps/support/support.component';
import { NgxGaugeModule } from 'ngx-gauge';
import { NgChartsModule } from 'ng2-charts';
import { TrainingApprovalTabComponent } from './training-approval-tab/training-approval-tab.component';
import { EtmsDashboardComponent } from './etms-dashboard/etms-dashboard.component';
import { SuperAdminComponent } from 'app/superAdmin/super-admin/super-admin.component';

@NgModule({
  declarations: [
    MainComponent,
    Dashboard2Component,
    CmDashboardComponent,
    PmDashboardComponent,
    TrainingAdministratorComponent,
    HodDashboardComponent,
    TrainingCoordinatorDbComponent,
    SupervisorDashboardComponent,
    DashboardTabsComponent,
    StudentDashboardComponent,
    SupportComponent,
    EtmsDashboardComponent,
    TrainingApprovalTabComponent,
    SuperAdminComponent
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
