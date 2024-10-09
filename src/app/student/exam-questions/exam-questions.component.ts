import { Component, OnInit, TemplateRef, ViewChild, HostListener, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AssessmentService } from '@core/service/assessment.service';
import { StudentsService } from '../../admin/students/students.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import Swal from 'sweetalert2';
import { CourseService } from '@core/service/course.service';
import { ClassService } from 'app/admin/schedule-class/class.service';
import { Location } from '@angular/common';


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
  studentClassId:any;
  public examAssessmentId!: any;
  public answerAssessmentId!: any;


  constructor(
    private assessmentService: AssessmentService,
    private route: ActivatedRoute,
    private router: Router,
    private studentService : StudentsService,
    private courseService:CourseService,
    private classService: ClassService,
    private location: Location
      ) { }

      ngOnInit(): void {
          this.fetchAssessmentDetails();
          this.getCourseDetails();
          this.getClassDetails();
          this.student();
          this.route.queryParams.subscribe(params => {
            this.retake = params['retake'] === 'true'; 
          });    
          this.applyBlurEffect(); 
          this.startVideoSession(); 
          this.startMonitoringTabSwitch();                      
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
        if(urlPath[urlPath.length-5] != "exam-questions"){
        this.studentClassId=urlPath[urlPath.length-5]
        }
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
          this.stopRecording();
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
          companyId:userId,
          studentClassId:this.studentClassId
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
          this.submitFeedback(this.answerAssessmentId);
          },
          (error: any) => {
            console.error('Error:', error);
          }
        );
      }

      updateExamStatus(): void {
        this.assessmentService.updateExamStatus(this.answerAssessmentId).subscribe(
          () => {
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
            retake: newRetakeNo,
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
       

        //video record
        isDragging: boolean = false; // State to check if dragging is active
  offsetX: number = 0;
  offsetY: number = 0;
  isRecording: boolean = false;

  @ViewChild('proctoringDiv', { static: true }) proctoringDiv!: ElementRef;
  @ViewChild('videoElement') videoElement!: ElementRef;
  mediaRecorder: any;
  recordedChunks: any[] = [];
  mediaStream: MediaStream | null = null;
  visibilityChangeListener: (() => void) | null = null;
  violationCount: number = 0; // Counter for violations
  maxViolations: number = 4; // Set maximum allowed violations
  // Mouse Down Event to Start Dragging
  onMouseDown(event: MouseEvent) {
    this.isDragging = true;
    this.offsetX = event.clientX - this.proctoringDiv.nativeElement.offsetLeft;
    this.offsetY = event.clientY - this.proctoringDiv.nativeElement.offsetTop;

    // Attach mousemove and mouseup events to the document for smooth dragging
    document.addEventListener('mousemove', this.onMouseMove.bind(this));
    document.addEventListener('mouseup', this.onMouseUp.bind(this));
  }

  // Mouse Move Event to Drag the Div
  onMouseMove(event: MouseEvent) {
    if (this.isDragging) {
      // Calculate the new position and apply styles to move the div
      this.proctoringDiv.nativeElement.style.left = event.clientX - this.offsetX + 'px';
      this.proctoringDiv.nativeElement.style.top = event.clientY - this.offsetY + 'px';
    }
  }

  // Mouse Up Event to Stop Dragging
  onMouseUp() {
    this.isDragging = false;
    document.removeEventListener('mousemove', this.onMouseMove.bind(this));
    document.removeEventListener('mouseup', this.onMouseUp.bind(this));
  }

  startVideoSession() {
    this.isRecording = true;
    this.removeBlurEffect(); // Remove blur when starting the recording

    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        this.mediaStream = stream;
        this.videoElement.nativeElement.srcObject = stream;
        this.mediaRecorder = new MediaRecorder(stream);
        this.mediaRecorder.ondataavailable = (event: any) => {
          if (event.data.size > 0) {
            this.recordedChunks.push(event.data);
          }
        };
        this.mediaRecorder.start();
      })
      .catch((error) => {
        this.showWarning('Camera or microphone not accessible.');
        this.isRecording = false;
        this.showPermissionError(); 
      });

    this.checkMediaDevices();
  }

  stopRecording() {
    if (this.mediaRecorder) {
      this.mediaRecorder.stop();
      this.mediaRecorder.onstop = () => {
        const blob = new Blob(this.recordedChunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'recorded-session.webm';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);

        // Stop all tracks in the media stream
        if (this.mediaStream) {
          this.mediaStream.getTracks().forEach((track) => track.stop());
        }
        this.clearWarnings();
        this.stopMonitoringTabSwitch();

        this.applyBlurEffect(); 
        this.isRecording = false;
      };
    }
  }

  // Monitor media devices to ensure availability of audio and video inputs
  checkMediaDevices() {
    navigator.mediaDevices.enumerateDevices()
      .then((devices) => {
        const videoInput = devices.find((device) => device.kind === 'videoinput');
        const audioInput = devices.find((device) => device.kind === 'audioinput');

        if (!videoInput) {
          this.showWarning('No video input device found.');
        }

        if (!audioInput) {
          this.showWarning('No audio input device found.');
        }
      })
      .catch((error) => {
        this.showWarning('Error accessing media devices.');
      });
  }

  // Apply blur effect to the body
  applyBlurEffect() {
    document.body.classList.add('blur-background');
  }

  // Remove blur effect from the body
  removeBlurEffect() {
    document.body.classList.remove('blur-background');
  }

  // Start monitoring tab switches to show warnings
  startMonitoringTabSwitch() {
    this.visibilityChangeListener = () => {
      if (document.hidden) {
        this.showWarning('Tab switch detected.');
        this.showViolationAlert(); // Trigger violation alert on tab switch
      }
    };
    document.addEventListener('visibilitychange', this.visibilityChangeListener);
  }

  stopMonitoringTabSwitch() {
    if (this.visibilityChangeListener) {
      document.removeEventListener('visibilitychange', this.visibilityChangeListener);
      this.visibilityChangeListener = null;
    }
  }

  showWarning(message: string) {
    const warningDiv = document.getElementById('warnings');
    if (warningDiv) {
      const warningMessage = document.createElement('div');
      warningMessage.className = 'alert alert-warning';
      warningMessage.innerText = message;
      warningDiv.appendChild(warningMessage);

      // Apply blur effect
      this.applyBlurEffect();

      // Clear the warning after 2 seconds
      setTimeout(() => {
        warningDiv.removeChild(warningMessage);
        this.clearWarnings(); // Clear all warnings after timeout
      }, 5000);
    }
  }

  clearWarnings() {
    const warningDiv = document.getElementById('warnings');
    if (warningDiv) {
      warningDiv.innerHTML = '';
    }

    // Remove blur effect
    this.removeBlurEffect();
  }

  showViolationAlert() {
    this.violationCount++;

    // Show browser alert
    alert(
      `You are violating the exam rules. If this happens again, the exam will be canceled and you will be terminated.`
    );

    // Check if violation count exceeds maximum allowed violations
    if (this.violationCount > this.maxViolations) {
      this.cancelExam();
    }
  }

  cancelExam() {
    alert("The exam has been canceled due to permission denial.");
    
    // Stop recording automatically
    this.stopRecording(); // Automatically stop recording on page unload
  
    // Delay navigation to allow the alert to show
    setTimeout(() => {
      this.location.back(); // Navigate back to the previous page
    }, 2000); // Delay of 1 second (1000 milliseconds)
  }
  

  showPermissionError() {
    this.applyBlurEffect(); // Blur the background
    Swal.fire({
      title: 'Camera and Microphone Required',
      text: 'Please allow access to your camera and microphone to start the exam.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Retry',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.startVideoSession(); // Retry starting the video session
      } else {
        this.cancelExam(); // Handle case where the user cancels
      }
    });
  }

  @HostListener('window:beforeunload', ['$event'])
  handleUnload(event: any) {
    this.stopRecording(); // Automatically stop recording on page unload
  }
 

}
