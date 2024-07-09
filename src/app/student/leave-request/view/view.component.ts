import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LeaveRequest } from '../leave-request.model';
import Swal from 'sweetalert2';
import { LeaveRequestService } from '../leave-request.service';
import { Direction } from '@angular/cdk/bidi';
import { FormDialogComponent } from '../dialogs/form-dialog/form-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent {

  breadscrums = [
    {
      title: 'Blank',
      items: ['Course'],
      active: 'View Course',
    },
  ];
  SourceData: any;
  id: any;
  constructor( private activatedRoute: ActivatedRoute,public leaveRequestService: LeaveRequestService,public router:Router, public dialog: MatDialog,) {

    this.activatedRoute.queryParams.subscribe((params: any) => {
      console.log(params['id']);
      this.loadData(params['id'])
    })
  }
  deleteItem(row_id: any) {
    Swal.fire({
      title: "Confirm Deletion",
      text: "Are you sure you want to delete this leave?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        this.leaveRequestService.deleteLeaveRequest(row_id).subscribe(() => {
          Swal.fire({
            title: 'Success',
            text: 'Leave deleted successfully.',
            icon: 'success',
          });
          this.router.navigate(['/reschedule/programs']);
          // this.loadData();
    
        });
  }
  });
  }
  

  loadData(id: string) {
    this.leaveRequestService.getLeavesById(id).subscribe(data => {
      this.SourceData = data;
    });
  }
  editCall(row: LeaveRequest) {
    this.id = row.id;
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(FormDialogComponent, {
      data: {
        leaveRequest: row,
        action: 'edit',
      },
      direction: tempDirection,
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        console.log('iiiiddd',this.id)
        this.loadData(this.id);
      }
    });
}
}