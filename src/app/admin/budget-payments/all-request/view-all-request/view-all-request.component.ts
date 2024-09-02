import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EtmsService } from '@core/service/etms.service';

@Component({
  selector: 'app-view-all-request',
  templateUrl: './view-all-request.component.html',
  styleUrls: ['./view-all-request.component.scss'],
})
export class ViewAllRequestComponent {
  _id!: any;

  userName!: string;
  email!: string;
  courseName!: string;
  employeeName!: string;
  roName!: string;
  directorName!: string;
  trainingadminName!: string;
  vendorName!: string;
  classStartDate!: string;
  classEndDate!: string;
  courseCost!: number;
  coursetimeline!: number;
  departmentName!: string;
  designationName!: string;
  directorApproval!: string;
  roApproval!: string;
  trainingadminApproval!: string;
  TAreasons!: string;
  RoReason!: string;
  directorReason!: string;

  breadscrums = [
    {
      title: 'All requests',
      items: ['All requests'],
      active: 'View Request',
    },
  ];
  constructor(
    private etmsServie: EtmsService,
    private _activeRouter: ActivatedRoute
  ) {
    // constructor
    this._activeRouter.queryParams.subscribe((params) => {
      this._id = params['id'];
    });
    
  }

  ngOnInit() {
    this.viewRequest(this._id);
  }
  viewRequest(id: string) {
    this.etmsServie.getRequestById(id).subscribe((data) => {

      this.userName = data.userName;
      this.email = data.email;
      this.courseName = data.courseName;
      this.departmentName = data.department;
      this.designationName = data.designation;
      this.courseCost = data.courseCost;
      this.coursetimeline = data.courseTimeline;
      this.employeeName = data.employeeName;
      this.directorName = data.directorName;
      this.roName = data.roName;
      this.vendorName = data.vendorName;
      this.roApproval = data.roApproval;
      this.trainingadminName = data.trainingAdminName;
      this.trainingadminApproval = data.trainingAdminApproval;
      this.directorApproval = data.directorApproval;
      this.TAreasons = data.trainingAdminReason;
      this.RoReason = data.roReason;
      this.directorReason = data.directorReason;
    });
  }
  cancel(){
    window.history.back();
  }
}
