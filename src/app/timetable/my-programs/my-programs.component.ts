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
  selector: 'app-my-programs',
  templateUrl: './my-programs.component.html',
  styleUrls: ['./my-programs.component.scss']
})
export class MyProgramsComponent {
  programCalendarOptions!: CalendarOptions
  filterName='';

  breadscrums = [
    {
      title: 'Program Timetable',
      items: ['Timetable'],
      active: 'My Programs',
    },
  ];
  studentApprovedPrograms: any;
  upcomingProgramClasses: any;
  upcomingProgramsLength: any;

  constructor(private classService: ClassService, private router: Router,public lecturesService: LecturesService,public dialog: MatDialog) {
    let userType = localStorage.getItem("user_type")
    if(userType == AppConstants.STUDENT_ROLE){
      this.getApprovedProgram();
    }

  }

  ngOnInit(){
    this.programCalendarOptions ={
      initialView: 'dayGridMonth',
      plugins: [dayGridPlugin],  
      events: [
            { title: '', date: '' },
          ]
    };

   
  }
  getInstructorApprovedProgram(){
    let instructorId=localStorage.getItem('id')
    //const payload = { studentId: studentId, status: 'approved',isAll:true };
    this.lecturesService.getClassListWithPagination1(instructorId, this.filterName,).subscribe(response =>{
     this.studentApprovedPrograms= response.data.docs.slice(0,5);
     const currentDate = new Date();
     const currentMonth = currentDate.getMonth();
     const currentYear = currentDate.getFullYear();  
     const tomorrow = new Date(currentYear, currentMonth, currentDate.getDate() + 1);
     this.upcomingProgramClasses = this.studentApprovedPrograms.filter((item:any) => {
      const sessionEndDate = new Date(item.sessions[0]?.sessionEndDate);
      return (
        sessionEndDate >= tomorrow 
      );
    });
    const events = this.studentApprovedPrograms.flatMap((courseClass: any,classId:any) => {
      const startDate = new Date(courseClass.sessions[0].sessionStartDate);
      const endDate = new Date(courseClass.sessions[0].sessionEndDate);
      const sessionStartTime = courseClass.sessions[0].sessionStartTime;
      const sessionEndTime = courseClass.sessions[0].sessionEndTime;
      const title = courseClass?.sessions[0]?.courseName;
      const datesArray = [];
      let currentDate = startDate;
          while (currentDate <= endDate) {
        datesArray.push({
          title: title,
          date: new Date(currentDate),
          extendedProps: {
            sessionStartTime: sessionStartTime,
            sessionEndTime: sessionEndTime
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
  
    this.programCalendarOptions = {
      initialView: 'dayGridMonth',
      plugins: [dayGridPlugin],
      events: filteredEvents,
      eventContent: function(arg, createElement) {
       
        const title = arg.event.title;
        const sessionStartTime = arg.event.extendedProps['sessionStartTime'];
        const sessionEndTime = arg.event.extendedProps['sessionEndTime'];
        return {
          html: `
            <div style=" font-size:10px; color: white; white-space: normal; word-wrap: break-word;cursor: pointer">
              ${title}<br>
               <span style ="color:white; cursor: pointer">${sessionStartTime} - ${sessionEndTime}</span>
            </div>`
        };
      }  , 
      eventDisplay: 'block' 
   
    };


    // this.upcomingProgramClasses.sort((a:any,b:any) => {
    //   const startDateA = a.classId.sessions[0].sessionStartDate;
    //   const startDateB = b.classId.sessions[0].sessionEndDate;
    //   return startDateA > startDateB ? 1 : startDateA < startDateB ? -1 : 0;
    // });
    this.upcomingProgramsLength = this.upcomingProgramClasses.length
    



    })
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
        programCode: event.extendedProps['programCode'],
        status: event.extendedProps['status'],
        sessionStartDate: event.extendedProps['sessionStartDate'],
        sessionEndDate: event.extendedProps['sessionEndDate'],
        deliveryType: event.extendedProps['deliveryType'],
        instructorCost: event.extendedProps['instructorCost'],
        reschedule:reschedule

      }
    });
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
      const sessionEndDate = new Date(item.classId.sessions[0].sessionEndDate);
      return (
        sessionEndDate >= tomorrow 
      );
    });
    const events = this.studentApprovedPrograms.flatMap((courseClass: any,classId:any) => {
      const startDate = new Date(courseClass.classId.sessions[0].sessionStartDate);
      const endDate = new Date(courseClass.classId.sessions[0].sessionEndDate);
      const sessionStartTime = courseClass.classId.sessions[0].sessionStartTime;
      const sessionEndTime = courseClass.classId.sessions[0].sessionEndTime;
      const title = courseClass.classId.courseId.title;
      const programCode = courseClass.classId?.sessions[0].courseCode;
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
            programCode: programCode,
            sessionStartDate:startDate,
            sessionEndDate:endDate,
            instructorCost:instructorCost,
            deliveryType:deliveryType
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
  
    this.programCalendarOptions = {
      initialView: 'dayGridMonth',
      plugins: [dayGridPlugin],
      events: filteredEvents,
      eventContent: function(arg, createElement) {
        const title = arg.event.title;
        const sessionStartTime = arg.event.extendedProps['sessionStartTime'];
        const sessionEndTime = arg.event.extendedProps['sessionEndTime'];
        return {
          html: `
            <div style=" font-size:10px; color: white; white-space: normal; word-wrap: break-word;cursor:pointer">
              ${title}<br>
               <span style ="color:white;cursor: pointer">${sessionStartTime} - ${sessionEndTime}</span>
            </div>`
        };
      }  , 
      eventDisplay: 'block' ,
      eventClick: (clickInfo) => this.openDialog(clickInfo.event)


   
    };


    // this.upcomingProgramClasses.sort((a:any,b:any) => {
    //   const startDateA = a.classId.sessions[0].sessionStartDate;
    //   const startDateB = b.classId.sessions[0].sessionEndDate;
    //   return startDateA > startDateB ? 1 : startDateA < startDateB ? -1 : 0;
    // });
    this.upcomingProgramsLength = this.upcomingProgramClasses.length
    



    })
  }

}
