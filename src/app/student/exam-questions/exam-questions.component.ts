import {
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  HostListener,
  ElementRef,
  OnDestroy,
  Renderer2,
} from '@angular/core';
import { ActivatedRoute, Router, NavigationStart } from '@angular/router';
import { AssessmentService } from '@core/service/assessment.service';
import { StudentsService } from '../../admin/students/students.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import Swal from 'sweetalert2';
import { CourseService } from '@core/service/course.service';
import { ClassService } from 'app/admin/schedule-class/class.service';
import { Location } from '@angular/common';
import { Subscription, timer } from 'rxjs';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { SpeechRecognitionService } from '@core/service/speech-recognition.service';

@Component({
  selector: 'app-exam-questions',
  templateUrl: './exam-questions.component.html',
  styleUrls: ['./exam-questions.component.scss'],
})
export class ExamQuestionsComponent {
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
  user_name!: string;
  selectedOption: any = '';
  optionsLabel: string[] = ['a)', 'b)', 'c)', 'd)'];
  public answers: any = [];
  answerResult!: any;
  timerInSeconds: number = 0;
  pageSize: number = 10;
  currentPage: number = 0;
  totalQuestions: number = 0;
  skip: number = 0;
  retake: boolean = false;
  retakeNo: number = 0;
  courseDetails: any;
  classDetails: any;
  studentClassId: any;
  public examAssessmentId!: any;
  public answerAssessmentId!: any;
  isDragging: boolean = false;
  offsetX: number = 0;
  offsetY: number = 0;
  isRecording: boolean = false;
  analyzerId: string = '';

  isVoiceDetectionEnabled = false;
  mobilePhoneFound: boolean = false;
  prohibitedObjectFound: boolean = false;
  faceNotVisible: boolean = false;
  multipleFacesVisible: boolean = false;
  checkedPrevLogs: boolean = false;
  isEnableProtector: boolean = false;
  userProfilePic: string = '';
  showOverlay: boolean = false;
  checkFaceMatch: boolean = false;
  faceMatchCount: number = 0;
  faceMisMatchCount: number = 0;
  overLayMsg: string = 'Please wait...';
  assessmentEvaluationType:any;


  @ViewChild('proctoringDiv', { static: true }) proctoringDiv!: ElementRef;
  @ViewChild('videoElement') videoElement!: ElementRef;
  mediaRecorder: any;
  recordedChunks: any[] = [];
  mediaStream: MediaStream | null = null;
  visibilityChangeListener: (() => void) | null = null;
  private visibilityChangeHandler!: () => void;
  private keyPressHandler!: (event: KeyboardEvent) => void;
  violationCount: number = 0;
  maxViolations: number = 5;
  totalTimes: number = 60;
  timerSubscription!: Subscription;

  handleMobilePhoneDetected(): void {
    Swal.fire('Cell Phone Detected', 'Action has been recorded', 'error');
    this.sendWarning('Cell Phone Detected', this.analyzerId);
    this.showViolationAlert();
  }

  handleProhibitedObjectDetected(): void {
    Swal.fire(
      'Prohibited Object Detected',
      'Action has been recorded',
      'error'
    );
    this.sendWarning('Prohibited Object Detected', this.analyzerId);
    this.showViolationAlert();
  }

  handleFaceNotVisible(): void {
    Swal.fire('Face Not Visible', 'Action has been recorded', 'error');
    this.sendWarning('Face Not Visible', this.analyzerId);
    this.showViolationAlert();
  }

  handleMultipleFacesDetected(): void {
    Swal.fire('Multiple Faces Detected', 'Action has been recorded', 'error');
    this.sendWarning('Multiple Face Detected', this.analyzerId);
    this.showViolationAlert();
  }

  handleLookingAwayDetected(): void {
    Swal.fire('Looking Away Detected', 'Action has been recorded', 'error');
    this.sendWarning('Looking Away Detected', this.analyzerId);
    this.showViolationAlert();
  }

  handleHumanVoiceDetect(): void {
    Swal.fire('Human voice Detected', 'Action has been recorded', 'error');
    this.sendWarning('Human voice Detected', this.analyzerId);
    this.showViolationAlert();
  }

  handleMessage(msg: string): void {
    this.overLayMsg = msg;
  }

