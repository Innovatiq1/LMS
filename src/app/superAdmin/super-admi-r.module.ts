import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SuperAdmiRRoutingModule } from './super-admi-r-routing.module';
import { CreateSuperAdminComponent } from './create-super-admin/create-super-admin.component';
import { EditSuperAdminComponent } from './edit-super-admin/edit-super-admin.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from '@shared/components/components.module';
import { SharedModule } from '@shared';
import { ViewadminComponent } from './viewadmin/viewadmin.component';
import { AdminListComponent } from './admin-list/admin-list.component';


@NgModule({
  declarations: [CreateSuperAdminComponent,EditSuperAdminComponent, ViewadminComponent, AdminListComponent],
  imports: [
    CommonModule,
    SuperAdmiRRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ComponentsModule,
    SharedModule,
  ]
})
export class SuperAdmiRModule { }
