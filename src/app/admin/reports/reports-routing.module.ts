import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportsComponent } from './reports/reports.component';
import { GenereateReportComponent } from './genereate-report/genereate-report.component';
import { FeedbackReportComponent } from './feedback-report/feedback-report.component';
import { UserReportComponent } from './user-report/user-report.component';
import { PaymentReportComponent } from './payment-report/payment-report.component';

const routes: Routes = [
  {
    path: 'report',
    component: ReportsComponent,
  },
  {
    path: 'generate-report',
    component: GenereateReportComponent,
  },
  {
    path: 'feedback-report',
    component: FeedbackReportComponent,
  },
  {
    path: 'student-report',
    component: UserReportComponent,
  },
  {
    path: 'payment-report',
    component: PaymentReportComponent,
  },

 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportsRoutingModule {}
