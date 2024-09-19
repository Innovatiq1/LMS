import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { StudentPaginationModel } from '@core/models/class.model';
import { CoursePaginationModel } from '@core/models/course.model';
import { CourseService } from '@core/service/course.service';
import { UserService } from '@core/service/user.service';
import { ClassService } from 'app/admin/schedule-class/class.service';
import { StudentsService } from 'app/admin/students/students.service';
import { SurveyService } from 'app/admin/survey/survey.service';
import { DataTransferService } from '@shared/datatransfer'; 
import { NgZone } from '@angular/core';
import { SurveyBuilderModel } from 'app/admin/survey/survey.model';
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
import { concatMap, forkJoin, from, map } from 'rxjs';

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
  // breadscrums = [
  //   {
  //     title: 'Dashboad',
  //     items: ['Dashboad'],
  //     active: 'CEO Dashboard',
  //   },
  // ];
  @ViewChild('chart') chart!: ChartComponent;
  @Input() sharedashboards!: any;
  @Input() role: any;
  public hrPieChartOptions!: Partial<pieChart1Options>;
  public ChartOptions!: Partial<chartOptions>;
  public courseBarChartOptions!: Partial<chartOptions>;
  departmentCharts: { [key: string]: any } = {};
  courseCharts: { [key: string]: any } = {};
  isHrPie: boolean = false;
 
  isCourseBar: boolean = false;
  isCourseBarChart: boolean = false;
  dept: any;
  colorClasses = ['l-bg-orange', 'l-bg-green', 'l-bg-red', 'l-bg-purple'];
  colorsFor = ['']
  updatedDepartments: any;
  courseStatus: any;
  staff: any;
  staffCount: any;
  coursePaginationModel!: Partial<CoursePaginationModel>;
  studentPaginationModel: StudentPaginationModel;
  count: any;
  classesList: any;
  docs: any;
  studentApprovedClasses: any;
  upcomingCourseClasses: any;
  feedback: any;
  classes: any;
  allCourse: any;
  allcourseCount: any;
  courseData: any;
  constructor(private studentService: StudentsService,private cd: ChangeDetectorRef,
    private userService: UserService,public surveyService: SurveyService,
    private courseService: CourseService,private classService: ClassService,public router: Router,
    private dataTransferService: DataTransferService, private ngZone: NgZone, private ref: ChangeDetectorRef,  public _courseService: CourseService,) {
      this.studentPaginationModel = {} as StudentPaginationModel;
    }

  ngOnInit() {
    this.PieChart();
    this.hrPieChart();
    this.getDepartments();
    this.getStaffList();
    this.getClassList();
    this.getCount();
    this.getAllSurveys();
    this.getAllCourse();
    this.courseBarChart();
  }


  getAllSurveys() {
    this.surveyService.getSurveyList()
      .subscribe(res => {
        this.feedback = res.data.docs.slice(0,5);
      })
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
      

  private courseBarChart() {
    this.courseBarChartOptions = {
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
  
  

  getManagerandStaffCount(companyId: string, department: string) {
    let headId = localStorage.getItem('id') || '';

    return this.studentService.getManagerandStaffCount(companyId, department, headId).pipe(
        map((users: any[]) => {
            const managerCount = users.filter(user => user.type.includes('Manager')).length;
            const staffCount = users.filter(user => user.type.includes('Staff')).length;
            const otherCount = users.filter(user => !['Manager', 'Staff'].includes(user.type)).length;

            return {
                managerCount,
                staffCount,
                otherCount
            };
        })
    );
  }

  
  getDepartments() {
    this.studentService.getAllDepartments().subscribe((response: any) => {
      const departments = response.data.docs;
      const components = this.sharedashboards.components;
      const companyId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
      const departmentNames: string[] = [];
      const upcomingCoursesData: number[] = [];
      const ongoingCoursesData: number[] = [];
      const completedCoursesData: number[] = [];
  
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();
      const today = new Date(currentYear, currentMonth, currentDate.getDate());
  
      const requests = departments.map((dept: {
        otherCount: number; department: string; courseStatus: any; _id: any; checked: boolean; recordCount?: number; managerCount?: number; staffCount?: number; 
}) => {
        const matchingComponent = components.find((comp: { component: any; checked: boolean; }) => comp.component === dept.department);
  
        if (matchingComponent && matchingComponent.checked) {
          dept.checked = matchingComponent.checked;
          departmentNames.push(dept.department);
          this.isCourseBarChart = false;
            this.isCourseBar = true
  
          const departmentDetails$ = this.studentService.getDepartmentById(companyId, dept.department).pipe(
            map(depData => {
                const departmentCourses = depData; 
              
                const upcomingCourses = departmentCourses.filter((course: any) => {
                  if (course ) {
                    const sessionStartDate = new Date(course?.sessionStartDate);
                    return sessionStartDate >= today;
                  }
                  return false;
                });
                upcomingCoursesData.push(upcomingCourses.length || 0);
    
                const ongoingCourses = departmentCourses.filter((course: any) => {
                  if (course) {
                    const sessionStartDate = new Date(course?.sessionStartDate);
                    const sessionEndDate = new Date(course?.sessionEndDate);
                    return sessionStartDate <= currentDate && sessionEndDate >= currentDate;
                  }
                  return false;
                });
                ongoingCoursesData.push(ongoingCourses.length || 0);
    
                const completedCourses = departmentCourses.filter((course: any) => {
                  if (course) {
                    const sessionEndDate = new Date(course?.sessionEndDate);
                    return sessionEndDate < currentDate;
                  }
                  return false;
                });
                completedCoursesData.push(completedCourses.length || 0);
    
                dept.recordCount = depData.length;
            })
          );
  
          const managerStaffCount$ = this.getManagerandStaffCount(companyId, dept.department).pipe(
            map(countData => {
             
              dept.managerCount = countData.managerCount;
              dept.staffCount = countData.staffCount;
              dept.otherCount = countData.otherCount;
            })
          );
  
          const courseStatus$ = this.studentService.getCourseStatus(companyId, dept.department).pipe(
            map(status => {
              this.updateHrPieChart(this.mapCourseStatus(status), dept.department, status);
              
            })
          );
  
          return forkJoin([departmentDetails$, managerStaffCount$, courseStatus$]).toPromise();
        } else {
          dept.checked = false;
          dept.recordCount = 0;
          dept.managerCount = 0;
          dept.staffCount = 0;
          this.isCourseBarChart = true;
          this.isCourseBar = false
          return Promise.resolve();
        }
      });
  
      Promise.all(requests).then(() => {
        this.updatedDepartments = departments;
        this.dept = this.updatedDepartments.filter((dept: { checked: boolean; }) => dept.checked);
        
        this.updateBarChart(departmentNames, upcomingCoursesData, ongoingCoursesData, completedCoursesData);
      });
    });
  }
  
  

  updateBarChart(departmentNames: string[], upcomingData: number[], ongoingData: number[], completedData: number[]) {
  
    if(departmentNames.length > 0) {
      this.isCourseBar = true;
      this.isCourseBarChart = false;
    }
    this.courseBarChartOptions = {
      ...this.courseBarChartOptions,
      xaxis: {
        ...this.courseBarChartOptions?.xaxis,
        categories: departmentNames, 
      },
      series: [
        {
          name: 'Upcoming Courses',
          data: this.adjustDataLength(upcomingData, departmentNames.length),
        },
        {
          name: 'Ongoing Courses',
          data: this.adjustDataLength(ongoingData, departmentNames.length),
        },
        {
          name: 'Completed Courses',
          data: this.adjustDataLength(completedData, departmentNames.length),
        },
      ],
    };

  }
  

  adjustDataLength(data: number[], length: number): number[] {
    const adjustedData = [...data];
  
    while (adjustedData.length < length) {
      adjustedData.push(0);
    }
  
    return adjustedData;
  }

  mapCourseStatus(courseStatusData: any) {
    const enrolled = courseStatusData.filter((status: any) => status.status === 'registered').length;
    const inProgress = courseStatusData.filter((status: any) => status.status === 'approved').length;
    const completed = courseStatusData.filter((status: any) => status.status === 'completed').length;
    return { enrolled, inProgress, completed }; 
  }
  
  
  updateHrPieChart(courseStatus: { enrolled: number, inProgress: number, completed: number }, department: string, courseStatusData: any[]) {
    this.ngZone.run(() => {
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
          events: {
            dataPointSelection: (event: any, chartContext: any, config: any) => {
              const clickedIndex = config.dataPointIndex;
              let status = '';
              let filteredRecords: any[] = [];
  
              // Determine the status and filter records accordingly
              switch (clickedIndex) {
                case 0:
                  status = 'Enrolled';
                  filteredRecords = courseStatusData.filter(record => record.status === 'registered');
                  break;
                case 1:
                  status = 'In-progress';
                  filteredRecords = courseStatusData.filter(record => record.status === 'approved');
                  break;
                case 2:
                  status = 'Completed';
                  filteredRecords = courseStatusData.filter(record => record.status === 'completed');
                  break;
              }
  
              // Store filtered records in the service
              this.dataTransferService.setRecords(filteredRecords);
  
              // Navigate to the details page with department and status
              this.router.navigate(['/dashboard/chart-course-view', department, status]);
            }
          }
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
    });
  }
  
  
  
  getColorClass(index: number): string {
    return this.colorClasses[index % this.colorClasses.length];
  }

  courseList(department: string) {
    const companyId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
    this.studentService.getDepartmentById(companyId, department).subscribe((courses: any) => {
      this.router.navigate(['/dashboard/corp-course-list'], { state: { courses } });
    });
  }
  
  managerList(department: string) {
    const companyId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
    let headId = localStorage.getItem('id') || '';
    this.studentService.getManagerandStaffCount(companyId, department, headId).subscribe((managers: any) => {
      const managersList = managers.filter((user: { type: string; }) => user?.type.includes('Manager'));
      this.router.navigate(['/dashboard/corp-manager-list'], { state: { managersList } });
    });
  }
  
  staffList(department: string) {
    const companyId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
    let headId = localStorage.getItem('id') || '';
    this.studentService.getManagerandStaffCount(companyId, department,headId).subscribe((managers: any) => {
      const staff = managers.filter((user: { type: string; }) => user?.type.includes('Staff'));
      this.router.navigate(['/dashboard/corp-staff-list'], { state: { staff } });
    });
  }

  officerList(department: string){
    const companyId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
    let headId = localStorage.getItem('id') || '';
    this.studentService.getManagerandStaffCount(companyId, department,headId).subscribe((managers: any) => {
      console.log("other", managers);
      this.router.navigate(['/dashboard/officers-list'], { queryParams: { managers: JSON.stringify(managers) } });

    });
  }
 

  // manager Dashboard
  
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
          console.log("classes",this.classes)
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
      }, (error) => {
        console.error('Error fetching courses', error);
      });
  }
  
  updateChart(departments: string[], upcomingData: number[], ongoingData: number[], completedData: number[]) {
    console.log('Updating courses',departments)
    // if(departments.length > 0){
    //   this.isCourseBarChart = true;
    //   this.isCourseBar = false
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
    console.log('openCertificateInNewTab', url);
    if (url) {
      window.open(url, '_blank');
    }
  }

}
