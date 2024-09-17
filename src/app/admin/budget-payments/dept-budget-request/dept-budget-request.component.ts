import { Direction } from '@angular/cdk/bidi';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CoursePaginationModel } from '@core/models/course.model';
import { EmpRequest } from '@core/models/emp-request.model';
import { EtmsService } from '@core/service/etms.service';
import { UtilsService } from '@core/service/utils.service';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import Swal from 'sweetalert2';
import { EditDeptBudgetRequestComponent } from './edit-dept-budget-request/edit-dept-budget-request.component';

@Component({
  selector: 'app-dept-budget-request',
  templateUrl: './dept-budget-request.component.html',
  styleUrls: ['./dept-budget-request.component.scss']
})
export class DeptBudgetRequestComponent extends UnsubscribeOnDestroyAdapter
implements OnInit
{
  breadscrums = [
    {
      title: 'Budget',
      items: ['Finance'],
      active: 'Department Budget Approval',
    },
  ];
ro = false;
payload = {};
director = false;
trainingAdmin = false;
dataSource: any;
id?: number;
coursePaginationModel!: Partial<CoursePaginationModel>;
totalItems: any;
pageSizeArr = this.utils.pageSizeArr;
approvedCourses = false;
rejectedCourses = false;
pendingCourses = false;


approved = 0;
pending = 0;
rejected = 0;

classesList = [
  {
    name: 'Michael John',
    course: 'Marketing Strategy',
    payment: '120',
    level: 'Beginner',
    date: '27/11/2023',
  },
];

constructor(
  private etmsService: EtmsService,
  private router: Router,
  public dialog: MatDialog,
  private snackBar: MatSnackBar,
  public httpClient: HttpClient,
  public utils: UtilsService,
  public exampleDatabase: EtmsService
) {
  super();
  this.coursePaginationModel = {};
  let user = JSON.parse(localStorage.getItem('currentUser') || '{}');
  if (user.user.type == 'RO') {
    this.ro = true;
  } else if (user.user.type == 'Director') {
    this.director = true;
  } else if (user.user.type == 'Training Administrator') {
    
    this.trainingAdmin = true;

    
  }
}

ngOnInit() {
  this.pendingCourses =true;
  // if (this.director) {
    this.getAllRequestsByDirector();
  // }
 
  this.getCount();
}

onPendingClick(){
  this.pendingCourses = true;
  this.approvedCourses = false;
  this.rejectedCourses = false;
  // if (this.director) {
      this.getAllRequestsByDirector();
    // }
}
onApprovedClick(){
  this.pendingCourses = false;
  this.approvedCourses = true;
  this.rejectedCourses = false;
  // if (this.director) {
      this.getAllApprovedRequestsByDirector();
    // }
}
onRejectedClick(){
  this.pendingCourses = false;
  this.approvedCourses = false;
  this.rejectedCourses = true;
  // if (this.director) {
      this.getAllRejectedRequestsByDirector();
    // }

}

pageSizeChange($event: any) {
  this.coursePaginationModel.page = $event?.pageIndex + 1;
  this.coursePaginationModel.limit = $event?.pageSize;
  // if(this.director){
      if(this.pendingCourses){
        this.getAllRequestsByDirector();
      } else if(this.approvedCourses){
        this.getAllApprovedRequestsByDirector();
      } else if(this.rejectedCourses){
        this.getAllRejectedRequestsByDirector()
      }
    // }
}


getAllRequestsByDirector() {
  let headId = localStorage.getItem('id');
  this.etmsService.getDeptBudgetRequestsByDirector({...this.coursePaginationModel,headId,headApproval:"Pending"}).subscribe(
    (response) => {
      this.dataSource = response.docs;
      this.totalItems = response.totalDocs;
      this.coursePaginationModel.docs = response.docs;
      this.coursePaginationModel.page = response.page;
      this.coursePaginationModel.limit = response.limit;
    },
    (error) => {}
  );
}

getAllApprovedRequestsByDirector() {
  let headId = localStorage.getItem('id');
  this.etmsService.getDeptBudgetRequestsByDirector({...this.coursePaginationModel,headId,headApproval:"Approved"}).subscribe(
    (response) => {
      this.dataSource = response.docs;
      this.totalItems = response.totalDocs;
      this.coursePaginationModel.docs = response.docs;
      this.coursePaginationModel.page = response.page;
      this.coursePaginationModel.limit = response.limit;
    },
    (error) => {}
  );
}

getAllRejectedRequestsByDirector() {
  let headId = localStorage.getItem('id');
  this.etmsService.getDeptBudgetRequestsByDirector({...this.coursePaginationModel,headId,headApproval:"Rejected"}).subscribe(
    (response) => {
      this.dataSource = response.docs;
      this.totalItems = response.totalDocs;
      this.coursePaginationModel.docs = response.docs;
      this.coursePaginationModel.page = response.page;
      this.coursePaginationModel.limit = response.limit;
    },
    (error) => {}
  );
}

approve(req: any) {
  this.id = req.head.id;
  let tempDirection: Direction;
  if (localStorage.getItem('isRtl') === 'true') {
    tempDirection = 'rtl';
  } else {
    tempDirection = 'ltr';
  }
  const dialogRef = this.dialog.open(EditDeptBudgetRequestComponent, {
    data: {
      empRequest: req,
      action: 'approve',
    },
    direction: tempDirection,
  });
  
  this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
    if (result === 1) {
      const foundIndex = this.exampleDatabase?.dataChange.value.findIndex(
        (x) => x.id === this.id
      );

      if (foundIndex != null && this.exampleDatabase) {
        this.exampleDatabase.dataChange.value[foundIndex] =
          this.etmsService.getDialogData();
      }
      this.getAllRequestsByDirector();
      this.getCount();
    }
  });


}


reject(row: any) {
  this.id = row.head.id;
  let tempDirection: Direction;
  if (localStorage.getItem('isRtl') === 'true') {
    tempDirection = 'rtl';
  } else {
    tempDirection = 'ltr';
  }
  const dialogRef = this.dialog.open(EditDeptBudgetRequestComponent, {
    data: {
      empRequest: row,
      action: 'reject',
    },
    direction: tempDirection,
  });

  this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
    if (result === 1) {
      const foundIndex = this.exampleDatabase?.dataChange.value.findIndex(
        (x) => x.id === this.id
      );

      if (foundIndex != null && this.exampleDatabase) {
        this.exampleDatabase.dataChange.value[foundIndex] =
          this.etmsService.getDialogData();
      }
      // if (this.director) {
        this.getAllRequestsByDirector();
      // }
      this.getCount();
     
    }
  });
}

getCount(){
  let userId = localStorage.getItem('id');
  let userRole = localStorage.getItem('user_type');


// if(userRole == "Director"){
  this.etmsService.getDeptBudgetRequestDirectorCount(userId).subscribe(res =>{
    this.approved = res.data.docs.budgetRequestApproved;
    this.rejected = res.data.docs.budgetRequestRejected;
    this.pending = res.data.docs.budgetRequestPending;
  
  })
  // }

 
}

}
