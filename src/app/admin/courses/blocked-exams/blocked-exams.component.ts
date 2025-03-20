import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { AssessmentQuestionsPaginationModel } from '@core/models/assessment-answer.model';
import { AssessmentService } from '@core/service/assessment.service';
import { UtilsService } from '@core/service/utils.service';
import { ActivityLogComponent } from '@shared/components/activity-log/activity-log.component';
import { AppConstants } from '@shared/constants/app.constants';
import { debounceTime, Subject } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-blocked-exams',
  templateUrl: './blocked-exams.component.html',
  styleUrls: ['./blocked-exams.component.scss']
})
export class BlockedExamsComponent {
  breadscrums = [
    {
      title: 'Blocked Exams',
      items: ['Blocked Exams'],
      active: 'Blocked Exams',
    },
  ];
  pageSizeArr = this.utils.pageSizeArr;
  dataSource!: any;
  displayedColumns = [
    'img',
    'Student Name',
    'Email',
    'Course Title',
    'Activity',
    'Action',
  ];
  commonRoles: any;
  assessmentPaginationModel!: Partial<AssessmentQuestionsPaginationModel>;


  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild('filter', { static: true }) filter!: ElementRef;
  private keyupSubject: Subject<Event> = new Subject<Event>();

  examScores: any;
  totalItems: any;
  constructor(public utils: UtilsService,
    private assessmentService: AssessmentService,
    private dialog: MatDialog) {
    this.assessmentPaginationModel = {};
    this.keyupSubject.pipe(debounceTime(300)).subscribe((event) => {
      this.applyFilter(event);
    });
  }

   ngOnInit() {
      this.commonRoles = AppConstants;
      this.getAllBlockedExams();
    }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
      ?.trim()
      ?.toLowerCase();

    if (filterValue) {
      this.assessmentPaginationModel.studentName = filterValue;
    } else {
      delete this.assessmentPaginationModel.studentName;
    }
    this.getAllBlockedExams();
  }

  getAllBlockedExams() {
    let company = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
    this.assessmentService
      .getExamBlocked({ ...this.assessmentPaginationModel, company })
      .subscribe((res) => {
        console.log('reeeee', res.data);
        this.dataSource = res.data.docs.map((data: any) => ({
          ...data,
          activityCount: data.warnings.length,
        }));
        console.log('dataSourse==', this.dataSource);
        this.examScores = res.data.docs;
        this.totalItems = res.data.totalDocs;
        this.assessmentPaginationModel.docs = res.data.docs;
        this.assessmentPaginationModel.page = res.data.page;
        this.assessmentPaginationModel.limit = res.data.limit;
        this.assessmentPaginationModel.totalDocs = res.data.totalDocs;
      });
  }

   openActivityLogModal(payload: any) {
      const dialogRef = this.dialog.open(ActivityLogComponent, {
        width: '800px',
        data: [payload],
      });
    }

    enableStudentExam(data: any, status: boolean) {
      const msg = status ? 'Approve' : 'Reject';
      Swal.fire({
            title: 'Are you sure?',
            text: `Do you want to ${msg} this exam!`,
            icon: 'warning',
            confirmButtonText: 'Yes',
            showCancelButton: true,
            cancelButtonColor: '#d33',
          }).then((result) => {
            if (result.isConfirmed) {
              const _id=data._id;
              this.assessmentService
              .updateAnalyzer(_id, {
                status: status ? 'approved' : 'reqRejected',
              }).subscribe((res) => {
                this.getAllBlockedExams();
              });
            }
          });
    }

    
  pageSizeChange($event: any) {
    this.assessmentPaginationModel.page = $event?.pageIndex + 1;
    this.assessmentPaginationModel.limit = $event?.pageSize;
    this.getAllBlockedExams();
  }
}
