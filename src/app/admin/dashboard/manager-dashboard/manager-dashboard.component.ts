import { UsersModel } from '@core/models/user.model';
import { LecturesService } from 'app/teacher/lectures/lectures.service';
import * as moment from 'moment';
import { CoursePaginationModel, MainCategory, SubCategory } from '@core/models/course.model';

import { ChangeDetectorRef, Component, Input, NgZone, OnInit, ViewChild } from '@angular/core';
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
import { LeaveService } from '@core/service/leave.service';
import { AnnouncementService } from '@core/service/announcement.service';
import { SettingsService } from '@core/service/settings.service';
import { StudentPaginationModel } from '@core/models/class.model';
import { AssessmentQuestionsPaginationModel } from '@core/models/assessment-answer.model';
import { SurveyService } from 'app/admin/survey/survey.service';
import { StudentsService } from 'app/admin/students/students.service';
import { DataTransferService } from '@shared/datatransfer';
import { forkJoin } from 'rxjs';
import { SurveyBuilderModel } from 'app/admin/survey/survey.model';
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
  selector: 'app-manager-dashboard',
  templateUrl: './manager-dashboard.component.html',
  styleUrls: ['./manager-dashboard.component.scss']
})
export class ManagerDashboardComponent {
  @ViewChild('chart') chart!: ChartComponent;
  @Input() sharedashboards!: any;
  coursePaginationModel!: Partial<CoursePaginationModel>;
  studentPaginationModel: StudentPaginationModel;
  staff: any;
  classes: any;
  staffCount: any;
  public hrPieChartOptions!: Partial<pieChart1Options>;
  isHrPie: boolean = false;
  count: number | undefined;
  classesList: any;
  docs: any;
  public ChartOptions!: Partial<chartOptions>;
  allCourse: any;
  allcourseCount: any;
  isCourseBarChart: boolean = false;
  isCourseBar: boolean = false;
  feedback: any;
  constructor(private studentService: StudentsService,private cd: ChangeDetectorRef,
    private userService: UserService,public surveyService: SurveyService,
    private courseService: CourseService,private classService: ClassService,public router: Router,
    private dataTransferService: DataTransferService, private ngZone: NgZone, private ref: ChangeDetectorRef,  public _courseService: CourseService,) {
      this.studentPaginationModel = {} as StudentPaginationModel;
    }

    ngOnInit() {
      this.PieChart();
      this.hrPieChart();
      this.getStaffList();
      this.getClassList();
      this.getCount();
      this.getAllSurveys();
      this.getAllCourse();
      
    }
  

