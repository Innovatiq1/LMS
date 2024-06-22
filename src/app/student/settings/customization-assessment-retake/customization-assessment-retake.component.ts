
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CourseService } from '@core/service/course.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { StudentsService } from 'app/admin/students/students.service';

@Component({
  selector: 'app-customization-assessment-retake',
  templateUrl: './customization-assessment-retake.component.html',
  styleUrls: ['./customization-assessment-retake.component.scss']
})
export class CustomizationAssessmentRetakeComponent {
  breadscrums = [
    {
      title: 'Customization',
      items: ['Configuration'],
      active: 'Assessment Retake',
    },
  ];
  retakeCodes: string[] = ['1', '2', '3', '4', '5'];

  selectedRetake: string = "";
  dialogRef: any;
  studentId: any;
  configuration: any;
  configurationSubscription!: Subscription;
  defaultRetake: string = '';
 
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
      const config = this.configuration.find((v:any)=>v.field === 'currency')
      if (config) {
        this.defaultRetake = config.value;
        this.selectedRetake = this.defaultRetake
      }
    });
  }

  updateRetake() {
    const selectedRetake = this.selectedRetake;
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to update this Assessment Retake!',
      icon: 'warning',
      confirmButtonText: 'Yes',
      showCancelButton: true,
      cancelButtonColor: '#d33',
    }).then((result) => {
      let userId = localStorage.getItem('id');    
      if (result.isConfirmed) {
    this.courseService.createAssessment({ value: selectedRetake ,adminId:userId}).subscribe(
      response => {
        Swal.fire({
          title: 'Successful',
          text: 'Assessment Configuration Success',
          icon: 'success'
        });
        // dialogRef.close(selectedRetake);
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
    const dialogRef = this.dialog.open(CustomizationAssessmentRetakeComponent, {
      width: '500px',
      data: { selectedRetake: this.selectedRetake }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.selectedRetake = result;
      }
    });
  }
}

