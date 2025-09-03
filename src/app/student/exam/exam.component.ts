//EXAM-Component ts

import { Component, ElementRef, ViewChild } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { AssessmentQuestionsPaginationModel } from '@core/models/assessment-answer.model';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { AssessmentService } from '@core/service/assessment.service';
import { UtilsService } from '@core/service/utils.service';
import Swal from 'sweetalert2';
import { CourseService } from '@core/service/course.service';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { AuthenService } from '@core/service/authen.service';
import { SettingsService } from '@core/service/settings.service';

@Component({
  selector: 'app-exam',
  templateUrl: './exam.component.html',
  styleUrls: ['./exam.component.scss'],
})
export class ExamComponent {
  displayedColumns: string[] = [
    // 'Assessment Name',
    'Course Name',
    'Submitted Date',
    'Score', 
    'Grade', 
    'GPA',
    'Exam Type',
    'Retakes left',
    'Exam',
    'Request Retake',
  ];

  retakeRequestsCache: { [key: string]: any } = {};
  assessmentPaginationModel!: Partial<AssessmentQuestionsPaginationModel>;
  totalItems: any;
  pageSizeArr = this.utils.pageSizeArr;
  id: any;
  selection = new SelectionModel<any>(true, []);
  dataSource: any; 
  gradeDataset:any[] = []
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild('filter', { static: true }) filter!: ElementRef;
  isAssessment = false;
  isTutorial = false;
  tab: number = 0;   
showGrade: boolean = false;
    currentPercentage: number = 0;
   gradeInfo: any = null;
retakeTemp=0;
retakeRequestData:any;
  breadscrums = [
    {
      title: 'Assesment Answer List',
      active: 'Assesment Answer',
    },
  ];

  constructor(
    private router: Router,
    public utils: UtilsService,
    private assessmentService: AssessmentService,
    private courseService: CourseService,
    private authenService: AuthenService,
    private settingService:SettingsService
  ) {
    this.assessmentPaginationModel = {};
  }

