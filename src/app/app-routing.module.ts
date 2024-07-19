
import { AuthLayoutComponent } from './layout/app-layout/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './layout/app-layout/main-layout/main-layout.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './core/guard/auth.guard';
import { SettingsComponent } from './student/settings/settings.component';
import { LeaveRequestComponent } from './student/leave-request/leave-request.component';
import { InstructorSettingsComponent } from './teacher/settings/settings.component';
import { InstructorLeaveRequestComponent } from './teacher/leave-request/leave-request.component';
import { LoginGuard } from '@core/guard/login.guard';
import { ViewComponent } from './student/leave-request/view/view.component';
import { RescheduledCoursesComponent } from './student/rescheduled-courses/rescheduled-courses.component';

const routes: Routes = [
 
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: '/authentication/signin-role', pathMatch: 'full' },
      {
        path: 'admin',
        loadChildren: () =>
          import('./admin/admin.module').then((m) => m.AdminModule),
        canActivate: [LoginGuard],
      },
      {
        path: 'super-admin',
        loadChildren: () =>
          import('./superAdmin/super-admi-r.module').then((m) => m.SuperAdmiRModule),
        canActivate: [LoginGuard],
      },
      {
        path: 'instructor',
        loadChildren: () =>
          import('./teacher/teacher.module').then((m) => m.TeacherModule),
        canActivate: [LoginGuard],
      },
      {
        path: 'student',
        loadChildren: () =>
          import('./student/student.module').then((m) => m.StudentModule),
        canActivate: [LoginGuard],
      },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./admin/dashboard/dashboard.module').then(
            (m) => m.DashboardModule
          ),
        canActivate: [LoginGuard],
      },
      
      
      {
        path: 'email',
        loadChildren: () =>
          import('./email/email.module').then((m) => m.EmailModule),
        canActivate: [LoginGuard],
      },
      {
        path: 'chat',
        loadChildren: () =>
          import('./apps/apps.module').then((m) => m.AppsModule),
        canActivate: [LoginGuard],
      },
      {
        path: 'timetable',
        loadChildren: () =>
          import('./timetable/timetable.module').then((m) => m.TimetableModule),
        canActivate: [LoginGuard],
      },
      {
        path: 'instructor-timetable',
        loadChildren: () =>
          import('./instructor-timetable/instructor-timetable.module').then((m) => m.InstructorTimetableModule),
        canActivate: [LoginGuard],
      },
      {
        path: 'settings/student-settings',
        component: SettingsComponent,
        canActivate: [LoginGuard],
      },
      {
        path: 'reschedule/courses',
        component: LeaveRequestComponent,
        canActivate: [LoginGuard],
      },
      {
        path: 'reschedule/reschedule-requests',
        component: InstructorLeaveRequestComponent,
        canActivate: [LoginGuard],
      },
      {
        path: 'reschedule/rescheduled-courses',
        component: RescheduledCoursesComponent,
        canActivate: [LoginGuard],
      },
      {
        path: 'reschedule/programs',
        component: LeaveRequestComponent,
        canActivate: [LoginGuard],
      },
      {
        path: 'reschedule/programs-view',
        component: ViewComponent,
        canActivate: [LoginGuard],
      },
      {
        path: 'reschedule/courses/programs-view',
        component: ViewComponent,
        canActivate: [LoginGuard],
      },
      
      {
        path: 'settings/instructor-settings',
        component: InstructorSettingsComponent,
        canActivate: [LoginGuard],
      },
      {
        path: 'leave-request/instructor-leaves',
        component: InstructorLeaveRequestComponent,
        canActivate: [LoginGuard],
      },
      {
        path: 'settings/coursemanager-settings',
        component: SettingsComponent,
        canActivate: [LoginGuard],
      },
      {
        path: 'settings/programmanager-settings',
        component: SettingsComponent,
        canActivate: [LoginGuard],
      },
      {
        path: 'settings/headofdepartment-settings',
        component: SettingsComponent,
        canActivate: [LoginGuard],
      },
      {
        path: 'settings/supervisor-settings',
        component: SettingsComponent,
        canActivate: [LoginGuard],
      },
      {
        path: 'settings/trainingcoordinator-settings',
        component: SettingsComponent,
        canActivate: [LoginGuard],
      },
      {
        path: 'settings/trainingadministrator-settings',
        component: SettingsComponent,
        canActivate: [LoginGuard],
      },
      {
        path: 'settings/admin-settings',
        component: SettingsComponent,
        canActivate: [LoginGuard],
      },


      // Extra components
      {
        path: 'calendar',
        loadChildren: () =>
          import('./calendar/calendar.module').then((m) => m.CalendarsModule),
        canActivate: [LoginGuard],
      },
      {
        path: 'task',
        loadChildren: () =>
          import('./task/task.module').then((m) => m.TaskModule),
        canActivate: [LoginGuard],
      },
      {
        path: 'contacts',
        loadChildren: () =>
          import('./contacts/contacts.module').then((m) => m.ContactsModule),
        canActivate: [LoginGuard],
      },
      {
        path: 'apps',
        loadChildren: () =>
          import('./apps/apps.module').then((m) => m.AppsModule),
        canActivate: [LoginGuard],
      },
      {
        path: 'widget',
        loadChildren: () =>
          import('./widget/widget.module').then((m) => m.WidgetModule),
        canActivate: [LoginGuard],
      },
      {
        path: 'ui',
        loadChildren: () => import('./ui/ui.module').then((m) => m.UiModule),
        canActivate: [LoginGuard],
      },
      {
        path: 'forms',
        loadChildren: () =>
          import('./forms/forms.module').then((m) => m.FormModule),
        canActivate: [LoginGuard],
      },
      {
        path: 'tables',
        loadChildren: () =>
          import('./tables/tables.module').then((m) => m.TablesModule),
        canActivate: [LoginGuard],
      },
      {
        path: 'charts',
        loadChildren: () =>
          import('./charts/charts.module').then((m) => m.ChartsModule),
        canActivate: [LoginGuard],
      },
      {
        path: 'timeline',
        loadChildren: () =>
          import('./timeline/timeline.module').then((m) => m.TimelineModule),
        canActivate: [LoginGuard],
      },
      {
        path: 'icons',
        loadChildren: () =>
          import('./icons/icons.module').then((m) => m.IconsModule),
        canActivate: [LoginGuard],
      },
      {
        path: 'extra-pages',
        loadChildren: () =>
          import('./extra-pages/extra-pages.module').then(
            (m) => m.ExtraPagesModule
          ),
        canActivate: [LoginGuard],
      },
      {
        path: 'maps',
        loadChildren: () =>
          import('./maps/maps.module').then((m) => m.MapsModule),
        canActivate: [LoginGuard],
      },
      {
        path: 'multilevel',
        loadChildren: () =>
          import('./multilevel/multilevel.module').then(
            (m) => m.MultilevelModule
          ),
        canActivate: [LoginGuard],
      },
    ],
  },
  {
    path: 'authentication',
    component: AuthLayoutComponent,
    loadChildren: () =>
      import('./authentication/authentication.module').then(
        (m) => m.AuthenticationModule
      ),
  },
  // { path: '**', component: Page404Component },
];
@NgModule({
  imports: [RouterModule.forRoot(routes, {})],
  exports: [RouterModule],
})
export class AppRoutingModule {}
