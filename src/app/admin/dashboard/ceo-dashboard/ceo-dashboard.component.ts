import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { StudentsService } from 'app/admin/students/students.service';

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTooltip,
  ApexYAxis,
  ApexPlotOptions,
  ApexStroke,
  ApexLegend,
  ApexMarkers,
  ApexGrid,
  ApexTitleSubtitle,
  ApexFill,
  ApexResponsive,
  ApexTheme,
  ApexNonAxisChartSeries,
} from 'ng-apexcharts';
import { map } from 'rxjs';

export type chartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  fill: ApexFill;
  legend: ApexLegend;
  markers: ApexMarkers;
  grid: ApexGrid;
  title: ApexTitleSubtitle;
  colors: string[];
  responsive: ApexResponsive[];
  labels: string[];
  theme: ApexTheme;
  series2: ApexNonAxisChartSeries;
};

export type pieChart1Options = {
  series: ApexAxisChartSeries | ApexNonAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions?: ApexPlotOptions;
  responsive: ApexResponsive[];
  labels?: string[];
  legend: ApexLegend;
  fill: ApexFill;
  colors: string[];
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  theme: ApexTheme;
  title: ApexTitleSubtitle;
  series2: ApexNonAxisChartSeries;
};

@Component({
  selector: 'app-ceo-dashboard',
  templateUrl: './ceo-dashboard.component.html',
  styleUrls: ['./ceo-dashboard.component.scss'],
})
export class CeoDashboardComponent {
  breadscrums = [
    {
      title: 'Dashboad',
      items: ['Dashboad'],
      active: 'CEO Dashboard',
    },
  ];
  @ViewChild('chart') chart!: ChartComponent;
  @Input() sharedashboards!: any;
  public hrPieChartOptions!: Partial<pieChart1Options>;
  public techincalPieChartOptions!: Partial<pieChart1Options>;
  public financePieChartOptions!: Partial<pieChart1Options>;
  public salesPieChartOptions!: Partial<pieChart1Options>;
  public courseBarChartOptions!: Partial<chartOptions>;
  departmentCharts: { [key: string]: any } = {};
  isHrPie: boolean = false;
  isTechnicalPie: boolean = false;
  isFinancePie: boolean = false;
  isSalesPie: boolean = false;
  isCourseBar: boolean = false;
  dept: any;
  colorClasses = ['l-bg-orange', 'l-bg-green', 'l-bg-red', 'l-bg-purple'];
  updatedDepartments: any;
  courseStatus: any;
  constructor(private studentService: StudentsService,private cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.getDepartments();
    // this.hrPieChart();
    this.courseBarChart();
    this.isHrPie = true;
    this.isTechnicalPie = true;
    this.isFinancePie = true;
    this.isSalesPie = true;
    this.isCourseBar = true;
  }

  // private hrPieChart() {
  //   this.hrPieChartOptions = {
  //     series2: [1, 2, 3],
  //     chart: {
  //       type: 'pie',
  //       height: 350,
  //     },
  //     legend: {
  //       show: true,
  //       position: 'bottom',
  //     },
  //     dataLabels: {
  //       enabled: false,
  //     },
  //     labels: ['Enrolled', 'In-progress', 'Completed'],
  //     colors: ['#6777ef', '#ff9800', '#B71180'],
  //     responsive: [
  //       {
  //         breakpoint: 480,
  //         options: {
  //           chart: {
  //             width: 200,
  //           },
  //           legend: {
  //             position: 'bottom',
  //           },
  //         },
  //       },
  //     ],
  //   };
  // }



  private courseBarChart() {
    this.courseBarChartOptions = {
      series: [
        {
          name: 'Upcoming Courses',
          data: [2, 1, 3, 1],
        },
        {
          name: 'Ongoing Courses',
          data: [7, 5, 6, 4],
        },
        {
          name: 'Completed Courses',
          data: [3, 2, 1, 1],
        },
      ],
      chart: {
        height: 350,
        type: 'bar',
        toolbar: {
          show: false,
        },
        foreColor: '#9aa0ac',
      },
      colors: ['#9F8DF1', '#E79A3B', '#2ecc71'],
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent'],
      },
      grid: {
        show: true,
        borderColor: '#9aa0ac',
        strokeDashArray: 1,
      },
      xaxis: {
        type: 'category',
        categories: [
          'HR Department',
          'Technical Department',
          'Finance Department',
          'Sales Department',
        ],
      },
      legend: {
        show: true,
        position: 'top',
        horizontalAlign: 'center',
        offsetX: 0,
        offsetY: 0,
      },

      tooltip: {
        x: {
          format: 'MMMM',
        },
      },
      yaxis: {
        title: {
          text: 'Number of Courses',
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
          // endingShape: 'rounded'
        },
      },
    };
  }
//   getDepartments() {
//     this.studentService.getAllDepartments().subscribe((response: any) => {
//       const departments = response.data.docs;
//       const components = this.sharedashboards.components;
//       const companyId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
//       this.updatedDepartments = departments.map(
//         (dept: {
//           courseStatus: any; department: any; _id: any; checked: boolean; recordCount?: number; managerCount?: number; staffCount?: number 
// }) => {
//           const matchingComponent = components.find(
//             (comp: { component: any; checked: boolean }) =>
//               comp.component === dept.department
//           );
  
