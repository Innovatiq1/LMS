import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main/main.component';
import { Dashboard2Component } from './dashboard2/dashboard2.component';
import { EtmsDashboardComponent } from './etms-dashboard/etms-dashboard.component';
import { TotalListComponent } from './total-list/total-list.component';
import { CorpCourseListComponent } from './corp-course-list/corp-course-list.component';
import { CorpManagerListComponent } from './corp-manager-list/corp-manager-list.component';
import { CorpStaffListComponent } from './corp-staff-list/corp-staff-list.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'main',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    component: MainComponent,
  },
  {
    path: 'instructor-analytics',
    component: Dashboard2Component,
  },
  {
    path: 'etms-dashboard',
    component: EtmsDashboardComponent
  },
  {
    path: 'program-list',
    component: TotalListComponent,
  },
  {
    path: 'corp-course-list',
    component: CorpCourseListComponent,
  },
  {
    path: 'corp-manager-list',
    component: CorpManagerListComponent,
  },
  {
    path: 'corp-staff-list',
    component: CorpStaffListComponent,
  }

];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
