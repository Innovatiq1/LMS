import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CourseTimetableComponent } from './course-timetable/course-timetable.component';
import { ProgramTimetableComponent } from './program-timetable/program-timetable.component';
import { ScheduleClassComponent } from './schedule-class/schedule-class.component';
import { ClassListComponent } from './class-list/class-list.component';
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
