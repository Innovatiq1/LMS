import { UsersModel } from '@core/models/user.model';
import { LecturesService } from 'app/teacher/lectures/lectures.service';
import * as moment from 'moment';
import { CoursePaginationModel, MainCategory, SubCategory } from '@core/models/course.model';

import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenService } from '@core/service/authen.service';
import { CourseService } from '@core/service/course.service';
import { InstructorService } from '@core/service/instructor.service';
import { StudentService } from '@core/service/student.service';
import { UserService } from '@core/service/user.service';
import { ClassService } from 'app/admin/schedule-class/class.service';
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
import { LeaveService } from '@core/service/leave.service';
import { AnnouncementService } from '@core/service/announcement.service';
import { SettingsService } from '@core/service/settings.service';
import { StudentPaginationModel } from '@core/models/class.model';
import { AssessmentQuestionsPaginationModel } from '@core/models/assessment-answer.model';
import { SurveyService } from 'app/admin/survey/survey.service';
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

//Instructor
export type avgLecChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  markers: ApexMarkers;
  colors: string[];
  yaxis: ApexYAxis;
  grid: ApexGrid;
  tooltip: ApexTooltip;
  legend: ApexLegend;
  fill: ApexFill;
  title: ApexTitleSubtitle;
};

export type pieChartOptions = {
  series: ApexAxisChartSeries | ApexNonAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions?: ApexPlotOptions;
  responsive: ApexResponsive[];
  labels?: string[];
  legend: ApexLegend;
  fill: ApexFill;
  colors: string[];
};
export type pieChartOptions1 = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  legend: ApexLegend;
  dataLabels: ApexDataLabels;
  responsive: ApexResponsive[];
  labels: string[];
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
  selector: 'app-manager-dashboard',
  templateUrl: './manager-dashboard.component.html',
  styleUrls: ['./manager-dashboard.component.scss']
})
export class ManagerDashboardComponent {
  @ViewChild('chart') chart!: ChartComponent;
  @Input() sharedashboards!: any;
  public areaChartOptions!: Partial<chartOptions>;
  public performanceBarChartOptions!: Partial<chartOptions>;
  public pieChart1Options!: Partial<pieChart1Options>;
  public lineChartOptions!: Partial<lineChartOptions>;
  public surveyBarChartOptions!: Partial<chartOptions>;
  public surveyPieChartOptions!: Partial<pieChart1Options>;
  public performanceRateChartOptions!: Partial<chartOptions>;
  public attendanceBarChartOptions!: Partial<chartOptions>;
  public attendancePieChartOptions!: Partial<pieChart1Options>;
  public polarChartOptions!: Partial<chartOptions>;
  public usersLineChartOptions!: Partial<lineChartOptions>;
  public usersBarChartOptions!: Partial<chartOptions>;
  public studentPieChartOptions!: Partial<pieChart1Options>;
  public studentBarChartOptions!: Partial<chartOptions>;
  public studentLineChartOptions!: Partial<lineChartOptions>;
  registeredCourses: any;
  public avgLecChartOptions!: Partial<avgLecChartOptions>;
  public pieChartOptions!: Partial<pieChartOptions>;
  public pieChartOptions1!: Partial<pieChartOptions>;
  UsersModel!: Partial<UsersModel>;
  // breadscrums = [
  //   {
  //     title: 'Dashboad',
  //     items: ['Dashboad'],
  //     active: 'IT Manager Dashboard',
  //   },
  // ];
  //Student
  studentName!: string;
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

  //End Student

