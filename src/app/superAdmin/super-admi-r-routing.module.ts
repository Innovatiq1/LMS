import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateSuperAdminComponent } from './create-super-admin/create-super-admin.component';
import { EditSuperAdminComponent } from './edit-super-admin/edit-super-admin.component';

const routes: Routes = [
  { path: 'create-super-admin', component: CreateSuperAdminComponent },
  { path: 'edit-super-admin', component: EditSuperAdminComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SuperAdmiRRoutingModule {}
