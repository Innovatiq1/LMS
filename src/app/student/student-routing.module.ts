import { Page404Component } from './../authentication/page404/page404.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeworkComponent } from './homework/homework.component';
import { LeaveRequestComponent } from './leave-request/leave-request.component';
import { SettingsComponent } from './settings/settings.component';
import { CourseComponent } from './course/course.component';
import { ViewCourseComponent } from './view-course/view-course.component';
import { ProgramComponent } from './program/program.component';
import { ViewProgramComponent } from './view-program/view-program.component';
import { FeedbackComponent } from './feedback/feedback.component';


import { SucessCourseComponent } from './sucess-course/sucess-course.component';
import { FailureCourseComponent } from './failure-course/failure-course.component';
import { ExamsSheduleComponent } from './exams-shedule/exams-shedule.component';
import { ProgramSheduleComponent } from './program-shedule/program-shedule.component';
import { SuccessProgramComponent } from './success-program/success-program.component';
import { FailureProgramComponent } from './failure-program/failure-program.component';
import { QuestionComponent } from './question/question.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { LogoCoutomzationComponent } from './settings/logo-coutomzation/logo-coutomzation.component';
import { SidemenuComponent } from './settings/sidemenu/sidemenu.component';
import { FormCustomizationComponent } from './settings/form-customization/form-customization.component'
import { AllUsersComponent } from './settings/all-users/all-users.component';
import { AllStudentsComponent } from './settings/all-students/all-students.component';
import { AllTeachersComponent } from './settings/all-teachers/all-teachers.component';
import { AllstaffComponent } from './settings/all-staff/all-staff.component';
import { AllDepartmentsComponent } from './settings/all-departments/all-departments.component';
import { CertificateTemplateComponent } from './settings/certificate-template/certificate-template.component';
import { ListComponent } from './settings/list/list.component';
import { CreatAnnouncementComponent } from './settings/list/creat-announcement/creat-announcement.component';
import { AddQuestionsComponent } from './settings/add-questions/add-questions.component';
import { AddExamQuestionsComponent } from './settings/add-exam-questions/add-exam-questions.component'
import { AllQuestionsComponent } from './settings/all-questions/all-questions.component';
import { AllExamQuestionsComponent } from './settings/all-exam-questions/all-exam-questions.component';
import { CreateUserRoleComponent } from './settings/create-user-role/create-user-role.component';
import { UserTypeComponent } from './settings/user-type/user-type.component';
import { ViewDepartmentComponent } from './settings/all-departments/view-department/view-department.component';
import { ViewAnnouncementComponent } from './settings/list/view-announcement/view-announcement.component';
import { ExamComponent } from './exam/exam.component';
import { RoleUserComponent } from './settings/role-user/role-user.component';
import { CategoriesComponent } from './settings/categories/categories.component';
import { CreateCategoriesComponent } from './settings/categories/create-categories/create-categories.component';
import { EditCategoriesComponent } from './settings/categories/edit-categories/edit-categories.component';
import { ViewCategoriesComponent } from './settings/categories/view-categories/view-categories.component';
import { ExamQuestionsComponent } from './exam-questions/exam-questions.component';
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
import { ExamTestListComponent } from './exam-test-list/exam-test-list.component';
import { VendorComponent } from './settings/vendor/vendor.component';
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
import { ViewApprovalWorkflowComponent } from './settings/approval-workflow/view-approval-workflow/view-approval-workflow.component';
import { CreateApprovalWorkflowComponent } from './settings/approval-workflow/create-approval-workflow/create-approval-workflow.component';
import { CreateCertificateComponent } from './settings/certificate-template/create-certificate/create-certificate.component';
import { CustomizationExamAssessmentAlgorithmComponent } from './settings/customization-exam-assessment-algorithm/customization-exam-assessment-algorithm.component';
import { CustomizationExamTimerComponent } from './settings/customization-exam-timer/customization-exam-timer.component';
import { DiscountComponent } from './settings/discount/discount.component';
import { UpdateDiscountComponent } from './settings/discount/update-discount/update-discount.component';
import { PassingCriteriaComponent } from './settings/passing-criteria/passing-criteria.component';


