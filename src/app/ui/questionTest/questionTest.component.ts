import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { StudentsService } from 'app/admin/students/students.service';
import { QuestionService } from '@core/service/question.service';
import Swal from 'sweetalert2';
import { AuthenService } from '@core/service/authen.service';
import { Router } from '@angular/router';
import { ClassService } from 'app/admin/schedule-class/class.service';
import { CourseService } from '@core/service/course.service';
import { SettingsService } from '@core/service/settings.service';

@Component({
  selector: 'app-questions',
  templateUrl: './questionTest.component.html',
  styleUrls: ['./questionTest.component.scss'],
})
export class QuestionTestComponent implements OnInit, OnDestroy {
  @Input() questionList: any = [];
  @Input() answersResult!: any;
  @Input() getAssessmentId!: any;
  @Input() totalTime!: number;
  @Input() isAnswersSubmitted: boolean = false;
  @Input() autoSubmit: boolean = false;
  @Input() isCertificate: string = '';
  @Output() submitAnswers: EventEmitter<any> = new EventEmitter<any>();
  @Output() navigate: EventEmitter<any> = new EventEmitter<any>();



  public answers: any = [];
  user_name!: string;
  isQuizCompleted: boolean = false;
  isQuizFailed: boolean = false;
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
  isExamStarted: boolean = false;
  courseId!: string;
  assessmentId: any;
  isCertIssued: boolean = false;
  isEvaluationSubmitted: boolean = false;
  answer: any[] = []; 
    actualScore:number = 0; 
  currentPercentage:number = 0;
  totalScore:number = 0 
  gradeDataset:any = [] 
  gradeInfo:any =null

  constructor(
    private studentService: StudentsService,
    private authenService: AuthenService,
    private questionService: QuestionService,
    private router: Router,
    private classService: ClassService,
    private courseService: CourseService, 
      private SettingService:SettingsService

  ) {
    let urlPath = this.router.url.split('/');

  }

  ngOnInit() {
    this.answers = Array.from({ length: this.questionList.length }, () => ({
      questionText: null,
      selectedOptionText: null,
      fileAnswer: null,
      fileName: null,
    }));
    // console.log("question lit",this.questionList)
    this.user_name = this.authenService.currentUserValue.user.name
    let urlPath = this.router.url.split('/');
    this.classId = urlPath[urlPath.length - 1];
    this.getClassDetails();
    if (this.isCertificate) {
      this.isCertIssued = true;
    } else {
      this.isCertIssued = false;
    }
  }