//           if (matchingComponent) {
//             dept.checked = matchingComponent.checked;
//             this.studentService.getDepartmentById(companyId, dept.department).subscribe((depData) => {
//               dept.recordCount = depData.length; 
//               // console.log(`Department: ${dept.department}, Data Count: ${dept.recordCount}`);
//             });
  
//             this.getManagerandStaffCount(companyId, dept.department).subscribe((countData: { managerCount: number | undefined; staffCount: number | undefined; }) => {
//               dept.managerCount = countData.managerCount; 
//               dept.staffCount = countData.staffCount;     
//               // console.log(`Department: ${dept.department}, Managers: ${dept.managerCount}, Staff: ${dept.staffCount}`);
//             });

//             this.studentService.getCourseStatus(companyId, dept.department).subscribe(status => {
//               dept.courseStatus = status;
//               console.log(this.courseStatus);
//             })
//           } else {
//             dept.checked = false;
//             dept.recordCount = 0;
//             dept.managerCount = 0;
//             dept.staffCount = 0;
//           }
  
//           return dept;
//         }
//       );
  
//       this.dept = this.updatedDepartments.filter((dept: { checked: any; }) => dept.checked);
//     });
//   }
  
processCourseStatuses(courseStatuses: any[]): { enrolled: number, inProgress: number, completed: number } {
  const counts = {
    enrolled: 0,
    inProgress: 0,
    completed: 0,
  };

  courseStatuses.forEach(status => {
    if (status.status === 'registered') {
      counts.enrolled++;
    } else if (status.status === 'approved') {
      counts.inProgress++;
    } else if (status.status === 'completed') {
      counts.completed++;
    }
  });

  return counts;
}

  getManagerandStaffCount(companyId: string, department: string) {
    return this.studentService.getManagerandStaffCount(companyId, department).pipe(
      map((users: any[]) => {
        const managerCount = users.filter(user => user.type === 'Manager').length;
        const staffCount = users.filter(user => user.type === 'Staff').length;
  
        return {
          managerCount,
          staffCount
        };
      })
    );
  }

  getDepartments() {
    this.studentService.getAllDepartments().subscribe((response: any) => {
      const departments = response.data.docs;
      const components = this.sharedashboards.components;
      const companyId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
  
      this.updatedDepartments = departments.map(
        (dept: {
          courseStatus: any; department: any; _id: any; checked: boolean; recordCount?: number; managerCount?: number; staffCount?: number;
        }) => {
          const matchingComponent = components.find(
            (comp: { component: any; checked: boolean }) =>
              comp.component === dept.department
          );
  
          if (matchingComponent) {
            dept.checked = matchingComponent.checked;
  
            this.studentService.getDepartmentById(companyId, dept.department).subscribe((depData) => {
              dept.recordCount = depData.length;
            });
  
            this.getManagerandStaffCount(companyId, dept.department).subscribe((countData: { managerCount: number | undefined; staffCount: number | undefined; }) => {
              dept.managerCount = countData.managerCount;
              dept.staffCount = countData.staffCount;
            });
  
            this.studentService.getCourseStatus(companyId, dept.department).subscribe(status => {
              
              dept.courseStatus = status;
              const courseStatus = this.mapCourseStatus(dept.courseStatus);
            
              this.updateHrPieChart(courseStatus, dept.department);
            });
          } else {
            dept.checked = false;
            dept.recordCount = 0;
            dept.managerCount = 0;
            dept.staffCount = 0;
          }
  
          return dept;
        }
      );
  
      this.dept = this.updatedDepartments.filter((dept: { checked: any; }) => dept.checked);
    });
  }
  
  mapCourseStatus(courseStatusData: any) {
    const enrolled = courseStatusData.filter((status: any) => status.status === 'registered').length;
    const inProgress = courseStatusData.filter((status: any) => status.status === 'approved').length;
    const completed = courseStatusData.filter((status: any) => status.status === 'completed').length;
    return { enrolled, inProgress, completed };
  }
  
  updateHrPieChart(courseStatus: { enrolled: number, inProgress: number, completed: number }, department: string) {
    const seriesData: number[] = [
      courseStatus.enrolled || 0,
      courseStatus.inProgress || 0,
      courseStatus.completed || 0
    ];
  
 
  
    const chartOptions = {
      series: seriesData,
      chart: {
        type: 'pie',
        height: 350,
      },
      legend: {
        show: true,
        position: 'bottom',
      },
      dataLabels: {
        enabled: false,
      },
      labels: ['Enrolled', 'In-progress', 'Completed'],
      colors: ['#6777ef', '#ff9800', '#B71180'],
      title: {
        text: `${department} Department Status`,
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: 'bottom',
            },
          },
        },
      ],
    };
  
 
    if (!this.departmentCharts) {
      this.departmentCharts = {};
    }
  
    this.departmentCharts[department] = chartOptions;
  
    this.cd.detectChanges(); 
  }
  
  
  
  getColorClass(index: number): string {
    return this.colorClasses[index % this.colorClasses.length];
  }
}
