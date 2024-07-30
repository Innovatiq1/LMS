import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CourseTimetableComponent } from './course-timetable/course-timetable.component';
import { ProgramTimetableComponent } from './program-timetable/program-timetable.component';
import { CreateProgramExamScheduleComponent } from './create-program-exam-schedule/create-program-exam-schedule.component';
import { AddComponent } from './add/add.component';
import { EditProgramExamScheduleComponent } from './edit-program-exam-schedule/edit-program-exam-schedule.component';
import { EditComponent } from './edit/edit.component';
import { ListComponent } from './list/list.component';
import { ProgramExamScheduleComponent } from './program-exam-schedule/program-exam-schedule.component';
import { ScheduleClassComponent } from './schedule-class/schedule-class.component';
import { ClassListComponent } from './class-list/class-list.component';
import { ViewProgramScheduleComponent } from './program-exam-schedule/view-program-schedule/view-program-schedule.component';
import { ViewCourseScheduleComponent } from './list/view-course-schedule/view-course-schedule.component';
import { ViewProgramClassComponent } from './schedule-class/view-program-class/view-program-class.component';
import { EAttendanceComponent } from './e-attendance/e-attendance.component';
import { MyProgramsComponent } from './my-programs/my-programs.component';
import { MyCoursesComponent } from './my-courses/my-courses.component';
const routes: Routes = [
    {
        path: 'course-timetable',
        component: CourseTimetableComponent
    },
    {
        path: 'program-timetable',
        component: ProgramTimetableComponent
    },
    {
      path: 'my-programs',
      component: MyProgramsComponent
  },
  {
    path: 'my-courses',
    component: MyCoursesComponent
},
    {
        path: 'course-exam',
        component: ListComponent
      },
      {
        path: 'course-exam-add',
        component: AddComponent
      },
      {
        path: 'course-exam-edit/:id',
        component: EditComponent
      },
      {
        path: 'program-exam',
        component: ProgramExamScheduleComponent
      },
      {
        path: 'program-exam-add',
        component: CreateProgramExamScheduleComponent
      },
      {
        path: 'program-exam-edit/:id',
        component: EditProgramExamScheduleComponent
      },
      {
        path:'schedule-class', 
        component:ScheduleClassComponent
      },
      {
        path:'class-list',
        component:ClassListComponent
      },
      {
        path:'view-schedule-class/:id', 
        component:ViewProgramClassComponent
      },
      {
        path:'schedule-class/view-schedule-class/:id', 
        component:ViewProgramClassComponent
      },
      {
        path:'view-program-exam-schedule/:id',
        component:ViewProgramScheduleComponent
      },
      {
        path:'view-course-exam-schedule/:id',
        component:ViewCourseScheduleComponent
      },
      {
        path:'e-attendance',
        component:EAttendanceComponent
      },
    // {
    //     path: 'course-timetable/student',
    //     component: CourseTimetableComponent
    // },
    // {
    //     path: 'program-timetable/student',
    //     component: ProgramTimetableComponent
    // },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TimetableRoutingModule {}
