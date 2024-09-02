import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersListComponent } from './users-list/users-list.component';
import { CreateUserProfileComponent } from './create-user-profile/create-user-profile.component';
import { AllManagersComponent } from './all-managers/all-managers.component';
import { AllStaffComponent } from './all-staff/all-staff.component';
import { CourseViewComponent } from './course-view/course-view.component';
import { ViewUsersComponent } from './view-users/view-users.component';
import { TutorialComponent } from './tutorial/tutorial.component';
import { AssesmentComponent } from './assesment/assesment.component';
import { ExamComponent } from './exam/exam.component';


const routes: Routes = [{
  path: "all-users",component: UsersListComponent
},{
  path: "create-all-users", component: CreateUserProfileComponent
},
{
  path: 'edit-all-users/:id',
  component: CreateUserProfileComponent,
},

  {
    path: 'all-managers',
    component: AllManagersComponent,
  },
  {
    path: 'all-staff',
    component: AllStaffComponent,
  },
  {
    path: 'view-course/:id',
    component: CourseViewComponent,
  },
  {
    path: 'view-all-users/:id',
    component: ViewUsersComponent,
  },
  {
    path: 'tutorials',
    component: TutorialComponent,
  },
  {
    path: 'assesment',
    component: AssesmentComponent,
  },
  {
    path: 'exam',
    component: ExamComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserProfileRoutingModule { }
