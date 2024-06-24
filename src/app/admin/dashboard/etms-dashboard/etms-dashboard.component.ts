import { Component, OnInit, ViewChild } from '@angular/core';
import { NgxGaugeType } from 'ngx-gauge/gauge/gauge';
import { EChartsOption } from 'echarts';
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
import { SettingsService } from '@core/service/settings.service';
import { AuthenService } from '@core/service/authen.service';
import { AppConstants } from '@shared/constants/app.constants';

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
};

interface GaugeValues {
  [key: number]: number;
}


@Component({
  selector: 'app-etms-dashboard',
  templateUrl: './etms-dashboard.component.html',
  styleUrls: ['./etms-dashboard.component.scss']
})
export class EtmsDashboardComponent implements OnInit {
  @ViewChild('chart') chart!: ChartComponent;
  public barChartOptions!: Partial<chartOptions>;
  public barChart2Options!: Partial<chartOptions>;
  public budgetLineChartOptions!: Partial<chartOptions>;
  public budgetBarChartOptions!: Partial<chartOptions>;
  public budgetPieChartOptions!: Partial<pieChart1Options>;
  public actualLineChartOptions!: Partial<chartOptions>;
  public actualBarChartOptions!: Partial<chartOptions>;
  public actualPieChartOptions!: Partial<pieChart1Options>;

  breadscrums = [
    {
      title: 'Dashboard',
      items: [],
      active: 'E-TMS Dashboard',
    },
  ];

  isBudgetLine: boolean = false;
  isBudgetPie: boolean = false;
  isBudgetBar: boolean = false;
  isActualLine: boolean = false;
  isActualPie: boolean = false;
  isActualBar: boolean = false;
  dashboard: any;

  constructor( private settingsService: SettingsService, private authenticationService:AuthenService,) {
    this.percentageValue = function (value: number): string {
      return `${Math.round(value)}`;
    };
  }
  ngOnInit() {
    const role = this.authenticationService.currentUserValue.user.role;
    console.log('roles', this.authenticationService.currentUserValue.user);
    if (role == AppConstants.ADMIN_ROLE) {
      this.getStudentDashboard();
    }
    this.chart2();
    this.chart3();
  }

  // 1st bar chart

