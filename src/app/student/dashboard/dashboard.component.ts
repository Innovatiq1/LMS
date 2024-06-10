import { Component, OnInit, ViewChild } from '@angular/core';
import { ClassService } from 'app/admin/schedule-class/class.service';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexYAxis,
  ApexStroke,
  ApexTooltip,
  ApexDataLabels,
  ApexPlotOptions,
  ApexResponsive,
  ApexGrid,
  ApexLegend,
  ApexFill,
} from 'ng-apexcharts';
import { LeaveRequestService } from '../leave-request/leave-request.service';
import { LeaveService } from '@core/service/leave.service';
import { AnnouncementService } from '@core/service/announcement.service';
import { StudentNotificationComponent } from '@shared/components/student-notification/student-notification.component';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { AppConstants } from '@shared/constants/app.constants';
export type barChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  responsive: ApexResponsive[];
  xaxis: ApexXAxis;
  grid: ApexGrid;
  legend: ApexLegend;
  fill: ApexFill;
};

export type areaChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  dataLabels: ApexDataLabels;
  legend: ApexLegend;
  grid: ApexGrid;
  colors: string[];
};

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  registeredCourses: any;
  @ViewChild('chart') chart!: ChartComponent;
  public barChartOptions!: Partial<barChartOptions>;
  public areaChartOptions!: Partial<areaChartOptions>;

  breadscrums = [
    {
      title: 'Dashboard',
      items: ['Student'],
      active: 'Dashboard',
    },
  ];
  studentName: string;
  approvedCourses: any;
  registeredPrograms: any;
  approvedPrograms: any;
  completedCourses: any;
  completedPrograms : any;
  studentApprovedClasses: any;
  studentApprovedPrograms: any;
  approvedLeaves: any;
  announcements: any;
  upcomingCourseClasses: any;
  upcomingProgramClasses: any;
  withdrawCourses: any;
  withdrawPrograms: any;
  constructor(private classService: ClassService,private leaveService: LeaveService,
    private announcementService:AnnouncementService, private snackBar: MatSnackBar,) {
    let user=JSON.parse(localStorage.getItem('currentUser')!);
    this.studentName = user?.user?.name;
    this.getRegisteredAndApprovedCourses()
  }

  getRegisteredAndApprovedCourses(){
    let studentId=localStorage.getItem('id')
    const payload = { studentId: studentId, status: 'approved' ,isAll:true};
    this.classService.getStudentRegisteredClasses(payload).subscribe(response =>{
      this.approvedCourses = response?.data?.docs?.length
    })
    const payload2 = { studentId: studentId, status: 'withdraw' ,isAll:true};
    this.classService.getStudentRegisteredClasses(payload2).subscribe(response =>{
      this.withdrawCourses = response?.data?.length
    })

    const payload1 = { studentId: studentId, status: 'registered' ,isAll:true};
    this.classService.getStudentRegisteredClasses(payload1).subscribe(response =>{
      this.registeredCourses = response?.data?.docs?.length
      this.getRegisteredAndApprovedPrograms()
    })
    const payload3 = { studentId: studentId, status: 'completed' ,isAll:true};
    this.classService.getStudentRegisteredClasses(payload3).subscribe(response =>{
      this.completedCourses = response?.data?.docs?.length
    })

  }
  getRegisteredAndApprovedPrograms(){
    let studentId=localStorage.getItem('id')
    const payload = { studentId: studentId, status: 'registered' ,isAll:true};
    this.classService.getStudentRegisteredProgramClasses(payload).subscribe(response =>{
      this.registeredPrograms = response?.data?.docs?.length
      const payload1 = { studentId: studentId, status: 'approved' ,isAll:true};
      this.classService.getStudentRegisteredProgramClasses(payload1).subscribe(response =>{
        this.approvedPrograms = response?.data?.docs?.length
        const payload3 = { studentId: studentId, status: 'completed' ,isAll:true};
      this.classService.getStudentRegisteredProgramClasses(payload3).subscribe(response =>{
        this.completedPrograms = response?.data?.docs?.length
        const payload2 = { studentId: studentId, status: 'withdraw' ,isAll:true};
        this.classService.getStudentRegisteredProgramClasses(payload2).subscribe(response =>{
          this.withdrawPrograms = response?.data?.length
          this.chart1();

        })
        this.doughnutChartData= {
          labels: this.doughnutChartLabels,
          datasets: [
            {
              data: [this.registeredCourses, this.approvedCourses, this.registeredPrograms, this.approvedPrograms, this.completedCourses, this.completedPrograms],
              backgroundColor: ['#5A5FAF', '#F7BF31', '#EA6E6C', '#28BDB8', '#73af5a', '#af5a79'],
            },
          ],
        };
      })
    })
    })
  }
  getApprovedCourse(){
    let studentId=localStorage.getItem('id')
    const payload = { studentId: studentId, status: 'approved' ,isAll:true};
    this.classService.getStudentRegisteredClasses(payload).subscribe(response =>{
     this.studentApprovedClasses = response.data.docs.slice(0,5);
     const currentDate = new Date();
     const currentMonth = currentDate.getMonth();
     const currentYear = currentDate.getFullYear();
     const tomorrow = new Date(currentYear, currentMonth, currentDate.getDate() + 1);
     this.upcomingCourseClasses = this.studentApprovedClasses.filter((item:any) => {
      const sessionStartDate = new Date(item.classId.sessions[0].sessionStartDate);
      return (
        sessionStartDate >= tomorrow
      );
    });
    })
  }
  getApprovedProgram(){
    let studentId=localStorage.getItem('id')
    const payload = { studentId: studentId, status: 'approved',isAll:true };
    this.classService.getStudentRegisteredProgramClasses(payload).subscribe(response =>{
     this.studentApprovedPrograms= response.data.docs.slice(0,5);
     const currentDate = new Date();
     const currentMonth = currentDate.getMonth();
     const currentYear = currentDate.getFullYear();
     const tomorrow = new Date(currentYear, currentMonth, currentDate.getDate() + 1);
     this.upcomingProgramClasses = this.studentApprovedPrograms.filter((item:any) => {
      const sessionStartDate = new Date(item.classId.sessions[0].sessionStartDate);
      return (
        sessionStartDate >= tomorrow
      );
    });

    })
  }
  getApprovedLeaves(){
    let studentId=localStorage.getItem('id')
    const payload = { studentId: studentId, status: 'approved' ,isAll:true};
    this.leaveService.getAllLeavesByStudentId(payload).subscribe(response =>{
     this.approvedLeaves = response.data.slice(0,5);
    })
  }
  getAnnouncementForStudents(filter?: any) {
    let payload ={
      announcementFor: AppConstants.STUDENT_ROLE
    }
    this.announcementService.getAnnouncementsForStudents(payload).subscribe((res: { data: { data: any[]; }; totalRecords: number; }) => {
      this.announcements = res.data
    })
  }




  public doughnutChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
  };
  public doughnutChartLabels: string[] = [
    'Registered Courses',
    'Approved Courses',
    'Registered Programs ',
    'Approved Programs',
    'Completed Courses' , 
    'Completed Programs'
  ];
  public doughnutChartData!: ChartData<'doughnut'>
  public doughnutChartType: ChartType = 'doughnut';

  // Doughnut chart end
  // showNotification(
  //   colorName: string,
  //   placementFrom: MatSnackBarVerticalPosition,
  //   placementAlign: MatSnackBarHorizontalPosition
  // ) {
  //   this.snackBar.openFromComponent(StudentNotificationComponent, {
  //     duration: 20000,
  //     verticalPosition: placementFrom,
  //     horizontalPosition: placementAlign,
  //     panelClass: colorName,
  //   });
  // }
  ngOnInit() {

    // this.snackBar.openFromComponent( StudentNotificationComponent, {
    //   // duration: 5000,
    //   panelClass: ['blue-snackbar'],
    //   horizontalPosition: 'end',
    //   verticalPosition:'bottom'
    // })
    // this.showNotification(
    //         'blue-snackbar',
    //         'bottom',
    //         'right'
    //       );


    this.chart2();
    this.getApprovedCourse();
    this.getApprovedProgram();
    this.getApprovedLeaves();
    this.getAnnouncementForStudents();
    }

  private chart1() {
    this.areaChartOptions = {
      series: [
        {
          name: 'Registered',
          data: [this.registeredCourses, this.registeredPrograms],
        },
        {
          name: 'Approved',
          data: [this.approvedCourses,this.approvedPrograms],
        },
        {
          name: 'Completed',
          data: [this.completedCourses,this.completedPrograms],
        },
        {
          name: 'Cancelled',
          data: [this.withdrawCourses,this.withdrawPrograms],
        },

      ],
      chart: {
        height: 350,
        type: 'area',
        toolbar: {
          show: false,
        },
        foreColor: '#9aa0ac',
      },
      colors: ['#FFA500', '#3d3','#d33'],
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth',
      },
      xaxis: {
        categories: [
          'Courses',
          'Programs',
        ],
      },
      grid: {
        show: true,
        borderColor: '#9aa0ac',
        strokeDashArray: 1,
      },
      legend: {
        show: true,
        position: 'top',
        horizontalAlign: 'center',
        offsetX: 0,
        offsetY: 0,
      },
    };
  }

  private chart2() {
    this.barChartOptions = {
      series: [
        {
          name: 'Physics',
          data: [44, 55, 41, 67, 22, 43],
        },
        {
          name: 'Computer',
          data: [13, 23, 20, 8, 13, 27],
        },
        {
          name: 'Management',
          data: [11, 17, 15, 15, 21, 14],
        },
        {
          name: 'Mathes',
          data: [21, 7, 25, 13, 22, 8],
        },
      ],
      chart: {
        type: 'bar',
        height: 330,
        foreColor: '#9aa0ac',
        stacked: true,
        toolbar: {
          show: false,
        },
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: {
              position: 'bottom',
              offsetX: -10,
              offsetY: 0,
            },
          },
        },
      ],
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '20%',
        },
      },
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        type: 'category',
        categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      },
      legend: {
        show: false,
      },
      grid: {
        show: true,
        borderColor: '#9aa0ac',
        strokeDashArray: 1,
      },
      fill: {
        opacity: 1,
        colors: ['#25B9C1', '#4B4BCB', '#EA9022', '#9E9E9E'],
      },
    };
  }
}
