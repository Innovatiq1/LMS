import { Component } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SupportService } from '../support/support.service';
import { StudentsService } from 'app/admin/students/students.service';
import Swal from 'sweetalert2';
import { CoursePaginationModel } from '@core/models/course.model';
import { AppConstants } from '@shared/constants/app.constants';
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent {
  hideRequiredControl = new UntypedFormControl(false);
  breadscrums = [
    {
      title: ' View',
      items: ['Support'],
      active: ' View',
    },
  ];
  students: any;
  chatId!:string;
  id:any;
 currentTime:any;
 source:any;
format: string|undefined;
coursePaginationModel: Partial<CoursePaginationModel>;
user!:string;
  dataToUpdate: any;
  dataSource: any;
  totalTickets: any;
  constructor(private studentService:StudentsService,public activeRoute: ActivatedRoute, private supportService: SupportService,public router:Router) {
    //constructor
    this.coursePaginationModel = {};
    const today = new Date();
     this.currentTime = today.getHours() + ":" + today.getMinutes() ;

     this.activeRoute.queryParams.subscribe(param =>{
      this.chatId = param['id'];
     })
  }

  ngOnInit(){
this.getAllStudents();
this.formatAMPM(new Date)
this. getDetailedAboutTickets();
// this.listOfTicket();
  }

   formatAMPM(date: { getHours: () => any; getMinutes: () => any; }) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    this.currentTime = hours + ':' + minutes + ' ' + ampm;

  }

  getAllStudents(){
    let payload = {
      type: AppConstants.STUDENT_ROLE
    }
    this.studentService.getStudent(payload).subscribe(response =>{
    this.students = response.data
    });

  }

  getDetailedAboutTickets(){
   this.supportService.getTicketById(this.chatId).subscribe(res =>{
 this.dataToUpdate = res;

  this.source = res.messages;
 this.user = res.messages[0].role;
 

   })
  }
  cancel(){
    window.history.back()
  }

 update(){
  console.log("mdsmd",this.dataToUpdate)
  let data = { ...this.dataToUpdate.messages, status: "closed" };
  this.id=this.dataToUpdate.id;
  console.log("chant",data);


  Swal.fire({
    title: 'Are you sure?',
    text: 'Do you want to close this ticket!',
    icon: 'warning',
    confirmButtonText: 'Yes',
    showCancelButton: true,
    cancelButtonColor: '#d33',
  }).then((result) => {
    if (result.isConfirmed) {
      this.supportService.updateChat(this.id,data).subscribe(res =>{
          Swal.fire({
            title: 'Success',
            text: 'Ticket closed successfully.',
            icon: 'success',
          });
          this.router.navigate(['/dashboard/dashboard'])
        },
        (error) => {
          Swal.fire({
            title: 'Error',
            text: 'Ticket not closed. Please try again.',
            icon: 'error',
          });
        }
      );
    
    }
  });

}

delete(){

  Swal.fire({
    title: "Confirm Deletion",
    text: "Are you sure you want to delete this ticket?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Delete",
    cancelButtonText: "Cancel",
  }).then((result) => {
    if (result.isConfirmed) {
  this.supportService.deleteTicket(this.chatId).subscribe(res =>{
    window.history.back();
    // this.listOfTicket();
  })
}
});
}
}
