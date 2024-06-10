
import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UtilsService } from '@core/service/utils.service';
import { AppConstants } from '@shared/constants/app.constants';

@Injectable()
export class LoginGuard implements CanActivate {

    constructor(private utilsService: UtilsService, private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        if (this.utilsService.isLoggedIn()) { 
            return true;
        }
        let userType = JSON.parse(localStorage.getItem('user_data')!).user.type;
        if(userType == AppConstants.ADMIN_USERTYPE || userType == AppConstants.INSTRUCTOR_ROLE){
        this.router.navigate(['/authentication/TMS/signin']);
        } else if(userType == AppConstants.STUDENT_ROLE){
          this.router.navigate(['/authentication/LMS/signin']);
        } else {
          this.router.navigate(['/authentication/TMS/signin']);
        }
        return false;
    }
}