  //instructor
  latestInstructor: any;
  dataSource1: any;
  programData: any;
  currentRecords: any;
  currentWeekRecords: any;
  dataSource: any[] = [];
  programFilterData: any[] = [];
  //series:any
  //labels: any
  programLabels: string[] = [];
  programSeries: number[] = [];
  labels: string[] = [];
  series: number[] = [];
  currentProgramRecords: any;
  currentProgramWeekRecords: any;
  upcomingCourses: any;
  programList: any;
  upcomingPrograms: any;
  courseData: any;
  coursePaginationModel!: Partial<CoursePaginationModel>;
  mainCategories!: MainCategory[];
  subCategories!: SubCategory[];
  allSubCategories!: SubCategory[];
  classesList: any;
  instructorCount: any;
  adminCount: any;
  studentCount: any;
  filterName='';
  isCourseBar: boolean = false;
  public courseBarChartOptions!: Partial<chartOptions>;
  // count: any;
  //instructor
  count: any;
  instructors: any;
  students: any;
  newStudents: any;
  oldStudents: any;
  twoMonthsStudents: any;
  fourMonthsStudents: any;
  twoMonthsAgoStudents: any;
  fourMonthsAgoStudents: any;
  sixMonthsAgoStudents: any;
  twelveMonthsAgoStudents: any;
  tenMonthsAgoStudents: any;
  eightMonthsAgoStudents: any;
  monthsAgoStudents: any;
  tillPreviousTwoMonthsStudents: any;
  tillPreviousFourMonthsStudents: any;
  tillPreviousSixMonthsStudents: any;
  tillPreviousEightMonthsStudents: any;
  tillPreviousTenMonthsStudents: any;
  tillPreviousTwelveMonthsStudents: any;
  // classesList: any;
  // instructorCount: any;
  // adminCount: any;
  // studentCount: any;
  isStudent: boolean = true;
  dbForm!: FormGroup;
  tmsUrl: boolean;
  lmsUrl: boolean;
  isAdmin: boolean = false;
  isStudentDB: boolean = false;
  isInstructorDB: boolean = false;
  isTADB: boolean = false;
  issupervisorDB: boolean = false;
  isHodDB: boolean = false;
  isTCDB: boolean = false;
  isCMDB: boolean = false;
  isPCDB: boolean = false;
  dashboard: any;
  // viewType: any;
  isBar: boolean = false;
  isPie: boolean = false;
  isLine: boolean = false;
  isList: boolean = false;
  isArea: boolean = false;
  isSurveyPie: boolean = false;
  isSurveyBar: boolean = false;
  isAttendanceLine: boolean = false;
  isAttendancePie: boolean = false;
  isAttendanceBar: boolean = false;
  isUsersLine: boolean = false;
  isUsersBar: boolean = false;
  isUsersPie: boolean = false;
  isStudentPie: boolean = false;
  isStudentBar: boolean = false;
  isStudentLine: boolean = false;
  studentDashboard: any;
  programClassList: any;
  totalDocs: any;
  docs: any;
  classList: any;
  officersCount: any;
  managersCount: any;
  officers: any;
  managers: any;
  feedbackCount: any;
  feedbacks: any;
  staff: any;
  staffCount: any;
  studentPaginationModel: StudentPaginationModel;
  assessmentPaginationModel!: Partial<AssessmentQuestionsPaginationModel>;
  completedClasses: any;
  totalItems: any;

  constructor(
    private courseService: CourseService,
    private userService: UserService,
    private instructorService: InstructorService,
    private classService: ClassService,
    private router: Router,
    private studentService: StudentService,
    private fb: UntypedFormBuilder,private announcementService:AnnouncementService,
    private authenticationService:AuthenService,private leaveService: LeaveService,
    public lecturesService: LecturesService,
    private settingsService: SettingsService, public surveyService: SurveyService,
  ) {
    //constructor
    this.studentPaginationModel = {} as StudentPaginationModel;
    this.assessmentPaginationModel = {};
    let urlPath = this.router.url.split('/')
    this.tmsUrl = urlPath.includes('TMS');
    this.lmsUrl = urlPath.includes('LMS');
    this.getCount();
    // this.getInstructorsList();
    this.getStudentsList();
    this.chart2();
    this.attendanceLineChart();
    this.dbForm = this.fb.group({
      title1: ['Latest Enrolled Programs', [Validators.required]],
      view1: ['List-view', [Validators.required]],
      percent1: ['50', [Validators.required]],
      title2: ['Latest Enrolled Courses', [Validators.required]],
      view2: ['List-view', [Validators.required]],
      percent2: ['50', [Validators.required]],
      title3: ['Announcement Board', [Validators.required]],
      view3: ['List-view', [Validators.required]],
      percent3: ['30', [Validators.required]],
      title4: ['Rescheduled List', [Validators.required]],
      view4: ['List-view', [Validators.required]],
      percent4: ['70', [Validators.required]],
      title5: ['Upcoming Program Classes', [Validators.required]],
      view5: ['List-view', [Validators.required]],
      percent5: ['50', [Validators.required]],
      title6: ['Upcoming Course classes', [Validators.required]],
      view6: ['List-view', [Validators.required]],
      percent6: ['50', [Validators.required]],
    });

    //Student
    let user=JSON.parse(localStorage.getItem('currentUser')!);
    this.studentName = user?.user?.name;
    this.getRegisteredAndApprovedCourses();
    //Student End
  }

  getCount() {
    let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
    this.courseService.getCount(userId).subscribe((response) => {
      this.count = response?.data;
    });
  }

