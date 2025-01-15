import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentsModule } from '@shared/components/components.module';
import { SharedModule } from '@shared';
import { EmailConfigurationRoutingModule } from './email-configuration-routing.module';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { WelcomeMailComponent } from './welcome-mail/welcome-mail.component';
import { InstructorRequestComponent } from './instructor-request/instructor-request.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { InviteUserRejectComponent } from './invite-user-reject/invite-user-reject.component';
import { CourseReferralInviteComponent } from './course-referral-invite/course-referral-invite.component';
import { CompletedCourseComponent } from './completed-course/completed-course.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SendCourseInvoiceComponent } from './send-course-invoice/send-course-invoice.component';
import { InstructorCourseInviteComponent } from './instructor-course-invite/instructor-course-invite.component';
import { InstructorAcceptCourseInviteComponent } from './instructor-accept-course-invite/instructor-accept-course-invite.component';
import { AdminNewEmailComponent } from './admin-new-email/admin-new-email.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
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
import { TaBudgetRequestComponent } from './ta-budget-request/ta-budget-request.component';
import { DirectorBudgetReqNotifComponent } from './director-budget-req-notif/director-budget-req-notif.component';
import { DirectorBudgetReqApprovalComponent } from './director-budget-req-approval/director-budget-req-approval.component';
import { DirectorBudgetReqRejectedComponent } from './director-budget-req-rejected/director-budget-req-rejected.component';
import { DeptBudgetReqNotifComponent } from './dept-budget-req-notif/dept-budget-req-notif.component';
import { DeptBudgetReqComponent } from './dept-budget-req/dept-budget-req.component';
import { DeptBudgetReqApprovalComponent } from './dept-budget-req-approval/dept-budget-req-approval.component';
import { DeptBudgetReqRejectedComponent } from './dept-budget-req-rejected/dept-budget-req-rejected.component';
import { ZoomCreateComponent } from './zoom-create/zoom-create.component';
import { ZoomUpdateComponent } from './zoom-update/zoom-update.component';
import { ZoomDeleteComponent } from './zoom-delete/zoom-delete.component';



@NgModule({
    declarations: [


    ForgotPasswordComponent,
                 WelcomeMailComponent,
                 InstructorRequestComponent,
                 InviteUserRejectComponent,
                 DirectorCourseNotificationComponent,
                 CourseReferralInviteComponent,
                 CompletedCourseComponent,
                 SendCourseInvoiceComponent,
                 InstructorCourseInviteComponent,
                 InstructorAcceptCourseInviteComponent,
                 AdminNewEmailComponent,
                 ProgramRegistrationComponent,
                 ProgramApprovalComponent,
                 ProgramCompletionComponent,
                 RoCourseNotificationComponent,
                 TaCourseNotificationComponent,
                 NewTrainingRequestComponent,
                 TrainingReqExpiryComponent,
                 RoCourseApprovalComponent,
                 DirectorCourseApprovalComponent,
                 TaCourseApprovalComponent,
                 RoCourseRejectedComponent,
                 DirectorCourseRejectedComponent,
                 TaCourseRejectedComponent,
                 TaBudgetRequestComponent,
                 DirectorBudgetReqNotifComponent,
                 DirectorBudgetReqApprovalComponent,
                 DirectorBudgetReqRejectedComponent,
                 DeptBudgetReqNotifComponent,
                 DeptBudgetReqComponent,
                 DeptBudgetReqApprovalComponent,
                 DeptBudgetReqRejectedComponent,
                 ZoomCreateComponent,
                 ZoomUpdateComponent,
                 ZoomDeleteComponent
  ],
    imports: [
        CommonModule, EmailConfigurationRoutingModule,
        ComponentsModule,SharedModule, CKEditorModule,ModalModule.forRoot(),AngularEditorModule
    ]
})
export class EmailConfigurationModule { }
