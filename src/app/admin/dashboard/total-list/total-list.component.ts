import { Component } from '@angular/core';
import { CoursePaginationModel } from '@core/models/course.model';
import { CourseService } from '@core/service/course.service';
import { UserService } from '@core/service/user.service';
import { UtilsService } from '@core/service/utils.service';

@Component({
  selector: 'app-total-list',
  templateUrl: './total-list.component.html',
  styleUrls: ['./total-list.component.scss'],
})
export class TotalListComponent {
  displayedColumns = [
    'program',
    'status',
    'code',
    'Creator',
    'Duration',
    'Start Date',
    'End Date',
    'Payment',
    'Compulsory Count',
    'Elective Count',
    
  ];

  breadscrums = [
    {
      title: 'Course Kit',
      items: ['Dashboard'],
      active: 'Program List',
    },
  ];
  isLoading: boolean = false;
  coursePaginationModel!: Partial<CoursePaginationModel>;
  totalItems: any;
  pageSizeArr = this.utils.pageSizeArr;
  staff: any;
  dataSource: any;
  programData: any;
  isNoMoreData = false;

  constructor(public utils: UtilsService, private courseService: CourseService,) {
    this.coursePaginationModel = {};
  }
  

  ngOnInit() {
    this.getProgramList();
  }

  getProgramList(filters?: any) {
    this.isLoading = true;
    this.isNoMoreData = false;
    let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
    this.courseService.getAllPrograms({...this.coursePaginationModel},userId).subscribe(
      (response: any) => {
        this.isLoading = false;
        this.programData = response.docs;
        this.totalItems = response.totalDocs;
        this.coursePaginationModel.docs = response.docs;
        this.coursePaginationModel.page = response.data.page;
        this.coursePaginationModel.limit = response.limit;
        this.coursePaginationModel.totalDocs = response.totalDocs;
      },
      (error) => {
        this.isLoading = false;
      }
    );
  }

  pageSizeChange($event: any) {
    this.coursePaginationModel.page = $event?.pageIndex + 1;
    this.coursePaginationModel.limit = $event?.pageSize;
      this.getProgramList();
    
  }
}
