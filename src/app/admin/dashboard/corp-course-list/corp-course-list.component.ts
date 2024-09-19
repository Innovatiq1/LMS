import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CoursePaginationModel } from '@core/models/course.model';

@Component({
  selector: 'app-corp-course-list',
  templateUrl: './corp-course-list.component.html',
  styleUrls: ['./corp-course-list.component.scss']
})
export class CorpCourseListComponent {
  breadscrums = [
    {
      title: 'Course List',
      items: ['Dashboard'],
      active: 'Course List',
    },
  ];
  courseData: any[] = [];
  coursePaginationModel: Partial<CoursePaginationModel>;
  totalItems: any;
  pageSizeArr = [10, 25, 50, 100];
  displayedColumns = [
    'name',
    'status',
    'code',
    'creator',
    'Days',
    'Training Hours',
    'Fee Type',
    'startDate',
    'endDate',
    'Vendor',
    'Fees',
  ];
isLoading: boolean = false;

  constructor(private router: Router) {
    this.coursePaginationModel = {
      
  }
}

  ngOnInit() {
    this.courseData = history.state.courses; 

    console.log(this.courseData)
  }

  pageSizeChange($event: any) {
    this.coursePaginationModel.page = $event?.pageIndex + 1;
    this.coursePaginationModel.limit = $event?.pageSize;
    
  }
  viewCourse(id: string) {
    this.router.navigate(['/admin/courses/course-view/'], {
      queryParams: { id: id, status: 'active' },
    });
  }
}
