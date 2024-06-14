import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateSuperAdminComponent } from './create-super-admin/create-super-admin.component';
import { EditSuperAdminComponent } from './edit-super-admin/edit-super-admin.component';
import { ViewadminComponent } from './viewadmin/viewadmin.component';
import { AdminListComponent } from './admin-list/admin-list.component';

const routes: Routes = [
  { path: 'create-admin', component: CreateSuperAdminComponent },
  { path: 'edit-admin', component: EditSuperAdminComponent },
  { path: 'view-admin', component: ViewadminComponent },
  { path: 'admin-list', component: AdminListComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SuperAdmiRRoutingModule {}
