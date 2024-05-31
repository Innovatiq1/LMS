import { Component, ElementRef, ViewChild } from '@angular/core';
import { AssessmentQuestionsPaginationModel } from '@core/models/assessment-answer.model'
import { UtilsService } from '@core/service/utils.service';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { AssessmentService } from '@core/service/assessment.service';

@Component({
  selector: 'app-exam-scores',
  templateUrl: './exam-scores.component.html',
  styleUrls: ['./exam-scores.component.scss']
})
export class ExamScoresComponent {

  displayedColumns: string[] = [
    // 'select',
    'img',
    'Student Name',
    'Email',
    'Course Title',
    'Exam Name',
    'Assessment Score',
    'Exam Assessment Score',
    'Action'
  ];

  breadscrums = [
    {
      title: 'Exam Scores',
      items: ['Course'],
      active: 'Exam Scores',
    },
  ];

  assessmentPaginationModel!: Partial<AssessmentQuestionsPaginationModel>;
  totalItems: any;
  pageSizeArr = this.utils.pageSizeArr;
  id: any;
  selection = new SelectionModel<any>(true, []);
  dataSource :any;
  examScores: any;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild('filter', { static: true }) filter!: ElementRef;

  constructor(public utils: UtilsService, private assessmentService: AssessmentService){
    this.assessmentPaginationModel = {};
  }

  ngOnInit() {
    this.getAllAnswers()
   }


   getAllAnswers() {
    this.assessmentService.getExamAnswersV2({ ...this.assessmentPaginationModel})
      .subscribe(res => {
        this.dataSource = res.data.docs;
        this.examScores = res.data.docs;
        this.totalItems = res.data.totalDocs;
        this.assessmentPaginationModel.docs = res.docs;
        this.assessmentPaginationModel.page = res.page;
        this.assessmentPaginationModel.limit = res.limit;
      })
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
      : this.dataSource.forEach((row: any) =>
          this.selection.select(row)
        );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value?.toLowerCase();
    this.dataSource = filterValue.trim().toLowerCase();
    if (filterValue) {
      this.dataSource = this.examScores?.filter((item: any) => {
        const searchList = `${item.studentInfo.name.toLowerCase()} ${item.studentInfo.last_name.toLowerCase()}`;
        return searchList.includes(filterValue);
      });
    } else {
      this.dataSource = this.examScores;
    }
  }

  enableStudentView(data: any){
    if(data.examAssessmentAnswer){
      const payload = {id: data.examAssessmentAnswer._id, studentView: true}
      this.assessmentService.updateAssessmentStudentView(payload).subscribe(res=> {
        this.getAllAnswers();
      })
    }
  }

}
