import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreateSuperAdminComponent } from '../create-super-admin/create-super-admin.component';

@Component({
  selector: 'app-super-admin',
  templateUrl: './super-admin.component.html',
  styleUrls: ['./super-admin.component.scss']
})
export class SuperAdminComponent {
  breadscrums = [
    {
      title: 'Dashboard',
      items: ['Dashboard'],
      active: 'Super Admin Dashboard',
    },
  ];
  constructor(private dialog: MatDialog) {
    
  }

  createAdmin(){
  this.dialog.open(CreateSuperAdminComponent)
  }
}
