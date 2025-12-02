import { AuthLayoutComponent } from './layout/app-layout/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './layout/app-layout/main-layout/main-layout.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './core/guard/auth.guard';
import { SettingsComponent } from './student/settings/settings.component';
import { LeaveRequestComponent } from './student/leave-request/leave-request.component';
import { InstructorLeaveRequestComponent } from './teacher/leave-request/leave-request.component';
import { LoginGuard } from '@core/guard/login.guard';
import { ViewComponent } from './student/leave-request/view/view.component';
import { RescheduledCoursesComponent } from './student/rescheduled-courses/rescheduled-courses.component';
import { SurveyRegistrationComponent } from './student/settings/survey-registration/survey-registration.component';
import { AllSurveyComponent } from './student/settings/all-survey/all-survey.component';
import { ThridPartyFormComponent } from './student/settings/thrid-party-form/thrid-party-form.component';
import { EmbedIframeComponent } from './embed-iframe/embed-iframe.component';
const routes: Routes = [

  {
    path: 'embed/form',
    component: EmbedIframeComponent,
  },
 
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: '/authentication/LMS/signin', pathMatch: 'full' },
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
        path: 'student/registration-form',
        component: SurveyRegistrationComponent
      },    
      {
        path: 'student/thirdparty/form',
        component: ThridPartyFormComponent
      },  
      {
        path: 'instructor',
        loadChildren: () =>
          import('./teacher/teacher.module').then((m) => m.TeacherModule),
        canActivate: [LoginGuard],
      },
      {
       path: 'student/all-survey',
       component: AllSurveyComponent,
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
        // canActivate: [LoginGuard],
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
      {
        path: 'apps',
        loadChildren: () =>
          import('./apps/apps.module').then((m) => m.AppsModule),
        canActivate: [LoginGuard],
      },
      {
        path: 'ui',
        loadChildren: () => import('./ui/ui.module').then((m) => m.UiModule),
        canActivate: [LoginGuard],
      },
    ],
  },
  {
    path: ':name/authentication',
    component: AuthLayoutComponent,
    loadChildren: () =>
      import('./authentication/authentication.module').then(
        (m) => m.AuthenticationModule
      ),
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
