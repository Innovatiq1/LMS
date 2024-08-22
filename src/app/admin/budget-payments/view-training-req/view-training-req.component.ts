import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CoursePaginationModel } from '@core/models/course.model';
import { EtmsService } from '@core/service/etms.service';

@Component({
  selector: 'app-view-training-req',
  templateUrl: './view-training-req.component.html',
  styleUrls: ['./view-training-req.component.scss']
})
export class ViewTrainingReqComponent {
  breadscrums = [
    {
      title: 'Blank',
      items: ['Training Request'],
      active: 'View Training Request',
    },
  ];

  requestDataById: any;
  requestData: any;
  coursePaginationModel!: Partial<CoursePaginationModel>;
  response: any;
  requestId: any;
  
  constructor(
    private etmsService: EtmsService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {
    this.coursePaginationModel = {};
    this.activatedRoute.params.subscribe((params: any) => {
      this.requestId = params.id;
     

    });
  }
  ngOnInit(): void {
    // this.getAllRequests();
    if (this.requestId) {
      this.activatedRoute.params.subscribe((params: any) => {
        
        this.requestId = params.id;
        this.getRequestsByID(this.requestId);
      });
    }
  }
  getRequestsByID(id: string) {
    this.etmsService.getRequestById(id).subscribe((response: any) => {
      this.requestDataById = response?._id;
      this.response = response;
    
    });
  }


  copy(id: string) {
    this.router.navigate(['/admin/budgets/copy-request'], {
      queryParams: { id: id, action: 'copy' },
    });
  }
  edit(id: string) {
    this.router.navigate(['/admin/budgets/edit-request'], {
      queryParams: { id: id, action: 'edit' },
    });
  }

}
