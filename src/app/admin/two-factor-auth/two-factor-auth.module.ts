import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentsModule } from "../../shared/components/components.module";
import { SharedModule } from '@shared';
import { TwoFactorAuthRoutingModule } from './two-factor-auth-routing.module';
import { TwoFactorAuthenticationComponent } from './two-factor-authentication/two-factor-authentication.component';
import { FormsModule } from '@angular/forms';




@NgModule({
    declarations: [
    TwoFactorAuthenticationComponent,
  ],
    imports: [
        CommonModule, TwoFactorAuthRoutingModule,
        ComponentsModule,SharedModule, FormsModule
    ]
})
export class TwoFactorAuthModule { }
