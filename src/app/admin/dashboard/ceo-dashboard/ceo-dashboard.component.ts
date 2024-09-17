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
  public hrPieChartOptions!: Partial<pieChart1Options>;
  public areaChartOptions!: Partial<chartOptions>;
  public techincalPieChartOptions!: Partial<pieChart1Options>;
  public financePieChartOptions!: Partial<pieChart1Options>;
  public salesPieChartOptions!: Partial<pieChart1Options>;
  public courseBarChartOptions!: Partial<chartOptions>;
  departmentCharts: { [key: string]: any } = {};
  courseCharts: { [key: string]: any } = {};
  isHrPie: boolean = false;
  isTechnicalPie: boolean = false;
  isFinancePie: boolean = false;
  isSalesPie: boolean = false;
  isCourseBar: boolean = false;
  dept: any;
  colorClasses = ['l-bg-orange', 'l-bg-green', 'l-bg-red', 'l-bg-purple'];
  updatedDepartments: any;
  courseStatus: any;
  staff: any;
  staffCount: any;
  coursePaginationModel!: Partial<CoursePaginationModel>;
  studentPaginationModel: StudentPaginationModel;
  count: any;
  completedClasses: any;
  isArea: boolean = false;
  isSurveyPie: boolean = false;
  isSurveyBar: boolean = false;
  classesList: any;
  docs: any;
  studentApprovedClasses: any;
  upcomingCourseClasses: any;
  feedback: any;
  constructor(private studentService: StudentsService,private cd: ChangeDetectorRef,
    private userService: UserService,public surveyService: SurveyService,
    private courseService: CourseService,private classService: ClassService,public router: Router) {
      this.studentPaginationModel = {} as StudentPaginationModel;
    }

  ngOnInit() {
    this.getDepartments();
    // this.hrPieChart();
    this.getStaffList();
    this.getCompletedClasses();
    this.getClassList();
    this.getCount();
    this.getAllSurveys();
    this.isHrPie = true;
    this.isTechnicalPie = true;
    this.isFinancePie = true;
    this.isSalesPie = true;
    this.courseBarChart();
    this.hrPieChart()
   
  }


  getAllSurveys() {
    this.surveyService.getSurveyList()
      .subscribe(res => {
        this.feedback = res.data.docs.slice(0,5);
      })
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

  private courseBarChart() {
    this.courseBarChartOptions = {
      series: [
        {
          name: 'Upcoming Courses',
          data: [2, 1, 3, 1], // Placeholder data
        },
        {
          name: 'Ongoing Courses',
          data: [7, 5, 6, 4], // Placeholder data
        },
        {
          name: 'Completed Courses',
          data: [3, 2, 1, 1], // Placeholder data
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
        const managerCount = users.filter(user => user.type.includes('Manager')).length;
        const staffCount = users.filter(user => user.type.includes('Staff')).length;
  
        return {
          managerCount,
          staffCount
        };
      })
    );
  }


  // getDepartments() {
  //   this.studentService.getAllDepartments().subscribe((response: any) => {
  //     const departments = response.data.docs;
  //     const components = this.sharedashboards.components;
  //     const companyId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
  //     const departmentNames: string[] = [];
  //     const upcomingCoursesData: number[] = [];
  //     const ongoingCoursesData: number[] = []; 
  //     const completedCoursesData: number[] = []; 
  
  //     const requests = departments.map((dept: { department: string; courseStatus: any; _id: any; checked: boolean; recordCount?: number; managerCount?: number; staffCount?: number; }) => {
  //       const matchingComponent = components.find((comp: { component: any; checked: boolean; }) => comp.component === dept.department);
      
  //       if (matchingComponent && matchingComponent.checked) {
  //         dept.checked = matchingComponent.checked;
      
  //         departmentNames.push(dept.department);
      
  //         const departmentDetails$ = this.studentService.getDepartmentById(companyId, dept.department).pipe(
  //           map(depData => dept.recordCount = depData.length)
  //         );
      
  //         const managerStaffCount$ = this.getManagerandStaffCount(companyId, dept.department).pipe(
  //           map(countData => {
  //             dept.managerCount = countData.managerCount;
  //             dept.staffCount = countData.staffCount;
  //           })
  //         );
      
  //         const courseStatus$ = this.studentService.getCourseStatus(companyId, dept.department).pipe(
  //           map(status => {
  //             console.log("status",status);
  //             const courseStatus = this.mapCourseStatus(status);
  //             // ongoingCoursesData.push(courseStatus.inProgress || 0);  
  //             completedCoursesData.push(courseStatus.completed || 0); 
      
  //             this.updateHrPieChart(courseStatus, dept.department);
  //           })
  //         );
  //         const approvedCourses$ = this.classService.getStudentRegisteredClasses({ companyId, department: dept.department }).pipe(
  //           map(response => {
  //             const studentApprovedClasses = response.data.docs;
  //             const currentDate = new Date();
  //             const currentMonth = currentDate.getMonth();
  //             const currentYear = currentDate.getFullYear();
  //             const tomorrow = new Date(currentYear, currentMonth, currentDate.getDate() + 1);
  //             // const tomorrow = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1);
          
  //             const upcomingCourseClasses = studentApprovedClasses.filter((item: any) => {
  //               const sessionStartDate = new Date(item.classId?.sessions[0]?.sessionStartDate);
  //               return sessionStartDate >= tomorrow;
  //             });
  //             console.log("upco",upcomingCourseClasses)
  //             upcomingCoursesData.push(upcomingCourseClasses.length || 0);
          
  //             const ongoingCourseClasses = studentApprovedClasses.filter((item: any) => {
  //               const sessionStartDate = new Date(item.classId?.sessions[0]?.sessionStartDate);
  //               const sessionEndDate = new Date(item.classId?.sessions[0]?.sessionEndDate);
  //               return sessionStartDate <= currentDate && sessionEndDate >= currentDate;
  //             });
  //             console.log("onco",ongoingCourseClasses)
  //             ongoingCoursesData.push(ongoingCourseClasses.length || 0);  
  //           })
  //         );
          
      
  //         return forkJoin([departmentDetails$, managerStaffCount$, courseStatus$, approvedCourses$])?.toPromise();
  //       } else {
  //         dept.checked = false;
  //         dept.recordCount = 0;
  //         dept.managerCount = 0;
  //         dept.staffCount = 0;
      
  //         return Promise.resolve();
  //       }
  //     });
      
      
  //   Promise.all(requests).then(() => {
  //     this.updatedDepartments = departments;
  //     this.dept = this.updatedDepartments.filter((dept: { checked: boolean; }) => dept.checked);
  //     this.updateBarChart(departmentNames, upcomingCoursesData, ongoingCoursesData, completedCoursesData);
  //     this.isCourseBar = true;
  //   });
  // });
      
  // }
  
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
      const tomorrow = new Date(currentYear, currentMonth, currentDate.getDate() + 1);
  
      const requests = departments.map((dept: { department: string; courseStatus: any; _id: any; checked: boolean; recordCount?: number; managerCount?: number; staffCount?: number; }) => {
        const matchingComponent = components.find((comp: { component: any; checked: boolean; }) => comp.component === dept.department);
  
        if (matchingComponent && matchingComponent.checked) {
          dept.checked = matchingComponent.checked;
          departmentNames.push(dept.department);
  
          const departmentDetails$ = this.studentService.getDepartmentById(companyId, dept.department).pipe(
            map(depData => dept.recordCount = depData.length)
          );
  
          const managerStaffCount$ = this.getManagerandStaffCount(companyId, dept.department).pipe(
            map(countData => {
              console.log("ManagerCount",  countData)
              dept.managerCount = countData.managerCount;
              dept.staffCount = countData.staffCount;
            })
          );
  
          const courseStatus$ = this.studentService.getCourseStatus(companyId, dept.department).pipe(
            map(status => {
              console.log("status", status);
              const studentApprovedClasses = status;
              
              const upcomingCourses = studentApprovedClasses.filter((course: any) => {
                if (course.sessions && course.sessions.length > 0) {
                  const sessionStartDate = new Date(course.sessions[0]?.sessionStartDate);
                  return sessionStartDate >= tomorrow;
                }
                return false;
              });
              upcomingCoursesData.push(upcomingCourses.length || 0);
  
              const ongoingCourses = studentApprovedClasses.filter((course: any) => {
                if (course.sessions && course.sessions.length > 0) {
                  const sessionStartDate = new Date(course.sessions[0]?.sessionStartDate);
                  const sessionEndDate = new Date(course.sessions[0]?.sessionEndDate);
                  return sessionStartDate <= currentDate && sessionEndDate >= currentDate;
                }
                return false;
              });
              ongoingCoursesData.push(ongoingCourses.length || 0);
              const completedCourses = this.mapCourseStatus(status).completed;
              completedCoursesData.push(completedCourses || 0);
  
              this.updateHrPieChart(this.mapCourseStatus(status), dept.department);
            })
          );
  
          return forkJoin([departmentDetails$, managerStaffCount$, courseStatus$]).toPromise();
        } else {
          dept.checked = false;
          dept.recordCount = 0;
          dept.managerCount = 0;
          dept.staffCount = 0;
  
          return Promise.resolve();
        }
      });
  
      Promise.all(requests).then(() => {
        this.updatedDepartments = departments;
        this.dept = this.updatedDepartments.filter((dept: { checked: boolean; }) => dept.checked);
        this.updateBarChart(departmentNames, upcomingCoursesData, ongoingCoursesData, completedCoursesData);
        this.isCourseBar = true;
      });
    });
  }
  
  

  updateBarChart(departmentNames: string[], upcomingData: number[], ongoingData: number[], completedData: number[]) {
  
  
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

  courseList(department: string) {
    const companyId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
    this.studentService.getDepartmentById(companyId, department).subscribe((courses: any) => {
      this.router.navigate(['/dashboard/corp-course-list'], { state: { courses } });
    });
  }
  
  managerList(department: string) {
    const companyId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
    this.studentService.getManagerandStaffCount(companyId, department).subscribe((managers: any) => {
      const managersList = managers.filter((user: { type: string; }) => user?.type.includes('Manager'));
      this.router.navigate(['/dashboard/corp-manager-list'], { state: { managersList } });
    });
  }
  
  staffList(department: string) {
    const companyId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
    this.studentService.getManagerandStaffCount(companyId, department).subscribe((managers: any) => {
      const staff = managers.filter((user: { type: string; }) => user?.type.includes('Staff'));
      this.router.navigate(['/dashboard/corp-staff-list'], { state: { staff } });
    });
  }

 

  // manager Dashboad


  // getStaffList(filters?: any) {
  //   let headId = localStorage.getItem('id');
  //   this.userService.getUsersById({...this.coursePaginationModel, headId}).subscribe((response: any) => {
  //     const users = response.data.docs;
  //     console.log("all users", users);
  //     this.staff = users.slice(0, 5); 
      
  //     const requests = users.map((user: any) =>  this.userService.getCoursesById(user.id));
  //     forkJoin(requests).subscribe((studentClassResponses: any) => {
  //       studentClassResponses.forEach((studentClassResponse: any, index: string | number) => {
  //         console.log(`User ${users[index].id} class data:`, studentClassResponse);
  //       })
  //       this.staffCount = response.data.totalDocs;
  //     }, error => {
  //       console.error('Error fetching student class data:', error);
  //     });
  //   }, error => {
  //     console.error('Error fetching users:', error);
  //   });
  // }
  
  getStaffList(filters?: any) {
    let headId = localStorage.getItem('id');
    this.userService.getUsersById({...this.coursePaginationModel, headId}).subscribe((response: any) => {
      const users = response.data.docs;
      this.staff = users.slice(0, 5); // Limit to 5 staff members
  
      // Initialize counters for the chart
      let enrolledCount = 0;
      let inProgressCount = 0;
      let completedCount = 0;
  
      // Create requests to get the class data for each user
      const requests = users.map((user: any) => this.userService.getCoursesById(user.id));
      
      // Use forkJoin to execute all requests in parallel
      forkJoin(requests).subscribe((studentClassResponses: any) => {
        studentClassResponses.forEach((studentClassResponse: any, index: number) => {
          const classes = studentClassResponse.data.docs; // Assuming the courses data is in response.data
          console.log("classes: " , classes)
          // Calculate counts based on statuses
          enrolledCount += classes.filter((course: any) => course.status === 'registered').length;
          inProgressCount += classes.filter((course: any) => course.status === 'approved').length;
          completedCount += classes.filter((course: any) => course.status === 'completed').length;
  
          console.log(`User ${users[index].id} class data:`, studentClassResponse);
        });
  
        // Update the chart with the new data
        this.updateHrPieChart1([enrolledCount, inProgressCount, completedCount]);
  
        // Set the staff count
        this.staffCount = response.data.totalDocs;
      }, error => {
        console.error('Error fetching student class data:', error);
      });
    }, error => {
      console.error('Error fetching users:', error);
    });
  }

  updateHrPieChart1(data: number[]) {
    this.hrPieChartOptions.series2 = data; // Update the series with new data
  }
  
  getCount() {
    let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
    this.courseService.getAllPrograms({...this.coursePaginationModel},userId).subscribe((response) => {
      this.count = response?.totalDocs;
    });
  }

  getCompletedClasses() {
    let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
        this.classService.getSessionCompletedStudent( userId,this.studentPaginationModel.page,this.studentPaginationModel.limit )
      .subscribe((response: { docs: any; page: any; limit: any; totalDocs: any }) => {
          this.completedClasses = response.docs.slice(0,5);
        }
      );
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
}
