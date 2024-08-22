import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '@core/service/user.service';
import { UtilsService } from '@core/service/utils.service';


@Component({
  selector: 'app-role-dailog',
  templateUrl: './role-dailog.component.html',
  styleUrls: ['./role-dailog.component.scss']
})
export class RoleDailogComponent {
  isLoading = true;
  totalItems: any;
  pageSizeArr = this.utils.pageSizeArr;
  subscribeParams: any;
  typeName: any;
  dataSource: any;

  constructor(private router: Router,
    public utils: UtilsService,
    private alluserService: UserService,
    private activatedRoute: ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<RoleDailogComponent>

  ) {

   
}

@ViewChild('filter', { static: true }) filter!: ElementRef;

ngOnInit(): void {
  this.getUsersRoleList();
}

getUsersRoleList() {
  this.alluserService.getUserRole(this.data.typeName).subscribe((response: any) => {
    this.dataSource = response.data.docs;
    this.isLoading = false;
  }, error => {
  });
}
}
