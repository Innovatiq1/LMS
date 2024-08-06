import { Component, Input } from '@angular/core';
import { AuthService, Role } from '@core';
import { AuthenService } from '@core/service/authen.service';
import { Location } from '@angular/common';
import { AppConstants } from '@shared/constants/app.constants';
@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss'],
})
export class BreadcrumbComponent {
  // @Input()
  // title!: string;
  @Input()
  items!: string[];
  @Input()
  active_item!: string;
  url: string = '/dashboard/dashboard';


  constructor(
    private authService: AuthService,
    private authenticationService: AuthenService,
    private _location: Location
  ) {
    this.url = this.homeURL();
  }

  homeURL():string {
    let url = '/dashboard/dashboard';
    // const role = this.authenticationService.currentUserValue.user.role;
    // if (
    //   role === Role.All ||
    //   (role === AppConstants.ADMIN_ROLE &&
    //     (role == 'RO' || role == 'Director' || role == 'Employee'))
    // ) {
    //   url = '/dashboard/dashboard';
    // } else if (
    //   role === AppConstants.INSTRUCTOR_ROLE ||
    //   role === 'Trainer' ||
    //   role === 'instructor'
    // ) {
    //   url = '/dashboard/instructor-dashboard';
    // } else if (role === AppConstants.STUDENT_ROLE || role === 'student') {
    //   url = '/dashboard/student-dashboard';
    // } else if (
    //   role === Role.TrainingAdministrator ||
    //   role === 'Training administrator' ||
    //   role === 'training administrator'
    // ) {
    //   url = '/dashboard/trainingadministrator-dashboard';
    // } else if (
    //   role === Role.Supervisor ||
    //   role === 'Supervisor' ||
    //   role === 'supervisor'
    // ) {
    //   url = '/dashboard/supervisor-dashboard';
    // } else if (
    //   role === Role.HOD ||
    //   role === 'hod' ||
    //   role === 'HOD' ||
    //   role === 'head of department'
    // ) {
    //   url = '/dashboard/hod-dashboard';
    // } else if (
    //   role === Role.TrainingCoordinator ||
    //   role === 'Training Coordinator' ||
    //   role === 'training coordinator'
    // ) {
    //   url = '/dashboard/trainingcoordinator-dashboard';
    // } else if (
    //   role === Role.CourseManager ||
    //   role === 'coursemanager' ||
    //   role === 'Course Manager'
    // ) {
    //   url = '/dashboard/coursemanager-dashboard';
    // } else if (
    //   role === Role.ProgramManager ||
    //   role === 'programcoordinator' ||
    //   role === 'Program manager'
    // ) {
    //   url = '/dashboard/programmanager-dashboard';
    // } else if (
    //   role === Role.Approver ||
    //   role === 'approver' ||
    //   role === 'approver'
    // ) {
    //   url = '/admin/courses/all-courses';
    // } else if (
    //   role === Role.TrainingCoordinatorAdministrator ||
    //   role === 'Training Coordinator Administrator' ||
    //   role === 'Training Coordinator Administrator'
    // ) {
    //   url = '/admin/users/all-students';
    // }
    return url;
  }

  backClicked() {
    this._location.back();
  }
}
