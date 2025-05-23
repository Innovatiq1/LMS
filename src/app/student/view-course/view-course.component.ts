import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  Inject,
  OnDestroy,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseKitModel } from '@core/models/course.model';
import { CommonService } from '@core/service/common.service';
import { CourseService } from '@core/service/course.service';
import { ClassService } from 'app/admin/schedule-class/class.service';
import { local } from 'd3';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';

import Swal from 'sweetalert2';
import { StudentVideoPlayerComponent } from './student-video-player/student-video-player.component';
import { Subject, takeUntil } from 'rxjs';
import * as Plyr from 'plyr';
import { T } from '@angular/cdk/keycodes';
import { MatDialog } from '@angular/material/dialog';
import DomToImage from 'dom-to-image';
import { DocumentViewComponent } from './document-view/document-view.component';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { StudentsService } from 'app/admin/students/students.service';
import { SurveyService } from 'app/admin/survey/survey.service';
import { PaymentDailogComponent } from './payment-dailog/payment-dailog.component';
import { SettingsService } from '@core/service/settings.service';
import { InvoiceComponent } from './invoice/invoice.component';
import * as moment from 'moment';
import jsPDF from 'jspdf';
import { AssessmentService } from '@core/service/assessment.service';
import { AppConstants } from '@shared/constants/app.constants';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { environment } from 'environments/environment';
import { HttpClient } from '@angular/common/http';

declare var Scorm2004API: any;
declare var Scorm12API: any;
export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
];
@Component({
  selector: 'app-view-course',
  templateUrl: './view-course.component.html',
  styleUrls: ['./view-course.component.scss'],
})
export class ViewCourseComponent implements OnDestroy {
  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;
  @ViewChild('discountDialog') discountDialog!: TemplateRef<any>;

  displayedColumns: string[] = [
    'position',
    ' Class Start Date ',
    ' Class End Date ',
    'action',
  ];
  displayedColumns1: string[] = ['video'];
  displayedColumns2: string[] = ['scormKit'];
  dataSource: any;
  currentPlaybackProgress: number = 0;
  playbackProgress: number = 0;
  questionForm!: FormGroup;
  isPlaying = false;
  lastPausedAt: number = 0;
  courseReferenceNumber: string = '';
  courseKitModel!: Partial<CourseKitModel>;
  templates: any[] = [];
  currentDate!: Date;
  breadscrums = [
    {
      title: 'Courses',
      items: ['Course'],
      active: 'View Details',
    },
  ];
  array: number[] = [];
  isRegistered = false;
  subscribeParams: any;
  classId: any;
  classDetails: any;
  courseId: any;
  courseKitDetails: any;
  studentClassDetails: any;
  isStatus = false;
  isApproved = false;
  isTest: boolean = true;
  isDocument: boolean = false;
  isCancelled = false;
  isCompleted = false;
  isDiscountVerification: boolean = false;
  isApproval: boolean = false;
  documentLink: any;
  uploadedDoc: any;
  title!: string;
  private player!: Plyr;
  videoStatus!: string;
  courseCompleted = false;
  certificateIssued = false;
  courseKit: any[] = [];
  viPath = 'assets/sample.mp4';
  videoData: any;
  videosrc!: string;
  header!: string;
  coursekitDetails: any;
  playBackTime!: number;
  duration!: number;
  currentVideoIndex = 0;
  private unsubscribe$ = new Subject<void>();
  sdiscrption!: string;
  url: any;
  longDescription: any;
  assessmentInfo!: any;
  examAssessmentInfo!: any;
  isAnswersSubmitted: boolean = false;
  isFeedBackSubmitted: boolean = false;
  questionList: any = [];
  answersResult!: any;
  getAssessmentId!: any;
  feedbackInfo!: any;
  freeCourse: boolean;
  paidCourse: boolean;
  free = false;
  paid = false;
  program = false;
  courseDetails: any;
  courseDetailsId: any;
  razorPayKey: any;
  isInvoice: boolean = false;
  paidAmount: boolean = false;

  isScormKitInit: boolean = false;

  pdfData: any = [];
  dafaultGenratepdf: boolean = false;
  element: any;
  invoiceUrl: any;
  verify = false;
  payment = false;
  selectedDiscount: any;
  selectedDiscountType: any;