const routes: Routes = [
  {
    path: 'enrollment/course',
    component: CourseComponent,
  },
  {
    path: 'view-course/:id',
    component: ViewCourseComponent,
  },
  {
    path: 'view-freecourse/:id',
    component: ViewCourseComponent,
  },

  {
    path: 'sucess-course/:id',
    component: SucessCourseComponent,
  },
  {
    path: 'fail-course/:id',
    component: FailureCourseComponent,
  },
  {
    path: 'sucess-program/:id',
    component: SuccessProgramComponent,
  },
  {
    path: 'fail-program/:id',
    component: FailureProgramComponent,
  },

  {
    path: 'enrollment/program',
    component: ProgramComponent,
  },
  {
    path: 'enrollment/exam',
    component: ExamComponent,
  },
  {
    path: 'exams/exam-results',
    component: ExamResultsComponent,
  },
  {
    path: 'exams/exam',
    component: ExamTestListComponent,
  },

  {
    path: 'view-program/:id',
    component: ViewProgramComponent,
  },

  {
    path: 'schedule/homework',
    component: HomeworkComponent,
  },
  // {
  //   path: 'timetable/course-timetable',
  //   component: TimetableComponent,
  // },
  // {
  //   path: 'timetable/program-timetable',
  //   component: ProgramTimetableComponent,
  // },

  {
    path: 'feedback/courses/:id/:id/:id',
    component: FeedbackComponent,
  },
  {
    path: 'feedback/freecourse/:id/:id/:id',
    component: FeedbackComponent,
  },

  {
    path: 'feedback/programs',
    component: FeedbackComponent,
  },
  {
    path: 'exams/courses',
    component: ExamsSheduleComponent
  },
  {
    path: 'exams/programs',
    component: ProgramSheduleComponent
  },
  {
    path: 'questions/:id/:id/:id',
    component: QuestionComponent,
  },
  {
    path: 'test/preview/:id/student/:studentId',
    component: PreviewTestAnswersheetComponent,
  },
  {
    path: 'questions/freecourse/:id/:id/:id',
    component: QuestionComponent,
  },

  {
    path: 'exam-questions/:id/:id/:id/:id', // 1.assessmentAnswerId, 2.studentId, 3.courseId, 4.examAssessmentId
    component: ExamQuestionsComponent,
  },
  {
    path: 'welcome',
    component: WelcomeComponent,
  },
  {
    path: 'settings/account-settings',
    component: SettingsComponent,
  },
  {
    path: 'settings/security-settings',
    component: SettingsComponent,
  },
  {
    path: 'settings/2-factor-authentication',
    component: SettingsComponent,
  },
  {
    path: 'settings/banners',
    component: SettingsComponent,
  },
  {
    path: 'settings/users',
    component: SettingsComponent,
  },
  {
    path: 'settings/all-user',
    component: SettingsComponent,
  },
  {
    path: 'settings/integration',
    component: SettingsComponent,
  },
  {
    path: 'settings/automation',
    component: SettingsComponent,
  },
  {
    path: 'settings/customization',
    component: SettingsComponent,
  },
  {
    path: 'settings/LMS-TAE',
    component: SettingsComponent,
  },
  {
    path: 'settings/configuration',
    component: SettingsComponent,
  },
  {
    path: 'settings/forms',
    component: SettingsComponent,
  },
  {
    path: 'settings/email-configuration',
    component: SettingsComponent,
  },
  {
    path: 'settings/customization-settings',
    component: SettingsComponent,
  },
  {path: 'settings/currency',
  component: CustomizationCurrencyComponent},
  {
    path: 'settings/timer',
    component: CustomizationTimerComponent
  },
  {
    path: 'settings/exam-timer',
    component: CustomizationExamTimerComponent
  },
  {
    path: 'settings/assessment-retake',
    component: CustomizationAssessmentRetakeComponent
  },
  {
    path: 'settings/exam-assessment-retake',
    component: CustomizationExamAssessmentRetakeComponent
  },
  {
    path: 'settings/exam-assessment-algorithm',
    component: CustomizationExamAssessmentAlgorithmComponent
  },
  {
    path: 'settings/customization-forms',
    component: SettingsComponent,
  },
  {
    path: 'settings/logo-customization',
    component: LogoCoutomzationComponent,
  },
  {
    path: 'settings/sidemenu',
    component: SettingsComponent,
  },
  {
    path: 'settings/all-users',
    component: AllUsersComponent,
  },
  {
    path: 'settings/all-students',
    component: AllStudentsComponent,
  },
  {
    path: 'settings/all-instructors',
    component: AllTeachersComponent,
  },
  {
    path: 'settings/all-staff',
    component: AllstaffComponent
  },
  {
    path: 'settings/all-departments',
    component: AllDepartmentsComponent
  },
  {
    path: 'settings/funding-grant',
    component: FundingComponent
  },
  {
    path: 'settings/vendor',
    component: VendorComponent
  },
  {
    path: 'settings/passing-criteria',
    component: PassingCriteriaComponent
  },


  {
    path: 'settings/discount',
    component: DiscountComponent
  },


  {
    path: 'settings/certificate/template',
    component: CertificateTemplateComponent
  },
  {
    path: 'settings/certificate/edit/:id',
    component: CreateCertificateComponent
  },
  {
    path: 'settings/certificate/view/:id',
    component: CreateCertificateComponent
  },
  {
    path: 'settings/certificate/create',
    component: CreateCertificateComponent
  },
  {
    path: 'settings/announcement',
    component: ListComponent,
  },
  {
    path: 'settings/customization-forms/create-announcement',
    component: CreatAnnouncementComponent,
  },
  {
    path: 'settings/create-announcement',
    component: CreatAnnouncementComponent,
  },
  {
    path: 'settings/edit-announcement/:id',
    component: CreatAnnouncementComponent,
  },
  {
    path: 'settings/view-announcement/:id',
    component: ViewAnnouncementComponent,
  },
  {
    path: 'settings/all-questions',
    component: AllQuestionsComponent,
},
{
  path: 'settings/all-exam-questions',
  component: AllExamQuestionsComponent,
},
{
    path: 'settings/add-questions',
    component: AddQuestionsComponent,
},
{
  path: 'settings/edit-questions/:id',
  component: AddQuestionsComponent,
},
{
  path: 'settings/preview-questions/:id',
  component: PreviewQuestionsComponent,
},
{
  path: 'settings/add-exam-questions',
  component: AddExamQuestionsComponent,
},
{
  path: 'settings/edit-exam-questions/:id',
  component: AddExamQuestionsComponent,
},
{
  path: 'settings/create-user-role',
  component: CreateUserRoleComponent
},
{
  path: 'settings/user-type',
  component: UserTypeComponent,
},
{
  path: 'settings/categories',
  component: CategoriesComponent
},
{
  path: 'settings/create-categories',
  component:  CreateCategoriesComponent
},
{
  path: 'settings/edit-categories/:id',
  component:  EditCategoriesComponent
},
{
  path:'settings/view-categories/:id',
  component:ViewCategoriesComponent
},
{
  path:'settings/view-categories',
  component:ViewCategoriesComponent
},
 {
    path:"settings/create-feedback",
    component: CreateFeedbackComponent
  },
  {
    path:"settings/edit-feedback/:id",
    component: CreateFeedbackComponent
  },
  {
    path:"settings/create-department",
    component: CreateDepartmentComponent
  },
// {
//   path: 'settings/course-kit',
//   component: CourseKitComponent
// },
// {
//   path: 'settings/create-course-kit',
//   component: CreateCourseKitComponent
// },
// {
//   path: 'settings/edit-course-kit/:id',
//   component:  EditCourseKitComponent
// },
// {
//   path: 'settings/create-template',
//   component: CreateTemplateComponent
// },
// {
//   path:'settings/view-course-kit/:id',
//   component:ViewCourseKitComponent
// },




  {
    path: 'settings/side-menu/:id',
    component: SidemenuComponent,
  },
  {
    path: 'settings/form-customization',
    component: FormCustomizationComponent,
  },
  {
    path: 'settings/view-department/:id',
    component: ViewDepartmentComponent,
  },
  {
    path: 'settings/role-user/:typeName',
    component: RoleUserComponent,
  },
  {
    path: 'settings/user-group',
    component: UserGroupComponent,
  },
  {
    path: 'settings/user-list-group',
    component: UserGroupListComponent
  },
  {
    path: 'settings/create-user-type',
    component: CreateUserTypeComponent
  },
  {
    path: 'settings/edit-user-type',
    component: CreateUserTypeComponent
  },
  {
    path: 'settings/edit-department/:id',
    component: AddDepartmentComponent
  },
  {
    path: 'settings/create-all-users',
    component: CreateAllUsersComponent
  },
  {
    path: 'settings/edit-all-users/:id',
    component: CreateAllUsersComponent
  },
  {
    path: 'settings/view-all-users/:id',
    component: ViewUsersComponent
  },
  {
    path: 'settings/add-student',
    component: AddStudentComponent
  },
  
  {
    path: 'settings/view-student',
    component: AboutStudentComponent
  },
  {
    path: 'settings/add-instructor',
    component: AddTeacherComponent
  },
  {
    path: 'settings/edit-instructor/:id',
    component: EditTeacherComponent
  },
  {
    path: 'settings/view-instructor',
    component: AboutTeacherComponent
  },
  {
    path: 'settings/add-staff',
    component: AddStaffComponent
  },
  {
    path: 'settings/about-staff',
    component: AboutStaffComponent
  },
  {
    path: 'settings/edit-staff',
    component: EditStaffComponent
  },
  {
    path: 'settings/customization-forms/course-forms',
    component: SettingsComponent,
  },
  {
    path: 'settings/customization-forms/program-forms',
    component: SettingsComponent,
  },
  {
    path: 'settings/customization-forms/users-forms',
    component: SettingsComponent,
  },
  {
    path: 'settings/customization-forms/finance-forms',
    component: SettingsComponent,
  },
  {
    path: 'settings/customization-forms/banner-forms',
    component: SettingsComponent,
  },
  {
    path: 'settings/dashboards',
    component: SettingsComponent,
  },
  {
    path: 'settings/student-dashboard',
    component: SettingsComponent,
  },
  {
    path: 'settings/student-dashboard/:id',
    component: StudentDbComponent,
  },

  {
    path: 'settings/smtp',
    component: SmtpComponent,
  },
  {
    path: 'settings/3rd-party-integrations',
    component: ThirdPartyToolsComponent,
  },
  {
    path: 'settings/singpass',
    component: SingpassComponent,
  },
  {
    path: 'settings/payment-gateway',
    component: PaymentGatewayComponent,
  },
  {
    path: 'settings/approval-workflow',
    component: ApprovalWorkflowComponent,
  },
  {
    path: 'settings/create-approval-flow',
    component: CreateApprovalWorkflowComponent
  },
  {
    path: 'settings/edit-approval-flow/:id',
    component: CreateApprovalWorkflowComponent
  },
  {
    path: 'settings/view-approval-flow/:id',
    component: ViewApprovalWorkflowComponent
  },
  
    {
    path: 'banners',
    loadChildren: () =>
      import('../student/settings/banners/banner.module').then((m) => m.BannerModule),
  },

  {
    path: 'email-configuration',
    loadChildren: () =>
      import('./settings/email-configuration/email-configuration.module').then((m) => m.EmailConfigurationModule),
  },
  {
    path: 'settings/update-funding',
    component: UpdateFundingComponent
  },
  {
    path: 'settings/update-department',
    component: UpdateDeptComponent
  },
  {
    path: 'settings/update-user-group',
    component: UpdateUsergroupComponent
  },
  {
    path: 'settings/update-vendor',
    component: UpdateVendorComponent
  },

  {
    path: 'settings/update-discount',
    component: UpdateDiscountComponent
  },

  

  { path: '**', component: Page404Component },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class StudentRoutingModule {}
