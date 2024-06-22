import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CourseService } from '@core/service/course.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { StudentsService } from 'app/admin/students/students.service';

@Component({
  selector: 'app-customization-timer',
  templateUrl: './customization-timer.component.html',
  styleUrls: ['./customization-timer.component.scss']
})
export class CustomizationTimerComponent {
  breadscrums = [
    {
      title: 'Customization',
      items: ['Configuration'],
      active: 'Timer',
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
      const config = this.configuration.find((v:any)=>v.field === 'timer')
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
      text: 'You want to update this Timer!',
      icon: 'warning',
      confirmButtonText: 'Yes',
      showCancelButton: true,
      cancelButtonColor: '#d33',
    }).then((result) => {
      if (result.isConfirmed) {
        let userId = localStorage.getItem('id');    
    this.courseService.createTimer({ value: selectedTimer,adminId:userId}).subscribe(
      response => {
        Swal.fire({
          title: 'Successful',
          text: 'Timer Configuration Success',
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

  openDialog(): void {
    const dialogRef = this.dialog.open(CustomizationTimerComponent, {
      width: '500px',
      data: { selectedTimer: this.selectedTimer }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('result: ', result);

        this.selectedTimer = result;
      }
    });
  }
}


