import { Component } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from '@core/service/admin.service';
import { AssessmentService } from '@core/service/assessment.service';
import { SettingsService } from '@core/service/settings.service';
import { StudentsService } from 'app/admin/students/students.service';

@Component({
  selector: 'app-preview-test-answersheet',
  templateUrl: './preview-test-answersheet.component.html',
  styleUrls: ['./preview-test-answersheet.component.scss'],
})
export class PreviewTestAnswersheetComponent {
  public questionList: any = [];
  answerResult!: any;
  studentInfo: any;
  actualScore: number = 0;
  currentPercentage: number = 0;
  totalScore: number = 0;
  gradeDataset: any = [];
  gradeInfo: any = null;
  pageSize: number = 10;
  currentPage: number = 0; 
  display_grade:boolean = false
  showGrade: boolean = false;
  totalQuestions: number = 0;
  skip: number = 0;
  optionsLabel: string[] = ['a)', 'b)', 'c)', 'd)'];
  breadscrums = [
    {
      title: 'Exam Scores',
      items: ['Exam Scores'],
      active: 'Preview',
    },
  ];

  isShowCongrats: boolean = false;
  getTypeOfExam: any;
  getAssessmentName: any;

  constructor(
    private studentService: StudentsService,
    private route: ActivatedRoute,
    private assessmentService: AssessmentService,
    private SettingService: SettingsService, 
    private adminService:AdminService
  ) {}
  ngOnInit() { 

     let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
    this.adminService
      .getUserTypeList({ allRows: true }, userId)
      .subscribe((response: any) => {
        if(response.length != 0){ 
          response.map((data:any)=>{ 
            data.typeName == "admin" ?   
                data.settingsMenuItems.map((inner_data:any)=>{ 
                  inner_data.title == "Configuration" ?   
                      inner_data.children.map((nav_menu:any)=>{
                        nav_menu.title == "Grade" ? (this.display_grade = true ) : this.display_grade = false  
                      } 
                    )
                  : ""
                })
            : ""
          })
        }
      });  

      console.log(this.display_grade,'===')

    const answerId = this.route.snapshot.paramMap.get('id') || '';
    const studentId = this.route.snapshot.paramMap.get('studentId') || '';
    const assessmentType =
      this.route.snapshot.queryParamMap.get('assessmentType');
    this.getTypeOfExam =
      this.route.snapshot.queryParamMap.get('assessmentType');
    this.isShowCongrats =
      (this.route.snapshot.queryParamMap.get('showCongrats') || '') == 'true';
    this.student(studentId);
    if (assessmentType === 'assessment') this.getAnswerById(answerId);
    else this.getExamAnswerById(answerId);
  }

  student(studentId: string) {
    this.studentService.getStudentById(studentId).subscribe((res: any) => {
      this.studentInfo = res;
    });
  }

  getAnswerById(answerId: string) {
    this.studentService.getAnswerById(answerId).subscribe((res: any) => {
      this.answerResult = res.assessmentAnswer;
      this.actualScore = res.assessmentAnswer.score;
      this.totalScore = res.assessmentAnswer.totalScore;  
    
      if(this.display_grade){ 
        console.log("inside ....")
      this.GradeCalculate();
      }
      const assessmentAnswer = res.assessmentAnswer;
      this.getAssessmentName = assessmentAnswer.assessmentId.name;
      const assessmentId = assessmentAnswer.assessmentId;
      this.questionList = assessmentId.questions.map((question: any) => {
        const answer = assessmentAnswer.answers.find(
          (ans: any) => ans.questionText === question.questionText
        );
        const correctOption = question.options.find(
          (option: any) => option.correct
        );
        const selectedOption = answer ? answer.selectedOptionText : null;
        const status = selectedOption
          ? correctOption.text === selectedOption
          : false;
        return {
          _id: question._id,
          questionText: question.questionText,
          selectedOption: answer
            ? answer.selectedOptionText
            : 'No answer provided',
          status: status,
          options: question.options,
          score: assessmentAnswer.score,
        };
      });
      this.totalQuestions = this.questionList.length;
    });
  }

