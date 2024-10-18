import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AllCourseComponent } from './all-course/all-course.component';
import { AddCourseComponent } from './add-course/add-course.component';
import { CompletionListComponent } from './completion-list/completion-list.component';
import { CreateClassComponent } from './create-class/create-class.component';
import { ViewClassComponent } from './class-list/view-class/view-class.component';
import { ViewCompletionComponent } from './completion-list/view-completion/view-completion.component';
import { CourseViewComponent } from './all-course/course-view/course-view.component';
import { CourseKitComponent } from './course-kit/course-kit.component';
import { CreateCourseKitComponent } from './course-kit/create-course-kit/create-course-kit.component';
import { CreateTemplateComponent } from './course-kit/create-template/create-template.component';
import { EditCourseKitComponent } from './course-kit/edit-course-kit/edit-course-kit.component';
import { ViewCourseKitComponent } from './course-kit/view-course-kit/view-course-kit.component';
import { ApproveListComponent } from '../approval/approve-list/approve-list.component';
import { ExamScoresComponent } from './exam-scores/exam-scores.component';
import { ActiveCoursesComponent } from './active-courses/active-courses.component';
import { InActiveCoursesComponent } from './in-active-courses/in-active-courses.component';
import { StudentPendingCoursesComponent } from './student-pending-courses/student-pending-courses.component';
import { VerificationListComponent } from './verification-list/verification-list.component';
import { StudentCourseComponent } from './all-course/student-course/student-course.component';
import { DraftedCoursesComponent } from './all-course/drafted-courses/drafted-courses.component';
import { RetakeRequestsComponent } from './retake-requests/retake-requests.component';
const routes: Routes = [
  {
    path: 'all-courses/course-name',
    component: AllCourseComponent,
  },
  {
    path: 'all-courses/ccreator',
    component: AllCourseComponent,
  },
  {
    path: 'submitted-courses/submitted-approved-courses',
    component: ActiveCoursesComponent,
  },
  {
    path: 'submitted-courses/submitted-pending-courses',
    component: InActiveCoursesComponent,
  },
  {
    path: 'add-course',
    component: AddCourseComponent,
  },
  {
    path: 'edit-course/:id',
    component: AddCourseComponent,
  },
  {
    path: 'view-course/:id',
    component: AddCourseComponent,
  },
  {
    path: 'create-class',
    component: CreateClassComponent,
  },
  {
    path: 'student-courses/course-completed-courses',
    component: CompletionListComponent,
  },
  {
    path: 'student-courses/course-completed-courses/edit',
    component: CompletionListComponent,
  },

  {
    path: 'view-class/:id',
    component: ViewClassComponent,
  },
  {
    path: 'timetable/class-list/view-class/:id',
    component: ViewClassComponent,
  },
  {
    path: 'view-completion-list',
    component: ViewCompletionComponent,
  },
  {
    path: 'student-courses/registered-approved-courses/view-completion-list',
    component: ViewCompletionComponent,
  },
  {
    path: 'student-courses/verification-list/view-completion-list',
    component: ViewCompletionComponent,
  },
  {
    path: 'student-courses/course-completed-courses/view-completion-list',
    component: ViewCompletionComponent,
  },
  {
    path: 'student-courses/registered-pending-courses/view-completion-list',
    component: ViewCompletionComponent,
  },
  {
    path: 'course-view',
    component: CourseViewComponent,
  },
  {
    path: 'submitted-courses/submitted-pending-courses/course-view',
    component: CourseViewComponent,
  },
  {
    path: 'course-kit',
    component: CourseKitComponent,
  },
  {
    path: 'create-course-kit',
    component: CreateCourseKitComponent,
  },
  {
    path: 'edit-course-kit/:id',
    component: EditCourseKitComponent,
  },
  {
    path: 'create-template',
    component: CreateTemplateComponent,
  },
  {
    path: 'course-kit/:id',
    component: ViewCourseKitComponent,
  },
  {
    path: 'student-courses/registered-approved-courses',
    component: ApproveListComponent,
  },
  
  {
    path: 'exam-scores',
    component: ExamScoresComponent,
  },
  {
    path:'student-courses/registered-pending-courses',
    component: StudentPendingCoursesComponent,
  },
  {
    path:'student-courses/verification-list',
    component: VerificationListComponent,
  },
  {
    path:'student-courses/retake-requests',
    component: RetakeRequestsComponent,
  },
  {
    path: 'student-courses/:coursename/:id',
    component: StudentCourseComponent,
  },
  {
    path: 'all-courses/drafts',
    component: DraftedCoursesComponent,
  },
  {
    path: 'submitted-courses/submitted-pending-courses/course-view',
    component: CourseViewComponent,
  },
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CoursesRoutingModule {}
