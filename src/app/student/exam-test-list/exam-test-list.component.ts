import { ChangeDetectorRef, Component, Inject, ViewChild } from '@angular/core';
import { StudentPaginationModel } from 'app/admin/schedule-class/class.model';
import { ClassService } from 'app/admin/schedule-class/class.service';
import { UtilsService } from '@core/service/utils.service';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { AssessmentService } from '@core/service/assessment.service';
import { AssessmentQuestionsPaginationModel } from '@core/models/assessment-answer.model';
import { CourseService } from '@core/service/course.service';
import { MatDialog } from '@angular/material/dialog';
import { InvoiceComponent } from '../view-course/invoice/invoice.component';
import { PaymentDailogComponent } from '../view-course/payment-dailog/payment-dailog.component';
import { SettingsService } from '@core/service/settings.service';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import jsPDF from 'jspdf';
import DomToImage from 'dom-to-image';
import { firstValueFrom } from 'rxjs';
import { DOCUMENT, Location } from '@angular/common';

@Component({
  selector: 'app-exam-test-list',
  templateUrl: './exam-test-list.component.html',
  styleUrls: ['./exam-test-list.component.scss'],
})
export class ExamTestListComponent {
  breadscrums = [
    {
      title: 'Exam',
      items: ['Course'],
      active: 'Exam',
    },
  ];
  displayedColumns: string[] = ['Course Title', 'Exam Name', 'Exam'];
  dataSource: any;
  assessmentPaginationModel!: Partial<AssessmentQuestionsPaginationModel>;
  totalItems: any;
  pageSizeArr = this.utils.pageSizeArr;
  isLoading: boolean = true;
  @ViewChild(MatSort) matSort!: MatSort;
  studentId!: string;
  razorPayKey: any;
  isInvoice: boolean = false;
  pdfData: any = [];
  invoiceUrl: any;
  discountValue: any;
  discountType: string = 'percentage';
  studentClassId:any;

  constructor(
    public utils: UtilsService,
    private classService: ClassService,
    public router: Router,
    private assessmentService: AssessmentService,
    public dialog: MatDialog,
    private settingsService: SettingsService,
    private changeDetectorRef: ChangeDetectorRef,
    private courseService: CourseService,
    @Inject(DOCUMENT) private document: any,
    private location: Location
  ) {
    this.assessmentPaginationModel = {};
    this.studentId = localStorage.getItem('id') || '';
  }

  ngOnInit() {
    this.getEnabledExams();
  }

  getEnabledExams() {
    let studentId = localStorage.getItem('id') || '';
    let company = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
    this.assessmentService
      .getAssignedExamAnswers({ ...this.assessmentPaginationModel, studentId })
      .subscribe((res) => {
        this.isLoading = false;
        this.dataSource = res.data.docs;
        this.totalItems = res.data.totalDocs;
        this.assessmentPaginationModel.docs = res.docs;
        this.assessmentPaginationModel.page = res.page;
        this.assessmentPaginationModel.limit = res.limit;
      });
  }

  view(id: string) {
    // this.router.navigate(['/admin/courses/view-completion-list'], {
    //   queryParams: { id: id, status: 'completed' },
    // });
  }

  pageSizeChange($event: any) {
    this.assessmentPaginationModel.page = $event?.pageIndex + 1;
    this.assessmentPaginationModel.limit = $event?.pageSize;
    this.getEnabledExams();
  }

  navToExam(data: any) {
    const studentClasses = data.studentClassId||[];
    if(studentClasses.length && studentClasses.some((v:any)=>v.status =='approved')){
      const courseDetails = data.courseId;
      const studentId = localStorage.getItem('id');
      this.studentClassId = studentClasses[0]?._id
      const examAssessment = data.courseId.exam_assessment._id;
      this.redirectToExam(courseDetails, studentId, null)
    }else{
      this.paidDirectExamFlow(data)
    }
  }

  getLabel(data:any):string{
    const course = data.courseId;
    const isApproved = data.studentClassId?.some((v:any)=>v.status == 'approved');
    if(course.feeType == 'free' || isApproved){
      return 'Take Exam'
    }
    return data.studentClassId?.length ? 'Approval Pending' : 'Pay'
  }

  paidDirectExamFlow(data: any) {
    const courseId = data?.courseId?._id;
    const isPaid = data.courseId?.feeType == 'paid';
    this.courseService.getCourseById(courseId).subscribe((response) => {
      const courseDetails = response;
      if(isPaid){
        this.paidDialogEvent(courseDetails, null, data);
      }else {
        this.freeExamFlow(courseDetails, data)
      }
    });
  }

