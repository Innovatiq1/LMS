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

import { TeacherRoutingModule } from './teacher-routing.module';
import { LecturesComponent } from './lectures/lectures.component';
import { DeleteDialogComponent } from './lectures/dialogs/delete/delete.component';
import { FormDialogComponent } from './lectures/dialogs/form-dialog/form-dialog.component';
import { InstructorLeaveRequestComponent } from './leave-request/leave-request.component';
import { LecturesService } from './lectures/lectures.service';
import { InstructorLeaveRequestService } from './leave-request/leave-request.service';
//import { FormDialogComponent } from './leave-request/dialogs/form-dialog/form-dialog.component';
import { SharedModule } from '@shared';
import { ComponentsModule } from '@shared/components/components.module';
import { EditLeaveRequestComponent } from './leave-request/dialogs/edit-leave-request/edit-leave-request.component';
import { LectureProgramsComponent } from './lecture-programs/lecture-programs.component';

@NgModule({
  declarations: [
    LecturesComponent,
    DeleteDialogComponent,
    FormDialogComponent,
    FormDialogComponent,
    InstructorLeaveRequestComponent,
    EditLeaveRequestComponent,
    LectureProgramsComponent,
  ],
  imports: [
    CommonModule,
    TeacherRoutingModule,
    NgChartsModule,
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
  ],
  providers: [LecturesService, InstructorLeaveRequestService],
})
export class TeacherModule {}
