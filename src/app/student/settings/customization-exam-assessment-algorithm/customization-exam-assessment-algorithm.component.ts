import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CourseService } from '@core/service/course.service';
import { StudentsService } from 'app/admin/students/students.service';
import { forkJoin } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-customization-exam-assessment-algorithm',
  templateUrl: './customization-exam-assessment-algorithm.component.html',
  styleUrls: ['./customization-exam-assessment-algorithm.component.scss']
})
export class CustomizationExamAssessmentAlgorithmComponent {
  breadscrums = [
    {
      title: 'Customization',
      items: ['Configuration'],
      active: 'Score Algorithm',
    },
  ];

  selectedAssessmentAlgorithm: number = 1;
  selectedExamAlgorithm: number = 1;
  scoreAlgo: string[] = ['0.5', '1', '1.5', '2', '2.5', '3', '3.5', '4', '4.5', '5'];
  studentId: any;

  constructor(
    
    private courseService: CourseService,
    public dialog: MatDialog,
    private studentsService: StudentsService,
  ){}

  ngOnInit(): void { 
    this.studentId = localStorage.getItem('id');
    this.loadData();
    this.getScoreAlgo();
   }

   loadData(){
    this.studentsService.getStudentById(this.studentId).subscribe(res => {
    })
  }

   getScoreAlgo() : any {
    this.studentsService.configuration$.subscribe(configuration => {
      if (configuration?.length > 0) {
        this.selectedAssessmentAlgorithm = configuration[5].value;
        this.selectedExamAlgorithm = configuration[4].value;
      }
    });
  }

  updateScoreAlgo(){
    const selectedAssessmentAlgorithm= this.selectedAssessmentAlgorithm;
    const selectedExamAlgorithm= this.selectedExamAlgorithm;
    let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
        forkJoin(
      this.courseService
      .createAssessmentAlgorithm({ value: selectedAssessmentAlgorithm,companyId:userId }),
      this.courseService
      .createExamAlgorithm({ value: selectedExamAlgorithm,companyId:userId })
    ).subscribe(
        (response) => {
          Swal.fire({
            title: 'Successful',
            text: 'Score Algorithm Configuration Success',
            icon: 'success',
          });
        },
        (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error,
          });
        }
      );
  }
}