    private hrPieChart() {
      this.hrPieChartOptions = {
        series2: [],
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


    private PieChart() {
    
      this.ChartOptions = {
        series: [
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
          categories: [],
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
          },
        },
      };
    }

  getStaffList(filters?: any) {
    let headId = localStorage.getItem('id');
    this.userService.getUsersById({...this.coursePaginationModel, headId}).subscribe((response: any) => {
     
      const users = response.data.docs;
      
      this.staff = users.slice(0, 5);
      let enrolledCount = 0;
      let inProgressCount = 0;
      let completedCount = 0;
      const requests = users.map((user: any) => this.userService.getCoursesById(user.id));
      forkJoin(requests).subscribe((studentClassResponses: any) => {
        studentClassResponses.forEach((studentClassResponse: any, index: number) => {
          this.classes = studentClassResponse.data.docs; 
          enrolledCount += this.classes.filter((course: any) => course.status === 'registered').length;
          inProgressCount += this.classes.filter((course: any) => course.status === 'approved').length;
          completedCount += this.classes.filter((course: any) => course.status === 'completed').length;
  
        });
  
        this.updateHrPieChart1([enrolledCount, inProgressCount, completedCount],this.classes);
  
        this.staffCount = response.data.totalDocs;
      }, error => {
        console.error('Error fetching student class data:', error);
      });
    }, error => {
      console.error('Error fetching users:', error);
    });
  }

  updateHrPieChart1(data: number[],classes:any[]) {
    this.isHrPie = true;
    this.hrPieChartOptions = {
      series2: data,
      chart: {
        type: 'pie',
        height: 350,
        events: {
          dataPointSelection: (event: any, chartContext: any, config: any) => {
            const clickedIndex = config.dataPointIndex;
              let status = '';
              let filteredRecords: any[] = [];
  
              // Determine the status and filter records accordingly
              switch (clickedIndex) {
                case 0:
                  status = 'Enrolled';
                  filteredRecords = classes.filter(record => record.status === 'registered');
                  break;
                case 1:
                  status = 'In-progress';
                  filteredRecords = classes.filter(record => record.status === 'approved');
                  break;
                case 2:
                  status = 'Completed';
                  filteredRecords = classes.filter(record => record.status === 'completed');
                  break;
              }
  
              this.router.navigate(['/dashboard/managers-pie-chart-view'], {
                queryParams: {
                  data: JSON.stringify(filteredRecords)
                }
              });
          }
        }
      },
      labels: ['Enrolled', 'In Progress', 'Completed'],
      colors: ['#6777ef', '#ff9800', '#B71180'],
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: 300
          },
          legend: {
            position: 'bottom'
          }
        }
      }]
    };
  }
  
  getCount() {
    let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
    this.courseService.getAllPrograms({...this.coursePaginationModel},userId).subscribe((response) => {
      this.count = response?.totalDocs;
    });
  }

  getClassList() {
    let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
    this.classService.getClassListByCompanyId(userId).subscribe(
      (response) => {
        if (response.docs) {
          this.classesList = response?.docs?.slice(0, 5).sort();
          this.docs = response?.data?.totalDocs;
        
        }
      },
      (error) => {
        console.log('error', error);
      }
    );
  }


  getAllCourse() {
    let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
    this._courseService
      .getAllCoursesWithoutPagination(userId)
      .subscribe((response: any) => {
        this.allCourse = response || [];
        this.allcourseCount = this.allCourse.filter((c: { status: string; }) => c.status === 'active').length;
     
        
        const upcomingCoursesData: number[] = [];
        const ongoingCoursesData: number[] = [];
        const completedCoursesData: number[] = [];
        
        const today = new Date();
        const currentDate = new Date();
        
        const departments: string[] = [...new Set(this.allCourse.map((course: any) => course.department))] as string[];
        const filteredDepartments: string[] = departments.filter(dept => dept !== undefined && dept !== null && dept !== '');
        
        filteredDepartments.forEach(dept => {
          const departmentCourses = this.allCourse.filter((course: any) => course.department === dept);
          
          const upcomingCourses = departmentCourses.filter((course: any) => {
            if (course) {
              const sessionStartDate = new Date(course.sessionStartDate);
              return sessionStartDate >= today;
            }
            return false;
          });
          upcomingCoursesData.push(upcomingCourses.length || 0);
          
          const ongoingCourses = departmentCourses.filter((course: any) => {
            if (course) {
              const sessionStartDate = new Date(course.sessionStartDate);
              const sessionEndDate = new Date(course.sessionEndDate);
              return sessionStartDate <= currentDate && sessionEndDate >= currentDate;
            }
            return false;
          });
          ongoingCoursesData.push(ongoingCourses.length || 0);
          
          const completedCourses = departmentCourses.filter((course: any) => {
            if (course) {
              const sessionEndDate = new Date(course.sessionEndDate);
              return sessionEndDate < currentDate;
            }
            return false;
          });
          completedCoursesData.push(completedCourses.length || 0);
        });
        
        this.updateChart(filteredDepartments, upcomingCoursesData, ongoingCoursesData, completedCoursesData);
        // this.isCourseBarChart = true;
      }, (error) => {
        console.error('Error fetching courses', error);
      });
  }
  
  updateChart(departments: string[], upcomingData: number[], ongoingData: number[], completedData: number[]) {
    // if(departments.length > 0){
    //   this.isCourseBarChart = true;
    // }
    this.ChartOptions = {
      ...this.ChartOptions,
      series: [
        {
          name: 'Upcoming Courses',
          data: this.adjustDataLengthBar(upcomingData, departments.length),
        },
        {
          name: 'Ongoing Courses',
          data: this.adjustDataLengthBar(ongoingData, departments.length),
        },
        {
          name: 'Completed Courses',
          data: this.adjustDataLengthBar(completedData, departments.length),
        }
      ],
      xaxis: {
        ...this.ChartOptions?.xaxis,
        categories: departments 
      }
    };
  }
  
  

  adjustDataLengthBar(data: number[], length: number): number[] {
    const adjustedData = [...data];
  
    while (adjustedData.length < length) {
      adjustedData.push(0);
    }
  
    return adjustedData;
  }
  editCall(row: SurveyBuilderModel) {
    this.router.navigate(['/admin/survey/feedbacks-list/view-survey'], {
      queryParams: { id: row },
    });
  }
  openCertificateInNewTab(url: string) {
    if (url) {
      window.open(url, '_blank');
    }
  }
  getAllSurveys() {
    this.surveyService.getSurveyList()
      .subscribe(res => {
        this.feedback = res.data.docs.slice(0,5);
      })
  }
}
