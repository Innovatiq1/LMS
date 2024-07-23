import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CoursePaginationModel } from '@core/models/course.model';
import { AuthenService } from '@core/service/authen.service';
import { SettingsService } from '@core/service/settings.service';
import { UtilsService } from '@core/service/utils.service';

@Component({
  selector: 'app-approval-workflow',
  templateUrl: './approval-workflow.component.html',
  styleUrls: ['./approval-workflow.component.scss']
})
export class ApprovalWorkflowComponent {
  displayedColumns = [
    
    'Title',
    'Approver',
    'Level',
    
  ];
  breadscrums = [
    {
      title: 'Questions',
      items: ['Automation'],
      active: 'Approval Workflow',
    },
  ];

  dataSource: any;
  coursePaginationModel!: Partial<CoursePaginationModel>;
  totalItems: any;
  pageSizeArr = this.utils.pageSizeArr;
  isCreate = false;
  isView = false;
  
  constructor(
    private settingsService: SettingsService,
    public utils: UtilsService, 
    private router: Router,
    private authenService: AuthenService
  ) {
    this.coursePaginationModel = {};
  }

  ngOnInit(): void {
    const roleDetails =this.authenService.getRoleDetails()[0].settingsMenuItems
    let urlPath = this.router.url.split('/');
    const parentId = `${urlPath[1]}/${urlPath[2]}/${urlPath [3]}`;
    const childId =  urlPath[urlPath.length - 1];
    let parentData = roleDetails.filter((item: any) => item.id == parentId);
    let childData = parentData[0].children.filter((item: any) => item.id == childId);
    let actions = childData[0].actions
    let createAction = actions.filter((item:any) => item.title == 'Create')
    let viewAction = actions.filter((item:any) => item.title == 'View')

    if(createAction.length >0){
      this.isCreate = true;
    }
    if(viewAction.length >0){
      this.isView = true;
    }
    this.getApprovalFlow();
  }

  getApprovalFlow(): void {
    this.settingsService.getApprovalFlow({ ...this.coursePaginationModel }).subscribe( (response) => {
          this.dataSource = response.data.docs;
          this.totalItems = response.data.totalDocs;
          this.coursePaginationModel.docs = response.data.docs;
          this.coursePaginationModel.page = response.data.page;
          this.coursePaginationModel.limit = response.data.limit;
        },
        (error) => {
          console.error('Failed to fetch approval flow:', error);
        }
      );
  }

  addNew() {
    this.router.navigate(['/student/settings/create-approval-flow']);
  }

}
