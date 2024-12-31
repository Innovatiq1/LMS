import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CourseTimetableComponent } from './course-timetable/course-timetable.component';
import { ProgramTimetableComponent } from './program-timetable/program-timetable.component';
import { ScheduleClassComponent } from './schedule-class/schedule-class.component';
import { ViewProgramClassComponent } from './schedule-class/view-program-class/view-program-class.component';
import { EAttendanceComponent } from './e-attendance/e-attendance.component';
import { MyProgramsComponent } from './my-programs/my-programs.component';
import { MyCoursesComponent } from './my-courses/my-courses.component';
import { ViewEAttendanceComponent } from './view-e-attendance/view-e-attendance.component';
const routes: Routes = [
  {
    path: 'course-timetable',
    component: CourseTimetableComponent,
  },
  {
    path: 'program-timetable',
    component: ProgramTimetableComponent,
  },
  {
    path: 'my-programs',
    component: MyProgramsComponent,
  },
  {
    path: 'my-courses',
    component: MyCoursesComponent,
  },
  {
    path: 'schedule-class',
    component: ScheduleClassComponent,
  },
 
  {
    path: 'view-schedule-class/:id',
    component: ViewProgramClassComponent,
  },
  {
    path: 'schedule-class/view-schedule-class/:id',
    component: ViewProgramClassComponent,
  },
  {
    path: 'e-attendance',
    component: EAttendanceComponent,
  },
  {
    path: 'view-e-attendance/:coursename/:id',
    component: ViewEAttendanceComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TimetableRoutingModule {}
