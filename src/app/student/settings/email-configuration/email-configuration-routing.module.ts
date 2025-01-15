import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { WelcomeMailComponent } from './welcome-mail/welcome-mail.component';
import { InstructorRequestComponent } from './instructor-request/instructor-request.component';
import { InviteUserRejectComponent } from './invite-user-reject/invite-user-reject.component';
import { CourseReferralInviteComponent } from './course-referral-invite/course-referral-invite.component';
import { CompletedCourseComponent } from './completed-course/completed-course.component';
import { InstructorCourseInviteComponent } from './instructor-course-invite/instructor-course-invite.component';
import { InstructorAcceptCourseInviteComponent } from './instructor-accept-course-invite/instructor-accept-course-invite.component';
import { SendCourseInvoiceComponent } from './send-course-invoice/send-course-invoice.component';
import { AdminNewEmailComponent } from './admin-new-email/admin-new-email.component';
import { ProgramRegistrationComponent } from './program-registration/program-registration.component';
import { ProgramApprovalComponent } from './program-approval/program-approval.component';
import { ProgramCompletionComponent } from './program-completion/program-completion.component';
import { DirectorCourseNotificationComponent } from './director-course-notification/director-course-notification.component';
import { RoCourseNotificationComponent } from './ro-course-notification/ro-course-notification.component';
import { TaCourseNotificationComponent } from './ta-course-notification/ta-course-notification.component';
import { NewTrainingRequestComponent } from './new-training-request/new-training-request.component';
import { TrainingReqExpiryComponent } from './training-req-expiry/training-req-expiry.component';
import { RoCourseApprovalComponent } from './ro-course-approval/ro-course-approval.component';
import { DirectorCourseApprovalComponent } from './director-course-approval/director-course-approval.component';
import { TaCourseApprovalComponent } from './ta-course-approval/ta-course-approval.component';
import { RoCourseRejectedComponent } from './ro-course-rejected/ro-course-rejected.component';
import { DirectorCourseRejectedComponent } from './director-course-rejected/director-course-rejected.component';
import { TaCourseRejectedComponent } from './ta-course-rejected/ta-course-rejected.component';
import { DirectorBudgetReqNotifComponent } from './director-budget-req-notif/director-budget-req-notif.component';
import { TaBudgetRequestComponent } from './ta-budget-request/ta-budget-request.component';
import { DirectorBudgetReqApprovalComponent } from './director-budget-req-approval/director-budget-req-approval.component';
import { DirectorBudgetReqRejectedComponent } from './director-budget-req-rejected/director-budget-req-rejected.component';
import { DeptBudgetReqNotifComponent } from './dept-budget-req-notif/dept-budget-req-notif.component';
import { DeptBudgetReqComponent } from './dept-budget-req/dept-budget-req.component';
import { DeptBudgetReqApprovalComponent } from './dept-budget-req-approval/dept-budget-req-approval.component';
import { DeptBudgetReqRejectedComponent } from './dept-budget-req-rejected/dept-budget-req-rejected.component';
import { ZoomCreateComponent } from './zoom-create/zoom-create.component';
import { ZoomUpdateComponent } from './zoom-update/zoom-update.component';
import { ZoomDeleteComponent } from './zoom-delete/zoom-delete.component';


const routes: Routes = [
    {
        path: 'settings/forgot-password',
        component: ForgotPasswordComponent
      },
      {
        path: 'settings/welcome-mail',
        component: WelcomeMailComponent
      },
      {
        path: 'settings/instructor-request',
        component: InstructorRequestComponent
      },
      {
        path: 'settings/invite-user-reject',
        component: InviteUserRejectComponent
      },
      {
        path: 'settings/director-course-notification',
        component: DirectorCourseNotificationComponent
      },
      {
        path: 'settings/ro-course-notification',
        component: RoCourseNotificationComponent
      },
      {
        path: 'settings/trainingAdmin-course-notification',
        component: TaCourseNotificationComponent
      },
      {
        path: 'settings/new-training-request',
        component: NewTrainingRequestComponent
      },
      {
        path: 'settings/training-request-expiry',
        component: TrainingReqExpiryComponent
      },
      {
        path: 'settings/ro-training-request-approval',
        component: RoCourseApprovalComponent
      },
      {
        path: 'settings/director-training-request-approval',
        component: DirectorCourseApprovalComponent
      },
      {
        path: 'settings/training-admin-training-request-approval',
        component: TaCourseApprovalComponent
      },
      {
        path: 'settings/ro-training-request-rejected',
        component: RoCourseRejectedComponent
      },
      {
        path: 'settings/director-training-request-rejected',
        component: DirectorCourseRejectedComponent
      },
      {
        path: 'settings/training-admin-training-request-rejected',
        component: TaCourseRejectedComponent
      },
      {
        path: 'settings/director-budget-request-notification',
        component: DirectorBudgetReqNotifComponent
      },
      {
        path: 'settings/training-admin-budget-request',
        component: TaBudgetRequestComponent
      },
      {
        path: 'settings/budget-request-approval',
        component: DirectorBudgetReqApprovalComponent
      },
      {
        path: 'settings/budget-request-rejected',
        component: DirectorBudgetReqRejectedComponent
      },
      {
        path: 'settings/department-budget-request-notification',
        component: DeptBudgetReqNotifComponent
      },
      {
        path: 'settings/department-budget-request',
        component: DeptBudgetReqComponent
      },
      {
        path: 'settings/department-budget-request-approval',
        component: DeptBudgetReqApprovalComponent
      },
      {
        path: 'settings/department-budget-request-rejected',
        component: DeptBudgetReqRejectedComponent
      },
      {
        path: 'settings/course-referral-invite',
        component: CourseReferralInviteComponent
      },
      {
        path: 'settings/completed-course',
        component: CompletedCourseComponent
      },
      {
        path: 'settings/course-registered-email',
        component: InstructorCourseInviteComponent
      },
      {
        path: 'settings/course-approval-email',
        component: InstructorAcceptCourseInviteComponent
      },
      {
        path: 'settings/send-course-invoice',
        component: SendCourseInvoiceComponent
      },
      {
        path: 'settings/admin-new-email',
        component: AdminNewEmailComponent
      },
      {
        path: 'settings/program-registration-email',
        component: ProgramRegistrationComponent
      },
      {
        path: 'settings/program-approval-email',
        component: ProgramApprovalComponent
      },
      {
        path: 'settings/program-completion-email',
        component: ProgramCompletionComponent
      },
      {
        path: 'settings/zoom-create',
        component: ZoomCreateComponent
      },
      {
        path: 'settings/zoom-update',
        component: ZoomUpdateComponent
      },
      {
        path: 'settings/zoom-delete',
        component: ZoomDeleteComponent
      }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmailConfigurationRoutingModule { }
