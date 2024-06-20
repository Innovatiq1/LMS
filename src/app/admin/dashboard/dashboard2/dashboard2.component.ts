import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CoursePaginationModel, MainCategory, SubCategory } from '@core/models/course.model';
import { AuthenService } from '@core/service/authen.service';
import { CourseService } from '@core/service/course.service';
import { InstructorService } from '@core/service/instructor.service';
import { SettingsService } from '@core/service/settings.service';
import { AppConstants } from '@shared/constants/app.constants';
import { ClassService } from 'app/admin/schedule-class/class.service';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexStroke,
  ApexMarkers,
  ApexYAxis,
  ApexGrid,
  ApexTooltip,
  ApexLegend,
  ApexFill,
  ApexPlotOptions,
  ApexResponsive,
  ApexTitleSubtitle,
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
@Component({
  selector: 'app-dashboard2',
  templateUrl: './dashboard2.component.html',
  styleUrls: ['./dashboard2.component.scss'],
})
export class Dashboard2Component implements OnInit,AfterViewInit {
  public admissionLineChartOptions!: Partial<chartOptions>;
  public admissionBarChartOptions!: Partial<chartOptions>;
  public admissionPieChartOptions!: Partial<pieChart1Options>;
  public feesLineChartOptions!: Partial<chartOptions>;
  public feesBarChartOptions!: Partial<chartOptions>;
  public feesPieChartOptions!: Partial<pieChart1Options>;

  breadscrums = [
    {
      title: 'Dashboad',
      items: [],
      active: 'Instructor Analytics',
    },
  ];
  instructors: any;
  tillPreviousTwoMonthsStudents: any;
  tillPreviousFourMonthsStudents: any;
  tillPreviousSixMonthsStudents: any;
  tillPreviousEightMonthsStudents: any;
  tillPreviousTenMonthsStudents: any;
  tillPreviousTwelveMonthsStudents: any;
  twoMonthsAgoInstructors: any;
  fourMonthsAgoInstructors: any;
  sixMonthsAgoInstructors: any;
  eightMonthsAgoInstructors: any;
  tenMonthsAgoInstructors: any;
  twelveMonthsAgoInstructors: any;
  todayInstructors: any;
  weekInstructors: any;
  oneMonthAgoInstructors: any;
  programList: any;
  upcomingPrograms: any;
  courseData: any;
  mainCategories!: MainCategory[];
  subCategories!: SubCategory[];
  allSubCategories!: SubCategory[];
  dataSource: any;
  coursePaginationModel!: Partial<CoursePaginationModel>;
  upcomingCourses: any;
  isAdmissionLine: boolean = false;
  isAdmissionBar: boolean = false;
  isAdmissionPie: boolean = false;
  isFeesLine: boolean = false;
  isFeesBar: boolean = false;
  isFeesPie: boolean = false;
  dashboard: any;
  commonRoles: any;
  
  constructor(private instructorService: InstructorService,
    private courseService: CourseService,
    private classService: ClassService,
    private router: Router,
    private settingsService: SettingsService,
    private authenticationService:AuthenService,
    private cdr: ChangeDetectorRef) {
    //constructor
  }

  ngOnInit() {
  //   this.getInstructorsList();
  //   this.getProgramList();
  //   this.getAllCourse();
  //   const role = this.authenticationService.currentUserValue.user.role;
  //   if (role == 'Admin') {
  //     this.getStudentDashboard();
  //   }
  //   this.cdr.detectChanges();
  }
  ngAfterViewInit(): void {
    this.commonRoles = AppConstants
    this.getInstructorsList();
    this.getProgramList();
    this.getAllCourse();
    const role = this.authenticationService.currentUserValue.user.role;
    if (role == AppConstants.ADMIN_ROLE || role ==AppConstants.ASSESSOR_ROLE) {
      this.getStudentDashboards();
    }
    this.cdr.detectChanges();
  }
  deleteItem(row: any) {
    // this.id = row.id;
    Swal.fire({
      title: "Confirm Deletion",
      text: "Are you sure you want to delete this Instructor?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    }).then((result: { isConfirmed: any; }) => {
      if (result.isConfirmed) {
        this.instructorService.deleteUser(row.id).subscribe(
          () => {
            Swal.fire({
              title: "Deleted",
              text: "Instructor deleted successfully",
              icon: "success",
            });
            this.getInstructorsList()
          },
          (error: { message: any; error: any; }) => {
            Swal.fire(
              "Failed to delete  Instructor",
              error.message || error.error,
              "error"
            );
          }
        );
      }
    });

  }

  getInstructorsList() {
    let payload = {
      type: AppConstants.INSTRUCTOR_ROLE
    }
    this.instructorService.getInstructor(payload).subscribe((response: any) => {
      this.instructors = response.slice(0, 8);
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();
      const twoMonthsAgoStart = new Date(currentYear, currentMonth - 2, 1);
      const twoMonthsAgoEnd = currentDate;

      const oneMonthAgoStart = new Date(currentYear, currentMonth - 1, 1);
      const oneMonthAgoEnd = currentDate;

      const fourMonthsAgoStart = new Date(currentYear, currentMonth - 4, 1);
      const fourMonthsAgoEnd = new Date(currentYear, currentMonth - 2, 0);

      const sixMonthsAgoStart = new Date(currentYear, currentMonth - 6, 1);
      const sixMonthsAgoEnd = new Date(currentYear, currentMonth - 4, 0);

      const eightMonthsAgoStart = new Date(currentYear, currentMonth - 8, 1);
      const eightMonthsAgoEnd = new Date(currentYear, currentMonth - 6, 0);

      const tenMonthsAgoStart = new Date(currentYear, currentMonth - 10, 1);
      const tenMonthsAgoEnd = new Date(currentYear, currentMonth - 8, 0);

      const twelveMonthsAgoStart = new Date(currentYear, currentMonth - 12, 1);
      const twelveMonthsAgoEnd = new Date(currentYear, currentMonth - 10, 0);
      this.twoMonthsAgoInstructors = response.filter((item: { createdAt: string | number | Date; }) => {
        const createdAtDate = new Date(item.createdAt);
        return (
          createdAtDate >= twoMonthsAgoStart && createdAtDate <= twoMonthsAgoEnd
        );
      });

      this.fourMonthsAgoInstructors = response.filter((item: { createdAt: string | number | Date; }) => {
        const createdAtDate = new Date(item.createdAt);
        return (
          createdAtDate >= fourMonthsAgoStart && createdAtDate <= fourMonthsAgoEnd
        );
      });

      this.sixMonthsAgoInstructors = response.filter((item: { createdAt: string | number | Date; }) => {
        const createdAtDate = new Date(item.createdAt);
        return (
          createdAtDate >= sixMonthsAgoStart && createdAtDate <= sixMonthsAgoEnd
        );
      });
      this.eightMonthsAgoInstructors = response.filter((item: { createdAt: string | number | Date; }) => {
        const createdAtDate = new Date(item.createdAt);
        return (
          createdAtDate >= eightMonthsAgoStart && createdAtDate <= eightMonthsAgoEnd
        );
      });
      this.tenMonthsAgoInstructors = response.filter((item: { createdAt: string | number | Date; }) => {
        const createdAtDate = new Date(item.createdAt);
        return (
          createdAtDate >= tenMonthsAgoStart && createdAtDate <= tenMonthsAgoEnd
        );
      });
      this.twelveMonthsAgoInstructors = response.filter((item: { createdAt: string | number | Date; }) => {
        const createdAtDate = new Date(item.createdAt);
        return (
          createdAtDate >= twelveMonthsAgoStart && createdAtDate <= twelveMonthsAgoEnd
        );
      });

      this.todayInstructors = response.filter((item: { createdAt: string | number | Date; }) => {
        const createdAtDate = new Date(item.createdAt);
        return (
          createdAtDate == currentDate
        );
      });
      const sevenDaysAgoDate = new Date(currentYear, currentMonth, currentDate.getDate() - 7);

      this.weekInstructors = response.filter((item: { createdAt: string | number | Date; }) => {
        const createdAtDate = new Date(item.createdAt);
        return (
          createdAtDate >= sevenDaysAgoDate && createdAtDate <= currentDate );
      });

      this.oneMonthAgoInstructors = response.filter((item: { createdAt: string | number | Date; }) => {
        const createdAtDate = new Date(item.createdAt);
        return (
          createdAtDate >= oneMonthAgoStart && createdAtDate <= oneMonthAgoEnd
        );
      });
      // this.chart1();
      this.setAdmissionChart();

    }, error => {
    });
  }
  private chart1() {
    this.admissionLineChartOptions = {
      series: [
        {
          name: 'Instructors',
          data: [ this.twoMonthsAgoInstructors.length,
            this.fourMonthsAgoInstructors.length,
            this.sixMonthsAgoInstructors.length,
            this.eightMonthsAgoInstructors.length,
            this.tenMonthsAgoInstructors.length,
            this.twelveMonthsAgoInstructors.length
          ],
        },
        

      ],
      chart: {
        height: 270,
        type: 'line',
        foreColor: '#9aa0ac',
        dropShadow: {
          enabled: true,
          color: '#000',
          top: 18,
          left: 7,
          blur: 10,
          opacity: 0.2,
        },
        toolbar: {
          show: false,
        },
      },
      colors: ['#9F78FF', '#858585'],
      stroke: {
        curve: 'smooth',
      },
      grid: {
        show: true,
        borderColor: '#9aa0ac',
        strokeDashArray: 1,
      },
      markers: {
        size: 3,
      },
      xaxis: {
        categories: ['Last 2 Months', '4 Months', '6 Months', '8 Months', '10 Months', '12 Months'],
        title: {
          text: 'Month',
        },
      },
      yaxis: {
        min: 0,
        max: 20,
      },
      legend: {
        position: 'top',
        horizontalAlign: 'right',
        floating: true,
        offsetY: -25,
        offsetX: -5,
      },
      tooltip: {
        theme: 'dark',
        marker: {
          show: true,
        },
        x: {
          show: true,
        },
      },
    };
  }
  getProgramList(filters?: any) {
    this.courseService.getCourseProgram({status:'active'}).subscribe(
      (response: any) => {
        this.programList = response.docs.slice(0,5);
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();  
        const tomorrow = new Date(currentYear, currentMonth, currentDate.getDate() + 1);
        this.upcomingPrograms = this.programList.filter((item: { sessionStartDate: string | number | Date; }) => {
          const sessionStartDate = new Date(item.sessionStartDate);
          return (
            sessionStartDate >= tomorrow 
          );
        });
      },
      (error) => {
      }
    );
  }
  getAllCourse(){
    this.courseService.getAllCourses({status:'active'}).subscribe(response =>{
     this.courseData = response.data.docs.slice(0,5);
     const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();  
        const tomorrow = new Date(currentYear, currentMonth, currentDate.getDate() + 1);
        this.upcomingCourses = this.courseData.filter((item: { sessionStartDate: string | number | Date; }) => {
          const sessionStartDate = new Date(item.sessionStartDate);
          return (
            sessionStartDate >= tomorrow 
          );
        });
    })
  }
  getCoursesList() {
    this.courseService.getAllCourses({status:'active'})
      .subscribe(response => {
        this.dataSource = response.data.docs;
        this.mapCategories();
      }, (error) => {
      }
      )
  }
  deleteCourse(id: string) {
    this.classService.getClassList({ courseId: id }).subscribe((classList: any) => {
      const matchingClasses = classList.docs.filter((classItem: any) => {
        return classItem.courseId && classItem.courseId.id === id;
      });
      if (matchingClasses.length > 0) {
        Swal.fire({
          title: 'Error',
          text: 'Classes have been registered with this course. Cannot delete.',
          icon: 'error',
        });
        return;
      }
      this.courseService.deleteCourse(id).subscribe(() => {
        this.getCoursesList();
        Swal.fire({
          title: 'Success',
          text: 'Course deleted successfully.',
          icon: 'success',
        });
      });
    });
  }
  private mapCategories(): void {
    this.coursePaginationModel.docs?.forEach((item) => {
      item.main_category_text = this.mainCategories.find((x) => x.id === item.main_category)?.category_name;
    });
  
    this.coursePaginationModel.docs?.forEach((item) => {
      item.sub_category_text = this.allSubCategories.find((x) => x.id === item.sub_category)?.category_name;
    });
  
  }
  aboutInstructor(id: any) {
    this.router.navigate(['/student/settings/view-instructor'], {
      queryParams: { data: id },
    });
  }

  private admissionLineChart() {
    this.admissionLineChartOptions = {
      series: [{
        name: `${AppConstants.INSTRUCTOR_ROLE}s`,
        data: [
          this.twelveMonthsAgoInstructors.length,
          this.tenMonthsAgoInstructors.length,
          this.eightMonthsAgoInstructors.length,
          this.sixMonthsAgoInstructors.length,
          this.fourMonthsAgoInstructors.length,
          this.twoMonthsAgoInstructors.length,
          this.oneMonthAgoInstructors.length,
          this.weekInstructors.length,
          this.todayInstructors.length
        ]
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
        categories: ["12 Months Ago", "10 Months Ago", "8 Months Ago", "6 Months Ago", "4 Months Ago", "2 Months Ago", "1 Month Ago", "This Week", "Today"]
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
      yaxis: { title: { text: `Number of ${AppConstants.INSTRUCTOR_ROLE}s` } },
      colors: ['#FFA500']
    };
  }

  private admissionBarChart() {
    this.admissionBarChartOptions = {
        series: [{
            name: `${AppConstants.INSTRUCTOR_ROLE}s`,
            data: [
                this.twelveMonthsAgoInstructors.length,
                this.tenMonthsAgoInstructors.length,
                this.eightMonthsAgoInstructors.length,
                this.sixMonthsAgoInstructors.length,
                this.fourMonthsAgoInstructors.length,
                this.twoMonthsAgoInstructors.length,
                this.oneMonthAgoInstructors.length,
                this.weekInstructors.length,
                this.todayInstructors.length
            ]
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
            categories: ["12 Months Ago", "10 Months Ago", "8 Months Ago", "6 Months Ago", "4 Months Ago", "2 Months Ago", "1 Month Ago", "This Week", "Today"]
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
        yaxis: { title: { text: `Number of ${AppConstants.INSTRUCTOR_ROLE}s` } },
        colors: ['#FFA500']
    };
}

private admissionPieChart() {
  this.admissionPieChartOptions = {
      series: [2, 4, 5],
      chart: {
          type: 'pie',
          height: 330,
          foreColor: '#9aa0ac',
          width: '100%',
      },
      labels: [ "1 Month Ago", "This Week", "Today"],
      colors: ['#25B9C1', '#4B4BCB', '#9E9E9E'],
      legend: {
        position: 'bottom',
    },
      tooltip: { enabled: true },
      dataLabels: { enabled: false },
      responsive: [{
          breakpoint: 480,
          options: {
              chart: {
                  width: 200
              },
              // legend: {
              //     position: 'bottom'
              // }
          }
      }]
  };
}

private feesLineChart() {
  this.feesLineChartOptions = {
    series: [
      {
        name: 'Fees Collection',
        data: [107, 268, 847],
      },
    ],
    chart: {
      height: 350,
      type: 'line',
      dropShadow: {
        enabled: true,
        color: '#000',
        top: 18,
        left: 7,
        blur: 10,
        opacity: 0.2,
      },
      foreColor: '#9aa0ac',
      toolbar: {
        show: false,
      },
    },
    colors: ['#51E298'],
    dataLabels: {
      enabled: true,
    },
    stroke: {
      curve: 'smooth',
    },
    markers: {
      size: 1,
    },
    grid: {
      show: true,
      borderColor: '#9aa0ac',
      strokeDashArray: 1,
    },
    xaxis: {
      categories: ['Today', 'This Week', 'This Month'],
      title: {
        text: 'Weekday',
      },
    },
    yaxis: {
      title: {
        text: 'Fees Collection',
      },
    },
    tooltip: {
      theme: 'dark',
      marker: {
        show: true,
      },
      // x: {
      //   show: true,
      // },
    },
  };
}
private feesPieChart() {
  this.feesPieChartOptions = {
      series: [107, 268, 847],
      chart: {
          width: 380,
          type: 'pie',
      },
      labels: ['Today', 'This Week', 'This Month'],
      colors: ['#51E298', '#FF5733', '#FFC300'],
      dataLabels: {
          enabled: true,
      },
      legend: {
          position: 'bottom',
      },
      tooltip: {
          theme: 'dark',
          marker: {
              show: true,
          },
          x: {
              show: true,
          },
      },
      // title: {
      //     text: 'Students by Day',
      // },
  };
}
private feesBarChart() {
this.feesBarChartOptions = {
    series: [
        {
            name: 'Fees Collection',
            data: [107, 268, 847]
        },
    ],
    chart: {
        height: 350,
        type: 'bar',
        dropShadow: {
            enabled: true,
            color: '#000',
            top: 18,
            left: 7,
            blur: 10,
            opacity: 0.2,
        },
        foreColor: '#9aa0ac',
        toolbar: {
            show: false,
        },
    },
    colors: ['#51E298'],
    dataLabels: {
        enabled: true,
    },
    stroke: {
        curve: 'smooth',
    },
    markers: {
        size: 1,
    },
    grid: {
        show: true,
        borderColor: '#9aa0ac',
        strokeDashArray: 1,
    },
    xaxis: {
        categories: ['Today', 'This Week', 'This Month'],
        title: {
            text: 'Weekday',
        },
    },
    yaxis: {
        title: {
            text: 'Fees Collection',
        },
    },
    tooltip: {
        theme: 'dark',
        marker: {
            show: true,
        },
        // x: {
        //     show: true,
        // },
    },
    // title: {
    //     text: 'Students by Day',
    // },
};
}
  getStudentDashboards(){
    this.settingsService.getStudentDashboard().subscribe(response => {
      this.dashboard = response.data.docs[1];
      this.setAdmissionChart();
      this.setFeesChart();
    })
  }
  setAdmissionChart() {
  if (this.dashboard?.content[4]?.viewType == 'Line Chart') {
      this.isAdmissionLine = true;
      this.admissionLineChart();
    } else  if (this.dashboard?.content[4].viewType == 'Bar Chart') {
      this.isAdmissionBar = true;
      this.admissionBarChart();
    } else  if (this.dashboard?.content[4].viewType == 'Pie Chart') {
      this.isAdmissionPie = true;
      this.admissionPieChart();
    }
  }
  setFeesChart() {
    if (this.dashboard.content[5].viewType == 'Line Chart') {
        this.isFeesLine = true;
        this.feesLineChart();
      } else  if (this.dashboard.content[5].viewType == 'Bar Chart') {
        this.isFeesBar = true;
        this.feesBarChart();
      } else  if (this.dashboard.content[5].viewType == 'Pie Chart') {
        this.isFeesPie = true;
        this.feesPieChart();
      }
    }
}
