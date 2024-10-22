import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserActivityService {
  private userActivity: any;
  private timeoutVal: number = 10 * 60 * 1000; // 10 minutes

  constructor(
    private ngZone: NgZone,
    private authService: AuthService,
    private router: Router
  ) {
    this.setActivityListeners();
  }

  setActivityListeners() {
    this.ngZone.runOutsideAngular(() => {
      window.addEventListener('mousemove', () => this.resetTimer());
      window.addEventListener('mousedown', () => this.resetTimer());
      window.addEventListener('keypress', () => this.resetTimer());
      window.addEventListener('scroll', () => this.resetTimer());
      window.addEventListener('touchmove', () => this.resetTimer());
    });

    this.resetTimer();
  }

  resetTimer() {
    clearTimeout(this.userActivity);
    this.userActivity = setTimeout(() => this.ngZone.run(() => this.logoutUser()), this.timeoutVal);
  }

  logoutUser() {
    this.authService.logout().subscribe(() => {
      let subdomain = localStorage.getItem('subdomain')
      this.router.navigate([`${subdomain}/authentication/TMS/signin`]);
    });
  }
}
