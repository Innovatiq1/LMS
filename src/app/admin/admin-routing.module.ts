import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
  },
  {
    path: 'e-tms',
    loadChildren: () =>
      import('./E-TMS/e-tms.module').then((m) => m.ETmsModule),
  },
  {
    path: 'users',
    loadChildren: () =>
      import('./teachers/teachers.module').then((m) => m.TeachersModule),
  },
  {
    path: 'users',
    loadChildren: () =>
      import('./students/students.module').then((m) => m.StudentsModule),
  },
  {
    path: 'courses',
    loadChildren: () =>
      import('./courses/courses.module').then((m) => m.CoursesModule),
  },
  {
    path: 'approval',
    loadChildren: () =>
      import('./approval/approval.module').then((m) => m.ApprovalModule),
  },

  {
    path: 'schedule',
    loadChildren: () =>
      import('./schedule-class/schedule-class.module').then((m) => m.ScheduleClassModule),
  },
  {
    path: 'program',
    loadChildren: () =>
      import('./program/program.module').then((m) => m.ProgramModule),
  },
  {
    path: 'users',
    loadChildren: () =>
      import('./users/users.module').then((m) => m.UsersModule),
  },
  {
    path: 'survey',
    loadChildren: () =>
      import('./survey/survey.module').then((m) => m.SurveyModule),
  },
  {
    path: 'audit',
    loadChildren: () =>
      import('./audit/audit.module').then((m) => m.AuditModule),
  },

  {
    path: 'certificate',
    loadChildren: () =>
    import('./certificate-builder/certificate.module').then((m) => m.CertificateModule)

  },
  {
    path: 'library',
    loadChildren: () =>
      import('./library/library.module').then((m) => m.LibraryModule),
  },
  {
    path: 'departments',
    loadChildren: () =>
      import('./departments/departments.module').then(
        (m) => m.DepartmentsModule
      ),
  },
  {
    path: 'users',
    loadChildren: () =>
      import('./staff/staff.module').then((m) => m.StaffModule),
  },
  {
    path: 'holidays',
    loadChildren: () =>
      import('./holidays/holidays.module').then((m) => m.HolidaysModule),
  },
  {
    path: 'fees',
    loadChildren: () => import('./fees/fees.module').then((m) => m.FeesModule),
  },
  {
    path: 'attendance',
    loadChildren: () =>
      import('./attendance/attendance.module').then((m) => m.AttendanceModule),
  },
  {
    path: 'payment',
    loadChildren: () =>
      import('./payments/payment.module').then((m) => m.PaymentModule),
  },
  {
    path: 'questions',
    loadChildren: () =>
      import('./questions/questions.module').then((m) => m.QuestionsModule),
  },
  {
    path: 'testimonials',
    loadChildren: () =>
      import('./testimonials/testimonials.module').then((m) => m.TestimonialsModule),
  },
  {
    path:'budgets',
    loadChildren: () =>
    import('./budget-payments/budget.module').then((m) => m.BudgetModule)
  },
  {
    path: 'reports',
    loadChildren: () =>
      import('./reports/reports.module').then((m) => m.ReportsModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
