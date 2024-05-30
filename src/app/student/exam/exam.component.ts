import { Component, ElementRef, ViewChild } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { AssessmentQuestionsPaginationModel } from '@core/models/assessment-answer.model';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { AssessmentService } from '@core/service/assessment.service';
import { UtilsService } from '@core/service/utils.service';
import Swal from 'sweetalert2';
import { CourseService } from '@core/service/course.service';

@Component({
  selector: 'app-exam',
  templateUrl: './exam.component.html',
  styleUrls: ['./exam.component.scss'],
})
export class ExamComponent {
  displayedColumns: string[] = [
    'Assessment Name',
    'Course Name',
    'Submitted Date',
    'Score',
    'Exam Type',
    'Exam',
  ];
  assessmentPaginationModel!: Partial<AssessmentQuestionsPaginationModel>;
  totalItems: any;
  pageSizeArr = this.utils.pageSizeArr;
  id: any;
  selection = new SelectionModel<any>(true, []);
  dataSource: any;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild('filter', { static: true }) filter!: ElementRef;

  breadscrums = [
    {
      title: 'Assesment Answer List',
      // items: ['Extra'],
      active: 'Assesment Answer',
    },
  ];

  constructor(
    private router: Router,
    public utils: UtilsService,
    private assessmentService: AssessmentService,
    private courseService: CourseService
  ) {
    this.assessmentPaginationModel = {};
  }

  ngOnInit() {
    this.getAllAnswers();
  }

  getAllAnswers() {
    this.assessmentService
      .getExamQuestionJsonV2({ ...this.assessmentPaginationModel })
      .subscribe((res) => {
        this.dataSource = res.data.docs;
        this.totalItems = res.data.totalDocs;
        this.assessmentPaginationModel.docs = res.docs;
        this.assessmentPaginationModel.page = res.page;
        this.assessmentPaginationModel.limit = res.limit;
      });
  }

  pageSizeChange($event: any) {
    this.assessmentPaginationModel.page = $event?.pageIndex + 1;
    this.assessmentPaginationModel.limit = $event?.pageSize;
    this.getAllAnswers();
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.forEach((row: any) => this.selection.select(row));
  }

  examType(data: any) {
    if (data.is_tutorial) {
      return 'Tutorial';
    } else {
      return 'Assessment';
    }
  }

  onDelete(id: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You are about to delete this tutorial. This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.assessmentService.deleteTutorial(id).subscribe(
          () => {
            Swal.fire(
              'Deleted!',
              'The tutorial has been deleted successfully.',
              'success'
            );
            this.getAllAnswers();
          },
          (error: any) => {
            console.error('Error deleting tutorial:', error);
            Swal.fire(
              'Error!',
              'An error occurred while deleting the tutorial.',
              'error'
            );
          }
        );
      }
    });
  }

  openTest(assessmentAnswer: any, isAssessment: boolean) {
    const studentId = assessmentAnswer.studentId._id;
    const courseId = assessmentAnswer.courseId._id;
    this.courseService
      .getStudentRegisteredByCourseId(studentId, courseId)
      .subscribe((res) => {
        const classId = res.classId;
        if(isAssessment){
          this.router.navigate(['/student/view-course/', classId], {
            queryParams: { tab: 'assessment' },
          });
        }else{
          this.router.navigate([
            '/student/questions/',
            classId,
            studentId,
            courseId,
          ]);
        }
      });
  }
  
}
