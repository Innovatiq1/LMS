import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import { ClassService } from 'app/admin/schedule-class/class.service';
import dayGridPlugin from '@fullcalendar/daygrid'
import { Router } from '@angular/router';
import { LecturesService } from 'app/teacher/lectures/lectures.service';
import { EventDetailDialogComponent } from '../program-timetable/event-detail-dialog/event-detail-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { AppConstants } from '@shared/constants/app.constants';

@Component({
  selector: 'app-my-courses',
  templateUrl: './my-courses.component.html',
  styleUrls: ['./my-courses.component.scss']
})
export class MyCoursesComponent {
  courseCalendarOptions!: CalendarOptions;
  filterName='';

  breadscrums = [
    {
      title: 'Course Timetable',
      items: ['Timetable'],
      active: 'My Courses',
    },
  ];
  studentApprovedClasses: any;
  upcomingCourseClasses: any;
  upcomingCoursesLength: any;
  allClasses: any;


  constructor(private classService: ClassService, private router: Router,public lecturesService: LecturesService,public dialog: MatDialog) {
    let userType = localStorage.getItem("user_type")
      this.getApprovedCourse();
  
  }

  ngOnInit(){
    this.courseCalendarOptions ={
      initialView: 'dayGridMonth',
      plugins: [dayGridPlugin],  
      events: [
            { title: '', date: '' },
            { title: '', date: '' }
          ]
    };
  }
   getInstructorApprovedCourse(){
    let studentId=localStorage.getItem('id')
    const payload = { studentId: studentId ,isAll:true,type: AppConstants.INSTRUCTOR_ROLE};
    let instructorId = localStorage.getItem('id')
    this.lecturesService.getClassListWithPagination(instructorId, this.filterName,).subscribe(
      (response: { data: { docs: string | any[]; }; }) => {

      this.studentApprovedClasses = response.data.docs.slice(0, 5);
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();
      const tomorrow = new Date(currentYear, currentMonth, currentDate.getDate() + 1);
      
      
        const events = this.studentApprovedClasses.flatMap((courseClass: any,classId:any) => {
        const startDate = new Date(courseClass?.sessions[0].sessionStartDate);
        const endDate = new Date(courseClass?.sessions[0]?.sessionEndDate);
        const sessionStartTime = this.formatTime(
          courseClass?.sessions[0]?.sessionStartTime
        );
        const sessionEndTime = this.formatTime(
          courseClass?.sessions[0]?.sessionEndTime
        );
        const department = courseClass?.department;

        const title = courseClass?.sessions[0]?.courseName;
       
        const datesArray = [];
        let currentDate = startDate;
            while (currentDate <= endDate) {
          datesArray.push({
            title: title,
            date: new Date(currentDate),
            extendedProps: {
              sessionStartTime: sessionStartTime,
              sessionEndTime: sessionEndTime,
              department:department
            
            }
          });
          currentDate.setDate(currentDate.getDate() + 1); 
        }
        return datesArray;
      });
      const filteredEvents = events.filter((event: { date: string | number | Date; }) => {
        const eventDate = new Date(event.date);
        return eventDate.getDay() !== 0; // Filter out events on Sundays
      });
    
      this.courseCalendarOptions = {
        initialView: 'dayGridMonth',
        plugins: [dayGridPlugin],
        events: filteredEvents,
        eventContent: function(arg, createElement) {
          const title = arg.event.title;
          const sessionStartTime = arg.event.extendedProps['sessionStartTime'];
          const sessionEndTime = arg.event.extendedProps['sessionEndTime'];
          return {
            html: `
            <div style=" font-size:10px; color: white
            ; white-space: normal; word-wrap: break-word;cursor:pointer">
              ${title}<br>
               <span style ="color:white;cursor:pointer">${sessionStartTime} - ${sessionEndTime}</span>
            </div>`
          };
        }  ,  
        eventDisplay: 'block' ,
        eventClick: (clickInfo) => this.openDialog(clickInfo.event)
        
      };
    });
        
  }
  formatTime(time: string): string {
    if(!time)
      return time;
    let [hours, minutes] = time.split(':').map(Number);
    const suffix = hours >= 12 ? 'P.M' : 'A.M';
    hours = hours % 12 || 12; // Convert to 12-hour format
    return `${hours}:${minutes.toString().padStart(2, '0')} ${suffix}`;
  }
  openDialog(event: { title: any; extendedProps: { [x: string]: any; }; }) {
    let userType = localStorage.getItem("user_type")
    var reschedule =false;

    if(userType == AppConstants.STUDENT_ROLE){
      reschedule = true
    }

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
        department: event.extendedProps['department'],
        deliveryType: event.extendedProps['deliveryType'],
        instructorCost: event.extendedProps['instructorCost'],
        reschedule:reschedule,
        meetingUrl: event.extendedProps['meetingUrl'],
        duration: event.extendedProps['duration']
      }
    });
  }

 
  getApprovedCourse(){
    let studentId=localStorage.getItem('id')
    const payload = { studentId: studentId, status: 'approved' ,isAll:true};
    this.classService.getStudentRegisteredClasses(payload).subscribe(response => {
      console.log(response);
      this.studentApprovedClasses = response?.data;
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();
      const tomorrow = new Date(currentYear, currentMonth, currentDate.getDate() + 1);
          this.upcomingCourseClasses = this.studentApprovedClasses.filter((item: any) => {
        const sessionEndDate = new Date(item?.classId?.sessions[0]?.sessionEndDate);
        return sessionEndDate >= tomorrow;
      });
          const events = this.studentApprovedClasses.flatMap((courseClass: any,classId:any) => {
        const startDate = new Date(courseClass?.classId?.sessions[0]?.sessionStartDate);
        const endDate = new Date(courseClass?.classId?.sessions[0]?.sessionEndDate);
        const sessionStartTime = this.formatTime(
          courseClass?.classId?.sessions[0]?.sessionStartTime
        );
        const sessionEndTime = this.formatTime(
          courseClass?.classId?.sessions[0]?.sessionEndTime
        );
        const title = courseClass?.classId?.courseId?.title;
        const courseCode = courseClass?.courseId?.courseCode;
        const deliveryType = courseClass?.classId?.classDeliveryType;
        const instructorCost = courseClass?.classId?.instructorCost;
        const department = courseClass?.classId?.department;
        const datesArray = [];
        const meetingPlatform = courseClass?.classId?.meetingPlatform;
        const meetingUrl = courseClass?.classId?.meetingUrl;
        const duration = courseClass?.classId?.duration;
        let currentDate = startDate;
            while (currentDate <= endDate) {
            const isSpecialEvent = deliveryType === "online";
            let isZoomClassAvailable = true;
              if(meetingPlatform == 'zoom'){
                isZoomClassAvailable = courseClass?.classId?.occurrences?.some((occ:any)=>{
                  const occDate = new Date(occ.startTime);
                  return this.isSameDate(occDate, currentDate)
                })
              }
              if(isZoomClassAvailable){
                datesArray.push({
                  title: title,
                  date: new Date(currentDate),
                  extendedProps: {
                    sessionStartTime: sessionStartTime,
                    sessionEndTime: sessionEndTime,
                    courseCode: courseCode,
                    instructorCost:instructorCost,
                    deliveryType:deliveryType,
                    department:department,
                    meetingUrl,
                    duration,
                  },
                  backgroundColor: isSpecialEvent ? '#fb8500' : '',
                  borderColor: isSpecialEvent ? 'darkgreen' : '',
                });
              }
          currentDate.setDate(currentDate.getDate() + 1); 
        }
        return datesArray;
      });
      const filteredEvents = events.filter((event: { date: string | number | Date; }) => {
        const eventDate = new Date(event.date);
        return eventDate.getDay() !== 0; // Filter out events on Sundays
      });
    
      this.courseCalendarOptions = {
        initialView: 'dayGridMonth',
        plugins: [dayGridPlugin],
        events: filteredEvents,
        eventContent: function(arg, createElement) {
          const title = arg.event.title;
          const sessionStartTime = arg.event.extendedProps['sessionStartTime'];
          const sessionEndTime = arg.event.extendedProps['sessionEndTime'];
          return {
            html: `
            <div style=" font-size:10px; color: white
            ; white-space: normal; word-wrap: break-word;cursor:pointer">
              ${title}<br>
               <span style ="color:white;cursor:pointer">${sessionStartTime} - ${sessionEndTime}</span>
            </div>`
          };
        }  ,  
        eventDisplay: 'block' ,
        eventClick: (clickInfo) => this.openDialog(clickInfo.event)
      };
    });   
  }

  isSameDate(date1:Date, date2:Date) {
    return date1.toDateString() === date2.toDateString();
  }

}
