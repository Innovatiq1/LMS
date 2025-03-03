import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { AssessmentQuestionsPaginationModel } from '@core/models/assessment-answer.model';
import { CoursePaginationModel } from '@core/models/course.model';
import { AssessmentService } from '@core/service/assessment.service';
import { CourseService } from '@core/service/course.service';
import { UtilsService } from '@core/service/utils.service';
import { ActivityLogComponent } from '@shared/components/activity-log/activity-log.component';
import { AppConstants } from '@shared/constants/app.constants';
import { debounceTime, Subject } from 'rxjs';

@Component({
  selector: 'app-exam-trianees',
  templateUrl: './exam-trianees.component.html',
  styleUrls: ['./exam-trianees.component.scss']
})
export class ExamTrianeesComponent {
  breadscrums = [
    {
      title: 'Exam',
      items: ['Course'],
      active: 'Exam',
    },
  ];
  displayedColumns: string[] = [
    'img',
    'Student Name',
    'Exam Start',
    'Exam Score',
    'Activity',
    'Status',
  ];
  private keyupSubject: Subject<Event> = new Subject<Event>();
  courseId: any;
  coursePaginationModel: Partial<CoursePaginationModel>;
  dataSource: any;
  commonRoles: any;
  pageSizeArr = this.utils.pageSizeArr;
  totalItems: any;


  constructor(
    public utils: UtilsService,
    private courseService: CourseService,
    private activatedRoute: ActivatedRoute,
        private dialog: MatDialog
    
  ) {
    this.coursePaginationModel = {};
    this.keyupSubject.pipe(debounceTime(300)).subscribe((event) => {
      this.applyFilter(event);
    });
    this.activatedRoute.params.subscribe((params: any) => {
      this.courseId = params.courseId;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
      ?.trim()
      ?.toLowerCase();

    if (filterValue) {
      this.coursePaginationModel.studentName = filterValue;
    } else {
      delete this.coursePaginationModel.studentName;
    }
    this.getAllExamTrainees();
  }
  ngOnInit() {
    this.commonRoles = AppConstants;
    this.getAllExamTrainees();
  }

  ngOnDestroy() {
    this.keyupSubject.unsubscribe();
  }

  onKeyup(event: Event) {
    this.keyupSubject.next(event);
  }

  pageSizeChange($event: any) {
    this.coursePaginationModel.page = $event?.pageIndex + 1;
    this.coursePaginationModel.limit = $event?.pageSize;
    this.getAllExamTrainees();
  }

  getAllExamTrainees() {
    let companyId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
    this.courseService.getAllTraineesExam(this.courseId, { ...this.coursePaginationModel, companyId })
      .subscribe((res) => {
        console.log('getAllTraineesExam==>',res);
        this.dataSource = res.data.docs.map((data: any) => ({
          ...data,
          activityCount: data.activityLogs.reduce((count: any, obj: any) => {
            return count + (obj.warnings ? obj.warnings.length : 0);
          }, 0),
        }));
        this.totalItems = res.data.totalDocs;
        this.coursePaginationModel.docs = res.data.docs;
        this.coursePaginationModel.page = res.data.page;
        this.coursePaginationModel.limit = res.data.limit;
        this.coursePaginationModel.totalDocs = res.data.totalDocs;
      })
  }

  openActivityLogModal(payload: any) {
      const dialogRef = this.dialog.open(ActivityLogComponent, {
        width: '800px',
        data: payload,
      });
    }
}
