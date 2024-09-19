import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '@core/service/user.service';

@Component({
  selector: 'app-managers-pie-chart',
  templateUrl: './managers-pie-chart.component.html',
  styleUrls: ['./managers-pie-chart.component.scss']
})
export class ManagersPieChartComponent {
  Courses: any[] = [];
  breadscrums = [
    {
      title: 'Course List',
      items: ['Dashboard'],
      active: 'Course List22',
    },
  ];
  displayedColumns = [
    'name',
    'course',
    'status',
    'department',
    'registeredDate',
  ];
  isLoading: boolean = false;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.Courses = JSON.parse(params['data']); 
      console.log("parsed data: ", this.Courses);
    });
  }


}
