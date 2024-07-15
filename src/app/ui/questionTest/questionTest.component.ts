import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { StudentsService } from 'app/admin/students/students.service';
import { QuestionService } from '@core/service/question.service';
import Swal from 'sweetalert2';
import { AuthenService } from '@core/service/authen.service';
import { Router } from '@angular/router';
import { ClassService } from 'app/admin/schedule-class/class.service';

@Component({
  selector: 'app-questions',
  templateUrl: './questionTest.component.html',
  styleUrls: ['./questionTest.component.scss'],
})
export class QuestionTestComponent implements OnInit, OnDestroy {
  @Input() questionList: any = [];
  @Input() answersResult!: any;
  @Input() getAssessmentId!:any;
  @Input() totalTime!: number;
  @Input() isAnswersSubmitted:boolean = false;
  @Input() autoSubmit:boolean = false;
  @Input() isCertificate: string = '';
  @Output() submitAnswers: EventEmitter<any> = new EventEmitter<any>();
  @Output() navigate: EventEmitter<any> = new EventEmitter<any>();
  


  public answers: any = [];
  user_name!: string;
  isQuizCompleted: boolean = false;
  isQuizFailed: boolean=false;
  minutes: number = 0;
  seconds: number = 0;
  interval: any;
  selectedOption: any = '';
  optionsLabel: string[] = ['a)', 'b)', 'c)', 'd)'];
  studentId!: string;
  classId!: string;
  assesmentId!: string;
  answerId!: string;
  answerResult!: any;
  isExamStarted:boolean=false;
  courseId!: string;
  assessmentId: any;
  isCertIssued: boolean = false;


  constructor(
    private studentService: StudentsService,
    private authenService:AuthenService,
    private questionService:QuestionService,
    private router: Router,
    private classService : ClassService
    
  )  {
    let urlPath = this.router.url.split('/');
    console.log("questionList", this.questionList)
   
  }

  ngOnInit() {
    this.answers = Array.from({ length: this.questionList.length }, () => ({
      questionText: null,
      selectedOptionText: null,
    }));
    this.user_name = this.authenService.currentUserValue.user.name
    let urlPath = this.router.url.split('/');
    this.classId = urlPath[urlPath.length - 1];
    this.getClassDetails() ;
    if (this.isCertificate) {
      this.isCertIssued = true;
      console.log("QuestionComponent - isCertificate:", this.isCertificate);
    } else {
      this.isCertIssued = false;
    }
  }

 

  startTimer() {
    if (!this.totalTime) {
      return;
    }
    this.interval = setInterval(() => {
      if (this.totalTime > 0) {
        this.minutes = Math.floor(this.totalTime / 60);
        this.seconds = this.totalTime % 60;
        this.totalTime--;
      } else {
        clearInterval(this.interval);
        if(this.autoSubmit){
          const submissionPayload = {
            answers: this.answers,
            courseId: this.courseId,
            is_tutorial: false,
            classId: this.classId
          };
          this.submitAnswers.next(submissionPayload);
        }
      }
    }, 1000);
  }

  ngOnDestroy() {
    clearInterval(this.interval);
  }

  attendedQuestions() {
    return this.answers.filter((v: any) => v.selectedOptionText !== null)
      .length;
  }

  handleRadioChange(index: any) {
    if(!this.isExamStarted){
      this.isExamStarted = true;
      this.startTimer();
    }
    this.answers[index].questionText = this.questionList[index]?.questionText;
    // this.answers[index].selectedOptionText = this.selectedOption;
    this.selectedOption = '';
  }

  confirmSubmit() {
    const nullOptionExists = this.answers.some(
      (answer: any) => answer.selectedOptionText === null
    );
    if (nullOptionExists) {
      Swal.fire({
        title: 'Error!',
        text: 'Please answer all questions before submitting.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      return;
    }

    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to submit the answers?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, submit!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
        const submissionPayload = {
          answers: this.answers,
          courseId: this.courseId,
          is_tutorial: false,
          classId: this.classId,
          companyId:userId
        };
        // this.getQuestionsById()
        this.submitAnswers.next(submissionPayload);
        clearInterval(this.interval);
      }
    });
  }
  // getQuestionsById(){
  //   console.log("this.sult",this.answersResult)
  //     console.log("this.getAssessmentId",this.getAssessmentId);
  //   this.questionService.getQuestionsById("667bf7d5b0b47928d08d1360").subscribe((res:any)=>{
     
  //     console.log("getQuestionsById==",res);
  //   })
  // }
  
  getClassDetails(){
    this.classService.getClassById(this.classId).subscribe((response)=>{
      this.courseId=response.courseId.id;
     
    })
  }



  navigateContinue(data:boolean) {
      const score=this.answersResult.score;
      const passingCriteria=this.answersResult.assessmentId.passingCriteria;
       if (score >= passingCriteria) {
      this.isQuizCompleted = true;
      const studentId = localStorage.getItem('id') || '';
      let payload = {
        status:"completed",
        studentId: studentId,
        classId: this.classId,
        playbackTime: 100,
      };
      this.classService
        .saveApprovedClasses(this.classId, payload)
        .subscribe((response) => {
          if(data)
          this.navigate.next(true);
        });
    
    } else {
      this.isQuizFailed = true;
    }
    
  }

  correctAnswers(value: any) {
    return this.questionList.filter((v: any) => v.status === value).length;
  }
}