  handleFaceMatchDetected(isMatch: boolean): void {
    if (isMatch)
      this.faceMatchCount++;
    else {
      this.faceMisMatchCount++;
      this.countingFaceMisMatch();
    }
    if (!isMatch && this.faceMatchCount > 1) {
      this.sendWarning('Face Not Matched', this.analyzerId);
    } else if (this.faceMatchCount == 1) {
      this.checkFaceMatch = false;
      this.showOverlay = false;
      console.log('Face match detected...')
      this.startProtoring();
      this.initializeEventListeners();
      this.startVoiceMonitoring();
      this.calculateTotalTime();
    }
  }

  countingFaceMisMatch() {
    if (this.faceMatchCount == 0 && this.faceMisMatchCount == 5) {
      Swal.fire('Face Not Match', 'The Exam has been canceled due to Face Not Matched', 'error').then(res => {
        this.location.back()
      });
    } else if (this.faceMatchCount < 5) {
      Swal.fire('Face Not Match', 'Action has been recorded', 'error')
    }
  }

  handleFaceMatchError(): void {
    Swal.fire('Face Match Error', 'Please Upload the Profile Picture', 'error').then(res => {
      this.location.back()
    });
  }

  startProtoring() {
    if (!this.analyzerId) {
      const studentId = localStorage.getItem('id') || '';
      let companyId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;

      let payload: any = {
        studentId,
        status: 'connected',
        examAssessmentId: this.examAssessmentId,
        companyId,
        courseId: this.courseId
      };
      this.assessmentService.createAnalyzerId(payload).subscribe((res) => {
        if (res?.response) {
          this.analyzerId = res?.response.id;
        }
      });
    }
  }

  sendWarning(message: string, analyzerId: string) {
    if (this.violationCount > this.maxViolations) {
      return
    }
    const payload = {
      warning_type: message,
    };
    this.assessmentService
      .addWarningById(analyzerId, payload)
      .subscribe((res) => {
        console.log('Uploaded warning=>', message);
      });
  }

  async startVideoAnalyzer() {
    const cameraPermission = await this.checkCameraPermission();
    if (cameraPermission) {
      this.checkFaceMatch = true;
    }
  }

  constructor(
    private assessmentService: AssessmentService,
    private route: ActivatedRoute,
    private router: Router,
    private studentService: StudentsService,
    private courseService: CourseService,
    private classService: ClassService,
    private location: Location,
    private snackBar: MatSnackBar,
    private renderer: Renderer2,
    private speechService: SpeechRecognitionService
  ) { }

  ngOnInit(): void {
    this.getProfilePic();
    this.fetchAssessmentDetails();
    this.getCourseDetails();
    this.getClassDetails();
    this.student();
    this.route.queryParams.subscribe((params) => {
      this.retake = params['retake'] === 'true';
    });
    this.applyBlurEffect();
    // this.startVideoAnalyzer();
    // this.startVideoSession();
    // this.startMonitoringTabSwitch();
  }

  startVoiceMonitoring() {
    this.isVoiceDetectionEnabled = true;
    this.speechService.startListening((detected) => {
      if (detected) {
        this.handleHumanVoiceDetect()
      }
    });
  }


  getClassDetails(): void {
    let urlPath = this.router.url.split('/');
    const examId = urlPath[urlPath.length - 1];
    this.examAssessmentId = examId.split('?')[0];
    this.courseId = urlPath[urlPath.length - 2];
    this.studentId = urlPath[urlPath.length - 3];
    this.answerAssessmentId = urlPath[urlPath.length - 4];

    this.classService
      .getClassesByCourseId(this.courseId)
      .subscribe((response) => {
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
      const videoAnalyzerReq = response?.exam_assessment?.videoAnalyzerReq;
      if (videoAnalyzerReq) {
        const maxViolations = response?.exam_assessment?.violoation_limit;
        this.maxViolations = maxViolations || 5;
        this.isEnableProtector = true;
        this.showOverlay = true;
        this.overLayMsg = 'Opening Camera...'
        this.startVideoAnalyzer();
      }
    });
  }



