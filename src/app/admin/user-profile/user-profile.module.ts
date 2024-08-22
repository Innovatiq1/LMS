import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserProfileRoutingModule } from './user-profile-routing.module';
import { UsersListComponent } from './users-list/users-list.component';
import { RoleDailogComponent } from './role-dailog/role-dailog.component';
import { ComponentsModule } from '@shared/components/components.module';
import { SharedModule } from '@shared';
import { CreateUserProfileComponent } from './create-user-profile/create-user-profile.component';
import { AllManagersComponent } from './all-managers/all-managers.component';
import { AllStaffComponent } from './all-staff/all-staff.component';
import { CourseViewComponent } from './course-view/course-view.component';
import { ViewUsersComponent } from './view-users/view-users.component';
import { TutorialComponent } from './tutorial/tutorial.component';
import { AssesmentComponent } from './assesment/assesment.component';
import { ExamComponent } from './exam/exam.component';


@NgModule({
  declarations: [
    UsersListComponent,
    RoleDailogComponent,
    CreateUserProfileComponent,
    AllManagersComponent,
    AllStaffComponent,
    CourseViewComponent,
    ViewUsersComponent,
    TutorialComponent,
    AssesmentComponent,
    ExamComponent
  ],
  imports: [
    CommonModule,
    UserProfileRoutingModule, ComponentsModule,SharedModule
  ]
})
export class UserProfileModule { }
