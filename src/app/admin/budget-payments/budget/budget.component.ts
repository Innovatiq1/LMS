import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { CoursePaginationModel } from '@core/models/course.model';
import { OverallBuget } from '@core/models/overall-budget.model';
import { EtmsService } from '@core/service/etms.service';
import { TableElement, TableExportUtil } from '@shared';
import jsPDF from 'jspdf';
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
import Swal from 'sweetalert2';
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
export interface PeriodicElement {
  training: string;
  percentage: string;
  overall: string;
  type: string;
}
export type pieChartOptions = {
  series?: ApexNonAxisChartSeries;
  chart?: ApexChart;
  legend?: ApexLegend;
  dataLabels?: ApexDataLabels;
  responsive?: ApexResponsive[];
  labels?: string[];
};
const ELEMENT_DATA: PeriodicElement[] = [
  {
    percentage: '12%',
    training: '$ 35,000',
    overall: '$ 24,000',
    type: 'Planned',
  },
  {
    percentage: '85%',
    training: '$ 35,000',
    overall: '$ 24,000',
    type: 'UnPlanned',
  },
  {
    percentage: '95%',
    training: '$ 35,000',
    overall: '$ 24,000',
    type: 'Planned',
  },
  {
    percentage: '12%',
    training: '$ 35,000',
    overall: '$ 24,000',
    type: 'Planned',
  },
  {
    percentage: '18%',
    training: '$ 35,000',
    overall: '$ 24,000',
    type: 'UnPlanned',
  },
];


@Component({
  selector: 'app-budget',
  templateUrl: './budget.component.html',
  styleUrls: ['./budget.component.scss']
})
export class BudgetComponent {
  SourceData: any;
  displayedColumns: string[] = [
    'percentage',
    'type',
    'overall-budget',
    'status',
  ];
  dataSource = ELEMENT_DATA;
  dataSource2 = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  totalItems: any;
  pageSizeArr = [10, 25, 50, 100];
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  public barChartOptions!: Partial<chartOptions>;
  selection = new SelectionModel<OverallBuget>(true, []);
  public pieChartOptions!: Partial<pieChartOptions>;
  coursePaginationModel!: Partial<CoursePaginationModel>;
  dataSource3 = new MatTableDataSource(ELEMENT_DATA);
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource3.filter = filterValue.trim().toLowerCase();
  }
  breadscrums = [
    {
      title: 'Over All Budget',
       items: ['Finance'],
      active: 'Budget',
    },
  ];
  constructor(public router: Router, private etmsService: EtmsService) {
    this.coursePaginationModel = {};
    this.pieChartOptions = {
      series: [44, 55],
      chart: {
        type: 'donut',
        width: 300,
      },
      legend: {
        show: false,
      },
      dataLabels: {
        enabled: false,
      },
      labels: ['Budget Spent', 'Balance Budget'],
      responsive: [
        {
          breakpoint: 480,
          options: {},
        },
      ],
    };
  }
  ngOnInit() {
    this.dataSource2.paginator = this.paginator;
    this.chart2();
    this.getAllRequests();
  }
  getAllRequests() {
    this.etmsService.getAllBudgets({...this.coursePaginationModel}).subscribe((res) => {
      this.SourceData = res.data.docs;
      this.totalItems = res.data.totalDocs;
      this.coursePaginationModel.docs = res.data.docs;
      this.coursePaginationModel.page = res.data.page;
      this.coursePaginationModel.limit = res.data.limit;
    });
  }

  private chart2() {
    this.barChartOptions = {
      series: [
        {
          name: 'percent',
          data: [5, 8, 10, 14, 9, 7],
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
      plotOptions: {
        bar: {
          dataLabels: {
            position: 'top', // top, center, bottom
          },
        },
      },
      dataLabels: {
        enabled: true,
        formatter: function (val) {
          return val + '%';
        },
        offsetY: -20,
        style: {
          fontSize: '12px',
          colors: ['#9aa0ac'],
        },
      },
      grid: {
        show: true,
        borderColor: '#9aa0ac',
        strokeDashArray: 1,
      },
      xaxis: {
        categories: [
          'Sales',
          'Marketing',
          'Finance',
          'Operations',
          'Corporate',
          'Shop Floor',
        ],
        position: 'bottom',
        labels: {
          offsetY: 0,
        },
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        crosshairs: {
          fill: {
            type: 'gradient',
            gradient: {
              colorFrom: '#D8E3F0',
              colorTo: '#BED1E6',
              stops: [0, 100],
              opacityFrom: 0.4,
              opacityTo: 0.5,
            },
          },
        },
        tooltip: {
          enabled: true,
          offsetY: -35,
        },
      },
      fill: {
        type: 'gradient',
        colors: ['#4F86F8', '#4F86F8'],
        gradient: {
          shade: 'light',
          type: 'horizontal',
          shadeIntensity: 0.25,
          gradientToColors: undefined,
          inverseColors: true,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [50, 0, 100, 100],
        },
      },
      yaxis: {
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        labels: {
            show: false,
          formatter: function (val) {
            return val + '%';
          },
        },
      },
    };
  }

  newBudget() {
    this.router.navigate(['/admin/budgets/create-budget']);
  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.length;
    return numSelected === numRows;
  }
  pageSizeChange($event: any) {
    this.coursePaginationModel.page = $event?.pageIndex + 1;
    this.coursePaginationModel.limit = $event?.pageSize;
      this.getAllRequests();
    
  }
  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.forEach((row: any) => this.selection.select(row));
  }

  edit(id: any) {
    this.router.navigate(['/admin/budgets/create-budget'], {
      queryParams: { id: id, action: 'edit' },
    });
  }

  deleteTraining(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this budget data!',
      icon: 'warning',
      confirmButtonText: 'Yes',
      showCancelButton: true,
      cancelButtonColor: '#d33',
    }).then((result) => {
      if (result.isConfirmed) {
        this.etmsService.deleteTrainingBudget(id).subscribe((res) => {
          if (res) {
            Swal.fire('Deleted!', 'Budget deleted successfully.', 'success');
          }
          this.getAllRequests();
        });
      }
    });
  }

  generatePdf() {
    const doc = new jsPDF();
    const headers = [['Year','Overall Budget','Training Type','Status']];
    const data = this.SourceData.map((user:any) =>
      [user.year,
        '$'+user.trainingBudget,
       user.trainingType,
       user.approval
    ] );
    //const columnWidths = [60, 80, 40];
    const columnWidths = [20, 20, 20, 20, 20, 20, 20, 20, 20, 20];
    (doc as any).autoTable({
      head: headers,
      body: data,
      startY: 20,
      headStyles: {
        fontSize: 10,
        cellWidth: 'wrap',
      },
    });
    doc.save('Budget-list.pdf');
  }
  exportExcel() {
    //k//ey name with space add in brackets
   const exportData: Partial<TableElement>[] = this.SourceData.map(
     (user: any) => ({
       'Year': user.year,
       'Overall Budget': '$'+user.trainingBudget,
       'Training Type': user.trainingType,
       'Status': user.approval,
     })
   );
    TableExportUtil.exportToExcel(exportData, 'Budget-list');
  }
}