  questionTimer: number = 60;
  defaultTab: string = 'home';
  assessmentTaken!: number;
  examAssessmentTaken!: number;
  assessmentAnswerLatest: any;
  registeredClassId: any;
  discounts: any;
  allDiscounts: any;
  commonRoles: any;
  discountType: any;
  discountValue: any;
  totalFee: any;
  isCertificate: string = '';
  paidProgram: boolean;
  assessmentTempInfo: any = null;
  isShowFeedback: boolean = false;
  isShowAssessmentQuestions: boolean = false;
  feeType: string = '';
  isScormCourseKit: boolean = false;
  scormModules: any[] = [];
  iframeUrl: string = '';
  private prefix: string = environment.Url;
  currentScormModule: any;
  lastcommit: any;
  scormKit: any;
  RetakeRequestCount = 0;
  retakeResponseData: any;
  approval: any;
  discount_Type: any;
  tpDiscountValue: any;
  isScormKit: boolean = false;
  isVideoKit: boolean = false;
  isLoading: boolean = true;
  constructor(
    private classService: ClassService,
    private activatedRoute: ActivatedRoute,
    private modalServices: BsModalService,
    private courseService: CourseService,
    @Inject(DOCUMENT) private document: any,
    private commonService: CommonService,
    private formBuilder: FormBuilder,
    private router: Router,
    private studentService: StudentsService,
    private surveyService: SurveyService,
    public dialog: MatDialog,
    private settingsService: SettingsService,
    private assessmentService: AssessmentService,
    private changeDetectorRef: ChangeDetectorRef,
    private sanitizer: DomSanitizer,
    private http: HttpClient
  ) {
    let urlPath = this.router.url.split('/');
    this.paidCourse = urlPath.includes('view-course');
    this.freeCourse = urlPath.includes('view-freecourse');
    this.paidProgram = urlPath.includes('view-programcourse');

    if (this.freeCourse) {
      this.free = true;
      this.subscribeParams = this.activatedRoute.params.subscribe((params) => {
        this.courseDetailsId = params['id'];
        this.getCourseKitDetails(this.courseDetailsId);
        this.getAssessmentAnswerCount(this.courseDetailsId);
        this.getExamAssessmentAnswerCount(this.courseDetailsId);
      });
      this.getRegisteredFreeCourseDetails();
    } else if (this.paidCourse) {
      this.paid = true;
      this.subscribeParams = this.activatedRoute.params.subscribe((params) => {
        this.classId = params['id'];
      });
      localStorage.setItem('classId', this.classId);
      this.getClassDetails();
      this.commonService.notifyVideoObservable$
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(() => {
          this.getRegisteredClassDetails();
        });
      this.getRegisteredClassDetails();
    } else if (this.paidProgram) {
      this.paid = true;
      this.subscribeParams = this.activatedRoute.params.subscribe((params) => {
        this.courseDetailsId = params['id'];
        this.getCourseKitDetails(this.courseDetailsId);
      });
    }
  }
  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params) => {
      if (params['tab'] === 'assessment') {
        this.defaultTab = 'test';
      }
    });
    this.commonRoles = AppConstants;

    setTimeout(() => {
      this.isLoading = false;
    }, 3000);
  }
  // openDocumentDialog(documentLink: string, filename: string): void {
  //   this.dialog.open(DocumentViewComponent, {
  //     data: { documentLink, filename },
  //     width: '80%',
  //     height: '80%'
  //   });
  // }
  getSafeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
  openDocumentDialog(url: string, filename: string): void {
    // console.log("viewCourse page ==",url);
    this.dialog.open(DocumentViewComponent, {
      width: '100%',
      height: '100%',
      data: { url },
    });
  }
  getClassDetails() {
    this.classService.getClassById(this.classId).subscribe((response) => {
      this.classDetails = response;
      this.feeType = this.classDetails.courseId.feeType;
      this.approval = this.classDetails?.courseId?.approval;
      this.courseReferenceNumber = this.classDetails?.courseReferenceNumber;

      this.courseId = this.classDetails.courseId.id;
      this.dataSource = this.classDetails.sessions;
      if (!this.paidProgram) {
        this.getCourseKitDetails(this.courseId);
      }
      this.getAssessmentAnswerCount(this.courseId);
      this.getRetakeRequests(this.courseId);
      this.getExamAssessmentAnswerCount(this.courseId);
      this.getTPAssessmentData();
    });
  }

  onTimeUpdate(event: any) {
    let time = this.commonService.getPlayBackTime();
    this.videoPlayer.nativeElement.addEventListener('timeupdate', () => {
      const progress =
        (this.videoPlayer.nativeElement.currentTime /
          this.videoPlayer.nativeElement.duration) *
        100;
      this.array.push(progress);

      this.commonService.setProgress(this.array);
    });
    this.videoPlayer.nativeElement.addEventListener('loadedmetadata', () => {
      const initialPlaybackPosition =
        (time / 100) * this.videoPlayer.nativeElement.duration;

      this.videoPlayer.nativeElement.currentTime = initialPlaybackPosition;
    });
    if (this.paid) {
      this.videoPlayer.nativeElement.addEventListener('ended', () => {
        let classId = localStorage.getItem('classId');
        let studentId = localStorage.getItem('id');
        const videoDetails = this.commonService.getVideoDetails();
        this.courseService
          .getVideoPlayedById(studentId, classId, videoDetails.id)
          .subscribe((response) => {
            if (response) {
              this.checkStudentClassRedirect();
            } else {
              let payload = {
                status: 'ended',
                studentId: studentId,
                classId: classId,
                videoId: videoDetails.id,
              };

              this.courseService.saveVideoPlayTime(payload).subscribe(() => {
                this.checkStudentClassRedirect();
              });
            }
          });
      });
    } else if (this.free) {
      this.videoPlayer.nativeElement.addEventListener('ended', () => {
        let courseId = this.courseDetailsId;
        let studentId = localStorage.getItem('id');
        const videoDetails = this.commonService.getVideoDetails();
        this.courseService
          .getVideoPlayedById(studentId, courseId, videoDetails.id)
          .subscribe((response) => {
            if (response) {
              this.checkStudentClassRedirect();
            } else {
              let payload = {
                status: 'ended',
                studentId: studentId,
                courseId: courseId,
                videoId: videoDetails.id,
              };
              this.courseService.saveVideoPlayTime(payload).subscribe(() => {
                this.checkStudentClassRedirect();
              });
            }
          });
      });
    }
  }

  checkStudentClassRedirect() {
    let courseId = this.courseDetailsId;
    let studentId: any = localStorage.getItem('id');
    let classId = localStorage.getItem('classId');
    const videoDetails = this.commonService.getVideoDetails();

    this.courseService
      .getStudentClass(studentId, classId)
      .subscribe((response) => {
        this.studentClassDetails = response.data.docs[0].coursekit;

        if (
          this.studentClassDetails.playbackTime !== 100 ||
          !this.studentClassDetails.playbackTime
        ) {
          const unmatchedDocuments = this.studentClassDetails.filter(
            (doc: { videoId: any }) => doc.videoId !== videoDetails.id
          );
          const allUnmatchedCompleted = unmatchedDocuments.every(
            (doc: { playbackTime: number }) => doc.playbackTime === 100
          );

          if (allUnmatchedCompleted) {
            this.courseService
              .getStudentClass(studentId, this.classId)
              .subscribe((response) => {
                this.studentClassDetails = response.data.docs[0];
                this.scormKitInit();
                const issueCertificate =
                  this.studentClassDetails.classId.courseId.issueCertificate;
                const learningTutorial =
                  this.studentClassDetails.classId.courseId.learningTutorial;
                const playBackTimes = this.studentClassDetails.playbackTime;
                this.isTest =
                  issueCertificate === 'test' && playBackTimes === 100
                    ? true
                    : false;
                this.isDocument =
                  issueCertificate === 'document' ? false : true;
                if (this.studentClassDetails.status == 'approved') {
                  if (this.paid) {
                    const targetURL = `/student/questions/${classId}/${studentId}/${this.courseId}`;
                    if (this.router.url != targetURL) {
                      if (issueCertificate == 'test') {
                        if (this.classDetails.courseId.tutorial != null) {
                          this.router.navigate([
                            '/student/questions/',
                            classId,
                            studentId,
                            this.courseId,
                          ]);
                        } else {
                        }
                      } else if (
                        issueCertificate == 'video' &&
                        learningTutorial
                      ) {
                        if (this.classDetails.courseId.tutorial != null) {
                          this.router.navigate(
                            [
                              '/student/questions/',
                              classId,
                              studentId,
                              this.courseId,
                            ],
                            {
                              queryParams: {
                                learningTutorial:
                                  this.studentClassDetails.classId.courseId
                                    .learningTutorial,
                              },
                            }
                          );
                        }
                      } else {
                        let payload = {
                          classId: this.classId,
                          playbackTime: 100,
                          status: 'completed',
                          studentId: studentId,
                        };
                        this.classService
                          .saveApprovedClasses(this.classId, payload)
                          .subscribe((response) => {
                            Swal.fire({
                              title: 'Course Completed Successfully',
                              text: 'Please Wait For the Certificate',
                              icon: 'success',
                            }).then((result) => {
                              if (result.isConfirmed) {
                                location.reload();
                              }
                            });
                          });
                      }
                    }
                  } else if (this.free) {
                    const targetURL = `/student/questions/freecourse/${classId}/${studentId}/${this.courseId}`;
                    if (this.router.url != targetURL) {
                      if (issueCertificate == 'test') {
                        if (this.classDetails.courseId.tutorial != null) {
                          this.router.navigate([
                            '/student/questions/freecourse/',
                            classId,
                            studentId,
                            this.courseId,
                          ]);
                        } else {
                        }
                      }
                      if (issueCertificate == 'video' && learningTutorial) {
                        if (this.classDetails.courseId.tutorial != null) {
                          this.router.navigate(
                            [
                              '/student/questions/freecourse/',
                              classId,
                              studentId,
                              this.courseId,
                            ],
                            {
                              queryParams: {
                                learningTutorial:
                                  this.studentClassDetails.classId.courseId
                                    .learningTutorial,
                              },
                            }
                          );
                        }
                      } else {
                        let payload = {
                          classId: this.classId,
                          playbackTime: 100,
                          status: 'completed',
                          studentId: studentId,
                        };

                        this.classService
                          .saveApprovedClasses(this.classId, payload)
                          .subscribe((response) => {
                            Swal.fire({
                              title: 'Course Completed Successfully',
                              text: 'Please Wait For the Certificate',
                              icon: 'success',
                            }).then((result) => {
                              if (result.isConfirmed) {
                                location.reload();
                              }
                            });
                          });
                      }
                    }
                  }
                } else {
                }
              });
          } else {
            let payload = {
              status: 'notCompleted',
              studentId: studentId,
            };
            this.classService
              .saveApprovedClasses(classId, payload)
              .subscribe((response) => { });
          }
        } else {
        }
      });
  }
  onPlay() {
    this.isPlaying = true;
  }

  playVideos(video: {
    name: any;
    discription: string;
    id: any;
    playbackTime: any;
  }) {
    this.videoPlayer.nativeElement.currentTime = video?.playbackTime;
    this.commonService.setPlayBackTime(video?.playbackTime);

    this.courseService.getCoursekitVideoById(video.id).subscribe((data) => {
      let videoUrl = data?.data;
      this.videoPlayer.nativeElement.src = videoUrl?.video_url;
    });
    this.sdiscrption = video.discription;
    this.header = video.name;
    this.commonService.setVideoDetails(video);
  }

  getDiscounts(id: any) {
    // debugger
    this.courseService.getDiscount(id).subscribe((response) => {
      this.discounts = response.filter(
        (item) => !item.discountTitle.includes('&')
      );
      this.allDiscounts = response;
      this.openDialog(this.discountDialog);
    });
  }
  submitDiscount(dialogRef?: any) {
    var userdata = JSON.parse(localStorage.getItem('currentUser')!);
    // let department= JSON.parse(localStorage.getItem('user_data')!).user.department;
    var studentId = localStorage.getItem('id');
    const today = new Date();
    const date = today.toISOString().split('T')[0];
    if (this.approval == 'no') {
      this.registerClass();
      dialogRef.close();
    } else {
      let body = {
        email: userdata.user.email,
        name: userdata.user.name,
        adminEmail: userdata.user.adminEmail,
        adminName: userdata.user.adminName,
        companyId: userdata.user.companyId,
        department: userdata.user.department,
        courseTitle: this.classDetails?.courseId?.title,
        courseFee:
          this.classDetails?.courseId?.fee + this.classDetails?.instructorCost,
        studentId: studentId,
        classId: this.classId,
        title: this.title,
        coursekit: this.courseKit,
        date: date,
        verify: false,
        discount_type: this.selectedDiscountType || 0,
        discount: this.selectedDiscount?.id,
      };
      this.courseService.saveRegisterClass(body).subscribe((response) => {
        Swal.fire({
          title: 'Thank you',
          text: 'We will verify details & enable payment',
          icon: 'success',
        });
        dialogRef?.close();
        this.payment = false;
        this.isRegistered = true;
        this.getRegisteredClassDetails();
        if (this.isDiscountVerification == true) {
          this.isDiscountVerification = false;
        }
      });
    }
  }

  openDialog(templateRef: any): void {
    const dialogRef = this.dialog.open(templateRef, {
      width: '1000px',
      data: { discounts: this.discounts },
    });
  }

  reRegister() {
    var userdata = JSON.parse(localStorage.getItem('currentUser')!);
    let department = JSON.parse(localStorage.getItem('user_data')!).user
      .department;
    var studentId = localStorage.getItem('id');
    if (this.approval == 'yes') {
      let payload = {
        studentId: studentId,
        classId: this.classId,
        title: this.title,
        department: userdata.user.department,
        coursekit: this.courseKit,
        courseStartDate: this.classDetails?.courseId?.sessionStartDate,
        courseEndDate: this.classDetails?.courseId?.sessionEndDate,
        email: userdata.user.email,
        name: userdata.user.name,
        courseTitle: this.courseDetails?.title,
        courseFee:
          this.classDetails?.courseId?.fee +
          this.classDetails?.instructorCost || 0,
        courseId: this.courseDetails.id,
        companyId: userdata.user.companyId,
        verify: true,
        paid: true,
      };
      this.courseService.saveRegisterClass(payload).subscribe((response) => {
        Swal.fire({
          title: 'Thank you',
          text: 'We will approve once verified',
          icon: 'success',
        });
        this.getRegisteredClassDetails();
        this.isApproval = false;
      });
    } else if (this.approval == 'no') {
      let payload = {
        studentId: studentId,
        classId: this.classId,
        title: this.title,
        department: userdata.user.department,
        coursekit: this.courseKit,
        courseStartDate: this.classDetails?.courseId?.sessionStartDate,
        courseEndDate: this.classDetails?.courseId?.sessionEndDate,
        email: userdata.user.email,
        name: userdata.user.name,
        courseTitle: this.courseDetails?.title,
        courseFee:
          this.classDetails?.courseId?.fee +
          this.classDetails?.instructorCost || 0,
        courseId: this.courseDetails.id,
        companyId: userdata.user.companyId,
        verify: true,
        paid: true,
        status: 'approved',
      };
      this.courseService.saveRegisterClass(payload).subscribe((response) => {
        Swal.fire({
          title: 'Thank you',
          text: 'All the Best for learning!',
          icon: 'success',
        });
        this.getRegisteredClassDetails();
      });
    }
  }
  tpDiscount() {
    const courseReferenceNumber = this.classDetails?.courseReferenceNumber || '';
    const trainingPartnerUen = localStorage.getItem('uen') || '';

    const payload = {
      courses: [
        {
          courseReferenceNumber: courseReferenceNumber,
          trainingPartnerUen: 'S70SS0009L',
        },
      ],
    };
    // console.log('Payload:', payload);

    this.http.post('http://localhost:3001/getGrantCalculations', payload).subscribe(
      (response: any) => {
        const course = response?.courses?.[0];
        if (course?.funding?.eligibleGrants?.eligibleGrantDetails?.length > 0) {
          this.tpDiscountValue = course.funding.eligibleGrants.eligibleGrantDetails;
        } else {
          console.log('No eligible grant details available.');
        }
      },
      (error) => {
        console.error('API Error:', error);
      }
    );

    this.openDialog(this.discountDialog);
  }

  submitForVerification(classId: string, action?: string) {
    // debugger
    var userdata = JSON.parse(localStorage.getItem('currentUser')!);
    let department = JSON.parse(localStorage.getItem('user_data')!).user
      .department;
    var studentId = localStorage.getItem('id');
    // if (this.paid && this.feeType=="paid" && this.approval == "yes") {
    //   if(this.isDiscountVerification == true){
    //     this.submitDiscount()
    //   } else {
    //     this.getDiscounts(userdata.user.companyId);
    //   }

    // } else if(this.paid && this.feeType=="paid"&& this.approval == "no"){
    //   this.getDiscounts(userdata.user.companyId);
    // }
    if (this.paid && this.feeType === 'paid' && this.approval === 'yes') {
      if (this.discount_Type === 'application discount') {
        if (this.isDiscountVerification === true) {
          this.submitDiscount();
        } else {
          this.getDiscounts(userdata.user.companyId);
        }
      } else if (this.discount_Type === 'tp gateway discount') {
        this.tpDiscount();
      } else if (this.discount_Type === 'none') {
        this.submitDiscount();
      }

    } else if (this.paid && this.feeType === 'paid' && this.approval === 'no') {
      if (this.discount_Type === 'application discount' || this.discount_Type === 'tp gateway discount') {
        this.getDiscounts(userdata.user.companyId);
      }
    } else if (this.paid && this.feeType == 'free' && this.approval == 'yes') {
      let payload = {
        studentId: studentId,
        classId: this.classId,
        title: this.title,
        department: userdata.user.department,
        coursekit: this.courseKit,
        courseStartDate: this.classDetails?.courseId?.sessionStartDate,
        courseEndDate: this.classDetails?.courseId?.sessionEndDate,
        email: userdata.user.email,
        name: userdata.user.name,
        courseTitle: this.courseDetails?.title,
        courseFee: 0,
        courseId: this.courseDetails.id,
        companyId: userdata.user.companyId,
        verify: true,
        paid: true,
      };
      this.courseService.saveRegisterClass(payload).subscribe((response) => {
        Swal.fire({
          title: 'Thank you',
          text: 'We will approve once verified',
          icon: 'success',
        });
        this.isRegistered = true;
        this.payment = true;
        this.verify = true;
        this.paidAmount = true;
      });
    } else if (this.paid && this.feeType == 'free' && this.approval == 'no') {
      let payload = {
        studentId: studentId,
        classId: this.classId,
        title: this.title,
        department: userdata.user.department,
        coursekit: this.courseKit,
        courseStartDate: this.classDetails?.courseId?.sessionStartDate,
        courseEndDate: this.classDetails?.courseId?.sessionEndDate,
        email: userdata.user.email,
        name: userdata.user.name,
        courseTitle: this.courseDetails?.title,
        courseFee: 0,
        courseId: this.courseDetails.id,
        companyId: userdata.user.companyId,
        verify: true,
        paid: true,
        status: 'approved',
      };
      this.courseService.saveRegisterClass(payload).subscribe((response) => {
        Swal.fire({
          title: 'Thank you',
          text: 'All the Best for learning!',
          icon: 'success',
        });
        this.getRegisteredClassDetails();
      });
    }
  }
  registerClass(classId?: string) {
    // console.log("regis", this.discountValue)
    var userdata = JSON.parse(localStorage.getItem('currentUser')!);
    var studentId = localStorage.getItem('id');
    if (this.paid) {
      if (this.feeType == 'paid' && this.approval == 'yes') {
        const today = new Date();
        const date = today.toISOString().split('T')[0];
        let body = {
          email: userdata.user.email,
          name: userdata.user.name,
          courseTitle: this.classDetails?.courseId?.title,
          courseFee:
            this.classDetails?.courseId?.fee +
            this.classDetails?.instructorCost,
          instructorCost: this.classDetails?.instructorCost,
          studentId: studentId,
          classId: this.classId,
          title: this.title,
          coursekit: this.courseKit,
          date: date,
          discountType: this.discountType ? this.discountType : '',
          discountValue: this.discountValue ? this.discountValue : 0,
          courseStartDate: this.classDetails?.courseId?.sessionStartDate,
          courseEndDate: this.classDetails?.courseId?.sessionEndDate,
        };
        const invoiceDialogRef = this.dialog.open(InvoiceComponent, {
          width: '1000px',
          height: '600px',
          data: body,
        });
        invoiceDialogRef.afterClosed().subscribe((res) => {
          if (res) {
            this.totalFee = res.totalValue;
            const dialogRef = this.dialog.open(PaymentDailogComponent, {
              width: '450px',
              height: '300px',
              data: { payment: '' },
            });
            dialogRef.afterClosed().subscribe((result) => {
              if (result) {
                if (result.payment === 'card') {
                  this.generateInvoice(body);
                  setTimeout(() => {
                    let payload = {
                      email: userdata.user.email,
                      name: userdata.user.name,
                      courseTitle: this.classDetails?.courseId?.title,
                      courseFee: res.totalValue
                        ? res.totalValue
                        : res.courseFee,
                      studentId: studentId,
                      classId: this.classId,
                      title: this.title,
                      coursekit: this.courseKit,
                      paid: true,
                      stripe: true,
                      adminEmail: userdata.user.adminEmail,
                      adminName: userdata.user.adminName,
                      companyId: userdata.user.companyId,
                      invoiceUrl: this.invoiceUrl,
                      courseStartDate:
                        this.classDetails?.courseId?.sessionStartDate,
                      courseEndDate:
                        this.classDetails?.courseId?.sessionEndDate,
                      status: 'registered',
                    };

                    this.classService
                      .saveApprovedClasses(this.registeredClassId, payload)
                      .subscribe((response) => {
                        this.document.location.href = response.data.session.url;
                        this.getClassDetails();
                      });
                  }, 5000);
                } else if (result.payment === 'other') {
                  let payload = {
                    email: userdata.user.email,
                    name: userdata.user.name,
                    courseTitle: this.classDetails?.courseId?.title,
                    courseFee: res.totalValue,
                    studentId: studentId,
                    classId: this.classId,
                    title: this.title,
                    coursekit: this.courseKit,
                  };

                  this.courseService
                    .createOrder(payload)
                    .subscribe((response) => {
                      if (response.status == 200) {
                        this.settingsService
                          .getPayment()
                          .subscribe((res: any) => {
                            this.razorPayKey = res.data.docs[0].keyId;
                            const paymentOrderId = response.data.id;
                            const options: any = {
                              key: this.razorPayKey,
                              amount: this.totalFee,
                              currency: 'INR',
                              name: userdata.user.email,
                              description: this.classDetails?.courseId?.title,
                              order_id: paymentOrderId,
                              modal: {
                                escape: false,
                              },
                              notes: {},
                              theme: {
                                color: '#ddcbff',
                              },
                            };
                            setTimeout(() => {
                              options.handler = (response: any, error: any) => {
                                options.response = response;
                                if (error) {
                                  this.router.navigate([
                                    '/student/fail-course/',
                                    this.classId,
                                  ]);
                                } else {
                                  this.courseService
                                    .verifyPaymentSignature(
                                      response,
                                      paymentOrderId
                                    )
                                    .subscribe((response: any) => {
                                      let body = {
                                        courseTitle:
                                          this.classDetails?.courseId?.title,
                                        courseFee:
                                          this.classDetails?.courseId?.fee +
                                          this.classDetails?.instructorCost,
                                      };
                                      this.generateInvoice(body);
                                      setTimeout(() => {
                                        let payload = {
                                          email: userdata.user.email,
                                          name: userdata.user.name,
                                          courseTitle:
                                            this.classDetails?.courseId?.title,
                                          courseFee: this.totalFee,
                                          studentId: studentId,
                                          classId: this.classId,
                                          title: this.title,
                                          coursekit: this.courseKit,
                                          orderId:
                                            response?.data?.payment
                                              ?.original_order_id,
                                          paymentId:
                                            response?.data?.payment
                                              ?.razorpay_payment_id,
                                          razorpay: true,
                                          invoiceUrl: this.invoiceUrl,
                                          paid: true,
                                          adminEmail: userdata.user.adminEmail,
                                          adminName: userdata.user.adminName,
                                          courseStartDate:
                                            this.classDetails?.courseId
                                              ?.sessionStartDate,
                                          courseEndDate:
                                            this.classDetails?.courseId
                                              ?.sessionEndDate,
                                        };

                                        this.classService
                                          .saveApprovedClasses(
                                            this.registeredClassId,
                                            payload
                                          )
                                          .subscribe((res) => {
                                            this.getClassDetails();

                                            response.data.isPaymentVerfied
                                              ? this.router.navigate([
                                                '/student/sucess-course/',
                                                this.classId,
                                              ])
                                              : this.router.navigate([
                                                '/student/fail-course/',
                                                this.classId,
                                              ]);
                                          });
                                      }, 5000);
                                    });
                                }
                              };
                              options.modal.ondismiss = () => {
                                alert('Transaction has been cancelled.');
                                this.router.navigate([
                                  '/student/fail-course/',
                                  this.classId,
                                ]);
                              };
                              const rzp =
                                new this.courseService.nativeWindow.Razorpay(
                                  options
                                );
                              rzp.open();
                            }, 100);
                          });
                      } else {
                        alert('Server side error');
                      }
                    });
                }
              }
            });
          }
        });
      } else if (this.feeType == 'paid' && this.approval == 'no') {
        const today = new Date();
        const date = today.toISOString().split('T')[0];
        let body = {
          email: userdata.user.email,
          name: userdata.user.name,
          courseTitle: this.classDetails?.courseId?.title,
          courseFee:
            this.classDetails?.courseId?.fee +
            this.classDetails?.instructorCost,
          instructorCost: this.classDetails?.instructorCost,
          studentId: studentId,
          classId: this.classId,
          title: this.title,
          coursekit: this.courseKit,
          date: date,
          discountType: this.discountType
            ? this.discountType
            : this.selectedDiscount
              ? this.selectedDiscount.discountType
              : '',
          discountValue: this.discountValue
            ? this.discountValue
            : this.selectedDiscount
              ? this.selectedDiscount.value
              : 0,

          courseStartDate: this.classDetails?.courseId?.sessionStartDate,
          courseEndDate: this.classDetails?.courseId?.sessionEndDate,
        };
        const invoiceDialogRef = this.dialog.open(InvoiceComponent, {
          width: '1000px',
          height: '600px',
          data: body,
        });
        invoiceDialogRef.afterClosed().subscribe((res) => {
          if (res) {
            this.totalFee = res.totalValue;
            const dialogRef = this.dialog.open(PaymentDailogComponent, {
              width: '450px',
              height: '300px',
              data: { payment: '' },
            });
            dialogRef.afterClosed().subscribe((result) => {
              if (result) {
                if (result.payment === 'card') {
                  this.generateInvoice(body);
                  setTimeout(() => {
                    let payload = {
                      email: userdata.user.email,
                      name: userdata.user.name,
                      courseTitle: this.classDetails?.courseId?.title,
                      courseFee: res.totalValue,
                      courseId: this.classDetails?.courseId?.id,
                      studentId: studentId,
                      classId: this.classId,
                      title: this.title,
                      coursekit: this.courseKit,
                      paid: true,
                      stripe: true,
                      adminEmail: userdata.user.adminEmail,
                      adminName: userdata.user.adminName,
                      companyId: userdata.user.companyId,
                      invoiceUrl: this.invoiceUrl,
                      courseStartDate:
                        this.classDetails?.courseId?.sessionStartDate,
                      courseEndDate:
                        this.classDetails?.courseId?.sessionEndDate,
                      status: 'approved',
                      verify: true,
                    };

                    this.classService;
                    this.courseService
                      .saveRegisterClass(payload)
                      .subscribe((response) => {
                        this.document.location.href = response.data.session.url;
                        this.getClassDetails();
                        this.getRegisteredClassDetails();
                      });
                  }, 5000);
                } else if (result.payment === 'other') {
                  let payload = {
                    email: userdata.user.email,
                    name: userdata.user.name,
                    courseTitle: this.classDetails?.courseId?.title,
                    courseFee: res.totalValue,
                    studentId: studentId,
                    classId: this.classId,
                    title: this.title,
                    coursekit: this.courseKit,
                  };

                  this.courseService
                    .createOrder(payload)
                    .subscribe((response) => {
                      if (response.status == 200) {
                        this.settingsService
                          .getPayment()
                          .subscribe((res: any) => {
                            this.razorPayKey = res.data.docs[0].keyId;
                            const paymentOrderId = response.data.id;
                            const options: any = {
                              key: this.razorPayKey,
                              amount: this.totalFee,
                              currency: 'INR',
                              name: userdata.user.email,
                              description: this.classDetails?.courseId?.title,
                              order_id: paymentOrderId,
                              modal: {
                                escape: false,
                              },
                              notes: {},
                              theme: {
                                color: '#ddcbff',
                              },
                            };
                            setTimeout(() => {
                              options.handler = (response: any, error: any) => {
                                options.response = response;
                                if (error) {
                                  this.router.navigate([
                                    '/student/fail-course/',
                                    this.classId,
                                  ]);
                                } else {
                                  this.courseService
                                    .verifyPaymentSignature(
                                      response,
                                      paymentOrderId
                                    )
                                    .subscribe((response: any) => {
                                      let body = {
                                        courseTitle:
                                          this.classDetails?.courseId?.title,
                                        courseFee:
                                          this.classDetails?.courseId?.fee +
                                          this.classDetails?.instructorCost,
                                      };
                                      this.generateInvoice(body);
                                      setTimeout(() => {
                                        let payload = {
                                          email: userdata.user.email,
                                          name: userdata.user.name,
                                          courseTitle:
                                            this.classDetails?.courseId?.title,
                                          courseFee: this.totalFee,
                                          studentId: studentId,
                                          classId: this.classId,
                                          title: this.title,
                                          coursekit: this.courseKit,
                                          orderId:
                                            response?.data?.payment
                                              ?.original_order_id,
                                          paymentId:
                                            response?.data?.payment
                                              ?.razorpay_payment_id,
                                          razorpay: true,
                                          invoiceUrl: this.invoiceUrl,
                                          paid: true,
                                          adminEmail: userdata.user.adminEmail,
                                          adminName: userdata.user.adminName,
                                          courseStartDate:
                                            this.classDetails?.courseId
                                              ?.sessionStartDate,
                                          courseEndDate:
                                            this.classDetails?.courseId
                                              ?.sessionEndDate,
                                        };

                                        this.classService
                                          .saveApprovedClasses(
                                            this.registeredClassId,
                                            payload
                                          )
                                          .subscribe((res) => {
                                            this.getClassDetails();

                                            response.data.isPaymentVerfied
                                              ? this.router.navigate([
                                                '/student/sucess-course/',
                                                this.classId,
                                              ])
                                              : this.router.navigate([
                                                '/student/fail-course/',
                                                this.classId,
                                              ]);
                                          });
                                      }, 5000);
                                    });
                                }
                              };
                              options.modal.ondismiss = () => {
                                alert('Transaction has been cancelled.');
                                this.router.navigate([
                                  '/student/fail-course/',
                                  this.classId,
                                ]);
                              };
                              const rzp =
                                new this.courseService.nativeWindow.Razorpay(
                                  options
                                );
                              rzp.open();
                            }, 100);
                          });
                      } else {
                        alert('Server side error');
                      }
                    });
                }
              }
            });
          }
        });
      }
    }
  }
  generateInvoice(element: any) {
    Swal.fire({
      title: 'Loading Payment Screen...',
      text: 'Please wait...',
      allowOutsideClick: false,
      timer: 24000,
      timerProgressBar: true,
    });

    this.isInvoice = true;
    this.pdfData = [];
    let pdfObj = {
      title: element?.courseTitle,
      courseFee: element?.courseFee,
      invoiceDate: moment().format('DD ddd MMM YYYY'),
    };
    this.pdfData.push(pdfObj);
    this.changeDetectorRef.detectChanges();

    var convertIdDynamic = 'contentToConvert';
    this.genratePdf3(convertIdDynamic);
  }

  genratePdf3(convertIdDynamic: any) {
    this.isInvoice = true;
    setTimeout(() => {
      this.waitForElement(convertIdDynamic).then((dashboard) => {
        if (dashboard != null) {
          const dashboardHeight = dashboard.clientHeight;
          const dashboardWidth = dashboard.clientWidth;

          const options = {
            background: 'white',
            width: dashboardWidth,
            height: dashboardHeight,
          };

          DomToImage.toPng(dashboard, options).then((imgData) => {
            const doc = new jsPDF(
              dashboardWidth > dashboardHeight ? 'l' : 'p',
              'mm',
              [dashboardWidth, dashboardHeight]
            );
            const imgProps = doc.getImageProperties(imgData);
            const pdfWidth = doc.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

            doc.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            const currentDateTime = moment();
            const randomString = this.generateRandomString(10);

            const pdfData = new File(
              [doc.output('blob')],
              randomString + 'invoice.pdf',
              {
                type: 'application/pdf',
              }
            );
            this.classService.uploadFileApi(pdfData).subscribe(
              (data: any) => {
                this.invoiceUrl = data.inputUrl;
              },
              (err) => { }
            );
          });
          this.isInvoice = false;
        } else {
          console.error('Element not found');
        }
      });
    }, 500);
  }
  private waitForElement(
    id: string,
    interval = 100,
    maxAttempts = 10
  ): Promise<HTMLElement | null> {
    let attempts = 0;
    return new Promise((resolve) => {
      const intervalId = setInterval(() => {
        const element = document.getElementById(id);
        if (element || attempts >= maxAttempts) {
          clearInterval(intervalId);
          resolve(element);
        }
        attempts++;
      }, interval);
    });
  }
  generateRandomString(length: number) {
    const characters =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomIndex);
    }
    return result;
  }

  getCourseKitDetails(id: string) {
    this.courseService.getCourseById(id).subscribe((response) => {
      this.courseKitDetails = response?.course_kit;
      this.courseDetails = response;
      // console.log('this.courseDetails', this.courseDetails);
      this.discount_Type = this.courseDetails.discount_type;
      // console.log('this.courseDetails', this.discount_Type);
      this.courseKitDetails.map((item: any) => {
        this.url = item?.videoLink[0]?.video_url;
      });

      // console.log("get the courseKit Details==",this.courseKitDetails)

      this.courseKit = this.courseKitDetails.map((kit: any) => ({
        shortDescription: kit.shortDescription,
        longDescription: kit.longDescription,
        documentLink: kit.documentLink,
        name: kit.name,
        filename: kit?.videoLink[0]?.doc_filename,
        videoId: kit?.videoLink[0]?.id,
        inputUrl: kit?.videoLink[0]?.video_url,
        url: kit?.videoLink[0]?.url,
        playbackTime: 0,
        kitType: kit.kitType,
        scormKit: kit.scormKit,
      }));

      this.isScormCourseKit = this.courseKit.some((v) => v.kitType === 'scorm');
      // console.log('courseKit:',this.courseKit);

      this.scormModules =
        this.courseKit.find((v) => v.kitType === 'scorm')?.scormKit?.modules ||
        [];
      this.scormKit = this.courseKit.find(
        (v) => v.kitType === 'scorm'
      )?.scormKit;
      // console.log(this.studentClassDetails)
      this.scormKitInit();

      if (this.paidProgram) {
        this.classService
          .getClassList({ courseId: this.courseDetails.id, program: 'yes' })
          .subscribe((response) => {
            this.classId = response.docs[0].id;
            localStorage.setItem('classId', this.classId);
            this.getClassDetails();
            this.commonService.notifyVideoObservable$
              .pipe(takeUntil(this.unsubscribe$))
              .subscribe(() => {
                this.getRegisteredClassDetails();
              });
            this.getRegisteredClassDetails();
          });
      }

      this.documentLink = this.courseKitDetails[0].documentLink;
      const uploadedDocument = this.documentLink?.split('/');
      this.uploadedDoc = uploadedDocument?.pop();
      this.title = response?.title;
      this.assessmentInfo = response?.assessment;
      this.questionList = response?.assessment?.questions || [];
      this.questionTimer = this.assessmentInfo.timer;
      this.examAssessmentInfo = response?.exam_assessment;
      this.updateShowAssessmentQuestions();
      const survey = response?.survey;
      this.feedbackInfo = survey
        ? {
          name: survey?.name,
          id: survey?.id,
          questions: survey?.questions?.map((question: any) => ({
            questionText: question?.questionText,
            type: question?.type,
            isMandatory: question?.isMandatory,
            maxRating: question?.maxRating,
            options:
              question?.options?.map((option: any) => option.text) || null,
          })),
        }
        : null;
    });
  }

  scormKitInit() {
    this.isScormKit = this.courseKit?.some((v) => v.kitType === 'scorm');
    this.isVideoKit = !this.isScormKit

    if (this.scormModules.length && !this.isScormKitInit) {
      let lastModuleId = this.scormModules[0]._id;
      if (this.studentClassDetails.scormKit && this.scormModules.length > 0 && this.studentClassDetails.scormKit.currentScormModule) {
        lastModuleId =
          this.studentClassDetails.scormKit.currentScormModule;
        this.lastcommit = this.studentClassDetails.scormKit.lastCommit;
      }
      let lastModule = this.scormModules.find(
        (v) => v._id === lastModuleId
      );
      if (!lastModule) {
        lastModule = this.scormModules[0];
      }
      const launchUrl = lastModule?.launch;
      const scormKit = this.scormKit;
      const url = scormKit?.path + '/' + launchUrl;
      this.currentScormModule = lastModule;
      this.openScormModule(lastModule, scormKit);
      this.isScormKitInit = true;
    }
  }
  getAttendanceDetails(getstudentClassDetails: any) {
    // console.log("this.courseDetails",getstudentClassDetails)
    const userData = JSON.parse(localStorage.getItem('user_data') || '');
    const currentDate = new Date().toISOString().split('T')[0];
    const options = { hour12: true };
    const currentTime = new Date().toLocaleTimeString('en-US', options);

    let companyId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
    // console.log("userData",userData)
    const palyload = {
      "uen": localStorage.getItem('uen') || '',
      "courseRunId": getstudentClassDetails?.classId?.courseTPRunId,
      "runId": getstudentClassDetails?.classId?.courseTPRunId,
      "courseId": getstudentClassDetails?.courseId?.id,
      "Title": getstudentClassDetails?.courseId?.title,
      "traineeId": userData.user.id,
      "date": currentDate,
      "time": currentTime,
      "companyId": companyId,
      "course": {
        "sessionID": "",
        "attendance": {
          "status": {
            "code": "1"
          },
          "trainee": {
            "id": "S1913366D",
            "name": userData.user.name + userData.user.last_name,
            "email": userData.user.email,
            "idType": {
              "code": userData?.user?.idType?.code
            },
            "contactNumber": {
              "mobile": userData.user.mobile,
              "areaCode": null,
              "countryCode": 65
            },
            "numberOfHours": 3.5,
            "surveyLanguage": {
              "code": "EL"
            }
          }
        },
        "referenceNumber": getstudentClassDetails?.courseId?.courseCode
      },
      "corppassId": "S5883425D"
    }
    this.settingsService.saveAttendance(palyload).subscribe((res) => {
      console.log("attendance", res)
    })

  }
  getRegisteredClassDetails() {
    const studentId = localStorage.getItem('id');
    this.courseService
      .getStudentClass(studentId, this.classId)
      .subscribe((response) => {


        this.studentClassDetails = response?.data?.docs[0];
        this.scormKitInit();
        this.registeredClassId = response?.data?.docs[0]?.id;
        if (response.data.docs[0].discount) {
          this.discountType = response?.data?.docs[0]?.discount.discountType;
          this.discountValue = response?.data?.docs[0]?.discount.value;

        } else {

          this.discountType = '';
          this.discountValue = response?.data?.docs[0]?.discount_type;
        }
        this.coursekitDetails = response?.data?.docs[0]?.coursekit;
        this.longDescription = this?.coursekitDetails[0]?.longDescription;
        let totalPlaybackTime = 0;
        let documentCount = 0;
        let lastModuleId = this.scormModules[0]?._id;
        if (this.studentClassDetails.scormKit && this.scormModules.length > 0) {
          lastModuleId =
            this.studentClassDetails.scormKit.currentScormModule;
          this.lastcommit = this.studentClassDetails.scormKit.lastCommit;
        }

        let lastModule: any = this.scormModules.find(
          (v) => v._id === lastModuleId
        );
        if (!lastModule) {
          lastModule = this.scormModules[0];
        }
        const launchUrl = lastModule?.launch;
        const scormKit = this.scormKit;
        const url = scormKit?.path + '/' + launchUrl;
        // this.initScorm2004(url);
        // console.log('launchUrl==', this.scormModules);


        this.coursekitDetails.forEach(
          (doc: { playbackTime: any }, index: number) => {
            const playbackTime = doc.playbackTime;
            totalPlaybackTime += playbackTime;
            documentCount++;
          }
        );
        const time = totalPlaybackTime / documentCount;
        this.playBackTime = time;
        this.commonService.setCompletedPercentage(this.playBackTime);
        const issueCertificate =
          this.studentClassDetails.classId.courseId.issueCertificate;
        const playBackTimes = this.studentClassDetails.playbackTime;

        if (
          this.studentClassDetails.status == 'registered' &&
          this.studentClassDetails.verify == true &&
          this.studentClassDetails.paid == false
        ) {
          this.isRegistered = true;
          this.isStatus = true;
          this.verify = true;
          this.payment = true;
          this.paidAmount = false;
        }
        if (
          this.studentClassDetails.status == 'registered' &&
          this.studentClassDetails.verify == true &&
          this.studentClassDetails.paid == true
        ) {
          this.isRegistered = true;
          this.isStatus = true;
          this.verify = true;
          this.payment = true;
          this.paidAmount = true;
        }

        if (
          this.studentClassDetails.status == 'registered' &&
          this.studentClassDetails.verify == false
        ) {
          this.isRegistered = true;
          this.isStatus = true;
          this.payment = false;
          this.verify = false;
        }

        if (this.studentClassDetails.status == 'approved') {
          this.getAttendanceDetails(this.studentClassDetails);
          // console.log("this is the approved==", this.studentClassDetails)
          this.isTest =
            issueCertificate === 'test' && playBackTimes === 100 ? true : false;
          this.isDocument = issueCertificate === 'document' ? false : true;
          this.isRegistered == true;
          this.isApproved = true;
        }
        if (
          !this.studentClassDetails.certifiacteUrl &&
          this.studentClassDetails.status == 'completed'
        ) {
          this.isTest =
            issueCertificate === 'test' && playBackTimes === 100 ? true : false;
          this.isDocument = issueCertificate === 'document' ? false : true;
          this.isRegistered == true;
          this.isCompleted = true;
        }
        if (
          this.studentClassDetails.certifiacteUrl &&
          this.studentClassDetails.status == 'completed'
        ) {
          this.isTest =
            issueCertificate === 'test' && playBackTimes === 100 ? true : false;
          this.isRegistered == true;
          this.isCompleted = true;
          this.isCertificate = 'Yes';
          this.certificateIssued = true;
        }
        if (
          this.studentClassDetails.status == 'cancel' &&
          this.studentClassDetails.discountVerification == false
        ) {
          this.isRegistered == true;
          this.isCancelled = true;
          this.isDiscountVerification = true;
        }

        if (
          this.studentClassDetails.status == 'cancel' &&
          this.studentClassDetails.approval == false
        ) {
          this.isRegistered == true;
          this.isCancelled = true;
          this.isApproval = true;
        }
      });
  }

  getAssessmentAnswerCount(courseId: string) {
    const studentId = localStorage.getItem('id') || '';
    // const retakeRequestCount
    this.assessmentService
      .getAssessmentAnswerCount(studentId, courseId)
      .subscribe((response: any) => {
        // this.assessmentTaken = response['count']-this.RetakeRequestCount;
        this.assessmentTaken = response['count'];
        // const retakeRequestCount=this.getRetakeRequests(studentId,courseId);
        // console.log('assessmentTake=', this.assessmentTaken);
        if (this.RetakeRequestCount == 1) {
          this.updateRetakeRequest(courseId);
        }
        this.updateShowAssessmentQuestions();
        this.assessmentAnswerLatest = response['latestRecord'];
        if (this.assessmentTaken >= 1) {
          this.updateCompletionStatus();
        }
      });
  }
  updateRetakeRequest(courseId: any) {
    const studentId = localStorage.getItem('id') || '';
    this.retakeResponseData.data[0].retakes = 0;
    const payload = this.retakeResponseData.data[0];
    this.settingsService
      .putRetakeRequestByStudentIdCourseId(studentId, courseId, payload)
      .subscribe((response) => {
        // console.log('response updateRetakeRequest=', response);
      });
  }
  getRetakeRequests(courseId: any) {
    const studentId = localStorage.getItem('id') || '';
    this.settingsService
      .getRetakeRequestByStudentIdAndCourseId(studentId, courseId)
      .subscribe((response) => {
        this.retakeResponseData = response;
        this.RetakeRequestCount = response.data[0].retakes;
      });
    // console.log("this.RetakeRequestCount",this.RetakeRequestCount);
    //  this.updateRetakeRequest(courseId)
  }

  updateShowAssessmentQuestions() {
    if (
      this.assessmentTempInfo &&
      !this.assessmentInfo.resultAfterFeedback &&
      this.isFeedBackSubmitted
    ) {
      this.assessmentTempInfo = null;
      this.isAnswersSubmitted = false;
      this.answersResult = null;
      this.questionList = this.assessmentInfo?.questions || [];
    }
    if (this.RetakeRequestCount === 1) {
      this.assessmentTaken = 1;
    }
    // console.log('this.assessmentTaken', this.assessmentTaken);
    // console.log('this.assessmentInfo.retake', this.assessmentInfo.retake);
    // if(this.assessmentTaken == this.assessmentInfo.retake){
    //   // this.isShowAssessmentQuestions =  false;
    //   this.isRetakeOver=false;
    // }
    if (this.assessmentTaken <= this.assessmentInfo.retake) {
      if (
        this.assessmentTempInfo == null ||
        (this.isAnswersSubmitted && !this.isFeedBackSubmitted)
      ) {
        if (
          this.assessmentInfo.resultAfterFeedback &&
          this.isAnswersSubmitted &&
          !this.isFeedBackSubmitted
        ) {
          this.isShowAssessmentQuestions = false;
          this.isShowFeedback = true;
        } else if (this.isShowFeedback) {
          this.isShowAssessmentQuestions = false;
        } else {
          this.isShowAssessmentQuestions = true;
          this.isShowFeedback = false;
        }
        this.isFeedBackSubmitted = false;
      } else if (
        this.assessmentInfo.resultAfterFeedback &&
        this.isAnswersSubmitted &&
        this.isFeedBackSubmitted
      ) {
        this.isShowAssessmentQuestions = true;
        this.isShowFeedback = false;
        this.assessmentTempInfo = null;
      } else {
        this.isShowAssessmentQuestions = true;
        this.isFeedBackSubmitted = false;
      }
    } else {
      this.isShowAssessmentQuestions = false;
    }
  }

  updateCompletionStatus() {
    const studentId = localStorage.getItem('id') || '';
    let payload = {
      studentId: studentId,
      classId: this.classId,
      playBackTime: 100,
    };
    this.classService
      .saveApprovedClasses(this.classId, payload)
      .subscribe((response) => { });
  }

  getExamAssessmentAnswerCount(courseId: string) {
    const studentId = localStorage.getItem('id') || '';
    this.assessmentService
      .getExamAssessmentAnswerCount(studentId, courseId)
      .subscribe((response: any) => {
        this.examAssessmentTaken = response['count'];
      });
  }

  getRegisteredFreeCourseDetails() {
    const studentId = localStorage.getItem('id');
    this.courseService
      .getStudentFreeCourse(studentId, this.courseDetailsId)
      .subscribe((response) => {
        this.studentClassDetails = response?.data?.docs[0];
        this.scormKitInit();
        this.coursekitDetails = response?.data?.docs[0]?.coursekit;

        this.longDescription = this?.coursekitDetails[0]?.longDescription;
        let totalPlaybackTime = 0;
        let documentCount = 0;
        this.coursekitDetails.forEach(
          (doc: { playbackTime: any }, index: number) => {
            const playbackTime = doc.playbackTime;
            totalPlaybackTime += playbackTime;
            documentCount++;
          }
        );
        const time = totalPlaybackTime / documentCount;
        this.playBackTime = time;
        this.commonService.setCompletedPercentage(this.playBackTime);
        if (this.studentClassDetails.status == 'registered') {
          this.isRegistered == true;
          this.isStatus = true;
        }
        if (this.studentClassDetails.status == 'approved') {
          this.isRegistered == true;
          this.isApproved = true;
        }
        if (
          !this.studentClassDetails.certifiacteUrl &&
          this.studentClassDetails.status == 'completed'
        ) {
          this.isRegistered == true;
          this.isCompleted = true;
        }
        if (
          this.studentClassDetails.certifiacteUrl &&
          this.studentClassDetails.status == 'completed'
        ) {
          this.isRegistered == true;
          this.isCompleted = true;
          this.certificateIssued = true;
        }
        if (this.studentClassDetails.status == 'cancel') {
          this.isRegistered == true;
          this.isCancelled = true;
        }
      });
  }

  parseDate(dateString: string): Date {
    return new Date(dateString);
  }

  toggleVideoPlay() {
    const video = this.videoPlayer.nativeElement;
    if (this.isPlaying) {
      video.pause();
    } else {
      video.play();
    }
  }

  destroyModal(): void {
    const playBackTime = this.commonService.getProgressArray();
    const videoDetails = this.commonService.getVideoDetails();
    let lastButOneValue = playBackTime[playBackTime.length - 1];
    let classId = localStorage.getItem('classId');
    let courseId = this.courseDetailsId;
    let studentId = localStorage.getItem('id');
    // console.log('lastButOneValue', lastButOneValue);
    if (this.paid) {
      let payload = {
        studentId: studentId,
        classId: classId,
        playbackTime: lastButOneValue,
        videoId: videoDetails.id,
      };
      let time = this.commonService.getPlayBackTime();
      if (lastButOneValue < time) {
      } else {
        this.classService
          .saveApprovedClasses(classId, payload)
          .subscribe((response) => {
            this.courseService
              .getStudentClass(studentId, classId)
              .subscribe((response) => {
                // debugger
                this.studentClassDetails = response.data.docs[0];
                this.scormKitInit();
                this.coursekitDetails = response.data.docs[0].coursekit;
                let totalPlaybackTime = 0;
                let documentCount = 0;
                this.coursekitDetails.forEach(
                  (doc: { playbackTime: any }, index: number) => {
                    const playbackTime = doc.playbackTime;
                    totalPlaybackTime += playbackTime;
                    documentCount++;
                  }
                );
                let time = totalPlaybackTime / documentCount;
                this.playBackTime = time;
                this.commonService.setCompletedPercentage(this.playBackTime);
                let percentage = this.commonService.getCompletedPercentage();
                let body = {
                  studentId: studentId,
                  playBackTime: percentage,
                  classId: classId,
                };
                this.classService
                  .saveApprovedClasses(classId, body)
                  .pipe(takeUntil(this.unsubscribe$))
                  .subscribe((response) => {
                    this.commonService.notifyVideoMethod();
                  });
              });
          });
      }
    } else if (this.free) {
      let payload = {
        studentId: studentId,
        courseId: courseId,
        playbackTime: lastButOneValue,
        videoId: videoDetails.id,
      };
      let time = this.commonService.getPlayBackTime();
      if (lastButOneValue < time) {
      } else {
        this.classService
          .saveApprovedClasses(courseId, payload)
          .subscribe((response) => {
            this.courseService
              .getStudentFreeCourse(studentId, courseId)
              .subscribe((response) => {
                this.studentClassDetails = response.data.docs[0];
                this.scormKitInit();
                this.coursekitDetails = response.data.docs[0].coursekit;
                let totalPlaybackTime = 0;
                let documentCount = 0;
                this.coursekitDetails.forEach(
                  (doc: { playbackTime: any }, index: number) => {
                    const playbackTime = doc.playbackTime;
                    totalPlaybackTime += playbackTime;
                    documentCount++;
                  }
                );
                let time = totalPlaybackTime / documentCount;
                this.playBackTime = time;
                this.commonService.setCompletedPercentage(this.playBackTime);
                let percentage = this.commonService.getCompletedPercentage();
                let body = {
                  studentId: studentId,
                  playBackTime: percentage,
                  courseId: this.courseDetailsId,
                };
                this.classService
                  .saveApprovedClasses(courseId, body)
                  .pipe(takeUntil(this.unsubscribe$))
                  .subscribe((response) => {
                    this.commonService.notifyVideoMethod();
                  });
              });
          });
      }
    }
  }
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
  getTPAssessmentData() {
    let uen = localStorage.getItem('uen') || '';
    const userData = JSON.parse(localStorage.getItem('user_data') || '');
    const currentDate = new Date().toISOString().split('T')[0];
    let TPAssessment = {
      assessment: {
        passingCriteria: this.courseDetails?.assessment?.passingCriteria || 0,
        trainingPartner: {
          uen: uen,
        },
        course: {
          referenceNumber: this.classDetails.course.courseReferenceNumber,
          run: {
            id: this.classDetails.courseTPRunId,
          },
        },
        trainee: {
          idType: userData.user.idType.description,
          id: userData.user.idNumber,
          fullName: userData.user.name,
        },
        result: '',
        score: 0,
        grade: '',
        assessmentDate: currentDate,
      },
    };
    return TPAssessment;
  }

  submitAnswers(payload: any = []) {
    const studentId = localStorage.getItem('id');
    const assesmentId = this.assessmentInfo?.id;
    let TpAassment1 = this.getTPAssessmentData();
    const requestBody = {
      studentId,
      assessmentId: assesmentId,
      courseId: payload.courseId,
      answers: payload.answers,
      is_tutorial: payload.is_tutorial,
      tpAssessment: TpAassment1,
      assessmentEvaluationType: this.courseDetails?.assessment?.assessmentEvaluationType,
      evaluationStatus: "pending",
    };

    // console.log('helo', requestBody);
    this.studentService.submitAssessment(requestBody).subscribe(
      (response: any) => {
        Swal.fire({
          title: 'Submitted!',
          text: 'Your answers were submitted.',
          icon: 'success',
        })
        // .then(() => {
        //   // Show second popup if evaluation type is Manual
        //   if (requestBody.assessmentEvaluationType === 'Manual') {
        //     Swal.fire({
        //       title: 'Please wait!',
        //       text: 'Your answers will be evaluated manually. You will be notified once the evaluation is complete.',
        //       icon: 'info',
        //     });
        //   }
        // });
        this.isAnswersSubmitted = true;
        this.assessmentTempInfo = requestBody;
        this.getAssessmentAnswerCount(payload.courseId);
        this.getAnswerById(response.response);
      },
      (error: any) => {
        console.error('Error:', error);
      }
    );
  }

  openFeedBack(payload: any) {
    if (!this.assessmentInfo.resultAfterFeedback) {
      this.isShowFeedback = true;
    } else {
      this.isShowFeedback = false;
      this.questionList = this.assessmentInfo?.questions || [];
      this.assessmentTempInfo = null;
      this.isAnswersSubmitted = false;
      this.router.navigate(['/student/enrollment/assessment-exam']);
    }
    this.updateShowAssessmentQuestions();
  }

  getAnswerById(answerId: string) {
    this.isFeedBackSubmitted = false;

    this.studentService.getAnswerById(answerId).subscribe((res: any) => {
      this.getAssessmentId = res.assessmentAnswer.assessmentId.id;
      this.isAnswersSubmitted = true;
      this.answersResult = res.assessmentAnswer;
      const assessmentAnswer = res.assessmentAnswer;
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
      this.isAnswersSubmitted = true;
    });
  }

  submitFeedback(event: any) {
    this.isFeedBackSubmitted = false;
    const studentId = localStorage.getItem('id');
    const userData = JSON.parse(localStorage.getItem('user_data') || '');
    const studentFirstName = userData?.user?.name;
    const studentLastName = userData?.user?.last_name;
    const payload = {
      ...event,
      studentId,
      courseId: this.courseId,
      studentFirstName,
      studentLastName,
      courseName: this.title,
      companyId: userData.user.companyId,
    };
    this.surveyService.addSurveyBuilder(payload).subscribe(
      (response) => {
        this.isFeedBackSubmitted = true;
        Swal.fire({
          title: 'Successful',
          text: 'Feedback submitted successfully',
          icon: 'success',
        });
        const feedbackInfo = { ...this.feedbackInfo };
        this.feedbackInfo = feedbackInfo;
        this.isShowFeedback = false;
        if (!this.assessmentInfo.resultAfterFeedback) {
          this.router.navigate(['/student/enrollment/assessment-exam']);
        } else {
          this.updateShowAssessmentQuestions();
        }
      },
      (error) => {
        this.assessmentTempInfo = null;
        Swal.fire({
          title: 'Failed to submit Feedback',
          text: error.message || error.error,
          icon: 'error',
        });
      }
    );
  }
  skipFeedback() {
    this.isFeedBackSubmitted = true;
    this.isShowFeedback = false;
    this.updateShowAssessmentQuestions();
  }



  initScorm2004(contentUrl: string) {
    // console.log('ContentUrl:',contentUrl)
    this.iframeUrl = contentUrl;
    const settings = {
      autocommit: true,
      autocommitSeconds: 5,
      dataCommitFormat: 'json',
      commitRequestDataType: 'application/json;charset=UTF-8',
      autoProgress: true,
      logLevel: 0,
      mastery_override: false,
      lmsCommitUrl: `${this.prefix}scorm/commit/${this.studentClassDetails?.scormKit?._id}`,
    };
    (window as any).API_1484_11 = new Scorm2004API(settings);
    (window as any).API_1484_11.on(
      'SetValue.cmi.*',
      this.receiveMessage.bind(this),
      false
    );
    let studentId = localStorage.getItem('id');

    (window as any).API_1484_11.cmi.suspend_data = this.currentScormModule._id;
    (window as any).API_1484_11.cmi.learner_id = studentId;

    if (this.lastcommit) {
      (window as any).API.loadFromJSON(this.lastcommit, '');
    }
  }

  initScorm12(contentUrl: string) {
    this.iframeUrl = contentUrl;
    const settings = {
      autocommit: true,
      autocommitSeconds: 5,
      dataCommitFormat: 'json',
      commitRequestDataType: 'application/json;charset=UTF-8',
      autoProgress: true,
      logLevel: 2,
      mastery_override: false,
      lmsCommitUrl: `${this.prefix}scorm/commit/${this.studentClassDetails?.scormKit?._id}`,
    };
    (window as any).API = new Scorm12API(settings);
    (window as any).API.on(
      'LMSSetValue.cmi.core.*',
      this.receiveMessage.bind(this),
      false
    );
    let studentId = localStorage.getItem('id');

    (window as any).API.LMSSetValue("cmi.suspend_data", this.currentScormModule._id);
    (window as any).API.LMSCommit("");
    (window as any).API.cmi.core.student_id = studentId;
  }

  receiveMessage(CMIElement: any, value: any): void {
    if ((CMIElement == 'cmi.completion_status' || CMIElement === 'cmi.core.lesson_status') && value === 'completed' && !this.isCompleted) {
      const studentId = localStorage.getItem('id');
      const percentagePerModule = 100 / this.scormModules.length;
      const playBackTime = this.playBackTime + percentagePerModule;
      this.playBackTime = playBackTime;
      let payload = {
        playbackTime: playBackTime > 100 ? 100 : playBackTime,
        status: playBackTime >= 100 ? 'completed' : 'approved',
      };
      this.classService
        .saveScormCompletion(this.registeredClassId, payload)
        .subscribe((response) => {
          if (playBackTime >= 100) {
            Swal.fire({
              title: 'Course Completed Successfully',
              text: 'Please Wait For the Certificate',
              icon: 'success',
            }).then((result) => {
              if (result.isConfirmed) {
                location.reload();
              }
            });
          }
        });
    }
  }

  openScormModule(module: any, scormKit: any) {
    this.currentScormModule = {
      ...module,
      launchUrl: scormKit.path + '/' + module.launch,
    };
    if (module.version === '1.2') {
      this.initScorm12(this.currentScormModule.launchUrl);
    } else {
      this.initScorm2004(this.currentScormModule.launchUrl);
    }
  }

  hasSessionEnded(): boolean {
    if (!this.classDetails?.sessions?.[0]?.sessionEndDate) return true;
    const sessionEndDate = new Date(
      this.classDetails?.sessions?.[0]?.sessionEndDate
    );
    const today = new Date();
    return sessionEndDate < today;
  }

  isMeetingAvailableToday(): boolean {
    const today = new Date();
    const meetingPlatform = this.classDetails?.meetingPlatform;
    let isZoomClassAvailable = true;
    if (meetingPlatform == 'zoom') {
      isZoomClassAvailable = this.classDetails?.occurrences?.some((occ: any) => {
        const occDate = new Date(occ.startTime);
        return this.isSameDate(occDate, today)
      })
    }
    return isZoomClassAvailable;
  }

  isSameDate(date1: Date, date2: Date) {
    return (date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate())
  }

  openMeeting(link: any) {
    if (link) {
      Swal.fire({
        title: 'Open Meeting Page',
        text: 'Do you want redirecting to Meeting Page',
        icon: 'warning',
        confirmButtonText: 'Okay',
        showCancelButton: true,
        cancelButtonColor: '#d33',
      }).then((result) => {
        if (result.isConfirmed) {
          window.open(link, "_blank");
        }
      });
    }

  }
}