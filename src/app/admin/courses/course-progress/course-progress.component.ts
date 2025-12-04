// import { Component } from '@angular/core';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { AssessmentQuestionsPaginationModel } from '@core/models/assessment-answer.model';
import { UtilsService } from '@core/service/utils.service';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { AssessmentService } from '@core/service/assessment.service';
import { Subject, debounceTime } from 'rxjs';
import { AppConstants } from '@shared/constants/app.constants';
import { MatDialog } from '@angular/material/dialog';
import { ActivityLogComponent } from '@shared/components/activity-log/activity-log.component';
import { CourseService } from '@core/service/course.service';
// import { ActivatedRoute,Route } from '@angular/router';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-course-progress',
  templateUrl: './course-progress.component.html',
  styleUrls: ['./course-progress.component.scss']
})
export class CourseProgressComponent {

  
    displayedColumns: string[] = [
      'Course Title',
      'Department',
      'Student Name',
      'Course start date',
      'Course end date',
      'Student enrollment date',
      'Student completed date',
      'Progress percentage',
    ];
  
    assessmentPaginationModel!: Partial<AssessmentQuestionsPaginationModel>;
    totalItems: any;
    pageSizeArr = this.utils.pageSizeArr;
    id: any;
    limit: any = 10;
    selection = new SelectionModel<any>(true, []);
    dataSource: any;
    courseProgress:any;
    examScores: any;
    @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
    @ViewChild('filter', { static: true }) filter!: ElementRef;
    private keyupSubject: Subject<Event> = new Subject<Event>();
    commonRoles: any;
  
    constructor(
      public utils: UtilsService,
      public router: Router,
      private assessmentService: AssessmentService,
      private courseService:CourseService,
      private dialog: MatDialog
    ) {
      this.assessmentPaginationModel = {};
      this.keyupSubject.pipe(debounceTime(300)).subscribe((event) => {
        this.applyFilter(event);
      });
      this.getStudentClassesByCompanyIdDept()
    }
  
    ngOnInit() {
      this.commonRoles = AppConstants;
      // this.getAllAnswers();
      
    }
    
    getStudentClassesByCompanyIdDept(page: number = 1, limit: number = this.limit) {
      let company = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
    
      const payload = {
        companyId: company,
        department: "IT",
        page: page,
        limit: limit
      };
    
      console.log("Payload for paginated request:", payload);
    
      this.courseService.getStudentClassesByCompanyDept(payload).subscribe({
        next: (res) => {
          this.courseProgress = res.data.docs;
          this.totalItems = res.data.totalDocs;
          this.assessmentPaginationModel.page = res.data.page;
          this.assessmentPaginationModel.limit = res.data.limit;
        },
        error: (err) => {
          console.error("Error fetching paginated classes:", err);
        }
      });
    }
    
    
    
    pageSizeChange($event: any) {
      this.assessmentPaginationModel.page = $event?.pageIndex + 1;
      this.assessmentPaginationModel.limit = $event?.pageSize;
      this.getStudentClassesByCompanyIdDept(
        this.assessmentPaginationModel.page,
        this.assessmentPaginationModel.limit
      );
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
  
    onKeyup(event: Event) {
      this.keyupSubject.next(event);
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
      // this.getAllAnswers();
    }
  
    ngOnDestroy() {
      this.keyupSubject.unsubscribe();
    }

    openActivityLogModal(payload: any) {
      const dialogRef = this.dialog.open(ActivityLogComponent, {
        width: '800px',
        data: payload,
      });
    }

}
