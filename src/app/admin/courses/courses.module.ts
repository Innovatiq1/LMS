import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoursesRoutingModule } from './courses-routing.module';
import { AddCourseComponent } from './add-course/add-course.component';
import { AllCourseComponent } from './all-course/all-course.component';
import { SharedModule } from '@shared';
import { ComponentsModule } from '@shared/components/components.module';
import { MatStepperModule } from '@angular/material/stepper';

import { ModalModule } from 'ngx-bootstrap/modal';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from '@danielmoncada/angular-datetime-picker';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { CreateClassComponent } from './create-class/create-class.component';
import { CompletionListComponent } from './completion-list/completion-list.component';

import { AngularEditorModule } from '@kolkov/angular-editor';
import { CourseViewComponent } from './all-course/course-view/course-view.component';
import { ActiveCoursesComponent } from './active-courses/active-courses.component';
import { InActiveCoursesComponent } from './in-active-courses/in-active-courses.component';
import { CourseKitComponent } from './course-kit/course-kit.component';
import { CreateCourseKitComponent } from './course-kit/create-course-kit/create-course-kit.component';
import { CreateTemplateComponent } from './course-kit/create-template/create-template.component';
import { EditCourseKitComponent } from './course-kit/edit-course-kit/edit-course-kit.component';
import { VideoPlayerComponent } from './course-kit/video-player/video-player.component';
import { ViewCourseKitComponent } from './course-kit/view-course-kit/view-course-kit.component';
import { ExamScoresComponent } from './exam-scores/exam-scores.component';
import { StudentPendingCoursesComponent } from './student-pending-courses/student-pending-courses.component';
import { VerificationListComponent } from './verification-list/verification-list.component';
import { StudentCourseComponent } from './all-course/student-course/student-course.component';
import { DraftedCoursesComponent } from './all-course/drafted-courses/drafted-courses.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RetakeRequestsComponent } from './retake-requests/retake-requests.component';
import { ViewCompletionComponent } from './completion-list/view-completion/view-completion.component';
import { ViewClassComponent } from './class-view/view-class/view-class.component';
import { ClassListComponent } from './class-list/class-list.component';
import { EnquiryListComponent } from './enquiry-list/enquiry-list.component';
import { ScheduleMeetingComponent } from './schedule-meeting/schedule-meeting.component';
import { DivideBy60Pipe } from './pipes/divide-by60.pipe';
import { ScormPlayerComponent } from './course-kit/scorm-player/scorm-player.component';
import { ImsccPlayerComponent } from './course-kit/imscc-player/imscc-player.component';
import { SafePipeAdmin } from '../pipes/safe.pipe';
import { BlockedExamsComponent } from './blocked-exams/blocked-exams.component';
import { ExamTrianeesComponent } from './exam-trianees/exam-trianees.component';
import { ManualEvaluationComponent } from './manual-evaluation/manual-evaluation.component';
import { ExamManualEvaluationComponent } from './exam-manual-evaluation/exam-manual-evaluation.component';



@NgModule({
  declarations: [
    AddCourseComponent,
    AllCourseComponent,
    CreateClassComponent,
    CompletionListComponent,
    ViewClassComponent,
    ViewCompletionComponent,
    CourseViewComponent,
    ActiveCoursesComponent,
    InActiveCoursesComponent,
    CourseKitComponent,
    VideoPlayerComponent,
    CreateCourseKitComponent,
    EditCourseKitComponent,
    ViewCourseKitComponent,
    CreateTemplateComponent,
    ExamScoresComponent,
    StudentPendingCoursesComponent,
    VerificationListComponent,
    StudentCourseComponent,
    DraftedCoursesComponent,
    RetakeRequestsComponent,
    ScheduleMeetingComponent,
    ClassListComponent,
   EnquiryListComponent,
   DivideBy60Pipe,
   ScormPlayerComponent,
   ImsccPlayerComponent,
    SafePipeAdmin,
    BlockedExamsComponent,
    ExamTrianeesComponent,
    ManualEvaluationComponent,
    ExamManualEvaluationComponent

  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CoursesRoutingModule,
    ComponentsModule,
    SharedModule,
    MatStepperModule,
    ModalModule.forRoot(),
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    CKEditorModule,
    AngularEditorModule,
    MatProgressSpinnerModule,
  ],
})
export class CoursesModule {}
