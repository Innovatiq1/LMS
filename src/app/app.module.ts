import { APP_INITIALIZER, NgModule } from '@angular/core';

import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './layout/header/header.component';
import { PageLoaderComponent } from './layout/page-loader/page-loader.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { RightSidebarComponent } from './layout/right-sidebar/right-sidebar.component';
import { AuthLayoutComponent } from './layout/app-layout/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './layout/app-layout/main-layout/main-layout.component';
import { fakeBackendProvider } from './core/interceptor/fake-backend';
import { ErrorInterceptor } from './core/interceptor/error.interceptor';
import { JwtInterceptor } from './core/interceptor/jwt.interceptor';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import {
  HttpClientModule,
  HTTP_INTERCEPTORS,
  HttpClient,
} from '@angular/common/http';

import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { ApiIntereptor } from '@core/interceptor/api.interceptor';
import { ErrorHandlerInterceptor } from '@core/interceptor/error-handler.interceptor';
import { DatePipe } from '@core/service/date.pipe';
import { SettingsComponent } from './student/settings/settings.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from '@danielmoncada/angular-datetime-picker';
import { ComponentsModule } from '@shared/components/components.module';
import { NgApexchartsModule } from 'ng-apexcharts';
import { LeaveRequestComponent } from './student/leave-request/leave-request.component';
import { ViewComponent } from './student/leave-request/view/view.component';
import { LeaveRequestService as stdLeaveReqService } from './student/leave-request/leave-request.service';
import { InstructorLeaveRequestService } from './teacher/leave-request/leave-request.service';
import { LecturesService } from './teacher/lectures/lectures.service';
import { LoginGuard } from '@core/guard/login.guard';
import { ChatbotComponent } from './apps/chatbot/chatbot.component';
// import { TicketComponent } from './ticket/ticket.component';
import { StudentsService } from './admin/students/students.service';
import { UsersModule } from './admin/users/users.module';
import { DashboardCustomzComponent } from './student/settings/dashboard-customz/dashboard-customz.component';
import { TrainerAnalyticsDashboardComponent } from './student/settings/trainer-analytics-dashboard/trainer-analytics-dashboard.component';
import { SupportDashboardComponent } from './student/settings/support-dashboard/support-dashboard.component';
import { EditUpdateDashboardComponent } from './student/settings/dashboard-customz/edit-update-dashboard/edit-update-dashboard.component';
import { TraineesDashboardComponent } from './student/settings/trainees-dashboard/trainees-dashboard.component';
import { SuperAdminService } from './superAdmin/super-admin.service';
import { CorporateDashboardComponent } from './student/settings/corporate-dashboard/corporate-dashboard.component';

// import { ChangeBgDirective } from './change-bg.directive';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    PageLoaderComponent,
    SidebarComponent,
    RightSidebarComponent,
    AuthLayoutComponent,
    MainLayoutComponent,
    SettingsComponent,
    LeaveRequestComponent,
    ChatbotComponent,
    // TicketComponent,
    ViewComponent,
    DashboardCustomzComponent,
    TrainerAnalyticsDashboardComponent,
    SupportDashboardComponent,
    EditUpdateDashboardComponent,
    TraineesDashboardComponent,
    CorporateDashboardComponent,
    

    // ChangeBgDirective

  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgScrollbarModule,
    NgApexchartsModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    ComponentsModule,
    SharedModule,

    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    NgScrollbarModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),
    LoadingBarRouterModule,
    // core & shared
    CoreModule,
    SharedModule
  ],
  providers: [
    DatePipe,
    StudentsService,
    stdLeaveReqService,
    InstructorLeaveRequestService,
    LecturesService,
    { provide: LoginGuard, useClass: LoginGuard },

    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    fakeBackendProvider,
        // { provide: LocationStrategy, useClass: HashLocationStrategy },

    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiIntereptor,
      multi: true,

    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorHandlerInterceptor,
      multi: true
    },
    SuperAdminService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
