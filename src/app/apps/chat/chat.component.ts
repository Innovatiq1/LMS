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
this.listOfTicket();
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

  // console.log();

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
//console.log("res",res);
 this.dataToUpdate = res;
  this.source = res.messages;
 this.user = res.messages[0].role;
 //this.id=res.messages[0]._id;
 

   })
  }
  cancel(){
    window.history.back()
    //this.router.navigate(['apps/support'])
  }
 update(){
  // console.log("source",this.dataToUpdate);
  this.dataToUpdate.messages[0].status="closed";
  let data=this.dataToUpdate.messages;
  this.id=this.dataToUpdate.id;
 // this.id=this.dataToUpdate.messages[0]._id;
  this.supportService.updateChat(this.id,data).subscribe(res =>{
    //this.router.navigate(['apps/support'])
    //window.history.back();
    // this.getDetailedAboutTickets();
  })
}
listOfTicket() {
  this.supportService.getAllTickets({ ...this.coursePaginationModel }).subscribe((res) => {
    this.dataSource = res.data.docs;
    this.totalTickets = this.dataSource.length;
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
    this.listOfTicket();
  })
}
});
}
}
