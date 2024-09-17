import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CoursePaginationModel } from '@core/models/course.model';
import { DataTransferService } from '@shared/datatransfer';

@Component({
  selector: 'app-chart-course-view',
  templateUrl: './chart-course-view.component.html',
  styleUrls: ['./chart-course-view.component.scss']
})
export class ChartCourseViewComponent {
  department: string | null = null;
  status: string | null = null;
  records: any[] = [];
  breadscrums = [
    {
      title: 'Course List',
      items: ['Dashboard'],
      active: 'Course List',
    },
  ];
  displayedColumns = [
    'name',
    'status',
    'department',
    'registeredDate',
  ];
isLoading: boolean = false;
  courseData: any[] = [];
  coursePaginationModel: Partial<CoursePaginationModel>;
  constructor(private route: ActivatedRoute, private dataTransferService: DataTransferService) {
    this.coursePaginationModel = {}
  }

  ngOnInit(): void {
    this.department = this.route.snapshot.paramMap.get('department');
    this.status = this.route.snapshot.paramMap.get('status');

    // Retrieve the records from the service
    this.courseData = this.dataTransferService.getRecords();
    console.log(this.courseData);
  }
}