  getTotalScore(): number {
    return this.questionList?.reduce((sum: number, q: any) => sum + (q.questionscore || 0), 0);
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
        if (this.autoSubmit) {
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
    if (!this.isExamStarted) {
      this.isExamStarted = true;
      this.startTimer();
    }
    this.answers[index].questionText = this.questionList[index]?.questionText;
    // this.answers[index].selectedOptionText = this.selectedOption;
    this.selectedOption = '';
  }


  handleFileChange(event: any, index: number) {
    const file = event.target.files[0];
    if (!file) return;
    const question = this.questionList[index];
    const maxSizeMB = question.fileSize || 50;

    if (file.size > maxSizeMB * 1024 * 1024) {
      Swal.fire({
        icon: 'error',
        title: 'File too large',
        text: `File should be less than ${maxSizeMB}MB.`,
      });
      event.target.value = '';
      return;
    }

    const formData = new FormData();
    formData.append('files', file);

    this.courseService.uploadDocument(formData).subscribe({
      next: (res: any) => {
        // console.log('Upload success:', res);

        const { documentLink, documentName, uploadedFileName } = res.data || {};
        this.answers[index] = {
          ...this.answers[index],
          questionText: this.questionList[index].questionText,
          fileAnswer: {
            documentLink,
            documentName,
            uploadedFileName,
          },
          fileName: documentName || file.name
        };
      },
      error: (err: any) => {
        Swal.fire({
          icon: 'error',
          title: 'Upload failed',
          text: 'Something went wrong while uploading the file.',
        });
      }
    });
  }


  confirmSubmit() {
    const unanswered = this.answers.some((answer: any, index: any) => {
      const question = this.questionList[index];
      const textAnswerEmpty = !answer.selectedOptionText || answer.selectedOptionText.trim() === '';

      if (question.questionType === 'file') {
        if (!answer.fileAnswer && textAnswerEmpty) {
          return true;
        }
      } else {
        if (textAnswerEmpty) {
          return true;
        }
      }
      return false;
    });


    if (unanswered) {
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
          companyId: userId
        };
        this.submitAnswers.next(submissionPayload);
        clearInterval(this.interval);
      }
    });
  }


  // getQuestionsById(){
  //   this.questionService.getQuestionsById("667bf7d5b0b47928d08d1360").subscribe((res:any)=>{
  //   })
  // }

  getClassDetails() {
    this.classService.getClassById(this.classId).subscribe((response) => {
      this.courseId = response.courseId.id;

    })
  }



  navigateContinue(data: boolean) {
    // console.log("this.answer",this.answersResult)
    this.actualScore = this.answersResult.score 
    this.totalScore = this.answersResult.totalScore  
    this.GradeCalculate()
    const score = this.answersResult.score;
    const passingCriteria = this.answersResult.assessmentId.passingCriteria;
    const assessmentEvaluationType = this.answersResult.assessmentEvaluationType;
    const evaluationStatus = this.answersResult.evaluationStatus;
    if (assessmentEvaluationType == 'Manual' && evaluationStatus == "pending") {
      //  console.log("helopro")
      this.isEvaluationSubmitted = true;
      const classIdRaw = this.classId;
      const getclassId = classIdRaw.split('?')[0];
      const studentId = localStorage.getItem('id') || '';
      let payload = {
        status: "completed",
        studentId: studentId,
        classId: getclassId,
        playbackTime: 100,
      };
      // console.log("classsssss",this.classId)
      this.classService
        .saveApprovedClasses(getclassId, payload)
        .subscribe((response) => {
          if (data) {
            Swal.fire({
              title: 'Please wait!',
              text: 'Your answers will be evaluated manually. You will be notified once the evaluation is complete.',
              icon: 'info',
            });
          }
          if (data)
            this.navigate.next(true);
        });
    }
    else if (score >= passingCriteria) {
      this.isQuizCompleted = true;
      const classIdRaw = this.classId;
      const getclassId = classIdRaw.split('?')[0];
      // console.log("getclassId",getclassId)
      const studentId = localStorage.getItem('id') || '';
      let payload = {
        status: "completed",
        studentId: studentId,
        classId: getclassId,
        playbackTime: 100,
      };

      // console.log("classsssss",this.classId)
      this.classService
        .saveApprovedClasses(getclassId, payload)
        .subscribe((response) => {
          if (data) {
            Swal.fire({
              icon: 'success',
              title: 'Course Completed Successfully!',
              text: 'Please wait for The certificate.',
            });
          }
          if (data)
            this.navigate.next(true);
        });

    } else {
      this.isQuizFailed = true;
    }

  }
    GradeCalculate(){  
    let calculatePercent = this.actualScore / this.totalScore * 100;
    this.currentPercentage = Number.isNaN(calculatePercent) ? 0 : Math.floor(calculatePercent);


    const getCompanyId:any = localStorage.getItem('userLogs')
    const parseid = JSON.parse(getCompanyId) 
    this.SettingService.gradeFetch(parseid.companyId).subscribe({
      next:(res:any)=>{
       if(res.response != null ){ 
         this.gradeDataset= []
        this.gradeDataset.push(...res.response!.gradeList) 
        let count = 0
         for(let i = 0;  i < this.gradeDataset.length; i++ ){  
         
      const max = this.gradeDataset[i].PercentageRange.split('-')[0] 
      const min = this.gradeDataset[i].PercentageRange.split('-')[1]
      if(calculatePercent >= max &&  calculatePercent <=min){
        this.gradeInfo =  this.gradeDataset[i]
        break 
        
      } 
      count +=1 
    } 
    console.log(count, this.gradeDataset.length)
    if(count === this.gradeDataset.length){
       const sorted = this.gradeDataset.sort((a:any, b:any) => {
    const numA = parseInt(a.PercentageRange.split('-')[0]);
    const numB = parseInt(b.PercentageRange.split('-')[0]);
    return numA - numB; 
    
    }); 
    this.gradeInfo = sorted[0]


    }

        
       } 
      },error:(err)=>{  
        
      }
    })

   
    

  }
  correctAnswers(value: any) {
    // console.log("questionlist112233",this.questionList)
    return this.questionList.filter((v: any) => v.status === value).length;
  }


  handleTextChange(index: number) {
    if (this.answers[index].selectedOptionText) {
      this.answers[index].questionText = this.questionList[index]?.questionText;
      this.answers[index].fileAnswer = null;
      this.answers[index].fileName = null;
    }
  }

  clearFileAnswer(index: number) {
    this.answers[index].fileAnswer = null;
    this.answers[index].fileName = null;
  }

}
