import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CourseService } from '@core/service/course.service';
import { InstructorService } from '@core/service/instructor.service';
import { StudentService } from '@core/service/student.service';
import { UserService } from '@core/service/user.service';
import { ClassService } from 'app/admin/schedule-class/class.service';
import { ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexFill, ApexGrid, ApexLegend, ApexMarkers, ApexNonAxisChartSeries, ApexPlotOptions, ApexResponsive, ApexStroke, ApexTheme, ApexTitleSubtitle, ApexTooltip, ApexXAxis, ApexYAxis, ChartComponent } from 'ng-apexcharts';
import Swal from 'sweetalert2';
import { ChartOptions } from 'chart.js';
import { DeptService } from '@core/service/dept.service';
import { CoursePaginationModel, MainCategory, SubCategory } from '@core/models/course.model';
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

@Component({
  selector: 'app-training-coordinator-db',
  templateUrl: './training-coordinator-db.component.html',
  styleUrls: ['./training-coordinator-db.component.scss']
})
export class TrainingCoordinatorDbComponent {
  @ViewChild('chart') chart!: ChartComponent;
  public areaChartOptions!: Partial<chartOptions>;
  public barChartOptions!: Partial<chartOptions>;
  public performanceRateChartOptions!: Partial<chartOptions>;
  public polarChartOptions!: Partial<chartOptions>;
  public lineChartOptions!: Partial<ChartOptions>;
  breadscrums = [
    {
      title: 'Dashboad',
      items: [],
      active: 'Training Coordinator Dashboard',
    },
  ];
  count: any;
  instructors: any;
  todayInstructors: any;
  weekInstructors: any;
  oneMonthAgoInstructors: any;
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
  classesList: any;
  instructorCount: any;
  adminCount: any;
  studentCount: any;
  departments: any;
  programList: any;
  upcomingPrograms: any;
  id?: number;
  departmentCount: any;
  courseData: any;
  mainCategories!: MainCategory[];
  subCategories!: SubCategory[];
  allSubCategories!: SubCategory[];
  dataSource: any;
  coursePaginationModel!: Partial<CoursePaginationModel>;
  upcomingCourses: any;

  constructor(private courseService: CourseService,
    private userService: UserService,
    private instructorService: InstructorService,
    private classService: ClassService,
    private router: Router,
    private studentService: StudentService,
    private deptService: DeptService,) {
    //constructor
    this.getCount();
    this.getInstructorsList();
    this.getStudentsList();
    this.chart2();
    this.chart3();


  }

