import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AssessmentService } from '@core/service/assessment.service';
import { StudentsService } from '../../admin/students/students.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import Swal from 'sweetalert2';
import { CourseService } from '@core/service/course.service';
import { ClassService } from 'app/admin/schedule-class/class.service';



@Component({
  selector: 'app-exam-questions',
  templateUrl: './exam-questions.component.html',
  styleUrls: ['./exam-questions.component.scss']
})
export class ExamQuestionsComponent {

  public name: string = "";
  public questionList: any = [];
  public currentQuestion: number = 0;
  public points: number = 0;
  counter = 60;
  correctAnswer: number = 0;
  inCorrectAnswer: number = 0;
  interval$: any;
  progress: string = "0";
  isQuizCompleted : boolean = false;
  isanswersSubmitted : boolean = false;
  totalTime: number = 0;
  minutes: number = 0;
  seconds: number = 0;
  interval: any;
  currentId!: string;
  courseId!: string;
  studentId!: string;
  classId!: string;
  assesmentId! : string;
  answerId! : string;
  user_name! : string;
  selectedOption: any = '';
  optionsLabel: string[] = ['a)', 'b)', 'c)', 'd)'];
  public answers: any = [];
  answerResult! : any
  timerInSeconds: number = 0;
  pageSize: number = 10;
  currentPage: number = 0;
  totalQuestions: number = 0;
  skip: number = 0;
  retake: boolean = false;
  retakeNo: number = 0;
  courseDetails:any;
  classDetails:any;
  public examAssessmentId!: any;
  public answerAssessmentId!: any;


  constructor(
    private assessmentService: AssessmentService,
    private route: ActivatedRoute,
    private router: Router,
    private studentService : StudentsService,
    private courseService:CourseService,
    private classService: ClassService
      ) { }

      ngOnInit(): void {
          this.fetchAssessmentDetails();
          this.getCourseDetails();
          this.getClassDetails();
          this.student();
          this.route.queryParams.subscribe(params => {
            this.retake = params['retake'] === 'true'; 
          });                          
      }

      getClassDetails():void{
        let urlPath = this.router.url.split('/');
        const examId = urlPath[urlPath.length - 1];
        this.examAssessmentId = examId.split('?')[0]; 
        this.courseId = urlPath[urlPath.length - 2];
        this.studentId = urlPath[urlPath.length - 3];
        this.answerAssessmentId = urlPath[urlPath.length - 4];


        this.classService.getClassesByCourseId(this.courseId).subscribe((response) => {
          this.classDetails = response.data[0];
        });
      }

      getCourseDetails(): void {
        let urlPath = this.router.url.split('/');
        const examId = urlPath[urlPath.length - 1];
        this.examAssessmentId = examId.split('?')[0]; 
        this.courseId = urlPath[urlPath.length - 2];
        this.studentId = urlPath[urlPath.length - 3];
        this.answerAssessmentId = urlPath[urlPath.length - 4];


        this.courseService.getCourseById(this.courseId).subscribe((response) => {          
          this.courseDetails = response;
        });
      }
      

      onPageChange(event: PageEvent): void {
        const pageCount = event.pageIndex
        if(this.currentPage < event.pageIndex) {
          this.skip += 10
        } else if (this.currentPage > event.pageIndex) {
    
          if (pageCount == 0) {
            this.skip = 0   
          } else {
            this.skip -= 10
          } 
        }
        this.currentPage = event.pageIndex;
      }

      getStartingIndex(): number {
        return this.currentPage * this.pageSize;
        
      }
    
      getEndingIndex(): number {
        return Math.min((this.currentPage + 1) * this.pageSize, this.totalQuestions);
      }
    
      getPaginatedQuestions(): any[] {
        return this.questionList.slice(this.getStartingIndex(), this.getEndingIndex());
      }
    

      fetchAssessmentDetails(): void {
        let urlPath = this.router.url.split('/');
        const examId = urlPath[urlPath.length - 1];
        this.examAssessmentId = examId.split('?')[0]; 
        this.courseId = urlPath[urlPath.length - 2];
        this.studentId = urlPath[urlPath.length - 3];
        this.answerAssessmentId = urlPath[urlPath.length - 4];
      
        this.assessmentService.getAnswerQuestionById(this.examAssessmentId).subscribe((response) => {
          this.questionList = response?.questions;
          this.timerInSeconds = response?.timer;
          this.retakeNo = response?.retake
          this.calculateTotalTime();
          this.answers = Array.from({ length: this.questionList.length }, () => ({
            questionText: null,
            selectedOptionText: null
          }));
          this.totalQuestions = this.questionList.length;
          this.goToPage(0);
        });
      }

      student(){
        this.studentService.getStudentById(this.studentId).subscribe((res: any) => {
          this.user_name = res.name
        })
      }

      handleRadioChange(index:any) {
        this.answers[index].questionText = this.questionList[index]?.questionText
        this.selectedOption = ''
      }

      correctAnswers(value:any) {
        return this.questionList.filter((v: any) => v.status === value).length
      }

