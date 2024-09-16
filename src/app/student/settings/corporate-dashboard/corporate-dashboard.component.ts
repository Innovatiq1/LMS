import { Component, Input, OnInit, ViewChild } from '@angular/core';
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
  selector: 'app-corporate-dashboard',
  templateUrl: './corporate-dashboard.component.html',
  styleUrls: ['./corporate-dashboard.component.scss']
})
export class CorporateDashboardComponent {
  breadscrums = [
    {
      title: 'Dashboad',
      items: ['Dashboad'],
      active: 'CEO Dashboard',
    },
  ];
@ViewChild('chart') chart!: ChartComponent;
@Input() selectedComponents!: { [key: string]: boolean };
public hrPieChartOptions!: Partial<pieChart1Options>;
public techincalPieChartOptions!: Partial<pieChart1Options>;
public financePieChartOptions!: Partial<pieChart1Options>;
public salesPieChartOptions!: Partial<pieChart1Options>;
public courseBarChartOptions!: Partial<chartOptions>;

isHrPie: boolean = false;
isTechnicalPie: boolean = false;
isFinancePie: boolean = false;
isSalesPie: boolean = false;
isCourseBar: boolean = false;
  dept: any;
  colorClasses = ['l-bg-orange', 'l-bg-green', 'l-bg-red', 'l-bg-purple'];
  dept1: any;
constructor(private studentService: StudentsService,){

}

ngOnInit() {
this.hrPieChart();
this.technicalPieChart();
this.financePieChart();
this.salesPieChart();
this.courseBarChart();
this.getDepartments();
this.getDepartments1();
this.isHrPie = true;
this.isTechnicalPie = true;
this.isFinancePie = true;
this.isSalesPie = true;
this.isCourseBar = true;
}

private hrPieChart() {
this.hrPieChartOptions = {
  series2: [1, 2, 3],
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
}

private technicalPieChart() {
this.techincalPieChartOptions = {
  series2: [2, 3, 1],
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
}
private financePieChart() {
this.financePieChartOptions = {
  series2: [3, 2, 1],
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
}
private salesPieChart() {
this.salesPieChartOptions = {
  series2: [1, 2, 2],
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
}

private courseBarChart() {
  this.courseBarChartOptions = {
    series: [
      {
        name: 'Upcoming Courses',
        data: [2,1,3,1],
      },
      {
        name: 'Ongoing Courses',
        data: [7,5,6,4],
      },
      {
        name: 'Completed Courses',
        data: [3,2,1,1],
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
getDepartments() {
  this.studentService.getAllDepartments().subscribe((response: any) => {
    this.dept = response.data.docs;
  });
}
getDepartments1() {
  this.studentService.getAllDepartments().subscribe((response: any) => {
    this.dept1 = response.data.docs;
  });
}
getColorClass(index: number): string {
  return this.colorClasses[index % this.colorClasses.length];
}
}
