import { Component, Input } from '@angular/core';
import { ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexFill, ApexGrid, ApexLegend, ApexMarkers, ApexNonAxisChartSeries, ApexPlotOptions, ApexResponsive, ApexStroke, ApexTheme, ApexTitleSubtitle, ApexTooltip, ApexXAxis, ApexYAxis } from 'ng-apexcharts';

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
};
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
export type lineChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions?: ApexPlotOptions;
  responsive: ApexResponsive[];
  labels?: string[];
  legend: ApexLegend;
  fill: ApexFill;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  grid: ApexGrid;
  stroke: ApexStroke;
  markers: ApexMarkers;
  colors: string[];
  title: ApexTitleSubtitle;
  tooltip: ApexTooltip;
  series2: ApexNonAxisChartSeries;
};
@Component({
  selector: 'app-trainees-dashboard',
  templateUrl: './trainees-dashboard.component.html',
  styleUrls: ['./trainees-dashboard.component.scss']
})
export class TraineesDashboardComponent {
  @Input() selectedComponents!: { [key: string]: boolean };
  public studentPieChartOptions!: Partial<pieChart1Options>;
  public studentBarChartOptions!: Partial<chartOptions>;
  public studentLineChartOptions!: Partial<lineChartOptions>;
  registeredCourses: any;
  approvedCourses: any;
  registeredPrograms: any;
  approvedPrograms: any;
  completedCourses: any;

ngOnInit(): void {
  this.studentPieChart();
}


  private studentPieChart() {
    this.studentPieChartOptions = {
      series: [20, 50, 30],
     
      chart: {
        type: 'pie',
        height: 330,
      },
      labels: ['Registered Courses', 'Approved Courses', 'Completed Courses'],
     
      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: {
              position: 'bottom',
            },
          },
        },
      ],
    };
  }
  private studentBarChart() {
    this.studentBarChartOptions = {
      series: [{
        name: 'Courses',
        data: [20, 50, 30]
      },
    ],
      chart: {
        type: 'bar',
        height: 330,
      },
      xaxis: {
        categories: ['Registered', 'Approved', 'Completed']
      },
      yaxis: {
        title: {
          text: 'Number of Courses'
        }
      },
      labels: ['Registered', 'Approved', 'Completed'],
      colors: ['#25B9C1', '#4B4BCB'],
      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: {
              position: 'bottom',
            },
          },
        },
      ],
    };
  }
  private studentLineChart() {
    this.studentLineChartOptions = {
      series: [{
        name: 'Courses',
        data: [this.registeredCourses, this.approvedCourses, this.completedCourses]
      }, 
    ],
      chart: {
        type: 'line',
        height: 330,
      },
      xaxis: {
        categories: ['Registered', 'Approved', 'Completed']
      },
      yaxis: {
        title: {
          text: 'Number of Courses'
        }
      },
      labels: ['Registered', 'Approved', 'Completed'],
      colors: ['#25B9C1', '#4B4BCB'],
      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: {
              position: 'bottom',
            },
          },
        },
      ],
    };
  }
  
}
