import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { NgChartsModule } from 'ng2-charts';
import { NgxEchartsModule } from 'ngx-echarts';
import { NgApexchartsModule } from 'ng-apexcharts';
import {
  OwlDateTimeModule,
  OwlNativeDateTimeModule,
} from '@danielmoncada/angular-datetime-picker';

import { StudentRoutingModule } from './student-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeworkComponent } from './homework/homework.component';
import { DeleteDialogComponent as leaveDeleteComonent } from './leave-request/dialogs/delete/delete.component';
import { FormDialogComponent } from './leave-request/dialogs/form-dialog/form-dialog.component';
// import { TimetableComponent } from './timetable/timetable.component';
import { HomeworkService } from './homework/homework.service';
import { LeaveRequestService as stdLeaveReqService } from './leave-request/leave-request.service';
import { SharedModule } from '@shared';
import { ComponentsModule } from '@shared/components/components.module';
import { CourseComponent } from './course/course.component';
import { ViewCourseComponent } from './view-course/view-course.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ProgramComponent } from './program/program.component';
import { ViewProgramComponent } from './view-program/view-program.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { FullCalendarModule } from '@fullcalendar/angular';

// import { ProgramTimetableComponent } from './program-timetable/program-timetable.component';

import { SucessCourseComponent } from './sucess-course/sucess-course.component';
import { FailureCourseComponent } from './failure-course/failure-course.component';
import { ExamsSheduleComponent } from './exams-shedule/exams-shedule.component';
import { ProgramSheduleComponent } from './program-shedule/program-shedule.component';
import { SuccessProgramComponent } from './success-program/success-program.component';
import { FailureProgramComponent } from './failure-program/failure-program.component';
import { StudentVideoPlayerComponent } from './view-course/student-video-player/student-video-player.component';
import { TimeFormatPipe } from '../../app/core/pipes/time-format.pipe';import { QuestionComponent } from './question/question.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { ChangeBgDirective } from 'app/change-bg.directive';
import { ExamScheduleService } from 'app/timetable/exam-schedule.service';
import { LogoCoutomzationComponent } from './settings/logo-coutomzation/logo-coutomzation.component';
import { SidemenuComponent } from './settings/sidemenu/sidemenu.component';
import { FormCustomizationComponent } from './settings/form-customization/form-customization.component';
import { AllUsersComponent } from './settings/all-users/all-users.component';
import { StudentsService } from 'app/admin/students/students.service';
import { AllStudentsComponent } from './settings/all-students/all-students.component';
import { AllTeachersComponent } from './settings/all-teachers/all-teachers.component';
import { TeachersService } from 'app/admin/teachers/teachers.service';
import { StaffService } from 'app/admin/staff/staff.service';
import { AllstaffComponent } from './settings/all-staff/all-staff.component';
import { AllDepartmentsComponent } from './settings/all-departments/all-departments.component';
import { DepartmentService } from 'app/admin/departments/department.service';
import { CertificateTemplateComponent } from './settings/certificate-template/certificate-template.component';
import { ListComponent } from './settings/list/list.component';
import { CreatAnnouncementComponent } from './settings/list/creat-announcement/creat-announcement.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { AllQuestionsComponent } from './settings/all-questions/all-questions.component';
import { AssesmentQuestionsComponent } from './settings/assesment-questions/assesment-questions.component';
import { AddQuestionsComponent } from './settings/add-questions/add-questions.component';
import { CreateUserRoleComponent } from './settings/create-user-role/create-user-role.component';
import { UserTypeComponent } from './settings/user-type/user-type.component';
import { ViewDepartmentComponent } from './settings/all-departments/view-department/view-department.component';
import { ViewAnnouncementComponent } from './settings/list/view-announcement/view-announcement.component';
import { ExamComponent } from './exam/exam.component';
import { AddExamQuestionsComponent } from './settings/add-exam-questions/add-exam-questions.component';
import { RoleUserComponent } from './settings/role-user/role-user.component';
import { RoleDailogComponent } from './settings/all-users/role-dailog/role-dailog.component';
import { AllExamQuestionsComponent } from './settings/all-exam-questions/all-exam-questions.component';
import { QuestionTestComponent } from 'app/ui/questionTest/questionTest.component';
import { CategoriesComponent } from './settings/categories/categories.component';
import { CreateCategoriesComponent } from './settings/categories/create-categories/create-categories.component';
import { EditCategoriesComponent } from './settings/categories/edit-categories/edit-categories.component';
import { ViewCategoriesComponent } from './settings/categories/view-categories/view-categories.component';
import { ExamQuestionsComponent } from './exam-questions/exam-questions.component';
import { SurveyModule } from 'app/admin/survey/survey.module';
import { CreateFeedbackComponent } from './settings/create-feedback/create-feedback.component';
import { UserGroupComponent } from './settings/user-group/user-group.component';
import { UserGroupListComponent } from './settings/user-group-list/user-group-list.component';
import { CreateDepartmentComponent } from './settings/create-department/create-department.component';
import { FundingComponent } from './settings/funding/funding.component';
import { CustomizationCurrencyComponent } from './settings/customization-currency/customization-currency.component';
import { CreateUserTypeComponent } from './settings/create-user-type/create-user-type.component';
import { AddDepartmentComponent } from './settings/add-department/add-department.component';
import { CreateAllUsersComponent } from './settings/create-all-users/create-all-users.component';
import { ViewUsersComponent } from './settings/view-users/view-users.component';
import { AddStudentComponent } from './settings/add-student/add-student.component';
import { AboutStudentComponent } from './settings/about-student/about-student.component';
import { AddTeacherComponent } from './settings/add-teacher/add-teacher.component';
import { AboutTeacherComponent } from './settings/about-teacher/about-teacher.component';
import { EditTeacherComponent } from './settings/edit-teacher/edit-teacher.component';
import { AddStaffComponent } from './settings/add-staff/add-staff.component';
import { AboutStaffComponent } from './settings/about-staff/about-staff.component';
import { ExamResultsComponent } from './exam-results/exam-results.component';
import { VendorComponent } from './settings/vendor/vendor.component';
import { UpdateDiscountComponent } from './settings/discount/update-discount/update-discount.component';
import { DiscountComponent } from './settings/discount/discount.component';
import { UpdateFundingComponent } from './settings/funding/update-funding/update-funding.component';
import { UpdateDeptComponent } from './settings/create-department/update-dept/update-dept.component';
import { UpdateUsergroupComponent } from './settings/user-group/update-usergroup/update-usergroup.component';
import { UpdateVendorComponent } from './settings/vendor/update-vendor/update-vendor.component';
import { EditStaffComponent } from './settings/about-staff/edit-staff/edit-staff.component';
import { CustomizationTimerComponent } from './settings/customization-timer/customization-timer.component';
import { CustomizationAssessmentRetakeComponent } from './settings/customization-assessment-retake/customization-assessment-retake.component';
import { CustomizationExamAssessmentRetakeComponent } from './settings/customization-exam-assessment-retake/customization-exam-assessment-retake.component';
import { SmtpComponent } from './settings/smtp/smtp.component';
import { ThirdPartyToolsComponent } from './settings/third-party-tools/third-party-tools.component';
import { SingpassComponent } from './settings/singpass/singpass.component';
import { PaymentGatewayComponent } from './settings/payment-gateway/payment-gateway.component';
import { ApprovalWorkflowComponent } from './settings/approval-workflow/approval-workflow.component';
import { StudentDbComponent } from './settings/student-db/student-db.component';
import { PreviewQuestionsComponent } from './settings/preview-questions/preview-questions.component';
import { PreviewTestAnswersheetComponent } from './preview-test-answersheet/preview-test-answersheet.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { CreateApprovalWorkflowComponent } from './settings/approval-workflow/create-approval-workflow/create-approval-workflow.component';
import { ViewApprovalWorkflowComponent } from './settings/approval-workflow/view-approval-workflow/view-approval-workflow.component';
import { InvoiceComponent } from './view-course/invoice/invoice.component';
import { ExamTestListComponent } from './exam-test-list/exam-test-list.component';
import { CreateCertificateComponent } from './settings/certificate-template/create-certificate/create-certificate.component';
import { CustomizationExamAssessmentAlgorithmComponent } from './settings/customization-exam-assessment-algorithm/customization-exam-assessment-algorithm.component';
import { CustomizationExamTimerComponent } from './settings/customization-exam-timer/customization-exam-timer.component';

