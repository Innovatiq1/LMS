import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import { ClassService } from 'app/admin/schedule-class/class.service';
import dayGridPlugin from '@fullcalendar/daygrid';
import { Router } from '@angular/router';
import { LecturesService } from 'app/teacher/lectures/lectures.service';
import { EventDetailDialogComponent } from '../program-timetable/event-detail-dialog/event-detail-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { AppConstants } from '@shared/constants/app.constants';

@Component({
  selector: 'app-course-timetable',
  templateUrl: './course-timetable.component.html',
  styleUrls: ['./course-timetable.component.scss'],
})
export class CourseTimetableComponent implements OnInit {
  courseCalendarOptions!: CalendarOptions;
  programCalendarOptions!: CalendarOptions;
  filterName = '';

  // breadscrums = [
  //   {
  //     title: 'Course Timetable',
  //     items: ['Timetable'],
  //     active: 'All Courses',
  //   },
  // ];
  studentApprovedClasses: any;
  upcomingCourseClasses: any;
  studentApprovedPrograms: any;
  upcomingProgramClasses: any;
  upcomingProgramsLength: any;
  upcomingCoursesLength: any;
  allClasses: any;

  constructor(
    private classService: ClassService,
    private router: Router,
    public lecturesService: LecturesService,
    public dialog: MatDialog
  ) {
    let userType = localStorage.getItem('user_type');
    if (userType == AppConstants.ADMIN_USERTYPE|| userType == AppConstants.ADMIN_ROLE|| userType == AppConstants.STUDENT_ROLE) {
      this.getClassList();
    } else {
      this.getInstructorApprovedCourse();
    }
  }

  ngOnInit() {
    this.programCalendarOptions = {
      initialView: 'dayGridMonth',
      plugins: [dayGridPlugin],
      events: [{ title: '', date: '' }],
    };

    this.courseCalendarOptions = {
      initialView: 'dayGridMonth',
      plugins: [dayGridPlugin],
      events: [
        { title: '', date: '' },
        { title: '', date: '' },
      ],
    };
  }
  getInstructorApprovedCourse() {
    let studentId = localStorage.getItem('id');
    const payload = { studentId: studentId, isAll: true, type: AppConstants.INSTRUCTOR_ROLE };
    let instructorId = localStorage.getItem('id');
    this.lecturesService
      .getClassListWithPagination(instructorId, this.filterName)
      .subscribe((response: { data: { docs: string | any[] } }) => {
        this.studentApprovedClasses = response.data.docs;
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();
        const tomorrow = new Date(
          currentYear,
          currentMonth,
          currentDate.getDate() + 1
        );
  
        const events = this.studentApprovedClasses.flatMap(
          (courseClass: any, classId: any) => {
            const startDate = new Date(
              courseClass?.sessions[0].sessionStartDate
            );
            const endDate = new Date(courseClass?.sessions[0]?.sessionEndDate);
            const sessionStartTime = this.formatTime(
              courseClass?.sessions[0]?.sessionStartTime
            );
            const sessionEndTime = this.formatTime(
              courseClass?.sessions[0]?.sessionEndTime
            );
            const title = courseClass?.courseName;
  
            const datesArray = [];
            let currentDate = startDate;
            while (currentDate <= endDate) {
              datesArray.push({
                title: title,
                date: new Date(currentDate),
                extendedProps: {
                  sessionStartTime: sessionStartTime,
                  sessionEndTime: sessionEndTime,
                  courseCode: courseClass?.courseCode,
                  deliveryType: courseClass?.classDeliveryType,
                  instructorCost: courseClass?.instructorCost,
                  sessionStartDate: startDate,
                  sessionEndDate: endDate,
                  id: courseClass?.id,
                  courseName: courseClass?.courseName,
                  status: courseClass?.status,
                },
              });
              currentDate.setDate(currentDate.getDate() + 1);
            }
            return datesArray;
          }
        );
        const filteredEvents = events.filter(
          (event: { date: string | number | Date }) => {
            const eventDate = new Date(event.date);
            return eventDate.getDay() !== 0;
          }
        );
  
        this.courseCalendarOptions = {
          initialView: 'dayGridMonth',
          plugins: [dayGridPlugin],
          events: filteredEvents,
          eventContent: function (arg, createElement) {
            const title = arg.event.title;
            const sessionStartTime =
              arg.event.extendedProps['sessionStartTime'];
            const sessionEndTime =
              arg.event.extendedProps['sessionEndTime'];
            return {
              html: `
            <div style=" font-size:10px; color: white
            ; white-space: normal; word-wrap: break-word;cursor: pointer;">
              ${title}<br>
               <span style ="color:white;cursor: pointer;">${sessionStartTime} - ${sessionEndTime}</span>
            </div>`,
            };
          },
          eventDisplay: 'block',
          eventClick: (clickInfo) => this.openDialog(clickInfo.event),
        };
      });
  }
  formatTime(time: string): string {
    let [hours, minutes] = time.split(':').map(Number);
    const suffix = hours >= 12 ? 'P.M' : 'A.M';
    hours = hours % 12 || 12; // Convert to 12-hour format
    return `${hours}:${minutes.toString().padStart(2, '0')} ${suffix}`;
  }
  
