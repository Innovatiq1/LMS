import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { ComponentsModule } from '../shared/components/components.module';
import { SharedModule } from '../shared/shared.module';
import { TimetableRoutingModule } from './timetable-routing.module';
import { CourseTimetableComponent } from './course-timetable/course-timetable.component';
import { ProgramTimetableComponent } from './program-timetable/program-timetable.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from '@danielmoncada/angular-datetime-picker';
import { ScheduleClassComponent } from './schedule-class/schedule-class.component';
import { ViewProgramClassComponent } from './schedule-class/view-program-class/view-program-class.component';
import { EAttendanceComponent } from './e-attendance/e-attendance.component';
import { EventDetailDialogComponent } from './program-timetable/event-detail-dialog/event-detail-dialog.component';
import { MyProgramsComponent } from './my-programs/my-programs.component';
import { MyCoursesComponent } from './my-courses/my-courses.component';
@NgModule({
  declarations: [
    CourseTimetableComponent,
    ProgramTimetableComponent,
    ScheduleClassComponent,
    ViewProgramClassComponent,
    EAttendanceComponent,
    EventDetailDialogComponent,
    MyProgramsComponent,
    MyCoursesComponent

  ],
  imports: [
    CommonModule,
    TimetableRoutingModule,
    CKEditorModule,
    ComponentsModule,
    SharedModule,
    FullCalendarModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule

  ],
  providers: [],

})
export class TimetableModule {}
