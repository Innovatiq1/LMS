import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CourseService } from '@core/service/course.service';
import { StudentsService } from 'app/admin/students/students.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-customization-exam-timer',
  templateUrl: './customization-exam-timer.component.html',
  styleUrls: ['./customization-exam-timer.component.scss']
})
export class CustomizationExamTimerComponent {
  breadscrums = [
    {
      title: 'Customization',
      items: ['Configuration'],
      active: 'Exam Timer',
    },
  ];
  timerValues: string[] = ['15', '30', '45', '60', '90', '120', '150'];
  

  selectedTimer: string = "";
  dialogRef: any;
  studentId: any;
  configuration: any;
  configurationSubscription!: Subscription;
  defaultTimer: string = '';
 
  constructor(
    
    private courseService: CourseService,
    public dialog: MatDialog,
    private studentsService: StudentsService,
  ){}

  ngOnInit(): void { 
    this.getCurrency();
    this.loadData();
   }

   loadData(){
    this.studentId = localStorage.getItem('id')
    this.studentsService.getStudentById(this.studentId).subscribe(res => {
    })
  }
  
  getCurrency() : any {
    this.configurationSubscription = this.studentsService.configuration$.subscribe(configuration => {
      this.configuration = configuration;
      const config = this.configuration.find((v:any)=>v.field === 'examTimer')
      if (config) {
        this.defaultTimer = config.value;
        this.selectedTimer = this.defaultTimer
      }
    });
  }

  updateCurrency() {
    const selectedTimer = this.selectedTimer;
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to update this Exam Timer!',
      icon: 'warning',
      confirmButtonText: 'Yes',
      showCancelButton: true,
      cancelButtonColor: '#d33',
    }).then((result) => {
      if (result.isConfirmed) {
        let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
            this.courseService.createExamTimer({ value: selectedTimer,companyId:userId }).subscribe(
      response => {
        Swal.fire({
          title: 'Successful',
          text: 'Exam Timer Configuration Success',
          icon: 'success'
        });
        // dialogRef.close(selectedTimer);
      },
      error => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error,
        });
      }
    );
  }
});
  }

}
