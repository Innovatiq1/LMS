import { Component, ViewChild } from '@angular/core';
import { StudentPaginationModel } from 'app/admin/schedule-class/class.model';
import { ClassService } from 'app/admin/schedule-class/class.service';
import { UtilsService } from '@core/service/utils.service';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { AssessmentService } from '@core/service/assessment.service';
import { AssessmentQuestionsPaginationModel } from '@core/models/assessment-answer.model';

@Component({
  selector: 'app-exam-test-list',
  templateUrl: './exam-test-list.component.html',
  styleUrls: ['./exam-test-list.component.scss'],
})
export class ExamTestListComponent {
  breadscrums = [
    {
      title: 'Exam',
      items: ['Course'],
      active: 'Exam',
    },
  ];
  displayedColumns: string[] = ['Course Title', 'Exam Name', 'Exam'];
  dataSource: any;
  assessmentPaginationModel!: Partial<AssessmentQuestionsPaginationModel>;
  totalItems: any;
  pageSizeArr = this.utils.pageSizeArr;
  isLoading: boolean = true;
  @ViewChild(MatSort) matSort!: MatSort;

  constructor(public utils: UtilsService, private classService: ClassService, public router: Router, private assessmentService: AssessmentService) {
    this.assessmentPaginationModel = {};
  }

  ngOnInit() {
    this.getEnabledExams();
  }

  getEnabledExams() {
    this.assessmentService.getAssignedExamAnswers({ ...this.assessmentPaginationModel})
      .subscribe(res => {
        this.isLoading = false;
        this.dataSource = res.data.docs;
        this.totalItems = res.data.totalDocs;
        this.assessmentPaginationModel.docs = res.docs;
        this.assessmentPaginationModel.page = res.page;
        this.assessmentPaginationModel.limit = res.limit;
      })
  }

  view(id: string) {
    // this.router.navigate(['/admin/courses/view-completion-list'], {
    //   queryParams: { id: id, status: 'completed' },
    // });
  }

  pageSizeChange($event: any) {
    this.assessmentPaginationModel.page = $event?.pageIndex + 1;
    this.assessmentPaginationModel.limit = $event?.pageSize;
    this.getEnabledExams();
  }
}