  async checkCameraPermission(): Promise<boolean> {
    try {
      // Check if Permissions API is supported
      if (navigator.permissions) {
        const status = await navigator.permissions.query({
          name: 'camera' as PermissionName,
        });

        if (status.state === 'granted') {
          console.log('Camera permission granted');
          return true;
        }

        if (status.state === 'prompt') {
          console.log('Camera permission needs to be requested');
          return this.requestCameraPermission(); // This will return a boolean
        }

        if (status.state === 'denied') {
          console.error('Camera permission denied');
          this.showPermissionError();
          return false;
        }
      } else {
        console.warn(
          'Permissions API not supported, directly requesting permission'
        );
        return this.requestCameraPermission(); // Fallback, will return a boolean
      }
    } catch (error) {
      console.error('Error checking camera permission:', error);
      return false; // Ensure the function returns false in case of an error
    }

    // Default return value to satisfy TypeScript
    return false;
  }

  async requestCameraPermission(): Promise<boolean> {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true });
      console.log('Camera access granted');
      return true;
    } catch (error) {
      console.error('Camera access denied:', error);
      this.showPermissionError();
      return false;
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
    // console.log("this.questionList",this.questionList)
    return this.questionList.slice(
      this.getStartingIndex(),
      this.getEndingIndex()
    );
  }

  fetchAssessmentDetails(): void {
    let urlPath = this.router.url.split('/');
    const examId = urlPath[urlPath.length - 1];
    this.examAssessmentId = examId.split('?')[0];
    this.courseId = urlPath[urlPath.length - 2];
    this.studentId = urlPath[urlPath.length - 3];

    this.answerAssessmentId = urlPath[urlPath.length - 4];
    if (urlPath[urlPath.length - 5] != 'exam-questions') {
      this.studentClassId = urlPath[urlPath.length - 5];
    }
    this.assessmentService
      .getAnswerQuestionById(this.examAssessmentId)
      .subscribe((response) => {
        // console.log("response",response);
        // console.log("this.questionList22 ",this.questionList)
        this.questionList = response?.questions;
        this.assessmentEvaluationType=response?.assessmentEvaluationType;
        this.timerInSeconds = response?.timer;
        this.retakeNo = response?.retake;
        // this.answers = Array.from({ length: this.questionList.length }, () => ({
        //   questionText: null,
        //   selectedOptionText: null,
        // }));
        this.answers = this.questionList.map((q:any) => ({
          questionText: q.questionText,
          selectedOptionText: null,
          questionType: q.questionType,
          isCorrect: null,
          fileAnswer: [],
          fileName: null
        }));
        
        this.totalQuestions = this.questionList.length;
        this.goToPage(0);
      });
  }
  clearFileAnswer(index: number) {
    this.answers[index].fileAnswer = null;
    this.answers[index].fileName = null;
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
        // this.answers[index] = {
        //   ...this.answers[index],
        //   questionText: this.questionList[index].questionText,
        //   fileAnswer: {
        //     documentLink,
        //     documentName,
        //     uploadedFileName,
        //   },
        //   fileName: documentName || file.name
        // };
        this.answers[index] = {
          ...this.answers[index],
          questionText: this.questionList[index].questionText,
          questionType: this.questionList[index].questionType,
          fileAnswer: [{
            documentLink,
            documentName,
            uploadedFileName,
          }],
          fileName: documentName || file.name,
          isCorrect: this.questionList[index].status ?? null
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
  // handleTextChange(index: number) {
  //   if (this.answers[index].selectedOptionText) {
  //     this.answers[index].questionText = this.questionList[index]?.questionText;
  //     this.answers[index].fileAnswer = null;
  //     this.answers[index].fileName = null;
  //   }
  // }
  handleTextChange(index: number) {
    if (this.answers[index].selectedOptionText) {
      const question = this.questionList[index];
      this.answers[index] = {
        ...this.answers[index],
        questionText: question.questionText,
        questionType: question.questionType,
        isCorrect: question.status ?? null,
        fileAnswer: null,
        fileName: null
      };
    }
  }
  
  student() {
    this.studentService.getStudentById(this.studentId).subscribe((res: any) => {
      this.user_name = res.name;
    });
  }

  getProfilePic() {
    const studentId = localStorage.getItem('id') || '';
    this.studentService.getStudentById(studentId).subscribe(async (res: any) => {
      const userProfilePicture = res?.avatar;
      this.userProfilePic = userProfilePicture;
      // this.startProtoring();
    });
  }

  // handleRadioChange(index: any) {
  //   this.answers[index].questionText = this.questionList[index]?.questionText;
  //   this.selectedOption = '';
  // }

  handleRadioChange(index: number) {
    const question = this.questionList[index];
    const selected = this.answers[index].selectedOptionText;
  
    this.answers[index] = {
      ...this.answers[index],
      questionText: question.questionText,
      questionType: question.questionType,
      isCorrect: question.status ?? null
    };
  
    this.selectedOption = '';
  }
  
  correctAnswers(value: any) {
    return this.questionList.filter((v: any) => v.status === value).length;
  }

  confirmSubmit() {
    // const nullOptionExists = this.answers.some(
    //   (answer: any) => answer.selectedOptionText === null
    // );
    const nullOptionExists = this.answers.some((answer: any) => {
      const isTextEmpty = answer.selectedOptionText === null || answer.selectedOptionText === '';
      const isFileEmpty = !answer.fileAnswer || answer.fileAnswer.length === 0;
      return isTextEmpty && isFileEmpty; 
    });
    
    // console.log("answer",this.answers)
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
      clearInterval(this.interval);
      this.stopRecording();
      // console.log("this.retake--->",this.retake)
      if (this.retake && result.isConfirmed) {
        this.updateAnswers();
      } else if (result.isConfirmed) {
        // console.log("subbbbbbbMit",true)
        this.submitAnswers();
      }
    });
  }

  submitAnswers() {
    clearInterval(this.interval);
    let userId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
    const requestBody = {
      studentId: this.studentId,
      examAssessmentId: this.examAssessmentId,
      assessmentAnswerId: this.answerAssessmentId,
      courseId: this.courseId,
      answers: this.answers,
      companyId: userId,
      studentClassId: this.studentClassId,
      assessmentEvaluationType:this.assessmentEvaluationType,
      evaluationStatus:"pending"
    };

    // console.log('Submitting Answer...>',requestBody)

    this.assessmentService.submitAssessment(requestBody).subscribe(
      (response: any) => {
        Swal.fire({
          title: 'Submitted!',
          text: 'Your answers were submitted.',
          icon: 'success',
        });
        // console.log("requestBodysubmit",requestBody)
        // console.log("this.retake",this.retake)
        if (!this.retake) {
          this.updateExamStatus();
        }
        this.answerId = response.response;
        if (this.analyzerId && this.isEnableProtector) {
          this.assessmentService
            .updateAnalyzer(this.analyzerId, {
              examAnswerId: this.answerId,
              status: 'closed',
            })
            .subscribe((res) => {
              this.submitFeedback(response.response);
            });
        } else {
          this.submitFeedback(response.response);
        }
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
      companyId: userId,
      assessmentEvaluationType:this.assessmentEvaluationType,
      evaluationStatus:"pending",
      
    };
    // console.log("requestBody",requestBody)
    this.assessmentService.updateAssessment(requestBody).subscribe(
      (response: any) => {
        Swal.fire({
          title: 'Submitted!',
          text: 'Your answers were submitted.',
          icon: 'success',
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
      () => { },
      (error) => {
        console.error('Error updating exam status:', error);
      }
    );
  }

  updateClassCompleted() {
    const studentId = localStorage.getItem('id') || '';
    const classId = this.classDetails.id;
    let payload = {
      status: 'completed',
      studentId: studentId,
      playbackTime: 100,
      classId,
    };

    this.classService
      .saveApprovedClasses(classId, payload)
      .subscribe((response) => { });
  }

  updateRetakes() {
    if (this.retakeNo >= 1) {
      const newRetakeNo = this.retakeNo - 1;
      const requestBody = {
        id: this.examAssessmentId,
        retake: newRetakeNo,
      };
      this.assessmentService.updateRetakes(requestBody).subscribe(
        (response: any) => { },
        (error: any) => {
          console.error('Error:', error);
        }
      );
    } else {
      Swal.fire({
        title: 'Cannot Update!',
        text: 'You have already reached the minimum retake number.',
        icon: 'error',
      });
    }
  }
  getAnswerById() {
    this.assessmentService
      .getAnswerById(this.answerId)
      .subscribe((res: any) => {
        this.answerResult = res.assessmentAnswer;
        const assessmentAnswer = res.assessmentAnswer;
        const assessmentId = assessmentAnswer.examAssessmentId;
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
        this.isanswersSubmitted = true;
      });
  }

  // attendedQuestions() {
  //   return this.answers.filter((v: any) => v.selectedOptionText !== null)
  //     .length;
  // }
  attendedQuestions() {
    return this.answers.filter((answer: any) => {
      const isTextAnswered = answer.selectedOptionText !== null && answer.selectedOptionText !== '';
      const isFileAnswered = answer.fileAnswer?.length > 0;
      return isTextAnswered || isFileAnswered;
    }).length;
  }
  
  calculateTotalTime() {
    this.totalTime = this.questionList.length * this.timerInSeconds;
    this.startTimer();
  }

  startTimer() {
    console.log(`Time Left: ${this.totalTime}, Interval ID: ${this.interval}`);
    if (this.interval) {
      clearInterval(this.interval);
    }
    this.interval = setInterval(() => {
      if (this.totalTime > 0) {
        this.minutes = Math.floor(this.totalTime / 60);
        this.seconds = this.totalTime % 60;
        this.totalTime--;
      } else {
        clearInterval(this.interval);
        this.interval = null;
        this.submitAnswers();
      }
    }, 1000);
  }

  ngOnDestroy() {
    clearInterval(this.interval);
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
    document.removeEventListener(
      'visibilitychange',
      this.visibilityChangeHandler
    );
    document.removeEventListener('keydown', this.keyPressHandler);
    this.isVoiceDetectionEnabled = false;
    this.speechService.stopListening();
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

  routingButton() {
    if (this.retake) {
      this.router.navigate(['student/enrollment/exam-results']);
    } else {
      this.router.navigate(['student/enrollment/assessment-exam']);
    }
  }

  titleRoute() {
    if (this.retake) {
      return 'Results';
    } else {
      return 'Continue';
    }
  }

  submitFeedback(examAssessmentAnswerId: any) {
    let isDirect = this.courseDetails?.examType === 'direct';
    let urlPath = this.router.url.split('/');
    const examId = urlPath[urlPath.length - 1];
    this.examAssessmentId = examId.split('?')[0];
    this.courseId = urlPath[urlPath.length - 2];
    this.studentId = urlPath[urlPath.length - 3];
    this.answerAssessmentId = urlPath[urlPath.length - 4];
    this.classId = isDirect ? this.courseId : this.classDetails.id;

    const isPaid = this.courseDetails?.feeType === 'paid';
    const queryParam = this.courseDetails?.examType
      ? { examType: this.courseDetails?.examType }
      : {};
    if (isPaid) {
      this.router.navigate(
        [
          '/student/feedback/courses',
          this.classId,
          this.studentId,
          this.courseId,
        ],
        { queryParams: { ...queryParam, examAssessmentAnswerId } }
      );
    } else {
      this.router.navigate(
        [
          '/student/feedback/freecourse',
          this.classId,
          this.studentId,
          this.courseId,
        ],
        { queryParams: { ...queryParam, examAssessmentAnswerId } }
      );
    }
  }

  // Handle mouse down
  onMouseDown(event: MouseEvent, element: HTMLElement) {
    this.isDragging = true;
    this.offsetX = event.offsetX;
    this.offsetY = event.offsetY;

    this.renderer.listen('document', 'mousemove', (e: MouseEvent) =>
      this.onMouseMove(e, element)
    );
    this.renderer.listen('document', 'mouseup', () => this.onMouseUp());
  }

  // Handle mouse move
  onMouseMove(event: MouseEvent, element: HTMLElement) {
    if (this.isDragging) {
      const containerRect =
        this.proctoringDiv.nativeElement.getBoundingClientRect();

      // Calculate new position
      const left = event.clientX - this.offsetX;
      const top = event.clientY - this.offsetY;

      // Restrict movement within the container
      if (
        left >= containerRect.left &&
        left + element.offsetWidth <= containerRect.right &&
        top >= containerRect.top &&
        top + element.offsetHeight <= containerRect.bottom
      ) {
        element.style.position = 'fixed';
        element.style.left = `${left - containerRect.left}px`;
        element.style.top = `${top - containerRect.top}px`;
      }
    }
  }

  onMouseUp() {
    this.isDragging = false;
  }

  startVideoSession() {
    this.isRecording = true;
    this.removeBlurEffect();

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
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

  checkMediaDevices() {
    navigator.mediaDevices
      .enumerateDevices()
      .then((devices) => {
        const videoInput = devices.find(
          (device) => device.kind === 'videoinput'
        );
        const audioInput = devices.find(
          (device) => device.kind === 'audioinput'
        );

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

  applyBlurEffect() {
    document.body.classList.add('blur-background');
  }

  removeBlurEffect() {
    document.body.classList.remove('blur-background');
  }

  initializeEventListeners(): void {
    this.visibilityChangeHandler = this.handleVisibilityChange.bind(this);
    this.keyPressHandler = this.handleKeyPress.bind(this);

    document.addEventListener('visibilitychange', this.visibilityChangeHandler);
    document.addEventListener('keydown', this.keyPressHandler);
  }


  handleVisibilityChange(): void {
    if (document.hidden && this.isEnableProtector) {
      Swal.fire('Changed Tab Detected', 'Action has been Recorded', 'error');
      this.sendWarning('Changed Tab Detected', this.analyzerId);
      this.showViolationAlert();
    }
  }

  handleKeyPress(event: KeyboardEvent): void {
    if ((event.altKey || event.ctrlKey) && this.isEnableProtector) {
      Swal.fire(`${event.altKey ? 'Alt' : 'Ctrl'} Key Press Detected`, 'Action has been Recorded', 'error');
      this.sendWarning(`${event.altKey ? 'Alt' : 'Ctrl'} Key Press Detected`, this.analyzerId);
      this.showViolationAlert();
    }
  }

  startMonitoringTabSwitch() {
    this.visibilityChangeListener = () => {
      if (document.hidden) {
        this.showWarning('Tab switch detected.');
        this.showViolationAlert();
      }
    };
    document.addEventListener(
      'visibilitychange',
      this.visibilityChangeListener
    );
  }

  stopMonitoringTabSwitch() {
    if (this.visibilityChangeListener) {
      document.removeEventListener(
        'visibilitychange',
        this.visibilityChangeListener
      );
      this.visibilityChangeListener = null;
    }
  }

  showNotification(
    colorName: string,
    text: string,
    placementFrom: MatSnackBarVerticalPosition,
    placementAlign: MatSnackBarHorizontalPosition
  ) {
    this.snackBar.open(text, '', {
      duration: 6000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName,
    });
  }

  showWarning(message: string) {
    const warningDiv = document.getElementById('warnings');
    if (warningDiv) {
      const warningMessage = document.createElement('div');
      warningMessage.className = 'alert alert-warning';
      warningMessage.innerText = message;
      warningDiv.appendChild(warningMessage);
      this.applyBlurEffect();
      setTimeout(() => {
        warningDiv.removeChild(warningMessage);
        this.clearWarnings();
      }, 5000);
    }
  }

  clearWarnings() {
    const warningDiv = document.getElementById('warnings');
    if (warningDiv) {
      warningDiv.innerHTML = '';
    }
    this.removeBlurEffect();
  }

  showViolationAlert() {
    this.violationCount++;
    console.log('Violation count:', this.violationCount);
    if (this.violationCount >= this.maxViolations) {
      Swal.fire('Max violation reached', 'The Exam will be canceled and you will be terminated', 'error').then(res => {
        this.location.back()
      });
    }
  }

  handleStopExam() {
    Swal.fire('Live Person Detection failed', 'The Exam will be canceled due to no face movement detected', 'error').then(res => {
      this.location.back()
    });
  }

  cancelExam() {
    alert('The exam has been canceled due to permission denial.');
    this.stopRecording();
    setTimeout(() => {
      this.location.back();
    }, 2000);
  }

  showPermissionError() {
    this.applyBlurEffect();
    Swal.fire({
      title: 'Camera and Microphone Required',
      text: 'Please allow access to your camera and microphone to start the exam.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Retry',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.startVideoAnalyzer();
      } else {
        this.cancelExam();
      }
    });
  }

  @HostListener('window:beforeunload', ['$event'])
  handleUnload(event: any) {
    this.stopRecording();
  }
}