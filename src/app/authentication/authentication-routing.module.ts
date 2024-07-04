import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { LockedComponent } from './locked/locked.component';
import { Page404Component } from './page404/page404.component';
import { Page500Component } from './page500/page500.component';
import { SigninRoleComponent } from './signin-role/signin-role.component';
import { SingpassLoginPageComponent } from './singpass-login-page/singpass-login-page.component';
const routes: Routes = [
  {
    path: '',
    redirectTo: 'signin',
    pathMatch: 'full',
  },
  {
    path: 'TMS/signin',
    component: SigninComponent,
  },
  {
    path: 'signin-role',
    component: SigninRoleComponent,
  },
  {
    path: 'LMS/signin',
    component: SigninComponent,
  },

  {
    path: 'TMS/signup',
    component: SignupComponent,
  },
  {
    path: 'LMS/signup',
    component: SignupComponent,
  },

  {
    path: 'TMS/forgot-password',
    component: ForgotPasswordComponent,
  },
  {
    path: 'LMS/forgot-password',
    component: ForgotPasswordComponent,
  },
  {
    path: 'singpass-login',
    component: SingpassLoginPageComponent,
  },

  {
    path: 'locked',
    component: LockedComponent,
  },
  {
    path: 'page404',
    component: Page404Component,
  },
  {
    path: 'LMS/page404',
    component: Page404Component,
  },
  {
    path: 'TMS/page404',
    component: Page404Component,
  },

  {
    path: 'page500',
    component: Page500Component,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthenticationRoutingModule {}