  async freeExamFlow(courseDetails: any, data:any){
    const courseKitDetails = courseDetails?.course_kit;
    const courseKit = courseKitDetails.map((kit: any) => ({
      shortDescription: kit.shortDescription,
      longDescription: kit.longDescription,
      documentLink: kit.documentLink,
      name: kit.name,
      filename: kit?.videoLink[0]?.doc_filename,
      videoId: kit?.videoLink[0]?.id,
      inputUrl: kit?.videoLink[0]?.video_url,
      url: kit?.videoLink[0]?.url,
      playbackTime: 0,
    }));
    const studentClass =await firstValueFrom(this.registerClass(courseDetails, courseKit));
    if(studentClass.success){
      this.studentClassId= studentClass?.data?.createdStudentClass?.id
      const courseDetailInfo = data.courseId;
      const studentId = localStorage.getItem('id');
      const examAssessment = data.courseId.exam_assessment._id;
      this.redirectToExam(courseDetailInfo, studentId, null)
    }
  }

  paidDialogEvent(courseDetails: any, classDetails: any, rawData: any) {
    const courseKitDetails = courseDetails?.course_kit;
    const courseKit = courseKitDetails.map((kit: any) => ({
      shortDescription: kit.shortDescription,
      longDescription: kit.longDescription,
      documentLink: kit.documentLink,
      name: kit.name,
      filename: kit?.videoLink[0]?.doc_filename,
      videoId: kit?.videoLink[0]?.id,
      inputUrl: kit?.videoLink[0]?.video_url,
      url: kit?.videoLink[0]?.url,
      playbackTime: 0,
    }));
    const userdata = JSON.parse(localStorage.getItem('currentUser')!);
    const studentId = localStorage.getItem('id');
    const today = new Date();
    const date = today.toISOString().split('T')[0];

    let body = {
      email: userdata.user.email,
      name: userdata.user.name,
      courseTitle: courseDetails?.title,
      courseFee: courseDetails?.fee,
      studentId: studentId,
      classId: null,
      title: courseDetails.title,
      coursekit: courseKit,
      date: date,
      discountType:'percentage',
      discountValue:0
    };
    const invoiceDialogRef = this.dialog.open(InvoiceComponent, {
      width: '1000px',
      height: '600px',
      data: body,
    });
    invoiceDialogRef.afterClosed().subscribe((res) => {
      if (res) {
        const dialogRef = this.dialog.open(PaymentDailogComponent, {
          width: '450px',
          height: '300px',
          data: { payment: '' },
        });
        dialogRef.afterClosed().subscribe(async (result) => {
          if (result) {
            const studentClass =await firstValueFrom(this.registerClass(courseDetails, courseKit, res.totalValue));
            if(studentClass.success){
              const registeredClassId = studentClass.data.createdStudentClass._id;
              if (result.payment === 'card') {
                this.generateInvoice(body);
                setTimeout(() => {
                  let payload = {
                    email: userdata.user.email,
                    name: userdata.user.name,
                    courseTitle: courseDetails?.title,
                    courseFee:res.totalValue,
                    studentId: studentId,
                    classId: null,
                    title: courseDetails?.title,
                    coursekit: courseKit,
                    paid: true,
                    stripe:true,
                    adminEmail:userdata.user.adminEmail,
                    adminName:userdata.user.adminName,
                    companyId:userdata.user.companyId,
                    invoiceUrl:this.invoiceUrl,
                    courseStartDate:courseDetails?.sessionStartDate,
                    courseEndDate:courseDetails?.sessionEndDate,
                    courseId: courseDetails.id,
                    successURL: this.getCurrentUrl(),
                    failURL: this.getCurrentUrl(),
                    isDirectExam: true,
                  }
  
                  this.classService
                  .saveApprovedClasses(registeredClassId,payload).subscribe((response) => {
                      this.document.location.href = response.data.session.url;
                    }); 
                  //redirect to exam
                  // this.redirectToExam(
                  //   courseDetails,
                  //   studentId,
                  //   null
                  // );
                },5000)
                
              } else if (result.payment === 'other') {
                let payload = {
                  email: userdata.user.email,
                  name: userdata.user.name,
                  courseTitle: courseDetails?.title,
                  courseFee: courseDetails?.fee,
                  studentId: studentId,
                  classId: null,
                  title: courseDetails?.title,
                  coursekit: courseKit,
                };
  
                this.courseService.createOrder(payload).subscribe((response) => {
                  if (response.status == 200) {
                    this.settingsService.getPayment().subscribe((res: any) => {
                      this.razorPayKey = res.data.docs[0].keyId;
                      const paymentOrderId = response.data.id;
                      const options: any = {
                        key: this.razorPayKey,
                        amount: courseDetails?.fee,
                        currency: 'INR',
                        name: userdata.user.email,
                        description: courseDetails?.title,
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
                            Swal.fire({
                              title: 'Error',
                              text: 'Failed to payment. Please try again.',
                              icon: 'error',
                              // confirmButtonColor: '#526D82',
                            });
                          } else {
                            this.courseService
                              .verifyPaymentSignature(response, paymentOrderId)
                              .subscribe((response: any) => {
                                let body = {
                                  courseTitle: courseDetails?.title,
                                  courseFee: courseDetails?.fee,
                                };
                                this.generateInvoice(body);
                                setTimeout(() => {
                                  let payload = {
                                    email: userdata.user.email,
                                    name: userdata.user.name,
                                    courseTitle: courseDetails?.title,
                                    courseFee: courseDetails?.fee,
                                    studentId: studentId,
                                    classId: null,
                                    title: courseDetails?.title,
                                    coursekit: courseKit,
                                    orderId:
                                      response?.data?.payment?.original_order_id,
                                    paymentId:
                                      response?.data?.payment
                                        ?.razorpay_payment_id,
                                    razorpay: true,
                                    invoiceUrl: this.invoiceUrl,
                                  };
                                  //redirect to exam
                                  this.redirectToExam(
                                    courseDetails,
                                    studentId, null
                                  );
                                }, 5000);
                              });
                          }
                        };
                        options.modal.ondismiss = () => {
                          alert('Transaction has been cancelled.');
                          this.router.navigate(['/student/exams/exam']);
                        };
                        const rzp = new this.courseService.nativeWindow.Razorpay(
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
  
          }
        });
      }
    });
  }

  registerClass(courseDetails:any, courseKit:any, courseFee:number=0){
    let userdata = JSON.parse(localStorage.getItem('currentUser')!);
    let studentId = localStorage.getItem('id');
    const companyId = JSON.parse(localStorage.getItem('user_data')!).user.companyId;
    let payload = {
      email: userdata.user.email,
      name: userdata.user.name,
      courseTitle: courseDetails?.title,
      courseFee: courseFee,
      studentId: studentId,
      classId: null,
      title: courseDetails.title,
      coursekit: courseKit,
      feeType: courseFee ? 'paid':'free',
      courseId: courseDetails.id,
      verify:true,
      paid: courseFee ? false: true,
      companyId: companyId,
      status:"approved"
    };
    return this.courseService.saveRegisterClass(payload)
  }

  generateInvoice(element: any) {
    Swal.fire({
      // title: "Updated",
      // text: "Course Kit updated successfully",
      // icon: "success",
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
              (err) => {}
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

  getRedirectURL( courseDetails: any,
    studentId: any,
    examAssessmentAnswer: any):string{
      const courseId = courseDetails._id ||courseDetails.id;
      const examAssessmentId = courseDetails.exam_assessment?._id || courseDetails.exam_assessment;

    const baseUrl = `${window.location.protocol}//${window.location.hostname}:${window.location.port}`;
    const redirectUrl = `${baseUrl}/student/exam-questions/${examAssessmentId}/${studentId}/${courseId}/${examAssessmentId}?retake=false&submitted=true`; 
    return redirectUrl
  }

  getCurrentUrl(): string {
    const currentPath = this.location.path();
    const baseUrl = `${window.location.protocol}//${window.location.hostname}:${window.location.port}`;
    return `${baseUrl}${currentPath}`;
  }

  redirectToExam(
    courseDetails: any,
    studentId: any,
    examAssessmentAnswer: any
  ) {
    const courseId = courseDetails._id ||courseDetails.id;
    const examAssessmentId = courseDetails.exam_assessment?._id || courseDetails.exam_assessment;
    this.router.navigate(
      [
        '/student/exam-questions/',
        this.studentClassId,
        examAssessmentId,
        studentId,
        courseId,
        examAssessmentId,
      ],
      { queryParams: { retake: false, submitted: true } }
    );
  }
}
