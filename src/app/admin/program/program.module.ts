import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule, SharedModule } from '@shared';
import { ProgaramCompletionListComponent } from './progaram-completion-list/progaram-completion-list.component';
import { ProgramListComponent } from './program-list/program-list.component';
import { CreateProgramComponent } from './create-program/create-program.component';
// import { ScheduleClassComponent } from './schedule-class/schedule-class.component';
import { ProgramRoutingModule } from './program-routing.module';
import { ComponentsModule } from '../../shared/components/components.module';
import { NgScrollbarModule } from 'ngx-scrollbar';
import {
  OwlDateTimeModule,
  OwlNativeDateTimeModule,
} from '@danielmoncada/angular-datetime-picker';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { ModalModule } from 'ngx-bootstrap/modal';
import { CreateClassComponent } from './create-class/create-class.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { ViewProgramComponent } from './view-program/view-program.component';
import { PendingProgramsComponent } from './program-list/pending-programs/pending-programs.component';
import { ApprovedProgramsComponent } from './program-list/approved-programs/approved-programs.component';
import { StudentPendingListComponent } from './student-pending-list/student-pending-list.component';
import { StudentApprovalListComponent } from './student-approval-list/student-approval-list.component';
import { ViewCompletionComponent } from './view-completion/view-completion.component';
import { ViewStudentPendingListComponent } from './view-student-pending-list/view-student-pending-list.component';
import { FilterPopupComponent } from './program-list/filter-popup/filter-popup.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
    declarations: [
        ProgramListComponent,
        CreateProgramComponent,
        ProgaramCompletionListComponent,
        CreateClassComponent,
        ViewProgramComponent,
        PendingProgramsComponent,
        ApprovedProgramsComponent,
        StudentPendingListComponent,
        StudentApprovalListComponent,
        ViewCompletionComponent,
        ViewStudentPendingListComponent,
        FilterPopupComponent,
         ],
    imports: [
        CommonModule,
        SharedModule,
        ModalModule.forRoot(),
        ProgramRoutingModule,
        ComponentsModule,OwlDateTimeModule,OwlNativeDateTimeModule,
        CKEditorModule,AngularEditorModule,NgScrollbarModule


    ]



})
export class ProgramModule {}
