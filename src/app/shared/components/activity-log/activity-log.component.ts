import { Component, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import * as moment from 'moment';

@Component({
  selector: 'app-activity-log',
  templateUrl: './activity-log.component.html',
  styleUrls: ['./activity-log.component.scss']
})
export class ActivityLogComponent {
  activityList: any[] = [];
  dataSource: any;
  displayedColumns: string[] = [
    'warning_type',
    'warning_timestamp'
  ];
    @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  

constructor( public dialogRef: MatDialogRef<ActivityLogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any){
      this.activityList = data.map((res:any)=>res.warnings||[]
      ).flat().map((res:any)=> { return {...res,warning_timestamp:moment(res.warning_timestamp).format('YYYY-DD-MM hh:mm:ss A')}});
      this.dataSource = this.activityList;
      console.log(this.dataSource, data)
    }

    closeModal() {
      this.dialogRef.close();
    }
}
