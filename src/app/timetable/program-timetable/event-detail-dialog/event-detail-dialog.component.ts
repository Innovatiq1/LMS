import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AppConstants } from '@shared/constants/app.constants';

@Component({
  selector: 'app-event-detail-dialog',
  templateUrl: './event-detail-dialog.component.html',
  styleUrls: ['./event-detail-dialog.component.scss'],
})
export class EventDetailDialogComponent implements OnInit {
  code: boolean = false;
  isStudent: boolean = false;
  isProgram: boolean = false;
  currentId: any;
  subscribeParams: any;
  commonRoles: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private activeRoute: ActivatedRoute,
    public router: Router
  ) {
    'programCode' in data ? (this.code = true) : (this.code = false);

    let userType = localStorage.getItem('user_type');
    if (userType == AppConstants.STUDENT_ROLE) {
      this.isStudent = true;
    }
    if(data.programName){
      this.isProgram = true
    }
    // console.log(data);
  }
  
  ngOnInit() {
    this.commonRoles = AppConstants
  }
}