  openDialog(event: { title: any; extendedProps: { [x: string]: any } }) {
    this.dialog.open(EventDetailDialogComponent, {
      width: '700px',
      data: {
        title: event.title,
        sessionStartTime: event.extendedProps['sessionStartTime'],
        sessionEndTime: event.extendedProps['sessionEndTime'],
        courseCode: event.extendedProps['courseCode'],
        status: event.extendedProps['status'],
        sessionStartDate: event.extendedProps['sessionStartDate'],
        sessionEndDate: event.extendedProps['sessionEndDate'],
        deliveryType: event.extendedProps['deliveryType'],
        instructorCost: event.extendedProps['instructorCost'],
        id: event.extendedProps['id'],
        courseName: event.extendedProps['courseName'],
      },
    });
  }
  getClassList() {
    let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
    this.classService.getClassListWithPagination({},userId).subscribe((response) => {
      this.allClasses = response.data.docs;
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();
      const tomorrow = new Date(
        currentYear,
        currentMonth,
        currentDate.getDate() + 1
      );
      this.upcomingCourseClasses = this.allClasses.filter((item: any) => {
        const sessionEndDate = new Date(item.sessions[0].sessionEndDate);
        return sessionEndDate >= tomorrow;
      });
      const events = this.allClasses.flatMap(
        (courseClass: any, classId: any) => {
          const startDate = new Date(courseClass.sessions[0].sessionStartDate);
          const endDate = new Date(courseClass?.sessions[0]?.sessionEndDate);
          const sessionStartTime = this.formatTime(
            courseClass?.sessions[0]?.sessionStartTime
          );
          const sessionEndTime = this.formatTime(
            courseClass?.sessions[0]?.sessionEndTime
          );
          const title = courseClass?.courseId?.title;
          const courseCode = courseClass?.courseId?.courseCode;
          const status = courseClass?.sessions[0]?.status;
          const deliveryType = courseClass?.classDeliveryType;
          const instructorCost = courseClass?.instructorCost;
          const id = courseClass?.id;
          const courseName = courseClass?.courseName;
          const datesArray = [];
          let currentDate = startDate;
          while (currentDate <= endDate) {
            datesArray.push({
              title: title,
              date: new Date(currentDate),
              extendedProps: {
                sessionStartTime: sessionStartTime,
                sessionEndTime: sessionEndTime,
                courseCode: courseCode,
                status: status,
                sessionStartDate: startDate,
                sessionEndDate: endDate,
                instructorCost: instructorCost,
                deliveryType: deliveryType,
                id: id,
                courseName: courseName,
              },
            });
            currentDate.setDate(currentDate.getDate() + 1);
          }
          return datesArray;
        }
      );
      const filteredEvents = events.filter(
        (event: { date: string | number | Date }) => {
          const eventDate = new Date(event.date);
          return eventDate.getDay() !== 0; // Filter out events on Sundays
        }
      );

      this.courseCalendarOptions = {
        initialView: 'dayGridMonth',
        plugins: [dayGridPlugin],
        events: filteredEvents,
        eventContent: function (arg, createElement) {
          const title = arg.event.title;
          const sessionStartTime = arg.event.extendedProps['sessionStartTime'];
          const sessionEndTime = arg.event.extendedProps['sessionEndTime'];
          return {
            html: `
            <div style=" font-size:10px; color: white
            ; white-space: normal; word-wrap: break-word;cursor: pointer;">
              ${title}<br>
               <span style ="color:white;cursor: pointer;">${sessionStartTime} - ${sessionEndTime}</span>
            </div>`,
          };
        },
        eventDisplay: 'block',
        eventClick: (clickInfo) => this.openDialog(clickInfo.event),
      };
    });
  }
  getApprovedCourse() {
    let studentId = localStorage.getItem('id');
    const payload = { studentId: studentId, status: 'approved', isAll: true };
    this.classService
      .getStudentRegisteredClasses(payload)
      .subscribe((response) => {
        this.studentApprovedClasses = response.data.docs.slice(0, 5);
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();
        const tomorrow = new Date(
          currentYear,
          currentMonth,
          currentDate.getDate() + 1
        );
        this.upcomingCourseClasses = this.studentApprovedClasses.filter(
          (item: any) => {
            const sessionEndDate = new Date(
              item.classId.sessions[0].sessionEndDate
            );
            return sessionEndDate >= tomorrow;
          }
        );
        const events = this.studentApprovedClasses.flatMap(
          (courseClass: any, classId: any) => {
            const startDate = new Date(
              courseClass.classId.sessions[0].sessionStartDate
            );
            const endDate = new Date(
              courseClass?.classId?.sessions[0]?.sessionEndDate
            );
            const sessionStartTime = this.formatTime(
              courseClass?.sessions[0]?.sessionStartTime
            );
            const sessionEndTime = this.formatTime(
              courseClass?.sessions[0]?.sessionEndTime
            );
            const title = courseClass?.classId?.courseId?.title;
            const courseCode = courseClass.courseId.courseCode;
            const deliveryType = courseClass.classId?.classDeliveryType;
            const instructorCost = courseClass.classId?.instructorCost;
            const datesArray = [];
            let currentDate = startDate;
            while (currentDate <= endDate) {
              datesArray.push({
                title: title,
                date: new Date(currentDate),
                extendedProps: {
                  sessionStartTime: sessionStartTime,
                  sessionEndTime: sessionEndTime,
                  courseCode: courseCode,
                  instructorCost: instructorCost,
                  deliveryType: deliveryType,
                },
              });
              currentDate.setDate(currentDate.getDate() + 1);
            }
            return datesArray;
          }
        );
        const filteredEvents = events.filter(
          (event: { date: string | number | Date }) => {
            const eventDate = new Date(event.date);
            return eventDate.getDay() !== 0; // Filter out events on Sundays
          }
        );

        this.courseCalendarOptions = {
          initialView: 'dayGridMonth',
          plugins: [dayGridPlugin],
          events: filteredEvents,
          eventContent: function (arg, createElement) {
            const title = arg.event.title;
            const sessionStartTime =
              arg.event.extendedProps['sessionStartTime'];
            const sessionEndTime = arg.event.extendedProps['sessionEndTime'];
            return {
              html: `
            <div style=" font-size:10px; color: white
            ; white-space: normal; word-wrap: break-word; cursor: pointer;">
              ${title}<br>
               <span style ="color:white;cursor: pointer;">${sessionStartTime} - ${sessionEndTime}</span>
            </div>`,
            };
          },
          eventDisplay: 'block',
          eventClick: (clickInfo) => this.openDialog(clickInfo.event),
        };
      });
  }

}