  ngOnInit() {
    const roleDetails =this.authenService.getRoleDetails()[0].menuItems
    let urlPath = this.router.url.split('/');
    const parentId = `${urlPath[1]}/${urlPath[2]}`;
    const childId =  urlPath[urlPath.length - 1];
    let parentData = roleDetails.filter((item: any) => item.id == parentId);
    let childData = parentData[0].children.filter((item: any) => item.id == childId);
    let actions = childData[0].actions
    let assessmentAction = actions.filter((item:any) => item.title == 'Assessment')
    let tutorialAction = actions.filter((item:any) => item.title == 'Tutorial')

   
  if (assessmentAction.length > 0) {
    this.isAssessment = true;
    this.tab = 0;
  }

  if (tutorialAction.length > 0) {
    this.isTutorial = true;
    if (!this.isAssessment) {
      this.tab = 1;
    }
  } 
 const getCompanyId: any = localStorage.getItem('userLogs');
    const parseid = JSON.parse(getCompanyId);
    this.settingService.gradeFetch(parseid.companyId).subscribe({
      next: (res: any) => {  
        this.gradeDataset = [] 
        this.gradeDataset.push(...res.response!.gradeList)

      },
      error: (err) => {},
    });
    
  
  this.getAllAnswers();
  }
  onTabChange(event: MatTabChangeEvent) {
    this.assessmentPaginationModel.page = 1;
    this.tab = event.index;
    this.getAllAnswers();
  }
  getAllAnswers() {
    let studentId = localStorage.getItem('id') || '';
  
    if (this.tab === 0 && this.isAssessment) {
      this.assessmentService
        .getExamQuestionJsonV2({ ...this.assessmentPaginationModel, studentId })
        .subscribe((res) => {
          this.dataSource = res.data.docs;
          // console.log("tutorialDataSourse==",this.dataSource);
          this.totalItems = res.data.totalDocs;
          this.assessmentPaginationModel.docs = res.data.docs;
          this.assessmentPaginationModel.page = res.data.page;
          this.assessmentPaginationModel.limit = res.data.limit;
          this.dataSource.forEach((row: any) => {
             let maxRetakes = row.assessmentId.retake;
             let usedRetakes = row.retakeCount;
            //  let retakeValue=maxRetakes-usedRetakes;
            //  if(usedRetakes>=maxRetakes)
            //  {
            //   row.retakeCount=1;
            //  }
            if (row.retakeCount>=row.assessmentId.retake && !row.is_exam_completed) {
              this.getRetakeRequestsDatas(row);
            }
          });
        });
       
      

    } else if (this.tab === 1 && this.isTutorial) { 
      
      this.assessmentService
        .getTutorialQuestionJsonV2({ ...this.assessmentPaginationModel, studentId })
        .subscribe((res) => {

          this.dataSource = res.data.docs;
          // console.log("getTutorial",this.dataSource)
          this.totalItems = res.data.totalDocs;
          this.assessmentPaginationModel.docs = res.data.docs;
          this.assessmentPaginationModel.page = res.data.page;
          this.assessmentPaginationModel.limit = res.data.limit;
          // this.dataSource.forEach((row: any) => {
          //   this.getRetakeRequest(row);
          // });
        });
    }
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
  calculateRetaks(row:any):any{
    if (row.is_tutorial) {
      return 'Unlimited';
    } else {
      const maxRetakes = row.assessmentId.retake;
      const usedRetakes = row.retakeCount;
      if(row.retakeLeft==1)
      {
        row.retakeCount==0;
        return 1;

      }
        
      return maxRetakes - usedRetakes;
    }
  }

  getRetakeRequestsDatas(row: any) {
    const studentId = row.studentId.id;
    const courseId = row.courseId._id;
  
    this.settingService.getRetakeRequestByStudentIdAndCourseId(studentId, courseId)
      .subscribe((response) => {
      
        if (response?.data && response.data[0]?.retakes === 1) {
          // this.retakeRequestData=response.data[0];
          row.retakeLeft = 1;
          row.retakeCount=1;
          row.enableRetakeTest = true;
        } else {
          row.enableRetakeTest = false;
        }
      });
  }
  calculateRetakesLeft(row: any): any {
    if (row.is_tutorial) {
      return 'Unlimited';
    } else {
      const maxRetakes = row.assessmentId.retake;
      const usedRetakes = row.retakeCount;
      let retakeValue = maxRetakes - usedRetakes;
      if (retakeValue === 0) {
        const cacheKey = `${row.studentId._id}-${row.courseId._id}`;
        if (this.retakeRequestsCache[cacheKey] !== undefined) {
          return this.retakeRequestsCache[cacheKey]; 
        } else {
          this.getRetakeRequest(row).then(response => {
            this.retakeRequestsCache[cacheKey] = response; 
          });
          return 'Loading...'; 
        }
      }

      return retakeValue;
    }
  }

  async getRetakeRequest(row: any): Promise<any> {
    const courseId = row.courseId._id;
    const studentId = row.studentId._id;

    try {
      const response: any = await this.settingService.getRetakeRequestByStudentIdAndCourseId(studentId, courseId).toPromise();
      return response?.data[0]?.retakes || 0; 
    } catch (error) {
      console.error("Error fetching retake request:", error);
      return 0; 
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
            this.assessmentPaginationModel.page = 1
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
  // onRequestRetake(row: any) {
  //   console.log("row",row)
  //   console.log("assessmentId",row.assessmentId._id)
  //   console.log("courseId",row.courseId._id)
  //   console.log("courseName",row.courseId.title)
  //   console.log("companyId",row.companyId)
  //   console.log("studetnId",row.studentId._id)
  //   console.log("studentName",row.studentId.name)
  //   console.log("examType",'assessment')
  //   let payload={
  //     "assessmentId":row.assessmentId._id,
  //     "courseId":row.courseId._id,
  //     "courseName":row.courseId.title,
  //     "companyId":row.companyId,
  //     "studentId":row.studentId._id,
  //     "studentName":row.studentId.name,
  //     "examType":"assessment",
  //     "requestStatus":"requested",
  //     "retakes":0

  //   }
  //   this.settingService.saveRetakeRequest(payload).subscribe(
  //   (response) => {
  //   Swal.fire({
  //     title: 'Request Retake',
  //     text: 'Are you sure you want to request a retake for this assessment?',
  //     icon: 'question',
  //     showCancelButton: true,
  //     confirmButtonText: 'Yes, request retake!',
  //     cancelButtonText: 'Cancel',
  //   })
  // })
  //   // .then((result) => {
  //   //   if (result.isConfirmed) {
  //   //     this.settingService.saveRetakeRequest(row.id).subscribe(
  //   //       (response) => {
  //   //         Swal.fire(
  //   //           'Requested!',
  //   //           'Your retake request has been submitted.',
  //   //           'success'
  //   //         );
  //   //         this.getAllAnswers();
  //   //       },
  //   //       (error: any) => {
  //   //         console.error('Error requesting retake:', error);
  //   //         Swal.fire(
  //   //           'Error!',
  //   //           'An error occurred while requesting the retake.',
  //   //           'error'
  //   //         );
  //   //       }
  //   //     );
  //   //   }
  //   // });
  // }

  onRequestRetake(row: any) {
    const payload = {
      assessmentId: row.assessmentId?._id,
      courseId: row.courseId._id,
      courseName: row.courseId.title,
      companyId: row.companyId,
      studentId: row.studentId._id,
      studentName: row.studentId.name,
      examType: 'assessment',
      requestStatus: 'requested',
      retakes: 0,
    };
    Swal.fire({
      title: 'Request Retake',
      text: 'Are you sure you want to request a retake for this assessment?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, request retake!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.settingService.saveRetakeRequest(payload).subscribe(
          (response) => {
            console.log("response 1111==",response)
            if (response.message) {
              Swal.fire({
                icon: 'info',
                title: 'Request Status',
                text: response.message,
              });
            } else {
              Swal.fire({
                icon: 'success',
                title: 'Retake Requested',
                text: 'Your retake request has been submitted successfully.',
              });
            }
          },
          (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Request Failed',
              text: 'There was an issue submitting your retake request.',
            });
          }
        );
      } else {
        console.log('User canceled the request.');
      }
    });
  } 

    GradeCalculate_gpa(actualScore:any,totalScore:any):any{ 

          let gradeData 
         let calculatePercent = (actualScore / totalScore) * 100;
    

          if (this.gradeDataset.length != 0) {
           
            let count = 0;
            for (let i = 0; i < this.gradeDataset.length; i++) {
              const max = this.gradeDataset[i].PercentageRange.split('-')[0];
              const min = this.gradeDataset[i].PercentageRange.split('-')[1];
              if (calculatePercent >= max && calculatePercent <= min) {
                gradeData = this.gradeDataset[i];
                break;
              }
              count += 1;
            }
            if (count === this.gradeDataset.length) {
              const sorted = this.gradeDataset.sort((a: any, b: any) => {
                const numA = parseInt(a.PercentageRange.split('-')[0]);
                const numB = parseInt(b.PercentageRange.split('-')[0]);
                return numA - numB;
              });
              gradeData = sorted[0];
            }
          
             return gradeData.gpa
          }
         else {
           return "Not yet provided"
        }  
           
    } 


      GradeCalculate_grade(actualScore:any,totalScore:any):any{
         let gradeData 
         let calculatePercent = (actualScore / totalScore) * 100;
    

          if (this.gradeDataset.length != 0) {
           
            let count = 0;
            for (let i = 0; i < this.gradeDataset.length; i++) {
              const max = this.gradeDataset[i].PercentageRange.split('-')[0];
              const min = this.gradeDataset[i].PercentageRange.split('-')[1];
              if (calculatePercent >= max && calculatePercent <= min) {
                gradeData = this.gradeDataset[i];
                break;
              }
              count += 1;
            }
            if (count === this.gradeDataset.length) {
              const sorted = this.gradeDataset.sort((a: any, b: any) => {
                const numA = parseInt(a.PercentageRange.split('-')[0]);
                const numB = parseInt(b.PercentageRange.split('-')[0]);
                return numA - numB;
              });
              gradeData = sorted[0];
            }
          
             return gradeData.grade
          }
         else {
           return "Not yet provided"
        }  
           
    }
  
}
