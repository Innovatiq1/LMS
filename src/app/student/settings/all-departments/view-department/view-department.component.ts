import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { CoursePaginationModel } from '@core/models/course.model';
import { UserService } from '@core/service/user.service';
import { UtilsService } from '@core/service/utils.service';

@Component({
  selector: 'app-view-department',
  templateUrl: './view-department.component.html',
  styleUrls: ['./view-department.component.scss']
})
export class ViewDepartmentComponent{
  displayedColumns: string[] = [
    'img',
    'User Type',
    'Name',
  ];
  breadscrums = [
    {
      title: 'Department',
      items: ['Department'],
      active: 'Department',
    },
  ];

  dataSource: any;
  isLoading = true;
  coursePaginationModel!: Partial<CoursePaginationModel>;
  totalItems: any;
  pageSizeArr = this.utils.pageSizeArr;
  subscribeParams: any;
  type: any;

  constructor(private router: Router,
    public utils: UtilsService,
    private alluserService: UserService,
    private activatedRoute: ActivatedRoute,

  ) {

    this.subscribeParams = this.activatedRoute.params.subscribe((params:any) => {
      this.type = params.id;
      console.log("paramas here",params)
      this.breadscrums = [
        {
          title: this.type,
          items: ['Department'],
          active: this.type,
        },
      ];
    
    
    });
    this.coursePaginationModel = {};
   
}

@ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
@ViewChild('filter', { static: true }) filter!: ElementRef;

ngOnInit(): void {
  this.getUsersDepartmentList();
}

getUsersDepartmentList(filters?:any) {
  let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
  this.alluserService.getUsersByDepartment(this.type,userId, {...this.coursePaginationModel}).subscribe((response: any) => {
    this.dataSource = response.results;
    this.isLoading = false;
    this.totalItems = response.results.totalDocs;
    this.coursePaginationModel.docs = response.results.docs;
    this.coursePaginationModel.page = response.results.page;
    this.coursePaginationModel.limit = response.results.limit;

  }, error => {
  });
}



pageSizeChange($event: any) {
  this.coursePaginationModel.page = $event?.pageIndex + 1;
  this.coursePaginationModel.limit = $event?.pageSize;
  this.getUsersDepartmentList()

}

 

}










