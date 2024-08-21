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

@NgModule({
  declarations: [
    MainComponent,
    Dashboard2Component,
    SupportComponent,
    EtmsDashboardComponent,
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
