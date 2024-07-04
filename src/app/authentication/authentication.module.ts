import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthenticationRoutingModule } from './authentication-routing.module';
import { Page500Component } from './page500/page500.component';
import { Page404Component } from './page404/page404.component';
import { SignupComponent } from './signup/signup.component';
import { LockedComponent } from './locked/locked.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { SigninComponent } from './signin/signin.component';
//import {Ng2TelInputModule} from 'ng2-tel-input';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { SigninRoleComponent } from './signin-role/signin-role.component';
import { SingpassLoginPageComponent } from './singpass-login-page/singpass-login-page.component';

@NgModule({
  declarations: [
    Page500Component,
    
    SigninComponent,
    SignupComponent,
    LockedComponent,
    ForgotPasswordComponent,
    SigninRoleComponent,
    SingpassLoginPageComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxIntlTelInputModule,
    
    AuthenticationRoutingModule,
    SharedModule,
  ],
  
})
export class AuthenticationModule {}