  getExamAnswerById(answerId: string) {
    this.assessmentService.getAnswerById(answerId).subscribe((res: any) => {
      this.actualScore = res.assessmentAnswer.score;
      this.totalScore = res.assessmentAnswer.totalScore; 
      if(this.display_grade){
      this.GradeCalculate();
      }

      console.log('this.res', res.assessmentAnswer.examAssessmentId.name);
      this.getAssessmentName = res.assessmentAnswer.examAssessmentId.name;
      this.answerResult = res.assessmentAnswer;
      const assessmentAnswer = res.assessmentAnswer;
      const assessmentId = res.assessmentAnswer.examAssessmentId;
      this.questionList = assessmentId.questions.map((question: any) => {
        const answer = assessmentAnswer.answers.find(
          (ans: any) => ans.questionText === question.questionText
        );
        const correctOption = question.options.find(
          (option: any) => option.correct
        );
        const selectedOption = answer ? answer.selectedOptionText : null;
        const status = selectedOption
          ? correctOption.text === selectedOption
          : false;
        return {
          _id: question._id,
          questionText: question.questionText,
          selectedOption: answer
            ? answer.selectedOptionText
            : 'No answer provided',
          status: status,
          options: question.options,
          score: assessmentAnswer.score,
        };
      });
      this.totalQuestions = this.questionList.length;
    });
  }
  correctAnswers(value: any) {
    return this.questionList.filter((v: any) => v.status === value).length;
  }

  onPageChange(event: PageEvent): void {
    const pageCount = event.pageIndex;
    if (this.currentPage < event.pageIndex) {
      this.skip += 10;
    } else if (this.currentPage > event.pageIndex) {
      if (pageCount == 0) {
        this.skip = 0;
      } else {
        this.skip -= 10;
      }
    }
    this.currentPage = event.pageIndex;
  }

  getStartingIndex(): number {
    return this.currentPage * this.pageSize;
  }

  getEndingIndex(): number {
    return Math.min(
      (this.currentPage + 1) * this.pageSize,
      this.totalQuestions
    );
  }

  getPaginatedQuestions(): any[] {
    return this.questionList.slice(
      this.getStartingIndex(),
      this.getEndingIndex()
    );
  }

  GradeCalculate() {
    let calculatePercent = (this.actualScore / this.totalScore) * 100;
    this.currentPercentage = Number.isNaN(calculatePercent)
      ? 0
      : Number(calculatePercent.toFixed(2));

    const getCompanyId: any = localStorage.getItem('userLogs');
    const parseid = JSON.parse(getCompanyId);
    this.SettingService.gradeFetch(parseid.companyId).subscribe({
      next: (res: any) => {
        if (res.response != null) {
          if (res.response!.gradeList!.length != 0) {
            this.gradeDataset = [];
            this.gradeDataset.push(...res.response!.gradeList);
            let count = 0;
            for (let i = 0; i < this.gradeDataset.length; i++) {
              const max = this.gradeDataset[i].PercentageRange.split('-')[0];
              const min = this.gradeDataset[i].PercentageRange.split('-')[1];
              if (calculatePercent >= max && calculatePercent <= min) {
                this.gradeInfo = this.gradeDataset[i];
                break;
              }
              count += 1;
            }
            console.log(count, this.gradeDataset.length);
            if (count === this.gradeDataset.length) {
              const sorted = this.gradeDataset.sort((a: any, b: any) => {
                const numA = parseInt(a.PercentageRange.split('-')[0]);
                const numB = parseInt(b.PercentageRange.split('-')[0]);
                return numA - numB;
              });
              this.gradeInfo = sorted[0];
            }
            this.showGrade = true;
          } else {
            this.showGrade = false;
          }
        }
      },
      error: (err) => {},
    });
  }
}
