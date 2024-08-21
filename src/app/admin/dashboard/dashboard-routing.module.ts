import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main/main.component';
import { Dashboard2Component } from './dashboard2/dashboard2.component';
import { EtmsDashboardComponent } from './etms-dashboard/etms-dashboard.component';

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
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
