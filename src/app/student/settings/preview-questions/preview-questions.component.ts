import { Component } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { AssessmentService } from '@core/service/assessment.service';
import { QuestionService } from '@core/service/question.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-preview-questions',
  templateUrl: './preview-questions.component.html',
  styleUrls: ['./preview-questions.component.scss'],
})
export class PreviewQuestionsComponent {
  public name: string = '';
  public questionList: any = [];
  public currentQuestion: number = 0;
  public points: number = 0;
  counter = 60;
  correctAnswer: number = 0;
  inCorrectAnswer: number = 0;
  interval$: any;
  progress: string = '0';
  isQuizCompleted: boolean = false;
  isanswersSubmitted: boolean = false;
  totalTime: number = 0;
  minutes: number = 0;
  seconds: number = 0;
  interval: any;
  currentId!: string;
  courseId!: string;
  studentId!: string;
  classId!: string;
  assesmentId!: string;
  answerId!: string;
  selectedOption: any = '';
  optionsLabel: string[] = ['a)', 'b)', 'c)', 'd)'];
  public answers: any = [];
  answerResult!: any;
  timerInSeconds: number = 0;
  pageSize: number = 10;
  currentPage: number = 0;
  totalQuestions: number = 0;
  skip: number = 0;
  public examAssessmentId!: any;
  public answerAssessmentId!: any;
  assessmentType:string|null =  ''

  breadcrumbs:any[] = []

  question: any;
  storedItems: string | null;

  constructor(
    private assessmentService: AssessmentService,
    private route: ActivatedRoute,
    private router: Router,
    private questionService: QuestionService
  ) {
    this.storedItems = localStorage.getItem('activeBreadcrumb');
  if (this.storedItems) {
   this.storedItems = this.storedItems.replace(/^"(.*)"$/, '$1');
   this.breadcrumbs = [
     {
       title: '', 
       items: [this.storedItems],  
       active: 'Preview',  
     },
   ];
 }
  }

  ngOnInit(): void {
    this.assessmentType = this.route.snapshot.queryParamMap.get('assessmentType');
    if(this.assessmentType === 'Assessment'){
      this.fetchAssessmentDetails()
    } else if(this.assessmentType === 'Tutorial'){
      this.fetchTutorialDetails()
    }else{
      this.fetchExamAssessmentDetails();
    }
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

  fetchExamAssessmentDetails(): void {
    this.route.queryParamMap.subscribe
    let urlPath = this.router.url.split('/');
    const examId = urlPath[urlPath.length - 1];
    this.examAssessmentId = examId.split('?')[0];

    this.assessmentService
      .getAnswerQuestionById(this.examAssessmentId)
      .subscribe((response) => {
        this.questionList = response?.questions;
        this.timerInSeconds = response?.timer;
        this.question = response;
        this.calculateTotalTime();
   
        this.totalQuestions = this.questionList.length;
        this.goToPage(0);
      });
  }

  fetchAssessmentDetails(): void {
    this.route.queryParamMap.subscribe
    let urlPath = this.router.url.split('/');
    const examId = urlPath[urlPath.length - 1];
    this.examAssessmentId = examId.split('?')[0];

    this.questionService
    .getQuestionsById(this.examAssessmentId)
      .subscribe((response:any) => {
        this.questionList = response?.questions;
        this.timerInSeconds = response?.timer;
        this.question = response;
        this.calculateTotalTime();
   
        this.totalQuestions = this.questionList.length;
        this.goToPage(0);
      });
  }
  fetchTutorialDetails(): void {
    this.route.queryParamMap.subscribe
    let urlPath = this.router.url.split('/');
    const examId = urlPath[urlPath.length - 1];
    this.examAssessmentId = examId.split('?')[0];

    this.questionService
    .getTutorialQuestionsById(this.examAssessmentId)
      .subscribe((response:any) => {
        this.questionList = response?.questions;
        this.timerInSeconds = response?.timer;
        this.question = response;
        this.calculateTotalTime();
   
        this.totalQuestions = this.questionList.length;
        this.goToPage(0);
      });
  }


 


  calculateTotalTime() {
    this.totalTime = this.questionList.length * this.timerInSeconds;
    this.minutes = Math.floor(this.totalTime / 60);
    this.seconds = this.totalTime % 60;
  }




  navigate() {
    this.isQuizCompleted = true;
  }

  getTotalPages(): number {
    return Math.ceil(this.totalQuestions / this.pageSize);
  }

  goToPage(pageNumber: number): void {
    this.currentPage = pageNumber;
  }


}