  getCount() {
    let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
        this.courseService.getCount(userId).subscribe(response => {
      this.count = response?.data;
      this.instructorCount = this.count?.instructors;
      this.adminCount = this.count?.admins
      this.studentCount = this.count?.students
      this.chart4();

    })

  }
  getInstructorsList() {
    let payload = {
      type: AppConstants.INSTRUCTOR_ROLE
    }
    this.instructorService.getInstructor(payload).subscribe((response: any) => {
      this.instructors = response.slice(0, 5);
    }, error => {
    });
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

  getStudentsList() {
    let payload = {
      type: AppConstants.STUDENT_ROLE
    }
    this.instructorService.getInstructor(payload).subscribe((response: any) => {
      this.students = response.slice(0, 5)
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

      const twelveMonthsAgoStart = new Date(currentYear, currentMonth - 12, 1);
      const twelveMonthsAgoEnd = new Date(currentYear, currentMonth - 10, 0);

      const monthsAgo = new Date(currentYear, currentMonth - 12, 1);
      const twoMonths = new Date(currentYear, currentMonth - 2, 0);
      const fourMonths = new Date(currentYear, currentMonth - 4, 0);
      const sixMonths = new Date(currentYear, currentMonth - 6, 0);
      const eightMonths = new Date(currentYear, currentMonth - 8, 0);
      const tenMonths = new Date(currentYear, currentMonth - 10, 0);
      const twelveMonths = new Date(currentYear, currentMonth - 12, 0);

      this.tillPreviousTwoMonthsStudents = response.filter((item: { createdAt: string | number | Date; }) => {
        const createdAtDate = new Date(item.createdAt);
        return (
          createdAtDate >= monthsAgo && createdAtDate <= twoMonths
        );
      });

      this.tillPreviousFourMonthsStudents = response.filter((item: { createdAt: string | number | Date; }) => {
        const createdAtDate = new Date(item.createdAt);
        return (
          createdAtDate >= monthsAgo && createdAtDate <= fourMonths
        );
      });

      this.tillPreviousSixMonthsStudents = response.filter((item: { createdAt: string | number | Date; }) => {
        const createdAtDate = new Date(item.createdAt);
        return (
          createdAtDate >= monthsAgo && createdAtDate <= sixMonths
        );
      });

      this.tillPreviousEightMonthsStudents = response.filter((item: { createdAt: string | number | Date; }) => {
        const createdAtDate = new Date(item.createdAt);
        return (
          createdAtDate >= monthsAgo && createdAtDate <= eightMonths
        );
      });

      this.tillPreviousTenMonthsStudents = response.filter((item: { createdAt: string | number | Date; }) => {
        const createdAtDate = new Date(item.createdAt);
        return (
          createdAtDate >= monthsAgo && createdAtDate <= tenMonths
        );
      });

      this.tillPreviousTwelveMonthsStudents = response.filter((item: { createdAt: string | number | Date; }) => {
        const createdAtDate = new Date(item.createdAt);
        return (
          createdAtDate >= monthsAgo && createdAtDate <= twelveMonths
        );
      });

      // Filtered students who joined in the specified time periods
      this.twoMonthsAgoStudents = response.filter((item: { createdAt: string | number | Date; }) => {
        const createdAtDate = new Date(item.createdAt);
        return (
          createdAtDate >= twoMonthsAgoStart && createdAtDate <= twoMonthsAgoEnd
        );
      });

      this.fourMonthsAgoStudents = response.filter((item: { createdAt: string | number | Date; }) => {
        const createdAtDate = new Date(item.createdAt);
        return (
          createdAtDate >= fourMonthsAgoStart && createdAtDate <= fourMonthsAgoEnd
        );
      });

      this.sixMonthsAgoStudents = response.filter((item: { createdAt: string | number | Date; }) => {
        const createdAtDate = new Date(item.createdAt);
        return (
          createdAtDate >= sixMonthsAgoStart && createdAtDate <= sixMonthsAgoEnd
        );
      });
      this.eightMonthsAgoStudents = response.filter((item: { createdAt: string | number | Date; }) => {
        const createdAtDate = new Date(item.createdAt);
        return (
          createdAtDate >= eightMonthsAgoStart && createdAtDate <= eightMonthsAgoEnd
        );
      });
      this.tenMonthsAgoStudents = response.filter((item: { createdAt: string | number | Date; }) => {
        const createdAtDate = new Date(item.createdAt);
        return (
          createdAtDate >= tenMonthsAgoStart && createdAtDate <= tenMonthsAgoEnd
        );
      });
      this.twelveMonthsAgoStudents = response.filter((item: { createdAt: string | number | Date; }) => {
        const createdAtDate = new Date(item.createdAt);
        return (
          createdAtDate >= twelveMonthsAgoStart && createdAtDate <= twelveMonthsAgoEnd
        );
      });
      this.chart1();
    }, error => {
    });
  }
  editCall(student: any) {
    
    this.router.navigate(['/admin/students/add-student'], { queryParams: { id: student.id } })
  }
  editClass(id: string) {
    this.router.navigate([`admin/courses/create-class`], { queryParams: { id: id } });
  }
  delete(id: string) {
    
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
      this.classService.deleteClass(id).subscribe(() => {
        Swal.fire({
          title: 'Success',
          text: 'Class deleted successfully.',
          icon: 'success',
        });
        this.getClassList();
      });
    });
  }


  deleteStudent(row: any) {
    // this.id = row.id;
    Swal.fire({
      title: "Confirm Deletion",
      text: "Are you sure you want to delete this Student?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        this.studentService.deleteUser(row.id).subscribe(
          () => {
            Swal.fire({
              title: "Deleted",
              text: "Student deleted successfully",
              icon: "success",
            });
            //this.fetchCourseKits();
            this.getStudentsList()
          },
          (error: { message: any; error: any; }) => {
            Swal.fire(
              "Failed to delete Student",
              error.message || error.error,
              "error"
            );
          }
        );
      }
    });

  }



  ngOnInit() {
    this.getClassList();
    this.getProgramList();
    this.getAllCourse();
  }
  getClassList() {
    let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
        this.classService
      .getClassListWithPagination({},userId)
      .subscribe(
        (response) => {
          
          if (response.data) {
            this.classesList = response.data.docs.slice(0, 5).sort();
          }

        },
        (error) => {
          console.log('error', error);
        }
      );
  }
  private chart1() {
    this.areaChartOptions = {
      series: [
        {
          name: 'new students',
          data: [
            this.twoMonthsAgoStudents.length,
            this.fourMonthsAgoStudents.length,
            this.sixMonthsAgoStudents.length,
            this.eightMonthsAgoStudents.length,
            this.tenMonthsAgoStudents.length,
            this.twelveMonthsAgoStudents.length
          ],
        },
        {
          name: 'old students',
          data: [
            this.tillPreviousTwoMonthsStudents.length,
            this.tillPreviousFourMonthsStudents.length,
            this.tillPreviousSixMonthsStudents.length,
            this.tillPreviousEightMonthsStudents.length,
            this.tillPreviousTenMonthsStudents.length,
            this.tillPreviousTwelveMonthsStudents.length,
          ],
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
        categories: ['2 Months', '4 Months', '6 Months', '8 Months', '10 Months', '12 Months']
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
  private chart3() {
    this.performanceRateChartOptions = {
      series: [
        {
          name: 'Students',
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
          text: 'Students',
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
  private chart4() {
    this.polarChartOptions = {
      series2: [this.instructorCount,
      this.studentCount,
      this.adminCount],
      chart: {
        type: 'pie',
        height: 400,
      },
      legend: {
        show: true,
        position: 'bottom',
      },
      dataLabels: {
        enabled: false,
      },
      labels: ['Instructors', 'Students', 'Admin'],
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
  getProgramList(filters?: any) {
    this.courseService.getCourseProgram({ status: 'active' }).subscribe(
      (response: any) => {
        this.programList = response.docs;
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

  getAllCourse() {
    this.courseService.getAllCourses({ status: 'active' }).subscribe(response => {
      
      this.courseData = response.data.docs;
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
    this.courseService.getAllCourses({ status: 'active' })
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


}