@NgModule({
  declarations: [
    DashboardComponent,
    HomeworkComponent,
    leaveDeleteComonent,
    FormDialogComponent,
    // TimetableComponent,
    CourseComponent,
    ViewCourseComponent,
    ProgramComponent,
    ViewProgramComponent,
    FeedbackComponent,

    // ProgramTimetableComponent,

    SucessCourseComponent,
    FailureCourseComponent,
    ExamsSheduleComponent,
    ProgramSheduleComponent,
    SuccessProgramComponent,
    FailureProgramComponent,
    StudentVideoPlayerComponent,
    TimeFormatPipe,
    QuestionComponent,
    WelcomeComponent,
    ChangeBgDirective,
    LogoCoutomzationComponent,
    SidemenuComponent,
    FormCustomizationComponent,
    AllUsersComponent,
    AllStudentsComponent,
    AllTeachersComponent,
    AllstaffComponent,
    AllDepartmentsComponent,
    CertificateTemplateComponent,
    ListComponent,
    CreatAnnouncementComponent,
    AllQuestionsComponent,
    AssesmentQuestionsComponent,
    AddQuestionsComponent,
    UserTypeComponent,
    CreateUserRoleComponent,
    ViewDepartmentComponent,
    ViewAnnouncementComponent,
    RoleUserComponent,
    RoleDailogComponent,
    AddExamQuestionsComponent,
    ExamComponent,
    AllExamQuestionsComponent,
    ExamQuestionsComponent,
    QuestionTestComponent,
    CategoriesComponent,
    CreateCategoriesComponent,
    ViewCategoriesComponent,
    EditCategoriesComponent,
    CreateFeedbackComponent,
    UserGroupComponent,
    UserGroupListComponent,
    CreateDepartmentComponent,
    FundingComponent,
    VendorComponent,
    CustomizationCurrencyComponent,
    CreateUserTypeComponent,
    AddDepartmentComponent,
    CreateAllUsersComponent,
    ViewUsersComponent,
    AddStudentComponent,
    AboutStudentComponent,
    AddTeacherComponent,AboutTeacherComponent,
    EditTeacherComponent,
    AddStaffComponent,
    AboutStaffComponent,
    ExamResultsComponent,
    VendorComponent,
    DiscountComponent,
    UpdateDiscountComponent,
    UpdateFundingComponent,
    UpdateDeptComponent,
    UpdateUsergroupComponent,
    UpdateVendorComponent,
    EditStaffComponent,
    CustomizationTimerComponent,
    CustomizationAssessmentRetakeComponent,
    CustomizationExamAssessmentRetakeComponent,
    SmtpComponent,
    ThirdPartyToolsComponent,
    SingpassComponent,
    PaymentGatewayComponent,
    ApprovalWorkflowComponent,
    StudentDbComponent,
    PreviewQuestionsComponent,
    PreviewTestAnswersheetComponent,
    CheckoutComponent,
    CreateApprovalWorkflowComponent,
    ViewApprovalWorkflowComponent,
    InvoiceComponent,
    ExamTestListComponent,
    CreateCertificateComponent,
    CustomizationExamAssessmentAlgorithmComponent,
    CustomizationExamTimerComponent,
  
    // CourseKitComponent,
    // VideoPlayerComponent,
    // CreateCourseKitComponent,
    // EditCourseKitComponent,
    // ViewCourseKitComponent,
    // CreateTemplateComponent
  ],
  imports: [
    CommonModule,
    StudentRoutingModule,
    NgChartsModule,
    FullCalendarModule,


    NgxEchartsModule.forRoot({
      echarts: () => import('echarts'),
    }),
    FormsModule,
    ReactiveFormsModule,
    NgScrollbarModule,
    NgApexchartsModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    ComponentsModule,
    SharedModule,
    ModalModule.forRoot(),
    CKEditorModule,
    AngularEditorModule,
    SurveyModule,


  ],
  providers: [
HomeworkService, stdLeaveReqService,StudentsService,ExamScheduleService,TeachersService,StaffService,DepartmentService]
})
export class StudentModule {}
