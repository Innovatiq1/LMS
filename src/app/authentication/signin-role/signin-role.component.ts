import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '@core/service/common.service';
import { UtilsService } from '@core/service/utils.service';
import { AppConstants } from '@shared/constants/app.constants';

@Component({
  selector: 'app-signin-role',
  templateUrl: './signin-role.component.html',
  styleUrls: ['./signin-role.component.scss']
})
export class SigninRoleComponent {

  selectedUser: string = '';
  commonRoles: any;
  constructor(
    private router: Router,
    public utils: UtilsService,
    private route:ActivatedRoute,
    private commonService:CommonService
  ) {
    this.commonRoles = AppConstants

  }
  
  images: string[] = ['/assets/images/login/Learning.jpeg', '/assets/images/login/learning2.jpg', '/assets/images/login/learning4.jpg'];
    currentIndex = 0;

  startSlideshow() {
    setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.images.length;
    }, 4000);
  }
  selectUser(userType: string) {
    this.selectedUser = userType;
  }
  openUrl() {
    const pathSegments = this.router.url.split('/');
    let extractedName = pathSegments[1];
    if (this.selectedUser === 'staff' || this.selectedUser === 'super admin') {
      this.commonService.navigateWithCompanyName(extractedName,'authentication/TMS/signin')
        } else if (this.selectedUser === 'student') {
      this.commonService.navigateWithCompanyName(extractedName,'authentication/LMS/signin')
    } else {
      
      alert('Please select role first.');
    }
  }
}