  private chart2() {
    this.barChartOptions = {
      series: [
        {
          name: 'percent',
          data: [5, 8, 10, 14, 9, 7, 11, 5, 9, 16, 7, 5],
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
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
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
              colorFrom: '#DD6153',
              colorTo: '#DD6153',
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
        colors: ['#DD6153', '#DD6153'],
        gradient: {
          shade: 'dark',
          type: 'horizontal',
          shadeIntensity: 0,
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

  //2nd bar chart
  private chart3() {
    this.barChart2Options = {
      series: [
        {
          name: 'percent',
          data: [5, 8, 10, 14, 9, 7, 11, 5, 9, 16, 7, 5],
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
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
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
              colorFrom: '#DD6153',
              colorTo: '#DD6153',
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
          shade: 'dark',
          type: 'horizontal',
          shadeIntensity: 0,
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

  //line chart

  line_chart: EChartsOption = {
    grid: {
      top: '6',
      right: '0',
      bottom: '17',
      left: '25',
    },
    xAxis: {
      data: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ],
      axisLine: {
        lineStyle: {
          color: '#eaeaea',
        },
      },
      axisLabel: {
        fontSize: 10,
        color: '#9aa0ac',
      },
    },
    tooltip: {
      show: true,
      showContent: true,
      alwaysShowContent: false,
      triggerOn: 'mousemove',
      trigger: 'axis',
    },
    yAxis: {
      min: 0,
      max: 100,
      interval: 10,
      splitLine: {
        lineStyle: {
          color: '#eaeaea',
        },
      },
      axisLine: {
        lineStyle: {
          color: '#eaeaea',
        },
      },
      axisLabel: {
        fontSize: 10,
        color: '#9aa0ac',
      },
    },
    series: [
      {
        name: 'Profit',
        type: 'line',
        smooth: true,
        lineStyle: {
          width: 3,
          shadowColor: 'rgba(0,0,0,0.4)',
          shadowBlur: 10,
          shadowOffsetY: 10,
        },
        symbolSize: 10,
        // size: 10,
        data: [8, 12, 28, 20, 25, 30, 35, 30, 28, 40, 30, 35],
        // color: ["#009DA0"]
      },
    ],
    color: ['#F6A025'],
  };

  //gauge chart
  gaugeValue = 68;
  gaugeValue1 = 45;
  gaugeValue2 = 85;

  guageType1 = 'full' as NgxGaugeType;
  percentageValue: (value: number) => string;




  private budgetLineChart() {
    this.budgetLineChartOptions = {
      series: [{
        name: "Percentage",
        data: [113, 120, 130, 120, 125, 119],
      }],
      chart: {
        type: 'line',
        height: 330,
        foreColor: '#9aa0ac',
        width: '100%',
        toolbar: {
          show: true, // Show the toolbar for better control
          tools: {
            download: true,
            selection: true,
            zoom: true,
            zoomin: true,
            zoomout: true,
            pan: true,
            reset: true
          },
          autoSelected: 'zoom'
        },
      },
      xaxis: {
        categories: ['2019', '2020', '2021', '2022', '2023', '2024'],
      },
      stroke: { curve: 'smooth' },
      dataLabels: { enabled: false },
      legend: {
        position: 'top',
        horizontalAlign: 'right',
        floating: true,
        offsetY: -25,
        offsetX: -5,
      },
      tooltip: { enabled: true },
      grid: {
        show: true,
        borderColor: '#9aa0ac',
        strokeDashArray: 1,
      },
      // yaxis: { title: { text: "Number of Instructors" } },
      colors: ['#FFA500']
    };
  }
  
  private budgetBarChart() {
    this.budgetBarChartOptions = {
        series: [{
            name: "Percentage",
            data:[113, 120, 130, 120, 125, 119],
        }],
        chart: {
            type: 'bar',
            height: 330,
            foreColor: '#9aa0ac',
            width: '100%',
            toolbar: {
                show: true,
                tools: {
                    download: true,
                    selection: true,
                    zoom: true,
                    zoomin: true,
                    zoomout: true,
                    pan: true,
                    reset: true
                },
                autoSelected: 'zoom'
            },
        },
        xaxis: {
          categories: ['2019', '2020', '2021', '2022', '2023', '2024'],
        },
        stroke: { curve: 'smooth' },
        dataLabels: { enabled: false },
        legend: {
            position: 'top',
            horizontalAlign: 'right',
            floating: true,
            offsetY: -25,
            offsetX: -5,
        },
        tooltip: { enabled: true },
        grid: {
            show: true,
            borderColor: '#9aa0ac',
            strokeDashArray: 1,
        },
        yaxis: { title: { text: "Number of Instructors" } },
        colors: ['#FFA500']
    };
  }
  
  private budgetPieChart() {
  this.budgetPieChartOptions = {
      series: [113, 120, 130, 120, 125, 119],
      chart: {
          type: 'pie',
          height: 330,
          foreColor: '#9aa0ac',
          width: '100%',
      },
      labels: ['2019', '2020', '2021', '2022', '2023', '2024'],
      colors: ['#51E298', '#FF5733', '#FFC300', '#C70039', '#900C3F', '#581845'],
      legend: {
          position: 'top',
          horizontalAlign: 'right',
          floating: true,
          offsetY: -25,
          offsetX: -5,
      },
      tooltip: { enabled: true },
      dataLabels: { enabled: false },
      responsive: [{
          breakpoint: 480,
          options: {
              chart: {
                  width: 200
              },
              legend: {
                  position: 'bottom'
              }
          }
      }]
  };
  }
  private actualLineChart() {
    this.actualLineChartOptions = {
      series: [{
        name: "Percentage",
        data: [105, 110, 115, 120, 125, 130],
      }],
      chart: {
        type: 'line',
        height: 330,
        foreColor: '#9aa0ac',
        width: '100%',
        toolbar: {
          show: true, // Show the toolbar for better control
          tools: {
            download: true,
            selection: true,
            zoom: true,
            zoomin: true,
            zoomout: true,
            pan: true,
            reset: true
          },
          autoSelected: 'zoom'
        },
      },
      xaxis: {
        categories: ['2019', '2020', '2021', '2022', '2023', '2024'],
      },
      stroke: { curve: 'smooth' },
      dataLabels: { enabled: false },
      legend: {
        position: 'top',
        horizontalAlign: 'right',
        floating: true,
        offsetY: -25,
        offsetX: -5,
      },
      tooltip: { enabled: true },
      grid: {
        show: true,
        borderColor: '#9aa0ac',
        strokeDashArray: 1,
      },
      // yaxis: { title: { text: "Number of Instructors" } },
      colors: ['#FFA500']
    };
  }
  
  private actualBarChart() {
    this.actualBarChartOptions = {
        series: [{
            name: "Percentage",
            data:[105, 110, 115, 120, 125, 130],
        }],
        chart: {
            type: 'bar',
            height: 330,
            foreColor: '#9aa0ac',
            width: '100%',
            toolbar: {
                show: true,
                tools: {
                    download: true,
                    selection: true,
                    zoom: true,
                    zoomin: true,
                    zoomout: true,
                    pan: true,
                    reset: true
                },
                autoSelected: 'zoom'
            },
        },
        xaxis: {
          categories: ['2019', '2020', '2021', '2022', '2023', '2024'],
        },
        stroke: { curve: 'smooth' },
        dataLabels: { enabled: false },
        legend: {
            position: 'top',
            horizontalAlign: 'right',
            floating: true,
            offsetY: -25,
            offsetX: -5,
        },
        tooltip: { enabled: true },
        grid: {
            show: true,
            borderColor: '#9aa0ac',
            strokeDashArray: 1,
        },
        // yaxis: { title: { text: "Number of Instructors" } },
        colors: ['#FFA500']
    };
  }
  
  private actualPieChart() {
  this.actualPieChartOptions = {
      series: [105, 110, 115, 120, 125, 130],
      chart: {
          type: 'pie',
          height: 330,
          foreColor: '#9aa0ac',
          width: '100%',
      },
      labels: ['2019', '2020', '2021', '2022', '2023', '2024'],
      colors: ['#51E298', '#FF5733', '#FFC300', '#C70039', '#900C3F', '#581845'],
      legend: {
          position: 'top',
          horizontalAlign: 'right',
          floating: true,
          offsetY: -25,
          offsetX: -5,
      },
      tooltip: { enabled: true },
      dataLabels: { enabled: false },
      responsive: [{
          breakpoint: 480,
          options: {
              chart: {
                  width: 200
              },
              legend: {
                  position: 'bottom'
              }
          }
      }]
  };
  }
//   private budgetLineChart() {
//     this.budgetLineChartOptions = {
//       series: [
//         {
//           name: 'Percentage',
//           data: [113, 120, 130, 120, 125, 119],
//         },
//       ],
//       chart: {
//         height: 350,
//         type: 'line',
//         dropShadow: {
//           enabled: true,
//           color: '#000',
//           top: 18,
//           left: 7,
//           blur: 10,
//           opacity: 0.2,
//         },
//         foreColor: '#9aa0ac',
//         toolbar: {
//           show: false,
//         },
//       },
//       colors: ['#51E298'],
//       dataLabels: {
//         enabled: true,
//       },
//       stroke: {
//         curve: 'smooth',
//       },
//       markers: {
//         size: 1,
//       },
//       grid: {
//         show: true,
//         borderColor: '#9aa0ac',
//         strokeDashArray: 1,
//       },
//       xaxis: {
//         categories: ['2019', '2020', '2021', '2022', '2023', '2024'],
//         title: {
//           text: 'Years',
//         },
//       },
//       yaxis: {
//         title: {
//           text: 'Percentage',
//         },
//       },
//       tooltip: {
//         theme: 'dark',
//         marker: {
//           show: true,
//         },
//         // x: {
//         //   show: true,
//         // },
//       },
//     }
//   }
//   private budgetPieChart() {
//     this.budgetPieChartOptions = {
//         series: [113, 120, 130, 120, 125, 119],
//         chart: {
//             width: 380,
//             type: 'pie',
//         },
//         labels: ['2019', '2020', '2021', '2022', '2023', '2024'],
//         colors: ['#51E298', '#FF5733', '#FFC300', '#C70039', '#900C3F', '#581845'],
//         dataLabels: {
//             enabled: true,
//         },
//         legend: {
//             position: 'bottom',
//         },
//         tooltip: {
//             theme: 'dark',
//             marker: {
//                 show: true,
//             },
//             // x: {
//             //     show: true,
//             // },
//         },
      
//     };
// }
// private budgetBarChart() {
// this.budgetBarChartOptions = {
//     series: [
//         {
//             name: 'Percentage',
//             data: [113, 120, 130, 120, 125, 119],
//         },
//     ],
//     chart: {
//         height: 350,
//         type: 'bar',
//         dropShadow: {
//             enabled: true,
//             color: '#000',
//             top: 18,
//             left: 7,
//             blur: 10,
//             opacity: 0.2,
//         },
//         foreColor: '#9aa0ac',
//         toolbar: {
//             show: false,
//         },
//     },
//     colors: ['#51E298'],
//     dataLabels: {
//         enabled: true,
//     },
//     stroke: {
//         curve: 'smooth',
//     },
//     markers: {
//         size: 1,
//     },
//     grid: {
//         show: true,
//         borderColor: '#9aa0ac',
//         strokeDashArray: 1,
//     },
//     xaxis: {
//         categories: ['2019', '2020', '2021', '2022', '2023', '2024'],
//         title: {
//             text: 'Years',
//         },
//     },
//     yaxis: {
//         title: {
//             text: 'Percentage',
//         },
//     },
//     tooltip: {
//         theme: 'dark',
//         marker: {
//             show: true,
//         },
//         // x: {
//         //     show: true,
//         // },
//     },
   
// }
// }

// private actualBarChart() {
//   this.actualBarChartOptions = {
//       series: [
//           {
//               name: 'Percentage',
//               data: [105, 110, 115, 120, 125, 130],
//           },
//       ],
//       chart: {
//           height: 350,
//           type: 'bar',
//           dropShadow: {
//               enabled: true,
//               color: '#000',
//               top: 18,
//               left: 7,
//               blur: 10,
//               opacity: 0.2,
//           },
//           foreColor: '#9aa0ac',
//           toolbar: {
//               show: false,
//           },
//       },
//       colors: ['#51E298'],
//       dataLabels: {
//           enabled: true,
//       },
//       stroke: {
//           curve: 'smooth',
//       },
//       markers: {
//           size: 1,
//       },
//       grid: {
//           show: true,
//           borderColor: '#9aa0ac',
//           strokeDashArray: 1,
//       },
//       xaxis: {
//           categories: ['2019', '2020', '2021', '2022', '2023', '2024'],
//           title: {
//               text: 'Years',
//           },
//       },
//       yaxis: {
//           title: {
//               text: 'Percentage',
//           },
//       },
//       tooltip: {
//           theme: 'dark',
//           marker: {
//               show: true,
//           },
//           // x: {
//           //     show: true,
//           // },
//       },
     
//   }
// }


// private actualLineChart() {
//   this.actualLineChartOptions = {
//     series: [
//       {
//         name: 'Percentage',
//         data: [105, 110, 115, 120, 125, 130],
//       },
//     ],
//     chart: {
//       height: 350,
//       type: 'line',
//       dropShadow: {
//         enabled: true,
//         color: '#000',
//         top: 18,
//         left: 7,
//         blur: 10,
//         opacity: 0.2,
//       },
//       foreColor: '#9aa0ac',
//       toolbar: {
//         show: false,
//       },
//     },
//     colors: ['#51E298'],
//     dataLabels: {
//       enabled: true,
//     },
//     stroke: {
//       curve: 'smooth',
//     },
//     markers: {
//       size: 1,
//     },
//     grid: {
//       show: true,
//       borderColor: '#9aa0ac',
//       strokeDashArray: 1,
//     },
//     xaxis: {
//       categories: ['2019', '2020', '2021', '2022', '2023', '2024'],
//       title: {
//         text: 'Years',
//       },
//     },
//     yaxis: {
//       title: {
//         text: 'Percentage',
//       },
//     },
//     tooltip: {
//       theme: 'dark',
//       marker: {
//         show: true,
//       },
//       // x: {
//       //   show: true,
//       // },
//     },
//   }
// }
// private actualPieChart() {
//   this.actualPieChartOptions = {
//       series: [105, 110, 115, 120, 125, 130],
//       chart: {
//           width: 380,
//           type: 'pie',
//       },
//       labels: ['2019', '2020', '2021', '2022', '2023', '2024'],
//       colors: ['#51E298', '#FF5733', '#FFC300', '#C70039', '#900C3F', '#581845'],
//       dataLabels: {
//           enabled: true,
//       },
//       legend: {
//           position: 'bottom',
//       },
//       tooltip: {
//           theme: 'dark',
//           marker: {
//               show: true,
//           },
//           // x: {
//           //     show: true,
//           // },
//       },
    
//   };
// }

  getStudentDashboard(){
    let userId = localStorage.getItem('id');
    this.settingsService.getStudentDashboard(userId).subscribe(response => {
      this.dashboard = response.data.docs[1];
      this.setBudgetChart();
      this.setActualChart();
    })
  }

  setBudgetChart() {
    if (this.dashboard.content[6].viewType == 'Bar Chart') {
      this.isBudgetBar = true;
      this.budgetBarChart();
    } else if (this.dashboard.content[6].viewType == 'Pie Chart') {
      this.isBudgetPie = true;
      this.budgetPieChart();
    }
    else if (this.dashboard.content[6].viewType == 'Line Chart') {
      this.isBudgetLine = true;
      this.budgetLineChart();
    }
  }

  setActualChart() {
    if (this.dashboard.content[7].viewType == 'Bar Chart') {
      this.isActualBar = true;
      this.actualBarChart();
    } else if (this.dashboard.content[7].viewType == 'Pie Chart') {
      this.isActualPie = true;
      this.actualPieChart();
    }
    else if (this.dashboard.content[7].viewType == 'Line Chart') {
      this.isActualLine = true;
      this.actualLineChart();
    }
  }
}