  getRegisteredAndApprovedCourses(){
    let studentId=localStorage.getItem('id')
    const payload = { studentId: studentId, status: 'approved' ,isAll:true};
    this.classService.getStudentRegisteredClasses(payload).subscribe(response =>{
      this.approvedCourses = response?.data?.length
    })
    const payload2 = { studentId: studentId, status: 'withdraw' ,isAll:true};
    this.classService.getStudentRegisteredClasses(payload2).subscribe(response =>{
      this.withdrawCourses = response?.data?.length
    })

    const payload1 = { studentId: studentId, status: 'registered' ,isAll:true};
    this.classService.getStudentRegisteredClasses(payload1).subscribe(response =>{
      this.registeredCourses = response?.data?.length
      this.getRegisteredAndApprovedPrograms()
    })
    const payload3 = { studentId: studentId, status: 'completed' ,isAll:true};
    this.classService.getStudentRegisteredClasses(payload3).subscribe(response =>{
      this.completedCourses = response?.data?.length
    })

  }
  getRegisteredAndApprovedPrograms(){
    let studentId=localStorage.getItem('id')
    const payload = { studentId: studentId, status: 'registered' ,isAll:true};
    this.classService.getStudentRegisteredProgramClasses(payload).subscribe(response =>{
      this.registeredPrograms = response?.data?.length
      const payload1 = { studentId: studentId, status: 'approved' ,isAll:true};
      this.classService.getStudentRegisteredProgramClasses(payload1).subscribe(response =>{
        this.approvedPrograms = response?.data?.length
        const payload3 = { studentId: studentId, status: 'completed' ,isAll:true};
      this.classService.getStudentRegisteredProgramClasses(payload3).subscribe(response =>{
        this.completedPrograms = response?.data?.length
        const payload2 = { studentId: studentId, status: 'withdraw' ,isAll:true};
        this.classService.getStudentRegisteredProgramClasses(payload2).subscribe(response =>{
          this.withdrawPrograms = response?.data?.length
          this.studentPieChart();
          this?.studentBarChart();
          this?.studentLineChart();
          this.setSurveyChart();

        })
        // this.pieChartData= {
        //   labels: this.pieChartLabels,
        //   datasets: [
        //     {
        //       data: [this.registeredCourses, this.approvedCourses, this.registeredPrograms, this.approvedPrograms, this.completedCourses, this.completedPrograms],
        //       backgroundColor: ['#5A5FAF', '#F7BF31', '#EA6E6C', '#28BDB8', '#73af5a', '#af5a79'],
        //     },
        //   ],
        // };

        // this.barChartData= {
        //   labels: this.barChartLabels,
        //   datasets: [
        //     {
        //       data: [this.registeredCourses, this.approvedCourses, this.registeredPrograms, this.approvedPrograms, this.completedCourses, this.completedPrograms],
        //       backgroundColor: ['#5A5FAF', '#F7BF31', '#EA6E6C', '#28BDB8', '#73af5a', '#af5a79'],
        //     },
        //   ],
        // };
      })
    })
    })
  }
  getApprovedCourse(){
    let studentId=localStorage.getItem('id')
    const payload = { studentId: studentId, status: 'approved' ,isAll:true};
    this.classService.getStudentRegisteredClasses(payload).subscribe(response =>{
     this.studentApprovedClasses = response.data;
     const currentDate = new Date();
     const currentMonth = currentDate.getMonth();
     const currentYear = currentDate.getFullYear();
     const tomorrow = new Date(currentYear, currentMonth, currentDate.getDate() + 1);
     this.upcomingCourseClasses = this.studentApprovedClasses.filter((item:any) => {
      const sessionStartDate = new Date(item.classId?.sessions[0]?.sessionStartDate);
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
     this.studentApprovedPrograms= response.data;
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
      announcementFor:'Student'
    }
    this.announcementService.getAnnouncementsForStudents(payload).subscribe((res: { data: { data: any[]; }; totalRecords: number; }) => {
      this.announcements = res.data
    })
  }
  getStudentsList() {
    let payload = {
      type: 'Staff',
    };
    this.instructorService.getInstructor(payload).subscribe(
      (response: any) => {
        this.students = response.slice(0, 5);
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        const twoMonthsAgoStart = new Date(currentYear, currentMonth - 2, 1);
        const twoMonthsAgoEnd = currentDate;

        const fourMonthsAgoStart = new Date(currentYear, currentMonth - 4, 1);
        const fourMonthsAgoEnd = new Date(currentYear, currentMonth - 2, 0);

        const sixMonthsAgoStart = new Date(currentYear, currentMonth - 6, 1);
        const sixMonthsAgoEnd = new Date(currentYear, currentMonth - 4, 0);

        const eightMonthsAgoStart = new Date(currentYear, currentMonth - 8, 1);
        const eightMonthsAgoEnd = new Date(currentYear, currentMonth - 6, 0);

        const tenMonthsAgoStart = new Date(currentYear, currentMonth - 10, 1);
        const tenMonthsAgoEnd = new Date(currentYear, currentMonth - 8, 0);

        const twelveMonthsAgoStart = new Date(
          currentYear,
          currentMonth - 12,
          1
        );
        const twelveMonthsAgoEnd = new Date(currentYear, currentMonth - 10, 0);

        const monthsAgo = new Date(currentYear, currentMonth - 12, 1);
        const twoMonths = new Date(currentYear, currentMonth - 2, 0);
        const fourMonths = new Date(currentYear, currentMonth - 4, 0);
        const sixMonths = new Date(currentYear, currentMonth - 6, 0);
        const eightMonths = new Date(currentYear, currentMonth - 8, 0);
        const tenMonths = new Date(currentYear, currentMonth - 10, 0);
        const twelveMonths = new Date(currentYear, currentMonth - 12, 0);

        this.tillPreviousTwoMonthsStudents = response.filter(
          (item: { createdAt: string | number | Date }) => {
            const createdAtDate = new Date(item.createdAt);
            return createdAtDate >= monthsAgo && createdAtDate <= twoMonths;
          }
        );

        this.tillPreviousFourMonthsStudents = response.filter(
          (item: { createdAt: string | number | Date }) => {
            const createdAtDate = new Date(item.createdAt);
            return createdAtDate >= monthsAgo && createdAtDate <= fourMonths;
          }
        );

        this.tillPreviousSixMonthsStudents = response.filter(
          (item: { createdAt: string | number | Date }) => {
            const createdAtDate = new Date(item.createdAt);
            return createdAtDate >= monthsAgo && createdAtDate <= sixMonths;
          }
        );

        this.tillPreviousEightMonthsStudents = response.filter(
          (item: { createdAt: string | number | Date }) => {
            const createdAtDate = new Date(item.createdAt);
            return createdAtDate >= monthsAgo && createdAtDate <= eightMonths;
          }
        );

        this.tillPreviousTenMonthsStudents = response.filter(
          (item: { createdAt: string | number | Date }) => {
            const createdAtDate = new Date(item.createdAt);
            return createdAtDate >= monthsAgo && createdAtDate <= tenMonths;
          }
        );

        this.tillPreviousTwelveMonthsStudents = response.filter(
          (item: { createdAt: string | number | Date }) => {
            const createdAtDate = new Date(item.createdAt);
            return createdAtDate >= monthsAgo && createdAtDate <= twelveMonths;
          }
        );

        // Filtered students who joined in the specified time periods
        this.twoMonthsAgoStudents = response.filter(
          (item: { createdAt: string | number | Date }) => {
            const createdAtDate = new Date(item.createdAt);
            return (
              createdAtDate >= twoMonthsAgoStart &&
              createdAtDate <= twoMonthsAgoEnd
            );
          }
        );

        this.fourMonthsAgoStudents = response.filter(
          (item: { createdAt: string | number | Date }) => {
            const createdAtDate = new Date(item.createdAt);
            return (
              createdAtDate >= fourMonthsAgoStart &&
              createdAtDate <= fourMonthsAgoEnd
            );
          }
        );

        this.sixMonthsAgoStudents = response.filter(
          (item: { createdAt: string | number | Date }) => {
            const createdAtDate = new Date(item.createdAt);
            return (
              createdAtDate >= sixMonthsAgoStart &&
              createdAtDate <= sixMonthsAgoEnd
            );
          }
        );
        this.eightMonthsAgoStudents = response.filter(
          (item: { createdAt: string | number | Date }) => {
            const createdAtDate = new Date(item.createdAt);
            return (
              createdAtDate >= eightMonthsAgoStart &&
              createdAtDate <= eightMonthsAgoEnd
            );
          }
        );
        this.tenMonthsAgoStudents = response.filter(
          (item: { createdAt: string | number | Date }) => {
            const createdAtDate = new Date(item.createdAt);
            return (
              createdAtDate >= tenMonthsAgoStart &&
              createdAtDate <= tenMonthsAgoEnd
            );
          }
        );
        this.twelveMonthsAgoStudents = response.filter(
          (item: { createdAt: string | number | Date }) => {
            const createdAtDate = new Date(item.createdAt);
            return (
              createdAtDate >= twelveMonthsAgoStart &&
              createdAtDate <= twelveMonthsAgoEnd
            );
          }
        );
        this.chart1();
        this.surveyPieChart();
        this.surveyBarChart();
      },
      (error) => {}
    );
  }



  ngOnInit() {

    this.getClassList();
    const role = this.authenticationService.currentUserValue.user.role;
 
    
//Student
    this.getStaffList();
    // this.getSurveyList();
    this.getAllSurveys();
    this.performancePieChart();
    this.getApprovedCourse();
    this.getApprovedProgram();
    this.getApprovedLeaves();
    this.getAnnouncementForStudents();

    //Instructor
    this.chart1Ins();
    // this.chart2Ins();
    this.instructorData();
    this.getProgramList();
    this.getAllCourse();
    // this.getCountIns();
    this.getCompletedClasses();
    this.courseBarChart();
  }
  
  getClassList() {
    let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
    console.log(userId);
    this.classService.getClassListByCompanyId(userId).subscribe(
      (response) => {
        console.log("docsyyy", response)
        if (response.docs) {
          this.classesList = response.docs.slice(0, 5).sort();
          this.docs = response.data.totalDocs;
        
        }
      },
      (error) => {
        console.log('error', error);
      }
    );
  }
  

  getCompletedClasses() {
    let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
        this.classService.getSessionCompletedStudent( userId,this.studentPaginationModel.page,this.studentPaginationModel.limit )
      .subscribe((response: { docs: any; page: any; limit: any; totalDocs: any }) => {
          this.completedClasses = response.docs.slice(0,5);
          console.log("completed", this.completedClasses)
        }
      );
  }

  getAllSurveys() {
    this.surveyService.getSurvey()
      .subscribe(res => {
        this.dataSource = res.data.docs;
        console.log("data", this.dataSource)
        // this.totalItems = res.data.totalDocs;
        // this.coursePaginationModel.docs = res.docs;
        // this.coursePaginationModel.page = res.page;
        // this.coursePaginationModel.limit = res.limit;
      })
  }
  private surveyLineChart() {
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
  private surveyBarChart() {
      this.surveyBarChartOptions = {
        series: [
          {
            name: 'Staff',
            data: [
              this.twoMonthsAgoStudents.length,
              this.fourMonthsAgoStudents.length,
              this.sixMonthsAgoStudents.length,
              this.eightMonthsAgoStudents.length,
              this.tenMonthsAgoStudents.length,
              this.twelveMonthsAgoStudents.length,
            ],
          },
          // {
          //   name: 'old staff',
          //   data: [
          //     this.tillPreviousTwoMonthsStudents.length,
          //     this.tillPreviousFourMonthsStudents.length,
          //     this.tillPreviousSixMonthsStudents.length,
          //     this.tillPreviousEightMonthsStudents.length,
          //     this.tillPreviousTenMonthsStudents.length,
          //     this.tillPreviousTwelveMonthsStudents.length,
          //   ],
          // },
        ],
        chart: {
          height: 350,
          type: 'bar',
          toolbar: {
            show: false,
          },
          foreColor: '#9aa0ac',
        },
        colors: ['#9F8DF1', '#E79A3B'],
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
            '2 Months',
            '4 Months',
            '6 Months',
            '8 Months',
            '10 Months',
            '12 Months',
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
            text: 'Number of Staff',
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
  
  private surveyPieChart() {
    const newStudentsData = [
      this.twoMonthsAgoStudents.length,
      this.fourMonthsAgoStudents.length,
      this.sixMonthsAgoStudents.length,
      this.eightMonthsAgoStudents.length,
      this.tenMonthsAgoStudents.length,
      this.twelveMonthsAgoStudents.length,
  ];

  // const oldStudentsData = [
  //     this.tillPreviousTwoMonthsStudents.length,
  //     this.tillPreviousFourMonthsStudents.length,
  //     this.tillPreviousSixMonthsStudents.length,
  //     this.tillPreviousEightMonthsStudents.length,
  //     this.tillPreviousTenMonthsStudents.length,
  //     this.tillPreviousTwelveMonthsStudents.length,
  // ];

  const totalNewStudents = newStudentsData.reduce((a, b) => a + b, 0);
  // const totalOldStudents = oldStudentsData.reduce((a, b) => a + b, 0);

  this.surveyPieChartOptions = {
    series: [totalNewStudents],
    chart: {
      height: 350,
      type: 'pie',
    },
    labels: ['Staff'],
    colors: ['#9F8DF1', '#E79A3B'],
    legend: {
      show: true,
      position: 'top',
      horizontalAlign: 'center',
      offsetX: 0,
      offsetY: 0,
    },
    tooltip: {
      enabled: true,
      y: {
        formatter: function (val) {
          return val + " students";
        }
      }
    },
  };

  }
  
 

  private performanceBarChart() {
    this.performanceBarChartOptions = {
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
          name: 'Maths',
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
  
  private performancePieChart() {
    const physicsData = [44, 55, 41, 67, 22, 43];
    const computerData = [13, 23, 20, 8, 13, 27];
    const managementData = [11, 17, 15, 15, 21, 14];
    const mathesData = [21, 7, 25, 13, 22, 8];
  
    const totalPhysics = physicsData.reduce((a, b) => a + b, 0);
    const totalComputer = computerData.reduce((a, b) => a + b, 0);
    const totalManagement = managementData.reduce((a, b) => a + b, 0);
    const totalMathes = mathesData.reduce((a, b) => a + b, 0);
  
    this.pieChart1Options = {
      series: [totalPhysics, totalComputer, totalManagement, totalMathes],
      chart: {
        type: 'pie',
        height: 330,
      },
      labels: ['Physics', 'Computer', 'Management', 'Maths'],
      colors: ['#25B9C1', '#4B4BCB', '#EA9022', '#9E9E9E'],
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

  private performanceLineChart() {
    this.lineChartOptions = {
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
          name: 'Maths',
          data: [21, 7, 25, 13, 22, 8],
        },
      ],
      chart: {
        type: 'line',
        height: 330,
        foreColor: '#9aa0ac',
      },
      stroke: {
        curve: 'smooth',
      },
      xaxis: {
        type: 'category',
        categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      },
      dataLabels: {
        enabled: false,
      },
      legend: {
        position: 'top',
        horizontalAlign: 'right',
        floating: true,
        offsetY: -25,
        offsetX: -5,
      },
      
      grid: {
        show: true,
        borderColor: '#9aa0ac',
        strokeDashArray: 1,
      },
      colors: ['#25B9C1', '#4B4BCB', '#EA9022', '#9E9E9E'],
    };
  }
  

  private chart1() {
    this.areaChartOptions = {
      series: [
        {
          name: 'Staff',
          data: [
            this.twoMonthsAgoStudents.length,
            this.fourMonthsAgoStudents.length,
            this.sixMonthsAgoStudents.length,
            this.eightMonthsAgoStudents.length,
            this.tenMonthsAgoStudents.length,
            this.twelveMonthsAgoStudents.length,
          ],
        },
        // {
        //   name: 'old staff',
        //   data: [
        //     this.tillPreviousTwoMonthsStudents.length,
        //     this.tillPreviousFourMonthsStudents.length,
        //     this.tillPreviousSixMonthsStudents.length,
        //     this.tillPreviousEightMonthsStudents.length,
        //     this.tillPreviousTenMonthsStudents.length,
        //     this.tillPreviousTwelveMonthsStudents.length,
        //   ],
        // },
      ],
      chart: {
        height: 350,
        type: 'area',
        toolbar: {
          show: false,
        },
        foreColor: '#9aa0ac',
      },
      colors: ['#9F8DF1', '#E79A3B'],
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth',
      },
      grid: {
        show: true,
        borderColor: '#9aa0ac',
        strokeDashArray: 1,
      },
      xaxis: {
        type: 'category',
        categories: [
          '2 Months',
          '4 Months',
          '6 Months',
          '8 Months',
          '10 Months',
          '12 Months',
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
    };
  }

  private chart2() {
    this.performanceBarChartOptions = {
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
  private attendanceLineChart() {
    this.performanceRateChartOptions = {
      series: [
        {
          name: 'Staff',
          data: [113, 120, 130, 120, 125, 119],
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
        categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        title: {
          text: 'Weekday',
        },
      },
      yaxis: {
        title: {
          text: 'Staff',
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
  private attendancePieChart() {
    this.attendancePieChartOptions = {
        series: [113, 120, 130, 120, 125, 119],
        chart: {
            width: 380,
            type: 'pie',
        },
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        colors: ['#51E298', '#FF5733', '#FFC300', '#C70039', '#900C3F', '#581845'],
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
private attendanceBarChart() {
  this.attendanceBarChartOptions = {
      series: [
          {
              name: 'Staff',
              data: [113, 120, 130, 120, 125, 119],
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
          categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
          title: {
              text: 'Weekday',
          },
      },
      yaxis: {
          title: {
              text: 'Staff',
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
      title: {
          text: 'Staff by Day',
      },
  };
}
  private usersPieChart() {
    this.polarChartOptions = {
      series2: [this.instructorCount, this.studentCount, this.adminCount],
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
      labels: ['Officers', 'Managers', 'Staff'],
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
  private usersBarChart() {
    this.usersBarChartOptions = {
      series: [
        {
            name: 'Count',
            data: [ this.instructorCount,this.studentCount,this.adminCount],
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
        categories: ['Officers','Managers','Staff'],
        title: {
            text: 'Users',
        },
    },
    yaxis: {
        title: {
            text: 'Count',
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


  private usersLineChart() {
    this.usersLineChartOptions = {
      series: [
        {
            name: 'Count',
            data: [ this.instructorCount,this.studentCount,this.adminCount],
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
        categories: ['Officers','Managers','Staff'],
        title: {
          text: 'Users',
        },
      },
      yaxis: {
        title: {
          text: 'Count',
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
      },}

  }


  private studentPieChart() {
    this.studentPieChartOptions = {
      series: [this.registeredCourses, this.approvedCourses, this.registeredPrograms, this.approvedPrograms, this.completedCourses, this.completedPrograms],
     
      chart: {
        type: 'pie',
        height: 330,
      },
      labels: ['Registered Courses', 'Approved Courses', 'Registered Programs', 'Approved Programs', 'Completed Courses', 'Completed Programs'],
      // colors: ['#25B9C1', '#4B4BCB', '#EA9022', '#9E9E9E'],
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
        data: [this.registeredCourses, this.approvedCourses, this.completedCourses]
      }, {
        name: 'Programs',
        data: [this.registeredPrograms, this.approvedPrograms, this.completedPrograms]
      }],
      chart: {
        type: 'bar',
        height: 330,
      },
      xaxis: {
        categories: ['Registered', 'Approved', 'Completed']
      },
      yaxis: {
        title: {
          text: 'Number of Courses/Programs'
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
      }, {
        name: 'Programs',
        data: [this.registeredPrograms, this.approvedPrograms, this.completedPrograms]
      }],
      chart: {
        type: 'line',
        height: 330,
      },
      xaxis: {
        categories: ['Registered', 'Approved', 'Completed']
      },
      yaxis: {
        title: {
          text: 'Number of Courses/Programs'
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
  

  aboutStudent(id: any) {
    this.router.navigate(['/student/settings/view-student'], {
      queryParams: { data: id },
    });
  }



  //Instructor
  getClassList2() {
    let instructorId = localStorage.getItem('id');
    this.lecturesService.getClassListWithPagination(instructorId, '').subscribe(
      (response) => {
        this.dataSource1 = response.data.docs;
        //this.dataSource1 = response.data.sessions;
        // this.totalItems = response.data.totalDocs
        // this.coursePaginationModel.docs = response.data.docs;
        // this.coursePaginationModel.page = response.data.page;
        // this.coursePaginationModel.limit = response.data.limit;
        //this.mapClassList()
        // this.dataSource = [];
        this.getSession();
        this.chart2();
      },
      (error) => { }
    );
  }

  getSession() {
    if (this.dataSource1) {
      this.dataSource1 &&
        this.dataSource1?.forEach((item: any, index: any) => {
          if (
            item.sessions[0] &&
            item.sessions[0]?.courseName 
          ) {
            let starttimeObject = moment(
              item.sessions[0].sessionStartTime,
              'HH:mm'
            );
            let endtimeObject = moment(item.sessions[0].sessionEndTime, "HH:mm");
            const duration = moment.duration(
              moment(item.sessions[0].sessionEndDate).diff(
                moment(item.sessions[0].sessionStartDate)
              )
            );
            let daysDifference = duration.asDays() + 1;
            this.labels.push(item.sessions[0].courseName);
            this.series?.push(daysDifference);
            this.dataSource?.push({
              courseName: item.sessions[0].courseName,
              courseCode: item.sessions[0].courseCode,
              sessionStartDate: moment(
                item.sessions[0].sessionStartDate
              ).format('YYYY-MM-DD'),
              sessionEndDate: moment(item.sessions[0].sessionEndDate).format(
                'YYYY-MM-DD'
              ),
              sessionStartTime: starttimeObject.format('hh:mm A'),
              sessionEndTime: endtimeObject.format("hh:mm A"),
              duration: daysDifference,
            });
          } else {
          }
          this.todayLecture();
          this.weekLecture();
        });
      //this.cdr.detectChanges();
      //this.myArray.push(newItem);
      //this.myArray.data = this.dataSource;
    }
    //return sessions;
  }
  getSession1() {
    if (this.programData) {
      this.programData &&
        this.programData?.forEach((item: any, index: any) => {
          if (
            item.sessions[0] &&
            item.sessions[0]?.courseName &&
            item.sessions[0]?.courseCode
          ) {
            let starttimeObject = moment(
              item.sessions[0].sessionStartTime,
              'HH:mm'
            );
        let endtimeObject = moment(item.sessions[0].sessionEndTime, "HH:mm");

            const duration = moment.duration(
              moment(item.sessions[0].sessionEndDate).diff(
                moment(item.sessions[0].sessionStartDate)
              )
            );
            let daysDifference = duration.asDays() + 1;
            this.programLabels.push(item.sessions[0].courseName);
            this.programSeries?.push(daysDifference);
            this.programFilterData?.push({
              courseName: item.sessions[0].courseName,
              courseCode: item.sessions[0].courseCode,
              instructorCost:item.instructorCost,
              duration: daysDifference,
              sessionStartDate: moment(
                item.sessions[0].sessionStartDate
              ).format('YYYY-MM-DD'),
              sessionEndDate: moment(item.sessions[0].sessionEndDate).format(
                'YYYY-MM-DD'
              ),
              sessionStartTime: starttimeObject.format('hh:mm A'),
          sessionEndTime: endtimeObject.format("hh:mm A"),
            });
          } else {
          }
          this.todayProgramLecture();
          this.weekProgramLecture();
        });
      //this.cdr.detectChanges();
      //this.myArray.push(newItem);
      //this.myArray.data = this.dataSource;
    }
    //return sessions;
  }
  todayProgramLecture() {
    if (this.programFilterData) {
      this.currentProgramRecords = this.filterRecordsByCurrentDate(
        this.programFilterData
      );
    }
  }
  weekProgramLecture() {
    if (this.programFilterData) {
      this.currentProgramWeekRecords = this.filterRecordsForCurrentWeek(
        this.programFilterData
      );
    }
  }

  todayLecture() {
    if (this.dataSource) {
      this.currentRecords = this.filterRecordsByCurrentDate(this.dataSource);
    }
  }
  weekLecture() {
    if (this.dataSource) {
      this.currentWeekRecords = this.filterRecordsForCurrentWeek(
        this.dataSource
      );
    }
  }
  filterRecordsForCurrentWeek(records: any[]) {
    const { startOfWeek, endOfWeek } = this.getCurrentWeekDates();
    return records.filter((record) => {
      const recordStartDate = new Date(record.sessionStartDate);
      const recordEndDate = new Date(record.sessionEndDate);
      return recordStartDate <= endOfWeek && recordEndDate >= startOfWeek;
    });
  }
  getCurrentWeekDates() {
    const today = new Date();
    const currentDay = today.getDay();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - currentDay + 1); // Assuming Monday is the start of the week
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // End of the week

    return { startOfWeek, endOfWeek };
  }

  filterRecordsByCurrentDate(records: any[]) {
    const currentDate = new Date(); // Get the current date
    const filteredRecords: any[] = [];

    records.forEach((record) => {
      const startDate = new Date(record.sessionStartDate); // Replace with the field that contains the start date
      const endDate = new Date(record.sessionEndDate); // Replace with the field that contains the end date

      if (currentDate >= startDate && currentDate <= endDate) {
        filteredRecords.push(record);
      }
    });

    return filteredRecords;
  }

  instructorData() {
    let payload = {
      type: 'Instructor',
    };
    this.instructorService.getInstructors(payload).subscribe(
      (response: { data: any }) => {
        this.latestInstructor = response?.data[0];
      },
      (error) => { }
    );
  }

  private chart1Ins() {
    this.avgLecChartOptions = {
      series: [
        {
          name: 'Avg. Lecture',
          data: [65, 72, 62, 73, 66, 74, 63, 67, 88, 60, 80, 70],
        },
      ],
      chart: {
        height: 350,
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
      stroke: {
        curve: 'smooth',
      },
      xaxis: {
        categories: [
          'Jan',
          'Feb',
          'March',
          'Apr',
          'May',
          'Jun',
          'July',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
        ],
        title: {
          text: 'Weekday',
        },
      },
      grid: {
        show: true,
        borderColor: '#9aa0ac',
        strokeDashArray: 1,
      },
      yaxis: {},
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'dark',
          gradientToColors: ['#35fdd8'],
          shadeIntensity: 1,
          type: 'horizontal',
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 100, 100, 100],
        },
      },
      markers: {
        size: 4,
        colors: ['#FFA41B'],
        strokeColors: '#fff',
        strokeWidth: 2,
        hover: {
          size: 7,
        },
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
  private chart2Ins() {
    this.pieChartOptions = {
      series: this.series,
      chart: {
        type: 'donut',
        width: 200,
      },
      legend: {
        show: false,
      },
      dataLabels: {
        enabled: false,
      },
      labels: this.labels,
      responsive: [
        {
          breakpoint: 480,
          options: {},
        },
      ],
    };
  }
  private chart3Ins() {
    this.pieChartOptions1 = {
      series: this.programSeries,
      chart: {
        type: 'donut',
        width: 200,
      },
      legend: {
        show: false,
      },
      dataLabels: {
        enabled: false,
      },
      labels: this.programLabels,
      responsive: [
        {
          breakpoint: 480,
          options: {},
        },
      ],
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
  private mapCategories(): void {
    this.coursePaginationModel.docs?.forEach((item) => {
      item.main_category_text = this.mainCategories.find((x) => x.id === item.main_category)?.category_name;
    });
  
    this.coursePaginationModel.docs?.forEach((item) => {
      item.sub_category_text = this.allSubCategories.find((x) => x.id === item.sub_category)?.category_name;
    });
  
  }
  getClassListIns() {
    this.classService
      .getClassListWithPagination()
      .subscribe(
        (response) => {
          
          if (response.data) {
            this.classesList = response.data.docs.slice(0,5).sort();
          }
       
        },
        (error) => {
          console.log('error', error);
        }
      );
  }
  editClassIns(id:string){
    this.router.navigate(['/admin/courses/create-class'], { queryParams: {id: id}});
  }
  deleteIns(id: string) {
    
    this.classService.getClassList({ courseId: id }).subscribe((classList: any) => {
      const matchingClasses = classList.docs.filter((classItem: any) => {
        return classItem.courseId && classItem.courseId.id === id;
      });
      if (matchingClasses.length > 0) {
        Swal.fire({
          title: 'Error',
          text: 'Class have been registered. Cannot delete.',
          icon: 'error',
        });
        return;
      }

      Swal.fire({
        title: "Confirm Deletion",
        text: "Are you sure you want to delete?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Delete",
        cancelButtonText: "Cancel",
      }).then((result) => {
        if (result.isConfirmed){
          this.classService.deleteClass(id).subscribe(() => {
            Swal.fire({
              title: 'Success',
              text: 'Class deleted successfully.',
              icon: 'success',
            });
            this.getClassList();
          });
        }
      });
     
    });
  }
  // getCountIns() {
    
  //   this.courseService.getCount().subscribe(response => {
  //     this.count = response?.data;
  //     this.instructorCount=this.count?.instructors;
  //     this.adminCount=this.count?.admins
  //     this.studentCount=this.count?.students
  //   })
       
  // }
  getAdminDashboard(){
    this.settingsService.getStudentDashboard().subscribe(response => {
    
      this.dashboard = response?.data?.docs[1];
  
      this.setPerformanceChart();
      this.setSurveyChart();
      this.setAttendanceChart();
      // this.setUsersChart();
    })
  }
  setSurveyChart() {
    if (this.dashboard.content[0].viewType == 'Bar Chart') {
      this.isSurveyBar = true;
      this.getStudentsList();
    } else if (this.dashboard.content[0].viewType == 'Pie Chart') {
      this.isSurveyPie = true;
      this.getStudentsList();
    }
    else if (this.dashboard.content[0].viewType == 'Line Chart') {
      this.isArea = true;
      this.getStudentsList();
    }
  }
  setPerformanceChart() {
    if (this.dashboard.content[1].viewType == 'Bar Chart') {
      this.isBar = true;
      this.performanceBarChart();
    } else if (this.dashboard.content[1].viewType == 'Pie Chart') {
      this.isPie = true;
      this.performancePieChart();
    }
    else if (this.dashboard.content[1].viewType == 'Line Chart') {
      this.isLine = true;
      this.performanceLineChart();
    }
  }
  setAttendanceChart() {
    if (this.dashboard.content[2].viewType == 'Bar Chart') {
      this.isAttendanceBar = true;
      this.attendanceBarChart();
    } else if (this.dashboard.content[2].viewType == 'Pie Chart') {
      this.isAttendancePie = true;
      this.attendancePieChart();
    }
    else if (this.dashboard.content[2].viewType == 'Line Chart') {
      this.isAttendanceLine = true;
      this.attendanceLineChart();
    }
  }
  



  getStaffList(filters?:any) {
    let headId = localStorage.getItem('id');
    this.userService.getUsersById( {...this.coursePaginationModel, headId}).subscribe((response: any) => {
      this.staff = response.data.docs.slice(0,5);
      this.staffCount = response.data.totalDocs;
  console.log(this.staffCount)
    }, error => {
    });
  }
  // getSurveyList(filters?:any){
  //   this.courseService.getSurvey().subscribe(response => {
  //     this.feedbackCount = response.data.docs.length;
  //     this.feedbacks = response.data.docs.slice(0,5);
  //   })
  // }

}
