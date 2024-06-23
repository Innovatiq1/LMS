import { Component, OnInit, ViewChild } from '@angular/core';
import { UsersModel } from '@core/models/user.model';
import { InstructorService } from '@core/service/instructor.service';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTooltip,
  ApexYAxis,
  ApexStroke,
  ApexLegend,
  ApexMarkers,
  ApexGrid,
  ApexFill,
  ApexTitleSubtitle,
  ApexNonAxisChartSeries,
  ApexResponsive,
} from 'ng-apexcharts';
import { LecturesService } from '../lectures/lectures.service';
import * as moment from 'moment';
import { CourseService } from '@core/service/course.service';
import { CoursePaginationModel, MainCategory, SubCategory } from '@core/models/course.model';
import { ClassService } from 'app/admin/schedule-class/class.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { AppConstants } from '@shared/constants/app.constants';

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
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  legend: ApexLegend;
  dataLabels: ApexDataLabels;
  responsive: ApexResponsive[];
  labels: string[];
};
export type pieChartOptions1 = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  legend: ApexLegend;
  dataLabels: ApexDataLabels;
  responsive: ApexResponsive[];
  labels: string[];
};

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  @ViewChild('chart') chart!: ChartComponent;
  public avgLecChartOptions!: Partial<avgLecChartOptions>;
  public pieChartOptions!: Partial<pieChartOptions>;
  public pieChartOptions1!: Partial<pieChartOptions>;
  UsersModel!: Partial<UsersModel>;

  breadscrums = [
    {
      title: 'Dashboard',
      items: ['Instructor'],
      active: 'Dashboard',
    },
  ];
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
  count: any;

  constructor(
    private instructorService: InstructorService,
    public lecturesService: LecturesService,
    private courseService: CourseService,
    private classService: ClassService,
    private router: Router,
  ) {
    //constructor
  }
  ngOnInit() {
    this.getClassList();
    this.getClassList1();
    this.chart1();
    //this.chart2();
    this.instructorData();
    this.getProgramList();
    this.getAllCourse();
    this.getCount();
  }
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
  getClassList1() {
    let instructorId = localStorage.getItem('id');
    this.lecturesService
      .getClassListWithPagination1(instructorId, '')
      .subscribe(
        (response) => {
          this.programData = response.data.docs;
          //this.dataSource1 = response.data.sessions;
          // this.totalItems = response.data.totalDocs
          // this.coursePaginationModel.docs = response.data.docs;
          // this.coursePaginationModel.page = response.data.page;
          // this.coursePaginationModel.limit = response.data.limit;
          //this.mapClassList()
          // this.dataSource = [];
          this.getSession1();
          this.chart3();
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
      type: AppConstants.INSTRUCTOR_ROLE,
    };
    this.instructorService.getInstructors(payload).subscribe(
      (response: { data: any }) => {
        this.latestInstructor = response?.data[0];
      },
      (error) => { }
    );
  }

  private chart1() {
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
  private chart2() {
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
  private chart3() {
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
    let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
        this.courseService.getAllCourses(userId,{status:'active'}).subscribe(response =>{
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
    let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
        this.courseService.getAllCourses(userId,{status:'active'})
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
  getClassList() {
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
  editClass(id:string){
    this.router.navigate(['/admin/courses/create-class'], { queryParams: {id: id}});
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
  getCount() {
    let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
        this.courseService.getCount(userId).subscribe(response => {
      this.count = response?.data;
      this.instructorCount=this.count?.instructors;
      this.adminCount=this.count?.admins
      this.studentCount=this.count?.students
    })
       
  }
}