      confirmSubmit() {
        const nullOptionExists = this.answers.some((answer: any) => answer.selectedOptionText === null);
        if (nullOptionExists) {
          Swal.fire({
            title: 'Error!',
            text: 'Please answer all questions before submitting.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
          return;
        }
      
        Swal.fire({
          title: 'Are you sure?',
          text: 'Do you want to submit the answers?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes, submit!',
          cancelButtonText: 'Cancel'
        }).then((result) => {
          clearInterval(this.interval);
          if (this.retake && result.isConfirmed) {
            this.updateAnswers();
        } else if (result.isConfirmed) {
            this.submitAnswers();
        }
        });
      }

      submitAnswers() {
        let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
        const requestBody = {
          studentId: this.studentId,
          examAssessmentId: this.examAssessmentId,
          assessmentAnswerId: this.answerAssessmentId,
          courseId: this.courseId,
          answers: this.answers,
          companyId:userId
        };
    
        this.assessmentService.submitAssessment(requestBody).subscribe(
          (response: any) => {
            Swal.fire({
              title: "Submitted!",
              text: "Your answers were submitted.",
              icon: "success"
            });
            if (!this.retake) {
              this.updateExamStatus();
            }
          this.answerId = response.response;
          // this.getAnswerById();
          this.submitFeedback(response.response);
          },
          (error: any) => {
            console.error('Error:', error);
          }
        );
      }

      updateAnswers() {
        let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
        const requestBody = {
          answers: this.answers,
          id: this.answerAssessmentId,
          companyId:userId

        };
        this.assessmentService.updateAssessment(requestBody).subscribe(
          (response: any) => {
            Swal.fire({
              title: "Submitted!",
              text: "Your answers were submitted.",
              icon: "success"
            });
          this.answerId = this.answerAssessmentId;
          // this.getAnswerById()
          this.submitFeedback(this.answerAssessmentId);
          // if(this.retake) {
          //   this.updateRetakes()
          // }
          },
          (error: any) => {
            console.error('Error:', error);
          }
        );
      }

      updateExamStatus(): void {
        this.assessmentService.updateExamStatus(this.answerAssessmentId).subscribe(
          () => {
            console.log('Exam status updated successfully');
          },
          error => {
            console.error('Error updating exam status:', error);
          }
        );
      }

      updateClassCompleted() {
          const studentId = localStorage.getItem('id') || '';
          const classId=this.classDetails.id;
          let payload = {
            status: 'completed',
            studentId: studentId,
            playbackTime: 100,
            classId
          };
          
          this.classService
            .saveApprovedClasses(classId, payload)
            .subscribe((response) => {
            });
        
      }

      updateRetakes() {
        if (this.retakeNo >= 1) {
          const newRetakeNo = this.retakeNo - 1;
          const requestBody = {
            id: this.examAssessmentId,
            retake: newRetakeNo
          };
          this.assessmentService.updateRetakes(requestBody).subscribe(
            (response: any) => {
            },
            (error: any) => {
              console.error('Error:', error);
            }
          );
        } else {
          Swal.fire({
            title: "Cannot Update!",
            text: "You have already reached the minimum retake number.",
            icon: "error"
          });
        }
      }
      getAnswerById() {
        this.assessmentService.getAnswerById(this.answerId).subscribe((res: any) => {
           this.answerResult  = res.assessmentAnswer;
           const assessmentAnswer = res.assessmentAnswer;
           const assessmentId = assessmentAnswer.examAssessmentId;
           this.questionList = assessmentId.questions.map((question: any) => {
             const answer = assessmentAnswer.answers.find((ans: any) => ans.questionText === question.questionText);
             const correctOption = question.options.find((option: any) => option.correct);
             const selectedOption = answer ? answer.selectedOptionText : null;
             const status = selectedOption ? correctOption.text === selectedOption : false;
             return {
               _id: question._id,
               questionText: question.questionText,
               selectedOption: answer ? answer.selectedOptionText : 'No answer provided',
               status: status,
               options : question.options,
               score : assessmentAnswer.score
             };
           });
           this.isanswersSubmitted = true
         });
       }

       attendedQuestions() {
        return this.answers.filter((v: any) => v.selectedOptionText !== null).length
        }
        
        calculateTotalTime() {
          this.totalTime = this.questionList.length * this.timerInSeconds;
          this.startTimer();
      
        }
      
        startTimer() {
          this.interval = setInterval(() => {
            if (this.totalTime > 0) {
              this.minutes = Math.floor(this.totalTime / 60);
              this.seconds = this.totalTime % 60;
              this.totalTime--;
            } else {
              clearInterval(this.interval);
              this.submitAnswers(); 
            }
          }, 1000);
        }
      
        ngOnDestroy() {
          clearInterval(this.interval);
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

        routingButton(){
          if(this.retake) {
            this.router.navigate(['student/enrollment/exam-results']);
          } else {
            this.router.navigate(['student/enrollment/exam']);
          }
        }

        titleRoute() {
          if(this.retake) {
            return 'Results'
          } else {
            return 'Continue'
          }
        }

        submitFeedback(examAssessmentAnswerId:any){
          let isDirect = this.courseDetails?.examType === 'direct';
          let urlPath = this.router.url.split('/');
          const examId = urlPath[urlPath.length - 1];
          this.examAssessmentId = examId.split('?')[0]; 
          this.courseId = urlPath[urlPath.length - 2];
          this.studentId = urlPath[urlPath.length - 3];
          this.answerAssessmentId = urlPath[urlPath.length - 4];
          this.classId = isDirect? this.courseId: this.classDetails.id;

          const isPaid =  this.courseDetails?.feeType === 'paid';
          const queryParam = this.courseDetails?.examType ? {examType:this.courseDetails?.examType}: {}
          if(isPaid){
            this.router.navigate(['/student/feedback/courses', this.classId, this.studentId, this.courseId], {queryParams: {...queryParam, examAssessmentAnswerId}});
          } else{
            this.router.navigate(['/student/feedback/freecourse', this.classId, this.studentId, this.courseId], {queryParams: {...queryParam,examAssessmentAnswerId}});
          }
        }

}
